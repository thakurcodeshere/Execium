"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getLearnModuleDetails, LEARN_MODULES } from "@/lib/learn";
import { 
  X, BookOpen, Target, Brain, Code2, Play, CheckCircle2, 
  ChevronLeft, ChevronRight, ArrowRight, Layers, HelpCircle, Copy, Sparkles, Check, Cpu, Zap, Lock, Unlock
} from "lucide-react";

export default function LearnPanel() {
  const { activeLearnModuleId, setLearnModuleId, theme, setCode, loadProgram, restart, play, setProjectName, setProjectId } = useStore();
  const [activeTab, setActiveTab] = useState<'problem' | 'approaches' | 'breakdown'>('problem');
  const [selectedApproachIdx, setSelectedApproachIdx] = useState(0);
  const [activeConstructIdx, setActiveConstructIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);

  const T = theme;

  useEffect(() => {
    try {
      if (localStorage.getItem("execium_pro_unlocked") === "true") {
        setIsProUnlocked(true);
      }
    } catch {}
  }, []);

  if (!activeLearnModuleId) return null;

  const currentModuleIdx = LEARN_MODULES.findIndex(m => m.id === activeLearnModuleId);
  const moduleInfo = getLearnModuleDetails(activeLearnModuleId);
  const selectedApproach = moduleInfo.approaches[selectedApproachIdx] || moduleInfo.approaches[0];
  
  // Dynamic line breakdown for the currently SELECTED Mental Model Approach!
  const currentLineBreakdown = selectedApproach.lineBreakdown || moduleInfo.approaches[0].lineBreakdown;
  const activeConstruct = currentLineBreakdown[activeConstructIdx] || currentLineBreakdown[0];

  const handleUnlockPro = () => {
    try {
      localStorage.setItem("execium_pro_unlocked", "true");
    } catch {}
    setIsProUnlocked(true);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSelectedApproachCode = () => {
    setCode(selectedApproach.code);
    restart();
    if (moduleInfo.traceKey) {
      loadProgram(moduleInfo.traceKey);
    }
  };

  const handleSimulate = () => {
    handleLoadSelectedApproachCode();
    setTimeout(() => {
      play();
    }, 400);
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: T.uiSurface, borderLeft: `1px solid ${T.uiBorder}`,
      color: T.uiText, fontFamily: "'Inter', sans-serif", position: "relative",
      overflow: "hidden"
    }}>
      {/* ── CSS KEYFRAME ANIMATIONS ── */}
      <style jsx global>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBorder {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .anim-fade {
          animation: fadeInSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-pulse {
          animation: pulseBorder 2s infinite;
        }
      `}</style>

      {/* ── HEADER BAR WITH PREV / NEXT PROBLEM NAVIGATION ── */}
      <div style={{
        padding: "10px 14px", background: T.uiPanelHd, borderBottom: `1px solid ${T.uiBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0
      }}>
        {/* Left: Module Title & Category Badge */}
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

        {/* Right: Prev / Next Navigation Controls & Exit */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Previous Problem Button */}
          <button
            disabled={currentModuleIdx <= 0}
            onClick={() => {
              if (currentModuleIdx > 0) {
                const prevMod = LEARN_MODULES[currentModuleIdx - 1];
                const prevDetails = getLearnModuleDetails(prevMod.id);
                setLearnModuleId(prevMod.id);
                setProjectName(prevDetails.title);
                setProjectId(null);
                setCode(`// ${prevDetails.title}\n// Category: ${prevDetails.category} | Difficulty: ${prevDetails.difficulty.toUpperCase()}\n// ${prevDetails.shortDesc}\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// TODO: Implement your solution for ${prevDetails.title}\n\nint main() {\n    cout << "=== ${prevDetails.title} ===" << endl;\n\n    // Write your code here\n\n    return 0;\n}\n`);
                restart();
                setActiveConstructIdx(0);
                setSelectedApproachIdx(0);
              }
            }}
            title="Previous Problem"
            style={{
              padding: "4px 8px", borderRadius: 6, border: `1px solid ${T.uiBorder}`,
              background: currentModuleIdx <= 0 ? "transparent" : T.uiSurface,
              color: currentModuleIdx <= 0 ? T.uiTextMuted : T.uiText,
              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 700,
              cursor: currentModuleIdx <= 0 ? "default" : "pointer",
              opacity: currentModuleIdx <= 0 ? 0.4 : 1,
              display: "flex", alignItems: "center", gap: 3, transition: "all 0.15s"
            }}
          >
            <ChevronLeft size={13} /> Prev
          </button>

          {/* Next Problem Button */}
          <button
            disabled={currentModuleIdx >= LEARN_MODULES.length - 1}
            onClick={() => {
              if (currentModuleIdx < LEARN_MODULES.length - 1) {
                const nextMod = LEARN_MODULES[currentModuleIdx + 1];
                const nextDetails = getLearnModuleDetails(nextMod.id);
                setLearnModuleId(nextMod.id);
                setProjectName(nextDetails.title);
                setProjectId(null);
                setCode(`// ${nextDetails.title}\n// Category: ${nextDetails.category} | Difficulty: ${nextDetails.difficulty.toUpperCase()}\n// ${nextDetails.shortDesc}\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// TODO: Implement your solution for ${nextDetails.title}\n\nint main() {\n    cout << "=== ${nextDetails.title} ===" << endl;\n\n    // Write your code here\n\n    return 0;\n}\n`);
                restart();
                setActiveConstructIdx(0);
                setSelectedApproachIdx(0);
              }
            }}
            title="Next Problem"
            style={{
              padding: "4px 8px", borderRadius: 6, border: "none",
              background: currentModuleIdx >= LEARN_MODULES.length - 1 ? "transparent" : "linear-gradient(135deg, #3b82f6, #a855f7)",
              color: currentModuleIdx >= LEARN_MODULES.length - 1 ? T.uiTextMuted : "#fff",
              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
              cursor: currentModuleIdx >= LEARN_MODULES.length - 1 ? "default" : "pointer",
              opacity: currentModuleIdx >= LEARN_MODULES.length - 1 ? 0.4 : 1,
              display: "flex", alignItems: "center", gap: 3, transition: "all 0.15s",
              boxShadow: currentModuleIdx >= LEARN_MODULES.length - 1 ? "none" : "0 2px 10px rgba(59,130,246,0.3)"
            }}
          >
            Next <ChevronRight size={13} />
          </button>

          {/* Exit Learn Mode */}
          <button
            onClick={() => setLearnModuleId(null)}
            title="Exit Learn Mode"
            style={{
              background: "transparent", border: "none", color: T.uiTextMuted,
              cursor: "pointer", display: "flex", alignItems: "center", padding: 4,
              borderRadius: 4, transition: "all 0.15s", marginLeft: 4
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = T.uiTextMuted}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── STEP TABS (Problem -> Approaches -> Line Breakdown) ── */}
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
            color: activeTab === 'problem' ? "#10b981" : T.uiTextMuted,
            borderBottom: activeTab === 'problem' ? "2px solid #10b981" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "all 0.2s ease"
          }}
        >
          <Target size={13} /> 1. Problem
        </button>

        <button
          onClick={() => setActiveTab('approaches')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'approaches' ? T.uiSurface : "transparent",
            color: activeTab === 'approaches' ? "#f59e0b" : T.uiTextMuted,
            borderBottom: activeTab === 'approaches' ? "2px solid #f59e0b" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "all 0.2s ease"
          }}
        >
          <Brain size={13} /> 2. Mental Models (10)
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          style={{
            flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            background: activeTab === 'breakdown' ? T.uiSurface : "transparent",
            color: activeTab === 'breakdown' ? "#a855f7" : T.uiTextMuted,
            borderBottom: activeTab === 'breakdown' ? "2px solid #a855f7" : "2px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "all 0.2s ease"
          }}
        >
          <Code2 size={13} /> 3. Line Breakdown
        </button>
      </div>

      {/* ── MAIN CONTENT BODY WITH MOTION FADE ── */}
      <div key={activeTab} className="anim-fade" style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

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
                marginTop: 8, transition: "transform 0.15s ease", boxShadow: "0 4px 15px rgba(16,185,129,0.3)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Step 2: Choose Mental Model (10 Approaches) <ArrowRight size={14} />
            </button>

          </div>
        )}

        {/* ── TAB 2: INTERACTIVE MENTAL MODEL SELECTOR (10 APPROACHES: 2 FREE, 8 PRO) ── */}
        {activeTab === 'approaches' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                // CHOOSE MENTAL MODEL (UP TO 10)
              </div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#f59e0b", fontWeight: 800 }}>
                2 Free | 8 Pro Payable
              </span>
            </div>

            {/* Interactive Selectable Mental Model Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {moduleInfo.approaches.map((app, idx) => {
                const isSelected = selectedApproachIdx === idx;
                const isAccessible = app.isFree || isProUnlocked;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedApproachIdx(idx);
                      setActiveConstructIdx(0); // Reset line stepper for new mental model
                    }}
                    className={isSelected ? "anim-pulse" : ""}
                    style={{
                      background: isSelected 
                        ? "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(168,85,247,0.08))" 
                        : isAccessible ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.3)",
                      border: `1.5px solid ${isSelected ? "#f59e0b" : isAccessible ? T.uiBorder : "rgba(239,68,68,0.3)"}`,
                      borderRadius: 12, padding: 14, cursor: "pointer",
                      display: "flex", flexDirection: "column", gap: 10,
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: isSelected ? "scale(1.01)" : "scale(1)",
                      opacity: isAccessible ? 1 : 0.85
                    }}
                  >
                    {/* Top Row: Title & Free vs Pro Indicator */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 10,
                          background: isSelected ? "#f59e0b" : "transparent",
                          border: `2px solid ${isSelected ? "#f59e0b" : T.uiTextMuted}`,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {isSelected && <Check size={12} color="#000" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: isSelected ? "#f59e0b" : T.uiText }}>
                          {app.name}
                        </span>
                      </div>

                      <span style={{
                        fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                        padding: "2px 7px", borderRadius: 4,
                        background: app.isFree ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                        color: app.isFree ? "#10b981" : "#ef4444",
                        border: `1px solid ${app.isFree ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                        display: "flex", alignItems: "center", gap: 4
                      }}>
                        {app.isFree ? <Unlock size={10} /> : <Lock size={10} />}
                        {app.isFree ? "FREE" : "PRO PAYABLE"}
                      </span>
                    </div>

                    {/* Mental Model Description */}
                    <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.5, paddingLeft: 28 }}>
                      {app.description}
                    </div>

                    {/* Complexity & Pros/Cons */}
                    {isAccessible ? (
                      <div style={{ display: "flex", gap: 8, marginLeft: 28, alignItems: "center" }}>
                        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>
                          Time: {app.timeComplexity}
                        </span>
                        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>
                          Space: {app.spaceComplexity}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 10, color: "#ef4444", marginLeft: 28, fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>
                        🔒 Locked: Pro Subscription Required to view code & line breakdown.
                      </div>
                    )}

                    {/* ── INLINE ACTION BOX (PROMPT IMAGE SPECIFICATION) FOR THIS SELECTED APPROACH ── */}
                    {isSelected && (
                      <div style={{
                        marginTop: 6, paddingTop: 12, borderTop: `1px solid ${T.uiBorder}`,
                        display: "flex", flexDirection: "column", gap: 8
                      }}>
                        <div style={{ fontSize: 10, color: T.uiTextMuted, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                          Switch to Step 3 below to view the line-by-line C++ code breakdown specific to this mental model approach!
                        </div>

                        {isAccessible ? (
                          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadSelectedApproachCode();
                              }}
                              style={{
                                flex: 1, padding: "9px 0", borderRadius: 8, border: `1px solid ${T.uiBorder}`,
                                background: "#1e293b", color: T.uiText, fontSize: 10,
                                fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                transition: "all 0.15s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = "#38bdf8"}
                              onMouseLeave={e => e.currentTarget.style.borderColor = T.uiBorder}
                            >
                              <Code2 size={13} color="#38bdf8" /> Load Code into Editor
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('breakdown');
                              }}
                              style={{
                                flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
                                background: "linear-gradient(135deg, #f59e0b 0%, #a855f7 100%)",
                                color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                boxShadow: "0 4px 16px rgba(245,158,11,0.35)", transition: "transform 0.15s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                              Step 3: Line Breakdown <ArrowRight size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(168,85,247,0.1))",
                            border: "1px dashed rgba(239,68,68,0.4)", borderRadius: 10, padding: 12,
                            textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: T.uiText }}>
                              🔒 Pro Approach Locked
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlockPro();
                              }}
                              style={{
                                padding: "7px 16px", borderRadius: 8, border: "none",
                                background: "linear-gradient(135deg, #ef4444, #a855f7)",
                                color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                                cursor: "pointer", boxShadow: "0 0 14px rgba(239,68,68,0.3)"
                              }}
                            >
                              🚀 Unlock All 10 Pro Approaches (Demo Pass)
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ── TAB 3: DYNAMIC LINE-BY-LINE BREAKDOWN FOR SELECTED MENTAL MODEL ── */}
        {activeTab === 'breakdown' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Header info showing which Mental Model this breakdown belongs to */}
            <div style={{
              padding: "8px 12px", background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.3)", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#a855f7" }}>
                🧠 MODEL BREAKDOWN: {selectedApproach.name}
              </div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>
                Line {activeConstructIdx + 1} of {currentLineBreakdown.length}
              </span>
            </div>

            {/* Construct Stepper Button List */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {currentLineBreakdown.map((item, idx) => {
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

            {/* Active Line & Construct Card for THIS Mental Model */}
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

              {/* Code Snippet Box for THIS specific approach */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6,
                background: "#0f172a", border: `1px solid ${T.uiBorder}`, borderRadius: 8,
                padding: 12, color: "#38bdf8"
              }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{activeConstruct.codeSnippet}</pre>
              </div>

              {/* Explanation of Why written this way for THIS specific approach */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  // WHY WRITTEN THIS WAY
                </div>
                <div style={{ fontSize: 11, color: T.uiText, lineHeight: 1.6 }}>
                  {activeConstruct.explanation}
                </div>
              </div>

              {/* Key Construct Details Table for THIS approach */}
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
                  disabled={activeConstructIdx === currentLineBreakdown.length - 1}
                  onClick={() => setActiveConstructIdx(idx => Math.min(currentLineBreakdown.length - 1, idx + 1))}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: "none",
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    color: "#fff", fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    cursor: activeConstructIdx === currentLineBreakdown.length - 1 ? "default" : "pointer",
                    opacity: activeConstructIdx === currentLineBreakdown.length - 1 ? 0.5 : 1
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
          onClick={handleLoadSelectedApproachCode}
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
