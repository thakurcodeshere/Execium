"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { LEARN_MODULES, getLearnModuleDetails, LearnModule } from "@/lib/learn";
import { Search, Sparkles, BookOpen, Code2, ArrowRight, X, Check, FileText, Layers, Award, Terminal, Zap, ExternalLink } from "lucide-react";

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDiff, setSelectedDiff] = useState<string>("all");
  const [readingModuleId, setReadingModuleId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    LEARN_MODULES.forEach(m => set.add(m.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredModules = useMemo(() => {
    return LEARN_MODULES.filter(m => {
      const matchCat = selectedCategory === "all" || m.category === selectedCategory;
      const matchDiff = selectedDiff === "all" || m.difficulty === selectedDiff;
      const q = searchQuery.toLowerCase().trim();
      const matchQ = !q || m.title.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return matchCat && matchDiff && matchQ;
    });
  }, [searchQuery, selectedCategory, selectedDiff]);

  const activeModuleDetails = useMemo(() => {
    if (!readingModuleId) return null;
    return getLearnModuleDetails(readingModuleId);
  }, [readingModuleId]);

  return (
    <div style={{
      minHeight: "100vh", background: "#070913", color: "#e2e8f0",
      fontFamily: "'Inter', sans-serif", paddingBottom: 80
    }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        paddingTop: 120, paddingBottom: 60, paddingLeft: 32, paddingRight: 32,
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.25), rgba(59,130,246,0.1), transparent)",
        borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "center", position: "relative"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 20,
          background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
          color: "#a855f7", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
          marginBottom: 16, textTransform: "uppercase", letterSpacing: 1
        }}>
          <Sparkles size={13} /> COMPUTATIONAL REALITY • C++ CURRICULUM
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.15,
          marginBottom: 16, background: "linear-gradient(135deg, #ffffff 30%, #a855f7 70%, #3b82f6 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Master C++ from First Line to Mastery
        </h1>

        <p style={{
          maxWidth: 720, margin: "0 auto 32px", fontSize: 16, color: "#94a3b8", lineHeight: 1.6
        }}>
          Explore 100 hand-crafted C++ modules curated from top computer science literature, GeeksforGeeks, and cplusplus.com. Deep dive into theory, mental models, code breakdowns, and interactive step-by-step memory trace simulations.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search 100 modules by keyword, category, or topic (e.g. Pointers, DP, Templates, STL)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 48px", borderRadius: 12,
              border: "1px solid rgba(168,85,247,0.3)", background: "rgba(15,23,42,0.8)",
              color: "#fff", fontSize: 14, fontFamily: "'JetBrains Mono'", outline: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)", transition: "all 0.2s"
            }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

        {/* Filter Toolbar */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 16, marginBottom: 32,
          background: "rgba(15,23,42,0.6)", padding: 18, borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)"
        }}>
          {/* Category Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", marginRight: 4, fontWeight: 800 }}>
              Category:
            </span>
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, border: `1px solid ${isActive ? "#a855f7" : "rgba(255,255,255,0.08)"}`,
                    background: isActive ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.02)",
                    color: isActive ? "#a855f7" : "#94a3b8", fontSize: 11,
                    fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                    cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize"
                  }}
                >
                  {cat === "all" ? `All (${LEARN_MODULES.length})` : cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", marginRight: 4, fontWeight: 800 }}>
              Difficulty:
            </span>
            {(["all", "easy", "medium", "hard"] as const).map(diff => {
              const isActive = selectedDiff === diff;
              const color = diff === "easy" ? "#10b981" : diff === "medium" ? "#f59e0b" : diff === "hard" ? "#ef4444" : "#3b82f6";
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDiff(diff)}
                  style={{
                    padding: "5px 12px", borderRadius: 8, border: `1px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
                    background: isActive ? `${color}20` : "transparent",
                    color: isActive ? color : "#94a3b8", fontSize: 11,
                    fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                    cursor: "pointer", transition: "all 0.15s", textTransform: "uppercase"
                  }}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modules Grid */}
        {filteredModules.length === 0 ? (
          <div style={{
            padding: 60, textAlign: "center", background: "rgba(15,23,42,0.4)",
            borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>
              No Modules Found
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              No C++ modules match your search filter "{searchQuery}". Try clearing filters or searching another keyword.
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20
          }}>
            {filteredModules.map((mod, idx) => {
              const diffColor = mod.difficulty === "easy" ? "#10b981" : mod.difficulty === "medium" ? "#f59e0b" : "#ef4444";
              const problemNum = LEARN_MODULES.findIndex(m => m.id === mod.id) + 1;

              return (
                <div
                  key={mod.id}
                  style={{
                    background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14, padding: 20, display: "flex", flexDirection: "column",
                    justify: "space-between", transition: "all 0.2s ease", position: "relative",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  <div>
                    {/* Top Row: Problem #, Category, Difficulty */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                          padding: "2px 8px", borderRadius: 6, background: "rgba(168,85,247,0.15)",
                          color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)"
                        }}>
                          Module {problemNum}
                        </span>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b" }}>
                          {mod.category}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                        padding: "2px 7px", borderRadius: 4, background: `${diffColor}18`,
                        color: diffColor, border: `1px solid ${diffColor}35`, textTransform: "uppercase"
                      }}>
                        {mod.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 8,
                      lineHeight: 1.3
                    }}>
                      {mod.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 16
                    }}>
                      {mod.shortDesc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Link
                      href={`/studio?learn=${mod.id}`}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                        background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff",
                        fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                        textDecoration: "none", display: "flex", alignItems: "center",
                        justifyContent: "center", gap: 6, boxShadow: "0 4px 14px rgba(168,85,247,0.3)"
                      }}
                    >
                      <Zap size={13} /> Launch Studio
                    </Link>

                    <button
                      onClick={() => setReadingModuleId(mod.id)}
                      style={{
                        padding: "8px 14px", borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.03)", color: "#e2e8f0",
                        fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 700,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      <BookOpen size={13} /> Read
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Module Theory Reader Modal */}
      {activeModuleDetails && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300, background: "rgba(3,3,10,0.85)",
          backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24
        }}>
          <div style={{
            width: "100%", maxWidth: 840, maxHeight: "88vh", background: "#0d1117",
            border: "1px solid rgba(168,85,247,0.4)", borderRadius: 16, overflowY: "auto",
            display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            position: "relative"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px", background: "rgba(15,23,42,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex",
              alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10
            }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#a855f7", fontWeight: 800, textTransform: "uppercase" }}>
                  {activeModuleDetails.category} • {activeModuleDetails.difficulty.toUpperCase()}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0 }}>
                  {activeModuleDetails.title}
                </h2>
              </div>
              <button
                onClick={() => setReadingModuleId(null)}
                style={{
                  background: "transparent", border: "none", color: "#94a3b8",
                  cursor: "pointer", padding: 6, borderRadius: 6
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Objective */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  // CONCEPTUAL OBJECTIVE
                </div>
                <div style={{ fontSize: 14, color: "#f8fafc", lineHeight: 1.6, fontWeight: 600 }}>
                  {activeModuleDetails.problemStatement.objective}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginTop: 6 }}>
                  {activeModuleDetails.problemStatement.description}
                </div>
              </div>

              {/* Key Takeaways */}
              {activeModuleDetails.problemStatement.takeaways && (
                <div style={{ background: "rgba(168,85,247,0.08)", padding: 14, borderRadius: 10, border: "1px solid rgba(168,85,247,0.2)" }}>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#a855f7", marginBottom: 6 }}>
                    💡 KEY CONCEPTUAL TAKEAWAYS:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {activeModuleDetails.problemStatement.takeaways.map((t, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#e2e8f0", lineHeight: 1.4, display: "flex", gap: 6 }}>
                        <span style={{ color: "#a855f7" }}>✓</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippet */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  // C++ IMPLEMENTATION SCAFFOLD
                </div>
                <pre style={{
                  background: "#030712", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: 14, fontSize: 11, fontFamily: "'JetBrains Mono'",
                  color: "#e6edf3", overflowX: "auto", margin: 0
                }}>
                  <code>{activeModuleDetails.fullCode}</code>
                </pre>
              </div>

              {/* Modal Footer CTA */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  onClick={() => setReadingModuleId(null)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "#94a3b8", fontSize: 11, fontFamily: "'JetBrains Mono'",
                    fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Close Reader
                </button>
                <Link
                  href={`/studio?learn=${activeModuleDetails.id}`}
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)", color: "#fff",
                    fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <Zap size={14} /> Open in Interactive Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
