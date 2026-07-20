"use client";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import LBarVertical from "@/components/studio/LBarVertical";
import LBarHorizontal from "@/components/studio/LBarHorizontal";
import AIAgentPanel from "@/components/studio/AIAgentPanel";

const CodeEditor = dynamic(() => import("@/components/studio/CodeEditor"), { ssr: false });

export default function StudioPage() {
  const { theme } = useStore();
  const T = theme;

  return (
    <div style={{
      height: "100vh", display: "flex", background: T.uiBg,
      overflow: "hidden", fontFamily: "'Inter', sans-serif", transition: "background 0.3s"
    }}>
      {/* ── 1: Left Vertical Sidebar (L-Shape Left Edge) ── */}
      <LBarVertical />

      {/* ── Right Workspace (Remaining Space) ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        height: "100%", overflow: "hidden", minWidth: 0
      }}>
        
        {/* ── Main Area: Code Editor (Full Frame) ── */}
        <div style={{
          flex: 1, minHeight: 0, position: "relative",
          background: T.editorBg
        }}>
          <CodeEditor />
        </div>

        {/* ── Bottom Section (Visualizers, Controls, and AI Agent) ── */}
        <div style={{
          height: 380, flexShrink: 0, borderTop: `1px solid ${T.uiBorder}`,
          display: "flex", minWidth: 0
        }}>
          
          {/* ── 2: Left/Center Visualizers & Controls ── */}
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
            <LBarHorizontal />
          </div>

          {/* ── 3: Right AI Agent Chat & Edit ── */}
          <div style={{ width: 320, flexShrink: 0, height: "100%" }}>
            <AIAgentPanel />
          </div>

        </div>

      </div>
    </div>
  );
}
