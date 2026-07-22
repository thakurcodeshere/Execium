"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { CODING_CHALLENGES, getChallengeDetails } from "@/lib/challenges";
import { X, Lock, Unlock, CheckCircle2, Code2, Copy, ArrowRight, Lightbulb, FileText } from "lucide-react";

export default function ChallengePanel() {
  const { activeChallengeId, setChallengeId, theme, setCode, restart, recordAttempt, attemptedChallenges } = useStore();
  const [activeTab, setActiveTab] = useState<'problem' | 'solutions'>('problem');
  const [selectedSolIdx, setSelectedSolIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [solvedList, setSolvedList] = useState<string[]>([]);
  const [localAttempted, setLocalAttempted] = useState<string[]>([]);

  const T = theme;

  useEffect(() => {
    try {
      const solved = localStorage.getItem("execium_solved_challenges");
      if (solved) setSolvedList(JSON.parse(solved));

      const attempted = localStorage.getItem("execium_attempted_challenges");
      if (attempted) setLocalAttempted(JSON.parse(attempted));
    } catch {}
  }, [activeChallengeId, attemptedChallenges]);

  if (!activeChallengeId) return null;

  const challengeInfo = getChallengeDetails(activeChallengeId);
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

      {/* ── NAVIGATION TABS (Problem vs Solutions) ── */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, flexShrink: 0
      }}>
        <button
          onClick={() => setActiveTab('problem')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'problem' ? T.uiSurface : "transparent",
            color: activeTab === 'problem' ? T.uiAccent : T.uiTextMuted,
            borderBottom: activeTab === 'problem' ? `2px solid ${T.uiAccent}` : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}
        >
          <FileText size={14} /> Problem Statement
        </button>

        <button
          onClick={() => setActiveTab('solutions')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'solutions' ? T.uiSurface : "transparent",
            color: activeTab === 'solutions' ? "#a855f7" : T.uiTextMuted,
            borderBottom: activeTab === 'solutions' ? "2px solid #a855f7" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}
        >
          {isAttempted ? <Unlock size={14} color="#10b981" /> : <Lock size={14} color="#f97316" />} 
          Solutions (10)
        </button>
      </div>

      {/* ── TAB CONTENT BODY ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>

        {/* ── TAB 1: PROBLEM STATEMENT ── */}
        {activeTab === 'problem' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            
            {/* Description */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                // QUESTION OBJECTIVE
              </div>
              <div style={{ fontSize: 13, color: T.uiText, lineHeight: 1.6, fontWeight: 500 }}>
                {challengeInfo.problemStatement}
              </div>
            </div>

            {/* Input & Output Format */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(0,0,0,0.15)", padding: 12, borderRadius: 8, border: `1px solid ${T.uiBorder}` }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#3b82f6" }}>📥 INPUT FORMAT: </span>
                <span style={{ fontSize: 11, color: T.uiTextMuted }}>{challengeInfo.inputFormat}</span>
              </div>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#10b981" }}>📤 OUTPUT FORMAT: </span>
                <span style={{ fontSize: 11, color: T.uiTextMuted }}>{challengeInfo.outputFormat}</span>
              </div>
            </div>

            {/* Example Test Cases */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                // EXAMPLE TEST CASES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {challengeInfo.exampleCases.map((ex, i) => (
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
                {challengeInfo.constraints.map((c, i) => (
                  <div key={i} style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: T.uiAccent }}>•</span> {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Attempt CTA Banner */}
            <div style={{
              marginTop: 10, padding: 14, borderRadius: 10,
              background: isAttempted ? "rgba(16,185,129,0.08)" : "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))",
              border: `1px solid ${isAttempted ? "rgba(16,185,129,0.3)" : "rgba(168,85,247,0.3)"}`,
              display: "flex", flexDirection: "column", gap: 8
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: isAttempted ? "#10b981" : T.uiText }}>
                {isAttempted ? <CheckCircle2 size={16} /> : <Lightbulb size={16} color="#a855f7" />}
                {isAttempted ? "Attempt Registered — Solutions Unlocked!" : "Ready to solve?"}
              </div>
              <div style={{ fontSize: 10, color: T.uiTextMuted, lineHeight: 1.5 }}>
                {isAttempted 
                  ? "Great job! Switch to the Solutions tab above to explore all 10 idiomatic C++ solutions."
                  : "Write your solution in the left code editor and click Compile, Run, or Submit. Once attempted, all 10 solutions will unlock automatically!"}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: SOLUTIONS (UP TO 10) ── */}
        {activeTab === 'solutions' && (
          <div>
            {!isAttempted ? (
              /* LOCKED STATE CARD */
              <div style={{
                padding: 28, borderRadius: 14, background: "rgba(0,0,0,0.25)",
                border: `1px dashed ${T.uiBorder}`, textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
                marginTop: 20
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 16, background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.3)", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <Lock size={26} color="#f97316" />
                </div>

                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.uiText, marginBottom: 6 }}>
                    Solutions Are Locked
                  </div>
                  <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
                    To encourage real problem solving, you must attempt or run/submit your code in the left editor at least once to unlock all 10 solution approaches.
                  </div>
                </div>

                <button
                  onClick={() => {
                    recordAttempt(activeChallengeId);
                  }}
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    cursor: "pointer", boxShadow: "0 0 16px rgba(168,85,247,0.3)",
                    marginTop: 6
                  }}
                >
                  🚀 Unlock Solutions Now
                </button>
              </div>
            ) : (
              /* UNLOCKED 10 SOLUTIONS */
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Header Banner */}
                <div style={{
                  padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)", display: "flex",
                  alignItems: "center", justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
                    <Unlock size={14} /> 10 SOLUTIONS UNLOCKED
                  </span>
                  <span style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>
                    Explore 10 C++ Approaches
                  </span>
                </div>

                {/* 10 Solutions Selector Buttons */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {challengeInfo.solutions.map((sol, idx) => {
                    const isSelected = selectedSolIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSolIdx(idx)}
                        style={{
                          padding: "5px 10px", borderRadius: 6,
                          border: `1px solid ${isSelected ? "#a855f7" : T.uiBorder}`,
                          background: isSelected ? "rgba(168,85,247,0.18)" : "transparent",
                          color: isSelected ? "#a855f7" : T.uiTextMuted,
                          fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                          cursor: "pointer", transition: "all 0.15s"
                        }}
                      >
                        Sol {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Solution Details Card */}
                <div style={{
                  background: "rgba(0,0,0,0.2)", border: `1px solid ${T.uiBorder}`,
                  borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.uiText, marginBottom: 4 }}>
                      {activeSolution.title}
                    </div>
                    <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.5 }}>
                      {activeSolution.desc}
                    </div>
                  </div>

                  {/* Complexity Pills */}
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)",
                      color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)"
                    }}>
                      ⏱ TIME: {activeSolution.timeComplexity}
                    </span>
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      padding: "2px 8px", borderRadius: 4, background: "rgba(168,85,247,0.15)",
                      color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)"
                    }}>
                      💾 SPACE: {activeSolution.spaceComplexity}
                    </span>
                  </div>

                  {/* C++ Code Viewer Box */}
                  <div style={{ position: "relative" }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6,
                      background: "#0f172a", border: `1px solid ${T.uiBorder}`, borderRadius: 8,
                      padding: 14, color: "#e2e8f0", overflowX: "auto", maxHeight: 280
                    }}>
                      <pre style={{ margin: 0 }}>{activeSolution.code}</pre>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => handleCopyCode(activeSolution.code)}
                        style={{
                          padding: "6px 12px", borderRadius: 6, border: `1px solid ${T.uiBorder}`,
                          background: T.uiSurface, color: T.uiText, fontSize: 10,
                          fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <Copy size={12} /> {copied ? "Copied!" : "Copy Code"}
                      </button>

                      <button
                        onClick={() => handleLoadSolution(activeSolution.code)}
                        style={{
                          padding: "6px 12px", borderRadius: 6, border: "none",
                          background: "linear-gradient(135deg, #10b981, #06b6d4)",
                          color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'",
                          fontWeight: 800, cursor: "pointer", display: "flex",
                          alignItems: "center", gap: 4, boxShadow: "0 0 10px rgba(16,185,129,0.3)"
                        }}
                      >
                        <Code2 size={12} /> Load Solution into Editor
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
