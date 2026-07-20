"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import ExecutionFlow from "./ExecutionFlow";
import VariablesPanel from "./VariablesPanel";
import ConsoleOutput from "./ConsoleOutput";
import MemoryUniverse from "./MemoryUniverse";
import RecursionDim from "./RecursionDimension";
import ExecutionWaterfall from "./ExecutionWaterfall";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles } from "lucide-react";

type VisualizerTab = 'flow' | 'waterfall' | 'memory' | 'recursion' | 'vars' | 'console';

const HL: Record<string, string> = {
  blue: '#3b82f6', green: '#10b981', yellow: '#f59e0b', purple: '#a855f7',
  orange: '#f97316', red: '#ef4444', cyan: '#06b6d4', pink: '#ec4899',
};

const SPEEDS = [{ l: '0.5×', ms: 2800 }, { l: '1×', ms: 1400 }, { l: '2×', ms: 700 }, { l: '4×', ms: 350 }];

export default function LBarHorizontal() {
  const {
    steps, cur, playback, speed, play,
    pause, fwd, bwd, restart, setSpeed, jump, theme, showAI, toggleAI
  } = useStore();

  const [activeTab, setActiveTab] = useState<VisualizerTab>('flow');

  const step = steps[cur];
  const playing = playback === 'playing';
  const done = playback === 'done';
  const pct = steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 0;
  const hlCol = step ? HL[step.hl] ?? '#3b82f6' : '#3b82f6';
  const T = theme;

  const tabs: Array<{ id: VisualizerTab; label: string; icon: string; col: string }> = [
    { id: 'flow', label: 'Flow', icon: '📋', col: '#06b6d4' },
    { id: 'waterfall', label: 'Waterfall', icon: '🌊', col: '#a855f7' },
    { id: 'memory', label: 'Memory Universe', icon: '📦', col: '#f97316' },
    { id: 'recursion', label: 'Stack Frame', icon: '🌀', col: '#ec4899' },
    { id: 'vars', label: 'Variables', icon: '✏️', col: '#10b981' },
    { id: 'console', label: 'Console Output', icon: '📤', col: '#ef4444' },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: T.uiSurface, borderTop: `1px solid ${T.uiBorder}`, overflow: "hidden"
    }}>
      {/* ── Visualizer Tabs Bar ── */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, padding: "0 8px", alignItems: "center", flexShrink: 0
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              border: "none", borderBottom: activeTab === t.id ? `2px solid ${t.col}` : "2px solid transparent",
              background: activeTab === t.id ? `${t.col}12` : "transparent",
              color: activeTab === t.id ? t.col : T.uiTextMuted, cursor: "pointer",
              fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: activeTab === t.id ? 800 : 400,
              transition: "all 0.15s"
            }}
          >
            <span style={{ fontSize: 12 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Step Badge */}
        {step && (
          <div style={{
            display: "flex", gap: 6, paddingRight: 8, fontSize: 9,
            fontFamily: "'JetBrains Mono'", color: T.uiTextMuted
          }}>
            <span style={{ background: `${hlCol}15`, color: hlCol, border: `1px solid ${hlCol}30`, padding: "2px 6px", borderRadius: 4 }}>
              Line {step.line} · {step.type.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ── Visualizer Panels Content (Scrollable) ── */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: T.uiBg }}>
        {activeTab === 'flow' && <ExecutionFlow />}
        {activeTab === 'waterfall' && <ExecutionWaterfall />}
        {activeTab === 'memory' && <MemoryUniverse />}
        {activeTab === 'recursion' && <RecursionDim />}
        {activeTab === 'vars' && <VariablesPanel />}
        {activeTab === 'console' && (
          <div style={{ height: "100%", padding: 12, background: T.editorBg }}>
            <ConsoleOutput />
          </div>
        )}
      </div>

      {/* ── Bottom Temporal Controls / Status Horizontal Line ── */}
      <div style={{
        height: 52, flexShrink: 0, background: T.uiPanelHd,
        borderTop: `1px solid ${T.uiBorder}`, display: "flex",
        alignItems: "center", padding: "0 16px", gap: 12
      }}>
        {/* Playback buttons */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button
            onClick={restart}
            title="Restart"
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,.03)", color: T.uiTextMuted, display: "flex",
              alignItems: "center", justifyContent: "center", transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.uiText}
            onMouseLeave={e => e.currentTarget.style.color = T.uiTextMuted}
          >
            <RotateCcw size={14} />
          </button>
          
          <button
            onClick={bwd}
            disabled={cur === 0}
            title="Step Backward"
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              cursor: cur === 0 ? "default" : "pointer", opacity: cur === 0 ? 0.3 : 1,
              background: "rgba(255,255,255,.03)", color: T.uiTextMuted, display: "flex",
              alignItems: "center", justifyContent: "center", transition: "all 0.15s"
            }}
            onMouseEnter={e => { if(cur>0) e.currentTarget.style.color = T.uiText; }}
            onMouseLeave={e => { if(cur>0) e.currentTarget.style.color = T.uiTextMuted; }}
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={playing ? pause : play}
            title={playing ? "Pause" : "Play Simulation"}
            style={{
              width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
              background: playing ? "rgba(245,158,11,.18)" : "rgba(16,185,129,.18)",
              color: playing ? "#f59e0b" : "#10b981", display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: playing ? "0 0 16px rgba(245,158,11,.35)" : "0 0 16px rgba(16,185,129,.35)",
              transition: "all 0.15s"
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={fwd}
            disabled={cur === steps.length - 1}
            title="Step Forward"
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              cursor: cur === steps.length - 1 ? "default" : "pointer", opacity: cur === steps.length - 1 ? 0.3 : 1,
              background: "rgba(255,255,255,.03)", color: T.uiTextMuted, display: "flex",
              alignItems: "center", justifyContent: "center", transition: "all 0.15s"
            }}
            onMouseEnter={e => { if(cur < steps.length-1) e.currentTarget.style.color = T.uiText; }}
            onMouseLeave={e => { if(cur < steps.length-1) e.currentTarget.style.color = T.uiTextMuted; }}
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: T.uiBorder }} />

        {/* Speed Controls */}
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <span style={{ fontSize: 8, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'", letterSpacing: 0.5, marginRight: 4 }}>SPEED:</span>
          {SPEEDS.map(s => (
            <button
              key={s.l}
              onClick={() => setSpeed(s.ms)}
              style={{
                padding: "3px 8px", borderRadius: 5, border: `1px solid ${speed === s.ms ? "rgba(59,130,246,0.3)" : "transparent"}`,
                background: speed === s.ms ? "rgba(59,130,246,0.12)" : "transparent",
                color: speed === s.ms ? "#3b82f6" : T.uiTextMuted, cursor: "pointer",
                fontFamily: "'JetBrains Mono'", fontSize: 9, fontWeight: 700, transition: "all 0.15s"
              }}
            >
              {s.l}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: T.uiBorder }} />

        {/* Scrubber Progress bar */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{ flex: 1, height: 4, background: "rgba(255,255,255,.05)", borderRadius: 2, cursor: "pointer", position: "relative" }}
            onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              jump(Math.round(((e.clientX - r.left) / r.width) * (steps.length - 1)));
            }}
          >
            <div style={{ position: "absolute", inset: 0, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${hlCol}, #a855f7)`, transition: "width 0.15s ease" }} />
            </div>
            <div style={{
              position: "absolute", top: -3, left: `calc(${pct}% - 5px)`,
              width: 10, height: 10, borderRadius: "50%", background: "#fff",
              border: `2px solid ${hlCol}`, boxShadow: `0 0 6px ${hlCol}`, transition: "left 0.15s ease"
            }} />
          </div>
          <span style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'", whiteSpace: "nowrap" }}>
            {cur + 1}/{steps.length}
          </span>
        </div>

        {/* Stats & AI Toggle button */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {step && (
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>
              OPS: <strong style={{ color: T.uiText }}>{step.ops}</strong>
            </div>
          )}

          <div style={{ width: 1, height: 16, background: T.uiBorder }} />

          {/* Toggle AI Agent button */}
          <button
            onClick={toggleAI}
            title={showAI ? "Close AI Copilot" : "Open AI Copilot"}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8,
              border: `1px solid ${showAI ? "#06b6d4" : T.uiBorder}`,
              background: showAI ? "rgba(6,182,212,.12)" : T.uiSurface,
              color: showAI ? "#06b6d4" : T.uiTextMuted, cursor: "pointer",
              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
              boxShadow: showAI ? "0 0 12px rgba(6,182,212,.25)" : "none",
              transition: "all 0.15s"
            }}
          >
            <Sparkles size={12} />
            <span>AI AGENT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
