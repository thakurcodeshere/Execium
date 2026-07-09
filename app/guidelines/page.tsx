"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeedbackModal from "@/components/FeedbackModal";

const STEPS = [
  {
    n: "01", icon: "✍️", color: "#3b82f6",
    title: "Write or Paste Code",
    desc: "The Monaco editor accepts any C++ code. Use Ctrl+V to paste from clipboard. The editor supports syntax highlighting, auto-complete, bracket matching, and IntelliSense for all C++ versions.",
    tip: "Tip: Use the 📂 Templates button to load pre-built examples instantly.",
  },
  {
    n: "02", icon: "🔢", color: "#a855f7",
    title: "Select C++ Version",
    desc: "Choose from C++11, C++14, C++17, C++20, or C++23 using the version selector in the editor toolbar. Each version enables different language features and syntax highlighting.",
    tip: "Tip: Templates are tagged with their minimum C++ version — look for the colored badges.",
  },
  {
    n: "03", icon: "▶️", color: "#10b981",
    title: "Simulate Execution",
    desc: "Press Ctrl+Enter or click the ▶ Simulate button. If your code matches a known pattern, a full execution trace loads automatically with memory states, call stack, and variable values.",
    tip: "Tip: Known patterns (fibonacci, sorting, etc.) get full visual traces. Custom code shows structural analysis.",
  },
  {
    n: "04", icon: "🔍", color: "#f59e0b",
    title: "Explore Execution Panels",
    desc: "Use the tabbed panel on the right to explore: Execution Flow (step-by-step), Waterfall (timeline), Memory (stack/heap), Call Stack (recursion), and Variables. Each panel updates in real time.",
    tip: "Tip: Click any step in the Execution Flow to jump directly to that moment in time.",
  },
  {
    n: "05", icon: "⏱️", color: "#f97316",
    title: "Use the Temporal Engine",
    desc: "The scrubber at the bottom lets you step forward, backward, play at variable speed, or jump to any execution step. Think of it like a video player for your code's runtime.",
    tip: "Tip: Use ← → arrow keys when focused on the scrubber for frame-by-frame stepping.",
  },
  {
    n: "06", icon: "🤖", color: "#06b6d4",
    title: "Ask the AI Oracle",
    desc: "Toggle the AI Oracle panel (top-right) to get contextual explanations of each execution step. Ask \"Why did this happen?\" or request algorithm explanations in plain English.",
    tip: "Tip: The AI Oracle explains memory changes, recursion depth, and complexity automatically.",
  },
  {
    n: "07", icon: "🔗", color: "#ec4899",
    title: "Run on Real Compiler",
    desc: "Click the Godbolt 🔗 button in the editor toolbar to open your code in Compiler Explorer (godbolt.org) — a real online C++ compiler. Test output with actual GCC, Clang, or MSVC.",
    tip: "Tip: Test edge cases and see actual compiler output, assembly, and optimization flags.",
  },
];

const SHORTCUTS = [
  { key: "Ctrl + Enter", action: "Run simulation" },
  { key: "Ctrl + V", action: "Paste code from clipboard" },
  { key: "Ctrl + Shift + F", action: "Format / prettify code" },
  { key: "Ctrl + C", action: "Copy selected code" },
  { key: "Ctrl + Z", action: "Undo last change" },
  { key: "Ctrl + /", action: "Toggle line comment" },
  { key: "← / →", action: "Step through execution" },
  { key: "Space", action: "Play/pause temporal engine" },
];

export default function GuidelinesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#03030a", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "100px 48px 60px", position: "relative" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.25)",
            borderRadius: 50, padding: "5px 18px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 12, color: "#3b82f6", fontFamily: "'JetBrains Mono'", fontWeight: 800, letterSpacing: 1.5 }}>// HOW TO USE</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: "#e2e8f0", letterSpacing: "-2px", marginBottom: 20 }}>
            Your Complete Guide to{" "}
            <span style={{
              background: "linear-gradient(120deg,#3b82f6,#a855f7,#06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Execium Ω∞</span>
          </h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, maxWidth: 620, margin: "0 auto 40px" }}>
            From writing your first line to visualizing complex recursion — master every capability of the platform in 7 steps.
          </p>
          <Link href="/studio">
            <button style={{
              padding: "13px 32px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#a855f7,#3b82f6)",
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 0 24px rgba(168,85,247,.4)",
            }}>⚡ Open Studio Now</button>
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "20px 48px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{
              display: "grid", gridTemplateColumns: "80px 1fr", gap: 24,
              background: "rgba(10,10,26,.8)", border: "1px solid rgba(255,255,255,.06)",
              borderRadius: 18, padding: "28px 32px",
              transition: "all .25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = step.color + "40"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${step.color}10`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${step.color}18`, border: `1px solid ${step.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{step.icon}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 800,
                  color: step.color, opacity: .7,
                }}>{step.n}</div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: `linear-gradient(${step.color}40,transparent)`, marginTop: 4 }} />
                )}
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 10 }}>{step.title}</h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 12 }}>{step.desc}</p>
                <div style={{
                  display: "inline-flex", alignItems: "flex-start", gap: 8,
                  background: `${step.color}08`, border: `1px solid ${step.color}20`,
                  borderRadius: 8, padding: "8px 14px",
                }}>
                  <span style={{ fontSize: 13, color: step.color, flexShrink: 0 }}>💡</span>
                  <span style={{ fontSize: 12, color: step.color, lineHeight: 1.6 }}>{step.tip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section style={{ padding: "0 48px 100px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: "#a855f7", fontFamily: "'JetBrains Mono'", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>// Keyboard Shortcuts</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0" }}>Work at the Speed of Thought</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 10 }}>
            {SHORTCUTS.map(s => (
              <div key={s.key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 18px", background: "rgba(10,10,26,.8)",
                border: "1px solid rgba(255,255,255,.06)", borderRadius: 10,
              }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>{s.action}</span>
                <kbd style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
                  color: "#a855f7", background: "rgba(168,85,247,.1)",
                  border: "1px solid rgba(168,85,247,.25)", borderRadius: 6, padding: "3px 10px",
                  whiteSpace: "nowrap",
                }}>{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeedbackModal />
    </div>
  );
}
