"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import LBarVertical from "@/components/studio/LBarVertical";
import LBarHorizontal from "@/components/studio/LBarHorizontal";
import AIAgentPanel from "@/components/studio/AIAgentPanel";
import ChallengePanel from "@/components/studio/ChallengePanel";
import LearnPanel from "@/components/studio/LearnPanel";

const CodeEditor = dynamic(() => import("@/components/studio/CodeEditor"), { ssr: false });

export default function StudioPage() {
  const { theme, showAI, isCollapsed, activeChallengeId, activeLearnModuleId } = useStore();
  const T = theme;

  // Sidebar drag-to-resize states
  const [sidebarWidth, setSidebarWidth] = useState(64);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Limits: min 64px, max 300px
    let newWidth = e.clientX;
    if (newWidth < 100) {
      newWidth = 64; // Snap to collapsed
    } else if (newWidth > 260) {
      newWidth = 260; // Max limit
    }
    setSidebarWidth(newWidth);
  }, [isResizing]);

  // Hook global mouse event listeners for resize drag
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const isSplit = Boolean(activeChallengeId || activeLearnModuleId);

  return (
    <div style={{
      height: "100vh", display: "flex", background: T.uiBg,
      overflow: "hidden", fontFamily: "'Inter', sans-serif", transition: "background 0.3s"
    }}>
      {/* ── 1: Left Vertical Sidebar (L-Shape Left Edge, Draggable & Collapsible) ── */}
      <LBarVertical 
        width={sidebarWidth} 
        setWidth={setSidebarWidth} 
        onStartResize={startResizing} 
      />

      {/* ── Right Workspace (Remaining Space) ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        height: "100%", overflow: "hidden", minWidth: 0
      }}>
        
        {/* ── Main Area: Code Editor (Left) & Problem / Learn Frame (Right) ── */}
        <div style={{
          flex: 1, minHeight: 0, position: "relative",
          background: T.editorBg, display: "flex"
        }}>
          {/* Left Frame: Monaco Code Editor */}
          <div style={{
            flex: isSplit ? "1 1 55%" : "1 1 100%",
            height: "100%", position: "relative", minWidth: 0
          }}>
            <CodeEditor />
          </div>

          {/* Right Frame: Problem Statement & Up to 10 Solutions */}
          {activeChallengeId && (
            <div style={{
              width: "45%", minWidth: 340, maxWidth: 640,
              height: "100%", flexShrink: 0
            }}>
              <ChallengePanel />
            </div>
          )}

          {/* Right Frame: Pedagogical Learn Programming Framework */}
          {activeLearnModuleId && (
            <div style={{
              width: "45%", minWidth: 340, maxWidth: 640,
              height: "100%", flexShrink: 0
            }}>
              <LearnPanel />
            </div>
          )}
        </div>

        {/* ── Bottom Section (Visualizers, Controls, and optional AI Agent) ── */}
        <div style={{
          height: isCollapsed ? 90 : 380, flexShrink: 0, borderTop: `1px solid ${T.uiBorder}`,
          display: "flex", minWidth: 0, transition: "height 0.2s ease"
        }}>
          
          {/* ── 2: Left/Center Visualizers & Controls ── */}
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
            <LBarHorizontal />
          </div>

          {/* ── 3: Right AI Agent Chat & Edit (Opens on 1/4 of screen on bottom right when toggled) ── */}
          {showAI && (
            <div style={{ width: "25vw", minWidth: 280, flexShrink: 0, height: "100%" }}>
              <AIAgentPanel />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
