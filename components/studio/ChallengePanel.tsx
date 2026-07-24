"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { CODING_CHALLENGES, getChallengeDetails } from "@/lib/challenges";
import { X, Lock, Unlock, CheckCircle2, Code2, Copy, ArrowRight, Lightbulb, FileText, Send, Check, Clock, Tag, Briefcase, ThumbsUp } from "lucide-react";

export interface ChallengeSubmission {
  id: string;
  code: string;
  timestamp: string;
  status: 'PASSED' | 'SUBMITTED';
  lineCount: number;
}

export default function ChallengePanel() {
  const { activeChallengeId, setChallengeId, theme, setCode, code, restart, recordAttempt, attemptedChallenges } = useStore();
  const [activeTab, setActiveTab] = useState<'problem' | 'solutions' | 'submissions'>('problem');
  const [selectedSolIdx, setSelectedSolIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [solvedList, setSolvedList] = useState<string[]>([]);
  const [localAttempted, setLocalAttempted] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const T = theme;

  useEffect(() => {
    try {
      const solved = localStorage.getItem("execium_solved_challenges");
      if (solved) setSolvedList(JSON.parse(solved));

      const attempted = localStorage.getItem("execium_attempted_challenges");
      if (attempted) setLocalAttempted(JSON.parse(attempted));

      if (activeChallengeId) {
        const savedSubs = localStorage.getItem(`execium_challenge_submissions_${activeChallengeId}`);
        if (savedSubs) setSubmissions(JSON.parse(savedSubs));
        else setSubmissions([]);

        const savedViewState = localStorage.getItem(`execium_challenge_state_${activeChallengeId}`);
        if (savedViewState) {
          const { tab, solIdx } = JSON.parse(savedViewState);
          if (tab) setActiveTab(tab);
          if (typeof solIdx === 'number') setSelectedSolIdx(solIdx);
        }
      }
    } catch {}
  }, [activeChallengeId, attemptedChallenges]);

  useEffect(() => {
    if (!activeChallengeId) return;
    try {
      localStorage.setItem(`execium_challenge_state_${activeChallengeId}`, JSON.stringify({
        tab: activeTab,
        solIdx: selectedSolIdx
      }));
    } catch {}
  }, [activeChallengeId, activeTab, selectedSolIdx]);

  if (!activeChallengeId) return null;

  const challengeInfo = getChallengeDetails(activeChallengeId);
  const ps = challengeInfo.problemStatement;
  const isSolved = solvedList.includes(activeChallengeId);
  const isAttempted = isSolved || localAttempted.includes(activeChallengeId) || attemptedChallenges.includes(activeChallengeId);

  const diffColor = challengeInfo.difficulty === 'easy' ? '#10b981' : challengeInfo.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
  const activeSolution = challengeInfo.solutions[selectedSolIdx] || challengeInfo.solutions[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSolution = (solCode: string) => {
    setCode(solCode);
    restart();
  };

  const handleSubmitSolution = () => {
    const codeToSubmit = code && code.trim().length > 0 ? code : challengeInfo.code;
    const newSub: ChallengeSubmission = {
      id: Date.now().toString(),
      code: codeToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PASSED',
      lineCount: codeToSubmit.split('\n').length
    };

    const updated = [newSub, ...submissions];
    setSubmissions(updated);

    try {
      localStorage.setItem(`execium_challenge_submissions_${activeChallengeId}`, JSON.stringify(updated));

      // Mark challenge as solved in localStorage
      if (!solvedList.includes(activeChallengeId)) {
        const newSolved = [...solvedList, activeChallengeId];
        setSolvedList(newSolved);
        localStorage.setItem("execium_solved_challenges", JSON.stringify(newSolved));
      }

      // Mark challenge as attempted
      if (!localAttempted.includes(activeChallengeId)) {
        const newAttempted = [...localAttempted, activeChallengeId];
        setLocalAttempted(newAttempted);
        localStorage.setItem("execium_attempted_challenges", JSON.stringify(newAttempted));
      }
    } catch {}

    recordAttempt(activeChallengeId);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: T.uiSurface, borderLeft: `1px solid ${T.uiBorder}`,
      color: T.uiText, fontFamily: "'Inter', sans-serif", position: "relative"
    }}>
      {/* ── HEADER BAR ── */}
      <div style={{
        padding: "10px 14px", background: T.uiPanelHd, borderBottom: `1px solid ${T.uiBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {challengeInfo.title}
          </span>
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            padding: "2px 7px", borderRadius: 4, background: `${diffColor}20`,
            color: diffColor, border: `1px solid ${diffColor}40`, textTransform: "uppercase"
          }}>
            {challengeInfo.difficulty}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Status Pill */}
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            padding: "2px 7px", borderRadius: 4,
            background: isSolved ? "rgba(16,185,129,.12)" : isAttempted ? "rgba(245,158,11,.12)" : "rgba(255,255,255,.05)",
            color: isSolved ? "#10b981" : isAttempted ? "#f59e0b" : T.uiTextMuted,
            border: `1px solid ${isSolved ? "rgba(16,185,129,.3)" : isAttempted ? "rgba(245,158,11,.3)" : T.uiBorder}`
          }}>
            {isSolved ? "🟢 SOLVED" : isAttempted ? "🟡 ATTEMPTED" : "⚪ UNATTEMPTED"}
          </span>

          {/* Exit Challenge button */}
          <button
            onClick={() => setChallengeId(null)}
            title="Exit Challenge View"
            style={{
              background: "transparent", border: "none", color: T.uiTextMuted,
              cursor: "pointer", display: "flex", alignItems: "center", padding: 4,
              borderRadius: 4, transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = T.uiTextMuted}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── NAVIGATION TABS (Problem vs Solutions vs Submissions) ── */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, flexShrink: 0
      }}>
        <button
          onClick={() => setActiveTab('problem')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'problem' ? T.uiSurface : "transparent",
            color: activeTab === 'problem' ? T.uiAccent : T.uiTextMuted,
            borderBottom: activeTab === 'problem' ? `2px solid ${T.uiAccent}` : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4
          }}
        >
          <FileText size={13} /> 1. Problem
        </button>

        <button
          onClick={() => setActiveTab('solutions')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'solutions' ? T.uiSurface : "transparent",
            color: activeTab === 'solutions' ? "#a855f7" : T.uiTextMuted,
            borderBottom: activeTab === 'solutions' ? "2px solid #a855f7" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4
          }}
        >
          {isAttempted ? <Unlock size={13} color="#10b981" /> : <Lock size={13} color="#f97316" />} 
          2. Solutions (10)
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'submissions' ? T.uiSurface : "transparent",
            color: activeTab === 'submissions' ? "#10b981" : T.uiTextMuted,
            borderBottom: activeTab === 'submissions' ? "2px solid #10b981" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4
          }}
        >
          <Send size={13} /> 3. Submissions ({submissions.length})
        </button>
      </div>

      {/* ── TAB CONTENT BODY ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>

        {/* ── TAB 1: RICH PROBLEM STATEMENT ── */}
        {activeTab === 'problem' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            
            {/* Metadata Bar (Companies & Acceptance) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Briefcase size={12} color={T.uiTextMuted} />
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>Companies:</span>
                {(ps.companies || ["Google", "Amazon", "Microsoft"]).map((c, i) => (
                  <span key={i} style={{
                    fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    padding: "2px 6px", borderRadius: 4, background: "rgba(59,130,246,0.12)",
                    color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)"
                  }}>
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, display: "flex", gap: 8 }}>
                <span style={{ color: "#10b981" }}>Acceptance: {ps.acceptanceRate || "65%"}</span>
                <span>Submissions: {ps.totalAccepted || "1.2M"}</span>
              </div>
            </div>

            {/* Objective */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                // QUESTION OBJECTIVE
              </div>
              <div style={{ fontSize: 13, color: T.uiText, lineHeight: 1.6, fontWeight: 700 }}>
                {ps.objective}
              </div>
              <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.5, marginTop: 6 }}>
                {ps.description}
              </div>
            </div>

            {/* Input & Output Format Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(0,0,0,0.15)", padding: 12, borderRadius: 8, border: `1px solid ${T.uiBorder}` }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#3b82f6" }}>📥 INPUT FORMAT: </span>
                <span style={{ fontSize: 11, color: T.uiTextMuted }}>{ps.inputDesc || challengeInfo.inputFormat}</span>
              </div>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#10b981" }}>📤 OUTPUT FORMAT: </span>
                <span style={{ fontSize: 11, color: T.uiTextMuted }}>{ps.outputDesc || challengeInfo.outputFormat}</span>
              </div>
            </div>

            {/* Key Takeaways Card */}
            {ps.takeaways && ps.takeaways.length > 0 && (
              <div style={{ background: "rgba(59,130,246,0.08)", padding: 12, borderRadius: 8, border: "1px solid rgba(59,130,246,0.25)" }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#3b82f6", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <Lightbulb size={12} /> KEY CONCEPTUAL TAKEAWAYS:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ps.takeaways.map((t, i) => (
                    <div key={i} style={{ fontSize: 10, color: T.uiText, lineHeight: 1.4, display: "flex", gap: 6 }}>
                      <span style={{ color: "#3b82f6" }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example Test Cases */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                // EXAMPLE TEST CASES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(ps.examples || challengeInfo.exampleCases).map((ex, i) => (
                  <div key={i} style={{
                    background: "rgba(0,0,0,0.2)", border: `1px solid ${T.uiBorder}`,
                    borderRadius: 8, padding: 12, fontFamily: "'JetBrains Mono'", fontSize: 11
                  }}>
                    <div style={{ color: "#a855f7", fontWeight: 700, marginBottom: 6, fontSize: 10 }}>
                      Example {i + 1}:
                    </div>
                    <div style={{ color: T.uiText, marginBottom: 4 }}>
                      <span style={{ color: T.uiTextMuted }}>Input: </span>{ex.input}
                    </div>
                    <div style={{ color: "#10b981", marginBottom: 4 }}>
                      <span style={{ color: T.uiTextMuted }}>Output: </span>{ex.output}
                    </div>
                    {ex.explanation && (
                      <div style={{ fontSize: 10, color: T.uiTextMuted, marginTop: 4, fontFamily: "'Inter'", fontStyle: "italic" }}>
                        Explanation: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                // CONSTRAINTS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {(ps.constraints || challengeInfo.constraints).map((c, i) => (
                  <div key={i} style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: T.uiAccent }}>•</span> {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Solution Button Banner */}
            <div style={{
              marginTop: 10, padding: 14, borderRadius: 10,
              background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.12))",
              border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", flexDirection: "column", gap: 10
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
                  <Send size={14} /> Submit Your Solution
                </div>
                {submittedSuccess && (
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#10b981" }}>
                    ✓ PASSED & SUBMITTED!
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10, color: T.uiTextMuted, lineHeight: 1.5 }}>
                Write your C++ solution in the editor on the left and click submit below to record your solution attempt.
              </div>
              <button
                onClick={handleSubmitSolution}
                style={{
                  width: "100%", padding: "9px 0", borderRadius: 7, border: "none",
                  background: "linear-gradient(135deg, #10b981, #3b82f6)",
                  color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 3px 12px rgba(16,185,129,0.3)", transition: "all 0.15s"
                }}
              >
                <Send size={14} /> Submit Solution & Record Progress
              </button>
            </div>

          </div>
        )}

        {/* ── TAB 2: SOLUTIONS (UP TO 10) ── */}
        {activeTab === 'solutions' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {challengeInfo.solutions.map((sol, idx) => {
              const isSelected = selectedSolIdx === idx;
              return (
                <div
                  key={sol.id}
                  onClick={() => setSelectedSolIdx(idx)}
                  style={{
                    background: isSelected ? `${T.uiAccent}10` : "rgba(0,0,0,0.15)",
                    border: `1px solid ${isSelected ? T.uiAccent : T.uiBorder}`,
                    borderRadius: 10, padding: 12, cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isSelected ? T.uiAccent : T.uiText }}>
                      {sol.title}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", padding: "1px 5px", borderRadius: 3, background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
                        Time: {sol.timeComplexity}
                      </span>
                      <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", padding: "1px 5px", borderRadius: 3, background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
                        Space: {sol.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.uiTextMuted, lineHeight: 1.4, marginBottom: isSelected ? 10 : 0 }}>
                    {sol.desc}
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      <pre style={{
                        background: "#0d1117", border: `1px solid ${T.uiBorder}`, borderRadius: 6,
                        padding: 10, fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#e6edf3",
                        overflowX: "auto", margin: 0, maxClamp: 200
                      }}>
                        <code>{sol.code}</code>
                      </pre>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLoadSolution(sol.code); }}
                          style={{
                            flex: 1, padding: "6px 0", borderRadius: 6, border: "none",
                            background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff",
                            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                          }}
                        >
                          <Code2 size={12} /> Load Code into Editor
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyCode(sol.code); }}
                          style={{
                            padding: "6px 12px", borderRadius: 6, border: `1px solid ${T.uiBorder}`,
                            background: T.uiSurface, color: T.uiText, fontSize: 10, fontFamily: "'JetBrains Mono'",
                            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                          }}
                        >
                          {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />} Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 3: SUBMISSIONS HISTORY ── */}
        {activeTab === 'submissions' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>
                📜 SUBMISSION HISTORY ({submissions.length})
              </div>
              <button
                onClick={handleSubmitSolution}
                style={{
                  padding: "5px 10px", borderRadius: 6, border: "none",
                  background: "#10b981", color: "#fff", fontSize: 9,
                  fontFamily: "'JetBrains Mono'", fontWeight: 800, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                <Send size={11} /> Submit Current Code
              </button>
            </div>

            {submissions.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", background: "rgba(0,0,0,0.15)", borderRadius: 8, border: `1px solid ${T.uiBorder}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.uiTextMuted, marginBottom: 4 }}>No Submissions Yet</div>
                <div style={{ fontSize: 10, color: T.uiTextMuted }}>Write your C++ solution in the editor and click "Submit Solution" to log your attempts.</div>
              </div>
            ) : (
              submissions.map((sub, i) => (
                <div key={sub.id} style={{
                  background: "rgba(0,0,0,0.18)", border: `1px solid ${T.uiBorder}`,
                  borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 8
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
                        🟢 {sub.status}
                      </span>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>
                        <Clock size={11} style={{ display: "inline", marginRight: 3 }} /> {sub.timestamp}
                      </span>
                    </div>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>
                      {sub.lineCount} lines
                    </span>
                  </div>

                  <pre style={{
                    background: "#0d1117", border: `1px solid ${T.uiBorder}`, borderRadius: 6,
                    padding: 8, fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#e6edf3",
                    overflowX: "auto", margin: 0, maxHeight: 120
                  }}>
                    <code>{sub.code}</code>
                  </pre>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button
                      onClick={() => handleLoadSolution(sub.code)}
                      style={{
                        padding: "4px 8px", borderRadius: 5, border: "none",
                        background: `${T.uiAccent}20`, color: T.uiAccent,
                        fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, cursor: "pointer"
                      }}
                    >
                      Load Submission
                    </button>
                    <button
                      onClick={() => handleCopyCode(sub.code)}
                      style={{
                        padding: "4px 8px", borderRadius: 5, border: `1px solid ${T.uiBorder}`,
                        background: T.uiSurface, color: T.uiTextMuted,
                        fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
