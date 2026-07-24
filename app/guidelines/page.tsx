"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeedbackModal from "@/components/FeedbackModal";
import {
  Sparkles, Terminal, Code2, Layers, BookOpen, Trophy, Zap, Cpu,
  Search, Play, FastForward, HelpCircle, Key, CheckCircle2, ArrowRight,
  ShieldAlert, Sliders, Globe, Command, Compass, RotateCcw
} from "lucide-react";

interface GuideSection {
  id: string;
  n: string;
  category: "Workflow" | "Studio" | "Curriculum" | "Arena" | "Engine";
  icon: any;
  color: string;
  title: string;
  subtitle: string;
  desc: string;
  tip: string;
  features: string[];
}

const SECTIONS: GuideSection[] = [
  {
    id: "step-1",
    n: "01",
    category: "Workflow",
    icon: Code2,
    color: "#3b82f6",
    title: "Multi-Tab Workspace & Code Editing",
    subtitle: "Write, edit, and organize multiple C++ project tabs seamlessly.",
    desc: "The Monaco code editor supports syntax highlighting, auto-complete, bracket matching, and IntelliSense across C++11 to C++23. Open multiple projects side-by-side in topbar tabs without mixing state or losing code when closing side frames.",
    tip: "Tip: Click '+ New Tab' or open any challenge/learn module to spawn isolated, persistent workspace tabs.",
    features: [
      "Multi-project workspace tabs in topbar with quick close (×)",
      "Supports C++11, C++14, C++17, C++20, and C++23 standards",
      "Auto-format, bracket matching, and syntax error diagnostics",
      "Closing side frames (X) preserves active code and tabs"
    ]
  },
  {
    id: "step-2",
    n: "02",
    category: "Curriculum",
    icon: BookOpen,
    color: "#a855f7",
    title: "Master 100 C++ Learn Modules",
    subtitle: "Curated C++ topics from Basics to Advanced Metaprogramming.",
    desc: "Explore 100 hand-crafted modules based on computer science literature, GeeksforGeeks, and cplusplus.com. Read in-depth theory, line-by-line breakdowns, mental models, and launch solution code directly in the simulator.",
    tip: "Tip: Access the /learn portal page or click the Learn sidebar button to filter by category or difficulty.",
    features: [
      "100 structured modules (Basics, Recursion, Algorithms, Memory)",
      "In-app Theory Reader modal with 10 mental model approaches",
      "Line-by-line code execution breakdown with variable roles",
      "Instant 1-Click 'Launch in Studio' integration"
    ]
  },
  {
    id: "step-3",
    n: "03",
    category: "Arena",
    icon: Trophy,
    color: "#f59e0b",
    title: "FAANG & HFT Coding Arena",
    subtitle: "Practice 12 curated algorithm challenges with daily reset rotation.",
    desc: "Solve interview problems tailored for Google, Meta, Amazon, Microsoft, and HFT candidates. Filter by company tag, difficulty, or status (Unsolved, Attempted, Solved). Submit solutions and track streaks.",
    tip: "Tip: Solve Today's Featured Pick before the 24-hour reset countdown expires!",
    features: [
      "12 bespoke Easy, Medium, and Hard coding challenges",
      "Live 24-hour Daily Challenge reset timer & streak tracker",
      "Right-side vertical filter box for status, difficulty, & company tags",
      "Submissions tab beside Problem Statement & Solutions in Studio"
    ]
  },
  {
    id: "step-4",
    n: "04",
    category: "Engine",
    icon: Cpu,
    color: "#10b981",
    title: "Temporal Execution & Visual Simulation",
    subtitle: "Visualize memory stack/heap, call stacks, and variable mutations.",
    desc: "Press Ctrl+Enter or click ▶ Simulate. Watch code execution step-by-step. The temporal engine generates real-time call stack graphs, memory allocations, pointer references, and variable state transitions.",
    tip: "Tip: Drag the scrubber at the bottom or use ← → arrow keys to step forward/backward in execution time.",
    features: [
      "Step-by-step memory stack & heap allocation graph",
      "Call stack depth visualization for recursive functions",
      "Timeline scrubber with variable playback speeds (0.5x - 4x)",
      "Automatic structural analysis for custom C++ code"
    ]
  },
  {
    id: "step-5",
    n: "05",
    category: "Studio",
    icon: Zap,
    color: "#06b6d4",
    title: "AI Oracle Debugger & Assistant",
    subtitle: "Get intelligent contextual explanations of execution steps.",
    desc: "Toggle the AI Oracle panel to receive instant plain-English explanations of any execution frame, memory change, pointer dereference, or algorithmic complexity.",
    tip: "Tip: Ask 'Why did this variable mutate?' to get instant deep-dive diagnostics.",
    features: [
      "Real-time contextual line explanations",
      "Memory leak & pointer error detection hints",
      "Complexity analysis (Time: O(N), Space: O(1))",
      "Interactive Q&A assistant for C++ concepts"
    ]
  },
  {
    id: "step-6",
    n: "06",
    category: "Studio",
    icon: Globe,
    color: "#ec4899",
    title: "Godbolt Compiler Explorer Sync",
    subtitle: "Validate your code on real GCC, Clang, and MSVC compilers.",
    desc: "Click the Godbolt 🔗 button in the toolbar to load your code directly into Compiler Explorer. Inspect generated assembly instructions and benchmark actual compiler optimizations.",
    tip: "Tip: Use Compiler Explorer to test real-world assembly generation for C++20 concepts.",
    features: [
      "1-Click sync to compiler-explorer (godbolt.org)",
      "Inspect assembly output for GCC, Clang, and MSVC",
      "Validate complex template meta-programs",
      "Compare compiler optimization levels (-O2, -O3)"
    ]
  }
];

