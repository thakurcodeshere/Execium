"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { getProgramList, PROGRAMS } from "@/lib/engine";
import { CODING_CHALLENGES, CodingChallenge, getDailyChallenge } from "@/lib/challenges";
import { LEARN_MODULES, getLearnModuleDetails } from "@/lib/learn";
import { 
  Plus, FolderGit2, History, User, Settings, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight, LayoutTemplate, BookOpen, HelpCircle, Flame
} from "lucide-react";

interface NavUser { name: string; avatar: string; provider: string; }
interface HistoryItem { id: string; title: string; code: string; timestamp: string; }
interface CustomProject { id: string; name: string; code: string; timestamp: string; }

interface LBarVerticalProps {
  width: number;
  setWidth: (w: number) => void;
  onStartResize: (e: React.MouseEvent) => void;
}

export default function LBarVertical({ width, setWidth, onStartResize }: LBarVerticalProps) {
  const { 
    pid, code, setCode, loadProgram, restart, theme, setTheme,
    projectName, projectId, setProjectName, setProjectId,
    activeChallengeId, activeLearnModuleId, setChallengeId, setLearnModuleId
  } = useStore();
  const [user, setUser] = useState<NavUser | null>(null);
  
  // Popover toggles
  const [showProgs, setShowProgs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const [learnDiffTab, setLearnDiffTab] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [learnSearchQuery, setLearnSearchQuery] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [projects, setProjects] = useState<CustomProject[]>([]);
  const [historyTab, setHistoryTab] = useState<'projects' | 'history'>('projects');

  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjTemplate, setNewProjTemplate] = useState("hello");

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingName, setRenamingName] = useState("");

  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [activeDiff, setActiveDiff] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Keyboard navigation focus indices & refs
  const [focusedLearnIdx, setFocusedLearnIdx] = useState(0);
  const [focusedChallengeIdx, setFocusedChallengeIdx] = useState(0);
  const learnItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const challengeItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setFocusedLearnIdx(0);
  }, [learnDiffTab, learnSearchQuery]);

  useEffect(() => {
    setFocusedChallengeIdx(0);
  }, [activeDiff]);

  // Global Keyboard Navigation Listener for Arrow Keys & Enter
  useEffect(() => {
    if (!showLearn && !showQuestions) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      if (showLearn) {
        const filtered = LEARN_MODULES.filter(m => {
          const matchTab = learnDiffTab === 'all' || m.difficulty === learnDiffTab;
          const q = learnSearchQuery.toLowerCase().trim();
          return matchTab && (!q || m.title.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
        });

        const tabs: ('all' | 'easy' | 'medium' | 'hard')[] = ['all', 'easy', 'medium', 'hard'];
        const currentIdx = tabs.indexOf(learnDiffTab);

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = tabs[(currentIdx + 1) % tabs.length];
          setLearnDiffTab(next);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
          setLearnDiffTab(prev);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedLearnIdx(prev => {
            const next = Math.min(filtered.length - 1, prev + 1);
            if (learnItemRefs.current[next]) {
              learnItemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
            return next;
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedLearnIdx(prev => {
            const next = Math.max(0, prev - 1);
            if (learnItemRefs.current[next]) {
              learnItemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
            return next;
          });
        } else if (e.key === 'Enter' && !isInputFocused) {
          if (filtered.length > 0 && focusedLearnIdx >= 0 && focusedLearnIdx < filtered.length) {
            e.preventDefault();
            handleSelectLearn(filtered[focusedLearnIdx].id);
          }
        } else if (e.key === 'Escape') {
          setShowLearn(false);
        }
      } else if (showQuestions) {
        const filtered = CODING_CHALLENGES.filter(c => c.difficulty === activeDiff);
        const tabs: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
        const currentIdx = tabs.indexOf(activeDiff);

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = tabs[(currentIdx + 1) % tabs.length];
          setActiveDiff(next);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
          setActiveDiff(prev);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedChallengeIdx(prev => {
            const next = Math.min(filtered.length - 1, prev + 1);
            if (challengeItemRefs.current[next]) {
              challengeItemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
            return next;
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedChallengeIdx(prev => {
            const next = Math.max(0, prev - 1);
            if (challengeItemRefs.current[next]) {
              challengeItemRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
            return next;
          });
        } else if (e.key === 'Enter') {
          if (filtered.length > 0 && focusedChallengeIdx >= 0 && focusedChallengeIdx < filtered.length) {
            e.preventDefault();
            handleSelectQuestion(filtered[focusedChallengeIdx]);
          }
        } else if (e.key === 'Escape') {
          setShowQuestions(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLearn, showQuestions, learnDiffTab, learnSearchQuery, activeDiff, focusedLearnIdx, focusedChallengeIdx]);

  const isExpanded = width > 120;
  const programs = getProgramList();
  const T = theme;

  useEffect(() => {
    try {
      const u = localStorage.getItem("execium_user");
      if (u) setUser(JSON.parse(u));

      const hist = localStorage.getItem("execium_history");
      if (hist) setHistory(JSON.parse(hist));

      const projs = localStorage.getItem("execium_projects");
      if (projs) setProjects(JSON.parse(projs));

      const solved = localStorage.getItem("execium_solved_challenges");
      if (solved) setSolvedChallenges(JSON.parse(solved));

      // Restore popover state if active module/challenge exists
      if (activeLearnModuleId) {
        setShowLearn(true);
      } else if (activeChallengeId) {
        setShowQuestions(true);
      } else {
        setShowLearn(false);
        setShowQuestions(false);
        setShowHistory(false);
        setShowProgs(false);
        setShowProfile(false);
      }
    } catch {}
  }, [activeLearnModuleId, activeChallengeId]);

  const saveToHistory = (customCode: string) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: customCode.split('\n')[0].replace("//", "").trim().slice(0, 24) || "Untitled Snippet",
        code: customCode,
        timestamp: new Date().toLocaleString()
      };
      const updated = [newItem, ...history.slice(0, 19)];
      setHistory(updated);
      localStorage.setItem("execium_history", JSON.stringify(updated));
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("execium_user");
    setUser(null);
    setShowProfile(false);
  };

  const triggerNewProjectModal = () => {
    setNewProjName(`Project ${Math.floor(Math.random() * 900) + 100}`);
    setNewProjTemplate("hello");
    setShowNewProjModal(true);
    setShowProgs(false);
    setShowHistory(false);
    setShowProfile(false);
    setShowLearn(false);
    setShowQuestions(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newProjName.trim() || "Untitled Project";
    
    let starterCode = "";
    if (newProjTemplate === "hello") {
      starterCode = `// Project: ${name}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`;
    } else if (newProjTemplate === "empty") {
      starterCode = `// Project: ${name}\nint main() {\n    \n    return 0;\n}`;
    } else if (newProjTemplate === "fibonacci") {
      starterCode = `// Project: ${name}\n#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n\nint main() {\n    cout << "fib(5) = " << fib(5) << endl;\n    return 0;\n}`;
    } else if (newProjTemplate === "sort") {
      starterCode = `// Project: ${name}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);\n        }\n    }\n}\n\nint main() {\n    vector<int> arr = {5, 2, 8, 1, 9};\n    bubbleSort(arr);\n    return 0;\n}`;
    }

    const newId = Date.now().toString();
    const newProj: CustomProject = {
      id: newId,
      name,
      code: starterCode,
      timestamp: new Date().toLocaleString()
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("execium_projects", JSON.stringify(updated));

    setCode(starterCode);
    setProjectName(name);
    setProjectId(newId);
    setChallengeId(null);
    restart();
    setShowNewProjModal(false);
  };

  const handleLoadProject = (proj: CustomProject) => {
    setCode(proj.code);
    setProjectName(proj.name);
    setProjectId(proj.id);
    setChallengeId(null);
    restart();
    setShowHistory(false);
  };

  const handleDeleteProject = (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== projId);
    setProjects(updated);
    localStorage.setItem("execium_projects", JSON.stringify(updated));
    
    if (projectId === projId) {
      setProjectId(null);
      setProjectName("Untitled Project");
    }
  };

  const handleStartRename = (proj: CustomProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(proj.id);
    setRenamingName(proj.name);
  };

  const handleSaveRename = (projId: string, e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nameToUse = renamingName.trim();
    if (!nameToUse) {
      setRenamingId(null);
      return;
    }
    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, name: nameToUse };
      }
      return p;
    });
    setProjects(updated);
    localStorage.setItem("execium_projects", JSON.stringify(updated));

    if (projectId === projId) {
      setProjectName(nameToUse);
    }
    setRenamingId(null);
  };

  const toggleHistoryPopover = () => {
    const nextState = !showHistory;
    setShowHistory(nextState);
    if (nextState) {
      try {
        const hist = localStorage.getItem("execium_history");
        if (hist) setHistory(JSON.parse(hist));
        const projs = localStorage.getItem("execium_projects");
        if (projs) setProjects(JSON.parse(projs));
      } catch {}
      setShowProgs(false);
      setShowProfile(false);
      setShowLearn(false);
      setShowQuestions(false);
    }
  };

  const toggleQuestionsPopover = () => {
    const nextState = !showQuestions;
    setShowQuestions(nextState);
    if (nextState) {
      try {
        const solved = localStorage.getItem("execium_solved_challenges");
        if (solved) setSolvedChallenges(JSON.parse(solved));
      } catch {}
      setShowProgs(false);
      setShowHistory(false);
      setShowProfile(false);
      setShowLearn(false);
    }
  };

  const handleNewProject = () => {
    const defaultCode = `// Untitled Project\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`;
    setCode(defaultCode);
    setProjectName("Untitled Project");
    setProjectId(null);
    setChallengeId(null);
    setLearnModuleId(null);
    restart();
    saveToHistory(defaultCode);
  };

  const handleLoadHistory = (itemCode: string) => {
    setCode(itemCode);
    setChallengeId(null);
    restart();
    setShowHistory(false);
  };

  const handleSelectQuestion = (q: CodingChallenge) => {
    setCode(q.code);
    setProjectName(q.title);
    setProjectId(null);
    setChallengeId(q.id);
    restart();
    saveToHistory(q.code);
    setShowQuestions(false);
  };

  const handleSelectLearn = (modId: string) => {
    const mod = getLearnModuleDetails(modId);
    // Set project name to the problem title
    setProjectName(mod.title);
    setProjectId(null);
    // Pre-fill editor with C++ boilerplate scaffold for this problem
    const boilerplate = `// ${mod.title}\n// Category: ${mod.category} | Difficulty: ${mod.difficulty.toUpperCase()}\n// ${mod.shortDesc}\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// TODO: Implement your solution for ${mod.title}\n\nint main() {\n    cout << "=== ${mod.title} ===" << endl;\n\n    // Write your code here\n\n    return 0;\n}\n`;
    setCode(boilerplate);
    restart();
    setLearnModuleId(modId);
    setShowLearn(false);
  };

  const CAT_COLORS: Record<string, string> = {
    'Basics': '#10b981', 'Recursion': '#a855f7', 'Algorithms': '#3b82f6',
    'Data Structures': '#f97316', 'Memory': '#ec4899',
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    width: isExpanded ? "100%" : 42,
    height: 42,
    borderRadius: 8,
    border: `1px solid ${active ? T.uiAccent : "transparent"}`,
    background: active ? `${T.uiAccent}15` : "transparent",
    color: active ? T.uiAccent : T.uiTextMuted,
    display: "flex",
    alignItems: "center",
    justifyContent: isExpanded ? "flex-start" : "center",
    gap: 12,
    padding: isExpanded ? "0 14px" : "0",
    cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    transition: "all 0.15s",
    textAlign: "left"
  });

  return (
    <div style={{
      width, height: "100%", background: T.uiPanelHd,
      borderRight: `1px solid ${T.uiBorder}`, display: "flex",
      flexDirection: "column", padding: "16px 0",
      gap: 16, zIndex: 110, position: "relative", flexShrink: 0,
      transition: "width 0.1s"
    }}>
      {/* ── DRAG HANDLE ── */}
      <div 
        onMouseDown={onStartResize}
        style={{
          position: "absolute", top: 0, right: -4, bottom: 0, width: 8,
          cursor: "col-resize", zIndex: 120
        }}
      />

      {/* ── LOGO & COLLAPSE ── */}
      <div style={{
        display: "flex", alignItems: "center", 
        justifyContent: isExpanded ? "space-between" : "center",
        padding: isExpanded ? "0 14px" : "0 8px", width: "100%"
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer",
            boxShadow: "0 0 14px rgba(168,85,247,.4)",
          }}>Ω</div>
          {isExpanded && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>Execium</span>
              <span style={{ fontSize: 7, color: T.uiTextMuted, letterSpacing: 0.5 }}>COMPUTATIONAL OS</span>
            </div>
          )}
        </Link>
        
        {isExpanded && (
          <button onClick={() => setWidth(64)} style={{ background: "none", border: "none", color: T.uiTextMuted, cursor: "pointer", display: "flex" }}>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <div style={{ padding: "0 12px" }}><div style={{ height: 1, background: T.uiBorder }} /></div>

      {/* ── VERTICAL NAVIGATION ITEMS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px", alignItems: "center" }}>
        
        {/* ADD NEW PROJECT */}
        <button onClick={triggerNewProjectModal} style={btnStyle(false)} title="Create New Project">
          <Plus size={18} />
          {isExpanded && <span>New Project</span>}
        </button>

        {/* TEMPLATES */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={() => { setShowProgs(p => !p); setShowHistory(false); setShowProfile(false); setShowLearn(false); setShowQuestions(false); }} 
            style={btnStyle(showProgs)}
            title="Templates library"
          >
            <LayoutTemplate size={18} />
            {isExpanded && <span>Templates</span>}
          </button>

          {showProgs && (
            <div style={{
              position: "absolute", top: 0, left: width - 8, width: 280,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)"
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>📂 C++ TEMPLATES</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {programs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { loadProgram(p.id); saveToHistory(p.code); setChallengeId(null); setShowProgs(false); }}
                    style={{
                      width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
                      background: p.id === pid ? `${T.uiAccent}15` : "transparent", border: "none", cursor: "pointer",
                      textAlign: "left", borderBottom: `1px solid ${T.uiBorder}`
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.uiText }}>{p.title}</div>
                      <div style={{ fontSize: 9, color: T.uiTextMuted }}>{p.category}</div>
                    </div>
                    <div style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: CAT_COLORS[p.category] ?? "#3b82f6"
                    }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LEARN PROGRAMMING */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={() => { setShowLearn(l => !l); setShowProgs(false); setShowHistory(false); setShowProfile(false); setShowQuestions(false); }} 
            style={btnStyle(showLearn)}
            title="Learn C++ Programming"
          >
            <BookOpen size={18} />
            {isExpanded && <span>Learn C++</span>}
          </button>

          {showLearn && (
            <div style={{
              position: "absolute", top: 0, left: width - 8, width: 320,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)", display: "flex", flexDirection: "column"
            }}>
              {/* Header Title */}
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>📚 LEARN PROGRAMMING (100)</span>
                <span style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>100 C++ TYPES</span>
              </div>

              {/* Search Filter Box */}
              <div style={{ padding: "8px 10px", borderBottom: `1px solid ${T.uiBorder}`, background: "rgba(0,0,0,0.15)" }}>
                <input
                  type="text"
                  placeholder="🔍 Search 100 C++ modules..."
                  value={learnSearchQuery}
                  onChange={e => setLearnSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "5px 10px", borderRadius: 6,
                    border: `1px solid ${T.uiBorder}`, background: T.uiSurface,
                    color: T.uiText, fontSize: 11, fontFamily: "'JetBrains Mono'", outline: "none"
                  }}
                />
              </div>

              {/* Difficulty Tabs */}
              <div style={{ padding: "6px 8px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd, display: "flex", gap: 4 }}>
                {(['all', 'easy', 'medium', 'hard'] as const).map(tab => {
                  const isAct = learnDiffTab === tab;
                  const count = tab === 'all' ? 100 : tab === 'easy' ? 35 : tab === 'medium' ? 40 : 25;
                  const color = tab === 'easy' ? '#10b981' : tab === 'medium' ? '#f59e0b' : tab === 'hard' ? '#ef4444' : T.uiAccent;
                  return (
                    <button
                      key={tab}
                      onClick={() => setLearnDiffTab(tab)}
                      style={{
                        flex: 1, padding: "4px 0", borderRadius: 5, border: `1px solid ${isAct ? color : "transparent"}`,
                        background: isAct ? `${color}20` : "transparent",
                        color: isAct ? color : T.uiTextMuted,
                        fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                        cursor: "pointer", textTransform: "uppercase"
                      }}
                    >
                      {tab} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Filtered Modules List */}
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {(() => {
                  const filtered = LEARN_MODULES.filter(m => {
                    const matchTab = learnDiffTab === 'all' || m.difficulty === learnDiffTab;
                    const q = learnSearchQuery.toLowerCase().trim();
                    const matchQuery = !q || m.title.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
                    return matchTab && matchQuery;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: 20, textAlign: "center", fontSize: 11, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>
                        No modules match "{learnSearchQuery}"
                      </div>
                    );
                  }

                  return filtered.map((m, idx) => {
                    const isFocused = idx === focusedLearnIdx;
                    const diffColor = m.difficulty === 'easy' ? '#10b981' : m.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
                    return (
                      <button
                        key={m.id}
                        ref={el => { learnItemRefs.current[idx] = el; }}
                        onClick={() => handleSelectLearn(m.id)}
                        onMouseEnter={() => setFocusedLearnIdx(idx)}
                        style={{
                          width: "100%", padding: "10px 12px", display: "flex", flexDirection: "column",
                          background: isFocused ? `${T.uiAccent}1f` : "transparent",
                          border: "none", cursor: "pointer",
                          textAlign: "left", borderBottom: `1px solid ${T.uiBorder}`,
                          transition: "all 0.12s ease", outline: "none",
                          boxShadow: isFocused ? `inset 3px 0 0 0 ${T.uiAccent}` : "none"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: isFocused ? 800 : 700, color: isFocused ? T.uiAccent : T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {isFocused ? "▶ " : ""}{m.title}
                          </span>
                          <span style={{
                            fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                            padding: "1px 5px", borderRadius: 3, background: `${diffColor}20`,
                            color: diffColor, border: `1px solid ${diffColor}40`, textTransform: "uppercase"
                          }}>
                            {m.difficulty}
                          </span>
                        </div>
                        <div style={{ fontSize: 9, color: isFocused ? T.uiText : T.uiTextMuted, lineHeight: 1.3 }}>
                          {m.shortDesc}
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>

              {/* Keyboard Shortcuts Helper Footer */}
              <div style={{
                padding: "6px 10px", background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${T.uiBorder}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted
              }}>
                <span><strong style={{ color: T.uiAccent }}>← →</strong> Tabs</span>
                <span><strong style={{ color: T.uiAccent }}>↑ ↓</strong> Scroll</span>
                <span><strong style={{ color: T.uiAccent }}>↵</strong> Select</span>
              </div>
            </div>
          )}
        </div>

        {/* PROGRAMMING QUESTIONS */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={toggleQuestionsPopover} 
            style={btnStyle(showQuestions)}
            title="Practice Coding Challenges"
          >
            <HelpCircle size={18} />
            {isExpanded && <span>Challenges</span>}
          </button>

          {showQuestions && (
            <div style={{
              position: "absolute", top: 0, left: width - 8, width: 300,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)", display: "flex", flexDirection: "column"
            }}>
              {/* Header Title */}
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>✍️ CODING CHALLENGES</span>
              </div>

              {/* Today's Daily Challenge Featured Card */}
              {(() => {
                const dailyInfo = getDailyChallenge();
                const isDailySolved = solvedChallenges.includes(dailyInfo.challenge.id);
                const diffColor = dailyInfo.challenge.difficulty === 'easy' ? '#10b981' : dailyInfo.challenge.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
                return (
                  <div style={{
                    padding: "12px 14px",
                    background: "linear-gradient(135deg, rgba(249,115,22,0.14), rgba(168,85,247,0.14))",
                    borderBottom: `1px solid ${T.uiBorder}`,
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", fontWeight: 800, color: "#f97316", display: "flex", alignItems: "center", gap: 4 }}>
                        <Flame size={12} fill="#f97316" color="#f97316" /> TODAY&apos;S DAILY PICK • {dailyInfo.formattedDate}
                      </span>
                      <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: `${diffColor}20`, color: diffColor }}>
                        {dailyInfo.challenge.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.uiText, marginBottom: 4 }}>
                      {dailyInfo.challenge.title}
                    </div>
                    <div style={{ fontSize: 9, color: T.uiTextMuted, marginBottom: 8, lineHeight: 1.3 }}>
                      {dailyInfo.challenge.desc}
                    </div>
                    <button
                      onClick={() => handleSelectQuestion(dailyInfo.challenge)}
                      style={{
                        width: "100%", padding: "6px 0", borderRadius: 6, border: "none",
                        background: isDailySolved ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #f97316, #a855f7)",
                        color: isDailySolved ? "#10b981" : "#fff",
                        fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        boxShadow: isDailySolved ? "none" : "0 2px 10px rgba(249,115,22,0.3)"
                      }}
                    >
                      {isDailySolved ? "✓ Solved Today" : "⚡ Solve Today's Challenge"}
                    </button>
                  </div>
                );
              })()}

              {/* Progress Tracker Card */}
              {(() => {
                const solvedCount = CODING_CHALLENGES.filter(c => solvedChallenges.includes(c.id)).length;
                const totalCount = CODING_CHALLENGES.length;
                const solvedPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
                return (
                  <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.15)", borderBottom: `1px solid ${T.uiBorder}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted, marginBottom: 6 }}>
                      <span>PROGRESS STATUS</span>
                      <span style={{ color: T.uiText, fontWeight: 700 }}>{solvedCount}/{totalCount} ({solvedPct}%)</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${solvedPct}%`, background: "linear-gradient(90deg, #10b981, #3b82f6)", transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                );
              })()}

              {/* Difficulty Tabs Selector */}
              <div style={{
                padding: "8px 10px", borderBottom: `1px solid ${T.uiBorder}`,
                background: T.uiPanelHd, display: "flex", gap: 6
              }}>
                {(['easy', 'medium', 'hard'] as const).map(diff => {
                  const labelColor = diff === 'easy' ? '#10b981' : diff === 'medium' ? '#f59e0b' : '#ef4444';
                  const isActive = activeDiff === diff;
                  return (
                    <button
                      key={diff}
                      onClick={() => setActiveDiff(diff)}
                      style={{
                        flex: 1, padding: "5px 0", borderRadius: 6, border: "none",
                        cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono'",
                        fontWeight: 800, textTransform: "uppercase",
                        background: isActive ? `${labelColor}20` : "transparent",
                        color: isActive ? labelColor : T.uiTextMuted,
                        transition: "all 0.15s"
                      }}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>

              {/* Challenges list */}
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {CODING_CHALLENGES.filter(c => c.difficulty === activeDiff).map((c, idx) => {
                  const isFocused = idx === focusedChallengeIdx;
                  const isSolved = solvedChallenges.includes(c.id);
                  const isTodayDaily = c.id === getDailyChallenge().challenge.id;
                  return (
                    <button
                      key={c.id}
                      ref={el => { challengeItemRefs.current[idx] = el; }}
                      onClick={() => handleSelectQuestion(c)}
                      onMouseEnter={() => setFocusedChallengeIdx(idx)}
                      style={{
                        width: "100%", padding: "12px 14px", display: "flex", flexDirection: "column",
                        background: isFocused ? `${T.uiAccent}1f` : activeChallengeId === c.id ? `${T.uiAccent}10` : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        borderBottom: `1px solid ${T.uiBorder}`, transition: "all 0.12s ease",
                        boxSizing: "border-box", outline: "none",
                        boxShadow: isFocused ? `inset 3px 0 0 0 ${T.uiAccent}` : "none"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: isFocused ? 800 : 700, color: isFocused ? T.uiAccent : T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                          {isFocused ? "▶ " : ""}{c.title}
                          {isTodayDaily && (
                            <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 4, background: "rgba(249,115,22,0.2)", color: "#f97316", fontFamily: "'JetBrains Mono'", fontWeight: 800 }}>🔥 DAILY</span>
                          )}
                        </div>
                        {/* Solved vs Unsolved Status badge */}
                        <span style={{
                          fontSize: 8, fontFamily: "'JetBrains Mono'", fontWeight: 800,
                          padding: "2px 6px", borderRadius: 4,
                          background: isSolved ? "rgba(16,185,129,.12)" : "rgba(255,255,255,.03)",
                          color: isSolved ? "#10b981" : T.uiTextMuted,
                          border: `1px solid ${isSolved ? "rgba(16,185,129,.25)" : T.uiBorder}`
                        }}>
                          {isSolved ? "SOLVED" : "TODO"}
                        </span>
                      </div>
                      <div style={{ fontSize: 9, color: isFocused ? T.uiText : T.uiTextMuted, marginTop: 4, lineHeight: 1.4 }}>
                        {c.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Keyboard Shortcuts Helper Footer */}
              <div style={{
                padding: "6px 10px", background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${T.uiBorder}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 9, fontFamily: "'JetBrains Mono'", color: T.uiTextMuted
              }}>
                <span><strong style={{ color: "#f97316" }}>← →</strong> Tabs</span>
                <span><strong style={{ color: "#f97316" }}>↑ ↓</strong> Scroll</span>
                <span><strong style={{ color: "#f97316" }}>↵</strong> Select</span>
              </div>
            </div>
          )}
        </div>

        {/* PROJECT HISTORY */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={toggleHistoryPopover} 
            style={btnStyle(showHistory)}
            title="Project History"
          >
            <History size={18} />
            {isExpanded && <span>History</span>}
          </button>

          {showHistory && (
            <div style={{
              position: "absolute", top: 0, left: width - 8, width: 300,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)", display: "flex", flexDirection: "column"
            }}>
              {/* Tabs selector */}
              <div style={{
                padding: "8px 10px", borderBottom: `1px solid ${T.uiBorder}`,
                background: T.uiPanelHd, display: "flex", gap: 6
              }}>
                <button
                  onClick={() => setHistoryTab('projects')}
                  style={{
                    flex: 1, padding: "5px 0", borderRadius: 6, border: "none",
                    cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono'",
                    fontWeight: 800, textTransform: "uppercase",
                    background: historyTab === 'projects' ? `${T.uiAccent}20` : "transparent",
                    color: historyTab === 'projects' ? T.uiAccent : T.uiTextMuted,
                    transition: "all 0.15s"
                  }}
                >
                  📁 Projects ({projects.length})
                </button>
                <button
                  onClick={() => setHistoryTab('history')}
                  style={{
                    flex: 1, padding: "5px 0", borderRadius: 6, border: "none",
                    cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono'",
                    fontWeight: 800, textTransform: "uppercase",
                    background: historyTab === 'history' ? `${T.uiAccent}20` : "transparent",
                    color: historyTab === 'history' ? T.uiAccent : T.uiTextMuted,
                    transition: "all 0.15s"
                  }}
                >
                  🕒 History ({history.length})
                </button>
              </div>

              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {historyTab === 'projects' ? (
                  projects.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center", fontSize: 11, color: T.uiTextMuted }}>
                      No saved projects yet.<br/>
                      Click "+ New Project" to create one.
                    </div>
                  ) : (
                    projects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleLoadProject(p)}
                        style={{
                          width: "100%", padding: "10px 14px", display: "flex", alignItems: "center",
                          justifyContent: "space-between", background: p.id === projectId ? `${T.uiAccent}15` : "transparent",
                          borderBottom: `1px solid ${T.uiBorder}`, cursor: "pointer",
                          transition: "background 0.15s", boxSizing: "border-box"
                        }}
                        onMouseEnter={e => { if (p.id !== projectId) e.currentTarget.style.background = `${T.uiAccent}08`; }}
                        onMouseLeave={e => { if (p.id !== projectId) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                          {renamingId === p.id ? (
                            <form 
                              onSubmit={(e) => handleSaveRename(p.id, e)}
                              onClick={e => e.stopPropagation()}
                              style={{ display: "flex", gap: 4, width: "100%" }}
                            >
                              <input
                                value={renamingName}
                                onChange={e => setRenamingName(e.target.value)}
                                style={{
                                  flex: 1, background: T.editorBg, border: `1px solid ${T.uiAccent}`,
                                  borderRadius: 4, padding: "2px 6px", color: T.uiText, fontSize: 11,
                                  fontFamily: "'Inter'", outline: "none", width: "100%"
                                }}
                                autoFocus
                              />
                            </form>
                          ) : (
                            <>
                              <div style={{ fontSize: 12, fontWeight: 700, color: T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: 8, color: T.uiTextMuted, marginTop: 2 }}>
                                {p.timestamp}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                          {renamingId === p.id ? (
                            <button
                              onClick={(e) => handleSaveRename(p.id, e)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981", fontSize: 12, fontWeight: 800 }}
                              title="Save Name"
                            >
                              ✓
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => handleStartRename(p, e)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: T.uiTextMuted, fontSize: 11 }}
                                title="Rename"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => handleDeleteProject(p.id, e)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11 }}
                                title="Delete Project"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  history.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center", fontSize: 11, color: T.uiTextMuted }}>
                      No history snapshots yet.
                    </div>
                  ) : (
                    history.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleLoadHistory(item.code)}
                        style={{
                          width: "100%", padding: "10px 14px", display: "flex", alignItems: "center",
                          justifyContent: "space-between", background: "transparent",
                          border: "none", borderBottom: `1px solid ${T.uiBorder}`, cursor: "pointer",
                          textAlign: "left", transition: "background 0.15s", boxSizing: "border-box"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `${T.uiAccent}0e`}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.uiText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                          <div style={{ fontSize: 8, color: T.uiTextMuted, marginTop: 4 }}>{item.timestamp}</div>
                        </div>
                      </button>
                    ))
                  )
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <div style={{ flex: 1 }} />

      {/* ── BOTTOM PROFILE & SETTINGS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px", alignItems: "center" }}>
        
        {/* THEME */}
        <button onClick={() => setTheme(theme.id === "dark-plus" ? "github-light" : "dark-plus")} style={btnStyle(false)} title="Toggle Light/Dark Theme">
          {theme.id.includes("light") ? <Moon size={18} /> : <Sun size={18} />}
          {isExpanded && <span>Switch Theme</span>}
        </button>

        {/* PROFILE */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button onClick={() => { setShowProfile(p => !p); setShowProgs(false); setShowHistory(false); setShowLearn(false); setShowQuestions(false); }} style={btnStyle(showProfile)} title="User Profile">
            {user ? (
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: "#fff"
              }}>{user.name[0].toUpperCase()}</div>
            ) : (
              <User size={18} />
            )}
            {isExpanded && <span>{user ? user.name : "Profile"}</span>}
          </button>

          {showProfile && (
            <div style={{
              position: "absolute", bottom: 0, left: width - 8, width: 220,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)"
            }}>
              {user ? (
                <>
                  <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.uiText }}>{user.name}</div>
                    <div style={{ fontSize: 10, color: T.uiTextMuted, marginTop: 2 }}>via {user.provider}</div>
                  </div>
                  <button onClick={logout} style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12, fontFamily: "'JetBrains Mono'", textAlign: "left" }}>
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: T.uiText, marginBottom: 10 }}>Not signed in</div>
                  <Link href="/login" style={{ textDecoration: "none" }} onClick={() => setShowProfile(false)}>
                    <button style={{
                      width: "100%", padding: "6px 0", borderRadius: 8, border: `1px solid ${T.uiAccent}`,
                      background: `${T.uiAccent}15`, color: T.uiAccent, fontSize: 11,
                      fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer"
                    }}>Sign In</button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <Link href="/settings" style={{ textDecoration: "none", width: "100%" }}>
          <button style={btnStyle(false)} title="Settings">
            <Settings size={18} />
            {isExpanded && <span>Settings</span>}
          </button>
        </Link>

      {/* ── NEW PROJECT MODAL OVERLAY ── */}
      {showNewProjModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(3,3,10,0.85)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
            borderRadius: 16, width: "90%", maxWidth: 420, padding: 28,
            boxShadow: "0 30px 90px rgba(0,0,0,0.8)", display: "flex",
            flexDirection: "column", gap: 20, fontFamily: "'Inter', sans-serif"
          }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: T.uiText, margin: 0 }}>
                ➕ Create New C++ Project
              </h3>
              <p style={{ fontSize: 11, color: T.uiTextMuted, marginTop: 6, lineHeight: 1.4 }}>
                Choose a name and a starter template for your new computational project space.
              </p>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Project Name Input */}
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontFamily: "'JetBrains Mono'" }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={e => setNewProjName(e.target.value)}
                  placeholder="e.g. Binary Search Tree"
                  required
                  style={{
                    width: "100%", background: T.editorBg, border: `1px solid ${T.uiBorder}`,
                    borderRadius: 8, padding: "10px 14px", color: T.uiText,
                    fontSize: 12, outline: "none", fontFamily: "'Inter'", boxSizing: "border-box"
                  }}
                  autoFocus
                />
              </div>

              {/* Starter Template Selection */}
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: T.uiTextMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontFamily: "'JetBrains Mono'" }}>
                  Starter Template
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { id: "hello", title: "👋 Hello World", desc: "Basic C++ program output stream" },
                    { id: "empty", title: "📄 Empty Project", desc: "Clear C++ workspace layout" },
                    { id: "fibonacci", title: "🌀 Fibonacci", desc: "Recursion visual template" },
                    { id: "sort", title: "⚡ Bubble Sort", desc: "Comparison sort algorithm" },
                  ].map(t => (
                    <div
                      key={t.id}
                      onClick={() => setNewProjTemplate(t.id)}
                      style={{
                        padding: 12, borderRadius: 10, border: `1px solid ${newProjTemplate === t.id ? T.uiAccent : T.uiBorder}`,
                        background: newProjTemplate === t.id ? `${T.uiAccent}0e` : "transparent",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: newProjTemplate === t.id ? T.uiAccent : T.uiText }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: 8, color: T.uiTextMuted, marginTop: 4, lineHeight: 1.3 }}>
                        {t.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: `1px solid ${T.uiBorder}`,
                    background: "none", color: T.uiTextMuted, cursor: "pointer",
                    fontSize: 11, fontFamily: "'JetBrains Mono'"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 22px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                    color: "#fff", cursor: "pointer", fontSize: 11,
                    fontFamily: "'JetBrains Mono'", fontWeight: 800,
                    boxShadow: "0 0 14px rgba(168,85,247,.4)"
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
