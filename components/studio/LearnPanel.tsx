"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { getLearnModuleDetails, LEARN_MODULES } from "@/lib/learn";
import { 
  X, BookOpen, Target, Brain, Code2, Play, CheckCircle2, 
  ChevronRight, ArrowRight, Layers, HelpCircle, Copy, Sparkles
} from "lucide-react";

export default function LearnPanel() {
  const { activeLearnModuleId, setLearnModuleId, theme, setCode, loadProgram, restart, play } = useStore();
  const [activeTab, setActiveTab] = useState<'problem' | 'approaches' | 'breakdown'>('problem');
  const [activeConstructIdx, setActiveConstructIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const T = theme;

  if (!activeLearnModuleId) return null;

  const moduleInfo = getLearnModuleDetails(activeLearnModuleId);
  const activeConstruct = moduleInfo.lineBreakdown[activeConstructIdx] || moduleInfo.lineBreakdown[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadCode = () => {
    setCode(moduleInfo.fullCode);
    restart();
    if (moduleInfo.traceKey) {
      loadProgram(moduleInfo.traceKey);
    }
  };

  const handleSimulate = () => {
    handleLoadCode();
    setTimeout(() => {
      play();
    }, 400);
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
          <BookOpen size={16} color="#3b82f6" />
          <span style={{ fontSize: 13, fontWeight: 800, color: T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {moduleInfo.title}
          </span>
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            padding: "2px 7px", borderRadius: 4, background: "rgba(59,130,246,.15)",
            color: "#3b82f6", border: "1px solid rgba(59,130,246,.3)", textTransform: "uppercase"
          }}>
            {moduleInfo.category}
          </span>
        </div>

        <button
          onClick={() => setLearnModuleId(null)}
          title="Exit Learn Mode"
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

      {/* ── STEP TABS (Problem -> Approaches -> Line Breakdown) ── */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, flexShrink: 0
      }}>
        <button
          onClick={() => setActiveTab('problem')}
          style={{
            flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'problem' ? T.uiSurface : "transparent",
            color: activeTab === 'problem' ? "#10b981" : T.uiTextMuted,
            borderBottom: activeTab === 'problem' ? "2px solid #10b981" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5
          }}
        >
          <Target size={13} /> 1. Problem Statement
        </button>

        <button
          onClick={() => setActiveTab('approaches')}
          style={{
            flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'approaches' ? T.uiSurface : "transparent",
            color: activeTab === 'approaches' ? "#f59e0b" : T.uiTextMuted,
            borderBottom: activeTab === 'approaches' ? "2px solid #f59e0b" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5
          }}
        >
          <Brain size={13} /> 2. Mental Model
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          style={{
            flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'breakdown' ? T.uiSurface : "transparent",
            color: activeTab === 'breakdown' ? "#a855f7" : T.uiTextMuted,
            borderBottom: activeTab === 'breakdown' ? "2px solid #a855f7" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5
          }}
        >
          <Code2 size={13} /> 3. Line Breakdown
        </button>
      </div>

      {/* ── MAIN CONTENT BODY ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── TAB 1: PROBLEM & OBJECTIVE ── */}
        {activeTab === 'problem' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                // QUESTION TITLE
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.uiText }}>
                {moduleInfo.problemStatement.title}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                // PROBLEM OBJECTIVE
              </div>
              <div style={{ fontSize: 12, color: T.uiText, lineHeight: 1.6 }}>
                {moduleInfo.problemStatement.objective}
              </div>
            </div>

            {/* Input & Output expectations */}
            <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8, border: `1px solid ${T.uiBorder}`, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'" }}>
                <span style={{ color: "#3b82f6", fontWeight: 800 }}>📥 Sample Input: </span>
                <span style={{ color: T.uiTextMuted }}>{moduleInfo.problemStatement.inputDesc}</span>
              </div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'" }}>
                <span style={{ color: "#10b981", fontWeight: 800 }}>📤 Expected Output: </span>
                <span style={{ color: T.uiTextMuted }}>{moduleInfo.problemStatement.outputDesc}</span>
              </div>
            </div>

            {/* Key Learning Takeaways */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                // KEY CONSTRUCTS YOU WILL MASTER
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {moduleInfo.problemStatement.takeaways.map((t, i) => (
                  <div key={i} style={{ fontSize: 11, color: T.uiText, display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.06)", padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(16,185,129,0.2)" }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setActiveTab('approaches')}
              style={{
                padding: "10px 0", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 8
              }}
            >
              Step 2: Explore Mental Model & Approaches <ArrowRight size={14} />
            </button>

          </div>
        )}

        {/* ── TAB 2: MENTAL MODEL & APPROACHES ── */}
        {activeTab === 'approaches' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1 }}>
              // STRATEGY & MENTAL MODEL
            </div>

            {/* Approaches List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {moduleInfo.approaches.map((app, idx) => (
                <div key={idx} style={{
                  background: idx === 0 ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.15)",
                  border: `1px solid ${idx === 0 ? "rgba(245,158,11,0.3)" : T.uiBorder}`,
                  borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: idx === 0 ? "#f59e0b" : T.uiText }}>
                      {app.name}
                    </span>
                    <span style={{
                      fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      padding: "2px 6px", borderRadius: 4,
                      background: idx === 0 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)",
                      color: idx === 0 ? "#f59e0b" : T.uiTextMuted
                    }}>
                      {app.category.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.5 }}>
                    {app.description}
                  </div>

                  <div style={{ fontSize: 10, color: T.uiText, fontStyle: "italic" }}>
                    {app.prosCons}
                  </div>

                  {/* Complexity Pills */}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
                      Time: {app.timeComplexity}
                    </span>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
                      Space: {app.spaceComplexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setActiveTab('breakdown')}
              style={{
                padding: "10px 0", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #f59e0b, #a855f7)",
                color: "#fff", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 8
              }}
            >
              Step 3: Line-by-Line Code Breakdown <ArrowRight size={14} />
            </button>

          </div>
        )}

        {/* ── TAB 3: LINE-BY-LINE CONSTRUCT BREAKDOWN (CORE USER REQUEST) ── */}
        {activeTab === 'breakdown' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                // LINE & CONSTRUCT MECHANICS
              </div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#a855f7", fontWeight: 800 }}>
                Step {activeConstructIdx + 1} of {moduleInfo.lineBreakdown.length}
              </span>
            </div>

            {/* Construct Stepper Button List */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {moduleInfo.lineBreakdown.map((item, idx) => {
                const isSelected = activeConstructIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveConstructIdx(idx)}
                    style={{
                      padding: "4px 8px", borderRadius: 6, flexShrink: 0,
                      border: `1px solid ${isSelected ? "#a855f7" : T.uiBorder}`,
                      background: isSelected ? "rgba(168,85,247,0.18)" : "transparent",
                      color: isSelected ? "#a855f7" : T.uiTextMuted,
                      fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    Line {item.lineNum}
                  </button>
                );
              })}
            </div>

            {/* Active Line & Construct Card */}
            <div style={{
              background: "rgba(0,0,0,0.25)", border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14
            }}>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: T.uiText }}>
                  {activeConstruct.title}
                </span>
                <span style={{
                  fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                  padding: "2px 7px", borderRadius: 4, background: "rgba(168,85,247,0.15)",
                  color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)"
                }}>
                  {activeConstruct.constructType.toUpperCase()}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6,
                background: "#0f172a", border: `1px solid ${T.uiBorder}`, borderRadius: 8,
                padding: 12, color: "#38bdf8"
              }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{activeConstruct.codeSnippet}</pre>
              </div>

              {/* Explanation of Why written this way */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  // WHY WRITTEN THIS WAY
                </div>
                <div style={{ fontSize: 11, color: T.uiText, lineHeight: 1.6 }}>
                  {activeConstruct.explanation}
                </div>
              </div>

              {/* Key Construct Details Table */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  // VARIABLE & CONSTRUCT ROLES
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {activeConstruct.keyDetails.map((kd, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 6,
                      border: `1px solid ${T.uiBorder}`, fontSize: 10, display: "flex", flexDirection: "column", gap: 3
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#f59e0b" }}>
                          {kd.variableOrConstruct}
                        </span>
                        <span style={{ color: T.uiTextMuted, fontSize: 9 }}>
                          {kd.role}
                        </span>
                      </div>
                      <div style={{ color: T.uiTextMuted, fontStyle: "italic", fontSize: 10 }}>
                        Rationale: {kd.whyThisWay}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stepper Navigation Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <button
                  disabled={activeConstructIdx === 0}
                  onClick={() => setActiveConstructIdx(idx => Math.max(0, idx - 1))}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.uiBorder}`,
                    background: T.uiSurface, color: activeConstructIdx === 0 ? T.uiTextMuted : T.uiText,
                    fontSize: 10, fontFamily: "'JetBrains Mono'", cursor: activeConstructIdx === 0 ? "default" : "pointer",
                    opacity: activeConstructIdx === 0 ? 0.5 : 1
                  }}
                >
                  ← Previous Line
                </button>

                <button
                  disabled={activeConstructIdx === moduleInfo.lineBreakdown.length - 1}
                  onClick={() => setActiveConstructIdx(idx => Math.min(moduleInfo.lineBreakdown.length - 1, idx + 1))}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: "none",
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    cursor: activeConstructIdx === moduleInfo.lineBreakdown.length - 1 ? "default" : "pointer",
                    opacity: activeConstructIdx === moduleInfo.lineBreakdown.length - 1 ? 0.5 : 1
                  }}
                >
                  Next Line →
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ── ACTION FOOTER (LOAD CODE & SIMULATE) ── */}
      <div style={{
        padding: 12, background: T.uiPanelHd, borderTop: `1px solid ${T.uiBorder}`,
        display: "flex", gap: 10, flexShrink: 0
      }}>
        <button
          onClick={handleLoadCode}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiText, fontSize: 10,
            fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s"
          }}
        >
          <Code2 size={14} color="#38bdf8" /> Load Code into Editor
        </button>

        <button
          onClick={handleSimulate}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'",
            fontWeight: 800, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6,
            boxShadow: "0 0 14px rgba(16,185,129,0.3)"
          }}
        >
          <Play size={14} fill="#fff" /> Simulate Execution
        </button>
      </div>
    </div>
  );
}