const SHORTCUTS = [
  { key: "Ctrl + Enter", action: "Run simulation", category: "Execution" },
  { key: "Ctrl + V", action: "Paste code into editor", category: "Editing" },
  { key: "Ctrl + C", action: "Copy selected code", category: "Editing" },
  { key: "Ctrl + Shift + F", action: "Format / prettify C++ code", category: "Editing" },
  { key: "Ctrl + Z", action: "Undo last edit", category: "Editing" },
  { key: "Ctrl + /", action: "Toggle line comment", category: "Editing" },
  { key: "← / →", action: "Step backward / forward in timeline", category: "Timeline" },
  { key: "Space", action: "Play / Pause execution simulation", category: "Timeline" },
  { key: "Esc", action: "Close popovers & side frames", category: "Interface" },
  { key: "Ctrl + K", action: "Quick search topics & challenges", category: "Navigation" }
];

export default function GuidelinesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [shortcutQuery, setShortcutQuery] = useState<string>("");

  const filteredSections = activeCategory === "all"
    ? SECTIONS
    : SECTIONS.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  const filteredShortcuts = SHORTCUTS.filter(s =>
    !shortcutQuery ||
    s.action.toLowerCase().includes(shortcutQuery.toLowerCase()) ||
    s.key.toLowerCase().includes(shortcutQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(shortcutQuery.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#050713", color: "#e2e8f0",
      fontFamily: "'Inter', sans-serif", paddingBottom: 100, overflowX: "hidden"
    }}>
      <Navbar />

      {/* ── HERO SECTION WITH MOTION GRADIENTS ── */}
      <section style={{
        paddingTop: 150, paddingBottom: 70, paddingLeft: 32, paddingRight: 32,
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.3), rgba(59,130,246,0.15), transparent)",
        borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "center", position: "relative"
      }}>
        {/* Animated Background Particle Orbs */}
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
          top: "10%", left: "15%", filter: "blur(50px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
          top: "20%", right: "15%", filter: "blur(50px)", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 30,
            background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.35)",
            color: "#c084fc", fontSize: 11, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            marginBottom: 20, textTransform: "uppercase", letterSpacing: 1.5,
            boxShadow: "0 0 20px rgba(168,85,247,0.3)"
          }}>
            <Sparkles size={14} /> PLATFORM MANUAL & ARCHITECTURE GUIDELINES
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 62px)", fontWeight: 900, lineHeight: 1.1,
            marginBottom: 20, letterSpacing: "-1px",
            background: "linear-gradient(135deg, #ffffff 20%, #e9d5ff 50%, #60a5fa 80%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Master the Execium Computational Reality OS
          </h1>

          <p style={{
            fontSize: 16, color: "#94a3b8", lineHeight: 1.8, maxWidth: 680, margin: "0 auto 36px"
          }}>
            Complete guide to multi-tab C++ workspaces, 100 curated theory modules, FAANG practice challenges, real-time memory stack/heap visualizer, and temporal timeline playback.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Link href="/studio">
              <button style={{
                padding: "12px 28px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                color: "#ffffff", fontSize: 13, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                cursor: "pointer", boxShadow: "0 0 30px rgba(168,85,247,0.5)",
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease"
              }}>
                <Zap size={16} /> Open Studio Simulator →
              </button>
            </Link>

            <Link href="/learn">
              <button style={{
                padding: "12px 24px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)", color: "#e2e8f0",
                fontSize: 13, fontFamily: "'JetBrains Mono'", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8
              }}>
                <BookOpen size={16} /> Explore 100 Modules
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CATEGORY TABS NAVIGATOR ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap",
          background: "rgba(15,23,42,0.6)", padding: 12, borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)"
        }}>
          {["all", "Workflow", "Curriculum", "Arena", "Engine", "Studio"].map(cat => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat.toLowerCase())}
                style={{
                  padding: "8px 18px", borderRadius: 10,
                  border: `1px solid ${isActive ? "#a855f7" : "transparent"}`,
                  background: isActive ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))" : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8", fontSize: 12,
                  fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                  cursor: "pointer", transition: "all 0.2s ease"
                }}
              >
                {cat === "all" ? "All Features (6)" : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── STEP-BY-STEP GUIDELINES CARDS WITH ADVANCED MOTION & HOVER EFFECTS ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {filteredSections.map(sec => {
            const IconComp = sec.icon;
            return (
              <div
                key={sec.id}
                style={{
                  display: "grid", gridTemplateColumns: "70px 1fr", gap: 24,
                  background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: 28, position: "relative", overflow: "hidden",
                  backdropFilter: "blur(16px)", transition: "all 0.25s ease",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${sec.color}60`;
                  e.currentTarget.style.boxShadow = `0 12px 40px ${sec.color}25`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Left Badge Column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: `${sec.color}20`, border: `1.5px solid ${sec.color}50`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 20px ${sec.color}30`
                  }}>
                    <IconComp size={24} color={sec.color} />
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 900,
                    color: sec.color, opacity: 0.8
                  }}>
                    {sec.n}
                  </span>
                </div>

                {/* Right Content Column */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                      padding: "2px 8px", borderRadius: 6, background: `${sec.color}15`,
                      color: sec.color, border: `1px solid ${sec.color}30`, textTransform: "uppercase"
                    }}>
                      {sec.category}
                    </span>
                  </div>

                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
                    {sec.title}
                  </h2>

                  <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 14 }}>
                    {sec.desc}
                  </p>

                  {/* Key Feature Highlights Bullet List */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 8, marginBottom: 16
                  }}>
                    {sec.features.map((feat, fi) => (
                      <div key={fi} style={{
                        display: "flex", alignItems: "center", gap: 8, fontSize: 12,
                        color: "#94a3b8", fontFamily: "'JetBrains Mono'"
                      }}>
                        <CheckCircle2 size={13} color={sec.color} /> {feat}
                      </div>
                    ))}
                  </div>

                  {/* Pro Tip Pill */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: `${sec.color}10`, border: `1px solid ${sec.color}30`,
                    borderRadius: 10, padding: "8px 14px"
                  }}>
                    <span style={{ fontSize: 13 }}>💡</span>
                    <span style={{ fontSize: 12, color: sec.color, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>
                      {sec.tip}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── KEYBOARD SHORTCUTS MATRIX WITH SEARCH FILTER ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          background: "rgba(15,23,42,0.6)", border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 20, padding: 32, backdropFilter: "blur(16px)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.5)"
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 24, flexWrap: "wrap", gap: 16
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#a855f7", fontFamily: "'JetBrains Mono'", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
                // SPEED OF THOUGHT
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#ffffff" }}>
                Keyboard Shortcuts Matrix
              </h2>
            </div>

            {/* Shortcut Search Input */}
            <div style={{ position: "relative", minWidth: 260 }}>
              <Search size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={shortcutQuery}
                onChange={e => setShortcutQuery(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10,
                  border: "1px solid rgba(168,85,247,0.3)", background: "rgba(3,7,18,0.8)",
                  color: "#ffffff", fontSize: 12, fontFamily: "'JetBrains Mono'", outline: "none"
                }}
              />
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12
          }}>
            {filteredShortcuts.map(s => (
              <div
                key={s.key}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", background: "rgba(3,7,18,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                  e.currentTarget.style.background = "rgba(168,85,247,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.background = "rgba(3,7,18,0.6)";
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{s.action}</div>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: "#64748b" }}>{s.category}</div>
                </div>

                <kbd style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800,
                  color: "#a855f7", background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.35)", borderRadius: 6, padding: "4px 10px",
                  whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(168,85,247,0.2)"
                }}>
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeedbackModal />
    </div>
  );
}
