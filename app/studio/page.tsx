"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import LBarVertical from "@/components/studio/LBarVertical";
import LBarHorizontal from "@/components/studio/LBarHorizontal";
import AIAgentPanel from "@/components/studio/AIAgentPanel";
import ChallengePanel from "@/components/studio/ChallengePanel";
import LearnPanel from "@/components/studio/LearnPanel";

import { getLearnModuleDetails } from "@/lib/learn";
import { getChallengeDetails } from "@/lib/challenges";

const CodeEditor = dynamic(() => import("@/components/studio/CodeEditor"), { ssr: false });

export default function StudioPage() {
  const { 
    theme, showAI, isCollapsed, activeChallengeId, activeLearnModuleId,
    setLearnModuleId, setChallengeId, setProjectId, setProjectName, setCode,
    code, projectId, projectName, pid
  } = useStore();
  const T = theme;
  const [hydrated, setHydrated] = useState(false);

  // Sidebar drag-to-resize states
  const [sidebarWidth, setSidebarWidth] = useState(64);
  const [isResizing, setIsResizing] = useState(false);

  // 1. Initial State Restoration from URL query params or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const learnParam = params.get("learn");
      const challengeParam = params.get("challenge");
      const projParam = params.get("proj");

      if (learnParam) {
        setLearnModuleId(learnParam);
        const savedCode = localStorage.getItem(`execium_code_learn_${learnParam}`);
        if (savedCode) {
          setCode(savedCode);
        } else {
          const mod = getLearnModuleDetails(learnParam);
          if (mod?.fullCode) setCode(mod.fullCode);
        }
      } else if (challengeParam) {
        setChallengeId(challengeParam);
        const savedCode = localStorage.getItem(`execium_code_challenge_${challengeParam}`);
        if (savedCode) {
          setCode(savedCode);
        } else {
          const ch = getChallengeDetails(challengeParam);
          if (ch?.starterCode) setCode(ch.starterCode);
        }
      } else if (projParam) {
        setProjectId(projParam);
        const projs = localStorage.getItem("execium_projects");
        if (projs) {
          const list = JSON.parse(projs);
          const found = list.find((p: any) => p.id === projParam);
          if (found) {
            setProjectName(found.name);
            setCode(found.code);
          }
        }
      } else {
        // Fallback to active session snapshot in localStorage
        const rawSession = localStorage.getItem("execium_studio_session");
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session.activeLearnModuleId) {
            setLearnModuleId(session.activeLearnModuleId);
            const savedCode = localStorage.getItem(`execium_code_learn_${session.activeLearnModuleId}`) || session.code;
            if (savedCode) setCode(savedCode);
          } else if (session.activeChallengeId) {
            setChallengeId(session.activeChallengeId);
            const savedCode = localStorage.getItem(`execium_code_challenge_${session.activeChallengeId}`) || session.code;
            if (savedCode) setCode(savedCode);
          } else if (session.projectId) {
            setProjectId(session.projectId);
            if (session.projectName) setProjectName(session.projectName);
            if (session.code) setCode(session.code);
          } else if (session.code) {
            setCode(session.code);
            if (session.projectName) setProjectName(session.projectName);
          }
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // 2. State & URL Synchronization effect (persist active session & URL query)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const session = {
        activeLearnModuleId,
        activeChallengeId,
        projectId,
        projectName,
        code,
        pid
      };
      localStorage.setItem("execium_studio_session", JSON.stringify(session));

      // Also persist per-module code if in learn or challenge view
      if (activeLearnModuleId && code) {
        localStorage.setItem(`execium_code_learn_${activeLearnModuleId}`, code);
      }
      if (activeChallengeId && code) {
        localStorage.setItem(`execium_code_challenge_${activeChallengeId}`, code);
      }

      // Update URL search parameters seamlessly without page reload
      let newUrl = "/studio";
      if (activeLearnModuleId) {
        newUrl = `/studio?learn=${activeLearnModuleId}`;
      } else if (activeChallengeId) {
        newUrl = `/studio?challenge=${activeChallengeId}`;
      } else if (projectId) {
        newUrl = `/studio?proj=${projectId}`;
      }

      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.replaceState(null, "", newUrl);
      }
    } catch {}
  }, [hydrated, activeLearnModuleId, activeChallengeId, projectId, projectName, code, pid]);

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
