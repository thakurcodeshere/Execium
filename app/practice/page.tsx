"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CODING_CHALLENGES, getChallengeDetails, getDailyChallenge, CodingChallenge } from "@/lib/challenges";
import { Search, Trophy, Flame, Clock, CheckCircle2, Circle, ArrowRight, Zap, Eye, X, Building2, Percent, Users, RotateCcw } from "lucide-react";

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiff, setSelectedDiff] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [previewChallengeId, setPreviewChallengeId] = useState<string | null>(null);

  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [attemptedChallenges, setAttemptedChallenges] = useState<string[]>([]);

  // Daily challenge rotation & timer state
  const dailyInfo = useMemo(() => getDailyChallenge(), []);
  const [timeUntilReset, setTimeUntilReset] = useState({ hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    try {
      const solved = localStorage.getItem("execium_solved_challenges");
      if (solved) setSolvedChallenges(JSON.parse(solved));

      const attempted = localStorage.getItem("execium_attempted_challenges");
      if (attempted) setAttemptedChallenges(JSON.parse(attempted));
    } catch {}

    const updateTimer = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0);
      const diffMs = nextReset.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilReset({ hours, mins, secs });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const companiesList = useMemo(() => {
    const set = new Set<string>();
    CODING_CHALLENGES.forEach(c => {
      const details = getChallengeDetails(c.id);
      details.problemStatement.companies?.forEach(comp => set.add(comp));
    });
    return ["all", ...Array.from(set)];
  }, []);

  const filteredChallenges = useMemo(() => {
    return CODING_CHALLENGES.filter(c => {
      const matchDiff = selectedDiff === "all" || c.difficulty === selectedDiff;
      const isSolved = solvedChallenges.includes(c.id);
      const isAttempted = attemptedChallenges.includes(c.id) && !isSolved;
      
      const matchStatus = selectedStatus === "all" || 
        (selectedStatus === "solved" && isSolved) ||
        (selectedStatus === "attempted" && isAttempted) ||
        (selectedStatus === "unsolved" && !isSolved && !isAttempted);

      const details = getChallengeDetails(c.id);
      const matchCompany = selectedCompany === "all" || details.problemStatement.companies?.includes(selectedCompany);

      const q = searchQuery.toLowerCase().trim();
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);

      return matchDiff && matchStatus && matchCompany && matchQ;
    });
  }, [searchQuery, selectedDiff, selectedStatus, selectedCompany, solvedChallenges, attemptedChallenges]);

  const activePreviewDetails = useMemo(() => {
    if (!previewChallengeId) return null;
    return getChallengeDetails(previewChallengeId);
  }, [previewChallengeId]);

  const isDailySolved = solvedChallenges.includes(dailyInfo.challenge.id);

  return (
    <div style={{
      minHeight: "100vh", background: "#070913", color: "#e2e8f0",
      fontFamily: "'Inter', sans-serif", paddingBottom: 80
    }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        paddingTop: 120, paddingBottom: 60, paddingLeft: 32, paddingRight: 32,
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.2), rgba(168,85,247,0.1), transparent)",
        borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "center", position: "relative"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 20,
          background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
          color: "#f59e0b", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
          marginBottom: 16, textTransform: "uppercase", letterSpacing: 1
        }}>
          <Trophy size={13} /> EXECIUM ARENA • INTERVIEW PRACTICE
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.15,
          marginBottom: 16, background: "linear-gradient(135deg, #ffffff 30%, #f59e0b 70%, #a855f7 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Curated C++ Coding Challenges
        </h1>

        <p style={{
          maxWidth: 720, margin: "0 auto 32px", fontSize: 16, color: "#94a3b8", lineHeight: 1.6
        }}>
          Practice curated C++ algorithm and data structure problems targeting FAANG and High-Frequency Trading technical interviews. Track submission status, daily streaks, and memory constraints.
        </p>

        {/* Search Input */}
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search challenges by title, category, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 48px", borderRadius: 12,
              border: "1px solid rgba(245,158,11,0.3)", background: "rgba(15,23,42,0.8)",
              color: "#fff", fontSize: 14, fontFamily: "'JetBrains Mono'", outline: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "40px 24px" }}>

        {/* Featured Daily Challenge Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(168,85,247,0.08))",
          border: "1px solid rgba(245,158,11,0.35)", borderRadius: 16, padding: 24,
          marginBottom: 40, display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 20, boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.2)",
                color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)", textTransform: "uppercase"
              }}>
                🔥 Today's Daily Pick
              </span>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} color="#f59e0b" /> Resets in {timeUntilReset.hours}h {timeUntilReset.mins}m {timeUntilReset.secs}s
              </span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
              {dailyInfo.challenge.title}
            </h2>

            <p style={{ fontSize: 13, color: "#cbd5e1", maxWidth: 620, margin: 0 }}>
              {dailyInfo.challenge.desc}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isDailySolved && (
              <span style={{
                padding: "6px 12px", borderRadius: 8, background: "rgba(16,185,129,0.15)",
                color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", fontSize: 11,
                fontFamily: "'JetBrains Mono'", fontWeight: 800, display: "flex", alignItems: "center", gap: 4
              }}>
                <CheckCircle2 size={14} /> Solved Today
              </span>
            )}

            <Link
              href={`/studio?challenge=${dailyInfo.challenge.id}`}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #f59e0b, #a855f7)", color: "#fff",
                fontSize: 12, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 6px 20px rgba(245,158,11,0.4)"
              }}
            >
              <Zap size={15} /> Solve Daily Challenge
            </Link>
          </div>
        </div>

        {/* ── 2-COLUMN LAYOUT: Left Challenges Grid + Right Vertical Filter Box ── */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* LEFT AREA: Challenges Directory Cards Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filteredChallenges.length === 0 ? (
              <div style={{
                padding: 60, textAlign: "center", background: "rgba(15,23,42,0.4)",
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>
                  No Challenges Found
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  No coding challenges match your active filter settings. Try resetting filters on the right sidebar.
                </div>
              </div>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 20
              }}>
                {filteredChallenges.map(c => {
                  const details = getChallengeDetails(c.id);
                  const isSolved = solvedChallenges.includes(c.id);
                  const isAttempted = attemptedChallenges.includes(c.id) && !isSolved;
                  const diffColor = c.difficulty === "easy" ? "#10b981" : c.difficulty === "medium" ? "#f59e0b" : "#ef4444";

                  return (
                    <div
                      key={c.id}
                      style={{
                        background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, padding: 20, display: "flex", flexDirection: "column",
                        justify: "space-between", backdropFilter: "blur(12px)"
                      }}
                    >
                      <div>
                        {/* Header Row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {isSolved ? (
                              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#10b981", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle2 size={13} /> SOLVED
                              </span>
                            ) : isAttempted ? (
                              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#f59e0b", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                <Clock size={13} /> ATTEMPTED
                              </span>
                            ) : (
                              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                                <Circle size={13} /> UNSOLVED
                              </span>
                            )}
                            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b" }}>
                              {c.category}
                            </span>
                          </div>

                          <span style={{
                            fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                            padding: "2px 7px", borderRadius: 4, background: `${diffColor}18`,
                            color: diffColor, border: `1px solid ${diffColor}35`, textTransform: "uppercase"
                          }}>
                            {c.difficulty}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>
                          {c.title}
                        </h3>

                        {/* Desc */}
                        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 14 }}>
                          {c.desc}
                        </p>

                        {/* Companies Badges */}
                        {details.problemStatement.companies && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                            {details.problemStatement.companies.map((comp, ci) => (
                              <span key={ci} style={{
                                fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#cbd5e1",
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                padding: "2px 6px", borderRadius: 4
                              }}>
                                {comp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Bar */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)"
                      }}>
                        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b" }}>
                          Acc: <strong style={{ color: "#e2e8f0" }}>{details.problemStatement.acceptanceRate}</strong>
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => setPreviewChallengeId(c.id)}
                            style={{
                              padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)",
                              background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 10,
                              fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 4
                            }}
                          >
                            <Eye size={12} /> Preview
                          </button>

                          <Link
                            href={`/studio?challenge=${c.id}`}
                            style={{
                              padding: "6px 12px", borderRadius: 6, border: "none",
                              background: "linear-gradient(135deg, #f59e0b, #a855f7)", color: "#fff",
                              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                              textDecoration: "none", display: "flex", alignItems: "center", gap: 4
                            }}
                          >
                            <Zap size={12} /> Solve
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: Vertical Filter Box */}
          <div style={{
            width: 330, flexShrink: 0, position: "sticky", top: 80,
            background: "rgba(15,23,42,0.75)", border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 16, padding: 20, backdropFilter: "blur(16px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", gap: 20
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#f59e0b", letterSpacing: 0.5 }}>
                ⚙️ CHALLENGE FILTERS
              </span>
              <button
                onClick={() => { setSelectedStatus("all"); setSelectedDiff("all"); setSelectedCompany("all"); setSearchQuery(""); }}
                style={{
                  background: "transparent", border: "none", color: "#64748b", cursor: "pointer",
                  fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 700, display: "flex", alignItems: "center", gap: 4
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#f59e0b"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>

            {/* STATUS Section (Vertical Box) */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                STATUS:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { id: "all", label: `ALL (${CODING_CHALLENGES.length})` },
                  { id: "unsolved", label: `UNSOLVED (${CODING_CHALLENGES.length - solvedChallenges.length})` },
                  { id: "attempted", label: `ATTEMPTED (${attemptedChallenges.filter(id => !solvedChallenges.includes(id)).length})` },
                  { id: "solved", label: `SOLVED (${solvedChallenges.length})` }
                ].map(st => {
                  const isActive = selectedStatus === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStatus(st.id)}
                      style={{
                        width: "100%", padding: "7px 12px", borderRadius: 8, textAlign: "left",
                        border: `1px solid ${isActive ? "#f59e0b" : "rgba(255,255,255,0.06)"}`,
                        background: isActive ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.02)",
                        color: isActive ? "#f59e0b" : "#94a3b8", fontSize: 11,
                        fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                        cursor: "pointer", transition: "all 0.15s", display: "flex",
                        alignItems: "center", justifyContent: "space-between"
                      }}
                    >
                      <span>{st.label}</span>
                      {isActive && <span style={{ fontSize: 12 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIFFICULTY Section (Vertical Box) */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                DIFFICULTY:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {(["all", "easy", "medium", "hard"] as const).map(diff => {
                  const isActive = selectedDiff === diff;
                  const color = diff === "easy" ? "#10b981" : diff === "medium" ? "#f59e0b" : diff === "hard" ? "#ef4444" : "#3b82f6";
                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDiff(diff)}
                      style={{
                        padding: "7px 10px", borderRadius: 8, textAlign: "center",
                        border: `1px solid ${isActive ? color : "rgba(255,255,255,0.06)"}`,
                        background: isActive ? `${color}20` : "rgba(255,255,255,0.02)",
                        color: isActive ? color : "#94a3b8", fontSize: 10,
                        fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                        cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s"
                      }}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPANY TAG Section (Vertical Box) */}
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                COMPANY TAG:
              </div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 220, overflowY: "auto",
                paddingRight: 4, scrollbarWidth: "thin"
              }}>
                {companiesList.map(comp => {
                  const isActive = selectedCompany === comp;
                  return (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompany(comp)}
                      style={{
                        padding: "5px 9px", borderRadius: 6,
                        border: `1px solid ${isActive ? "#3b82f6" : "rgba(255,255,255,0.08)"}`,
                        background: isActive ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.02)",
                        color: isActive ? "#60a5fa" : "#94a3b8", fontSize: 10,
                        fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                    >
                      {comp === "all" ? "All Companies" : comp}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Challenge Preview Modal */}
      {activePreviewDetails && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,10,0.85)",
          backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24
        }}>
          <div style={{
            width: "100%", maxWidth: 800, maxHeight: "88vh", background: "#0d1117",
            border: "1px solid rgba(245,158,11,0.4)", borderRadius: 16, overflowY: "auto",
            display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px", background: "rgba(15,23,42,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex",
              alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10
            }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#f59e0b", fontWeight: 800, textTransform: "uppercase" }}>
                  {activePreviewDetails.category} • {activePreviewDetails.difficulty.toUpperCase()}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0 }}>
                  {activePreviewDetails.problemStatement.title}
                </h2>
              </div>
              <button
                onClick={() => setPreviewChallengeId(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: 6 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  // PROBLEM OBJECTIVE
                </div>
                <div style={{ fontSize: 14, color: "#f8fafc", lineHeight: 1.6, fontWeight: 600 }}>
                  {activePreviewDetails.problemStatement.objective}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginTop: 6 }}>
                  {activePreviewDetails.problemStatement.description}
                </div>
              </div>

              {/* Formats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#10b981", fontWeight: 800, marginBottom: 4 }}>
                    📥 INPUT FORMAT
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#cbd5e1" }}>
                    {activePreviewDetails.inputFormat}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#a855f7", fontWeight: 800, marginBottom: 4 }}>
                    📤 OUTPUT FORMAT
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#cbd5e1" }}>
                    {activePreviewDetails.outputFormat}
                  </div>
                </div>
              </div>

              {/* Examples */}
              {activePreviewDetails.exampleCases && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    // EXAMPLE TEST CASES
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activePreviewDetails.exampleCases.map((ex, ei) => (
                      <div key={ei} style={{ background: "#030712", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#60a5fa" }}>
                          Input: {ex.input}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#10b981" }}>
                          Output: {ex.output}
                        </div>
                        {ex.explanation && (
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  onClick={() => setPreviewChallengeId(null)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "#94a3b8", fontSize: 11, fontFamily: "'JetBrains Mono'",
                    fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Close Preview
                </button>
                <Link
                  href={`/studio?challenge=${activePreviewDetails.id}`}
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #f59e0b, #a855f7)", color: "#fff",
                    fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <Zap size={14} /> Open & Solve in Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
