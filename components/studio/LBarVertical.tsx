"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getProgramList, PROGRAMS } from "@/lib/engine";
import { 
  Plus, FolderGit2, History, User, Settings, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight, LayoutTemplate, Clock
} from "lucide-react";

interface NavUser { name: string; avatar: string; provider: string; }
interface HistoryItem { id: string; title: string; code: string; timestamp: string; }

interface LBarVerticalProps {
  width: number;
  setWidth: (w: number) => void;
  onStartResize: (e: React.MouseEvent) => void;
}

export default function LBarVertical({ width, setWidth, onStartResize }: LBarVerticalProps) {
  const { pid, code, setCode, loadProgram, restart, theme, setTheme } = useStore();
  const [user, setUser] = useState<NavUser | null>(null);
  
  // Popover toggles
  const [showProgs, setShowProgs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const isExpanded = width > 120;
  const programs = getProgramList();
  const T = theme;

  // Load user and history from localStorage
  useEffect(() => {
    try {
      const u = localStorage.getItem("execium_user");
      if (u) setUser(JSON.parse(u));

      const hist = localStorage.getItem("execium_history");
      if (hist) setHistory(JSON.parse(hist));
    } catch {}
  }, []);

  // Update history when code is changed or loaded
  const saveToHistory = (customCode: string) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: customCode.split('\n')[0].replace("//", "").trim().slice(0, 24) || "Untitled Snippet",
        code: customCode,
        timestamp: new Date().toLocaleString()
      };
      const updated = [newItem, ...history.slice(0, 19)]; // Limit to 20 items
      setHistory(updated);
      localStorage.setItem("execium_history", JSON.stringify(updated));
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("execium_user");
    setUser(null);
    setShowProfile(false);
  };

  const handleNewProject = () => {
    const defaultCode = `// New Execium Project\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to Execium!" << endl;\n    return 0;\n}`;
    setCode(defaultCode);
    restart();
    saveToHistory(defaultCode);
    alert("New project created in editor!");
  };

  const handleLoadHistory = (itemCode: string) => {
    setCode(itemCode);
    restart();
    setShowHistory(false);
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
      {/* ── DRAG HANDLE FOR RESIZING ── */}
      <div 
        onMouseDown={onStartResize}
        style={{
          position: "absolute", top: 0, right: -4, bottom: 0, width: 8,
          cursor: "col-resize", zIndex: 120
        }}
        title="Drag to resize sidebar"
      />

      {/* ── TOP SECTION: LOGO & COLLAPSE TOGLE ── */}
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
          <button 
            onClick={() => setWidth(64)}
            style={{
              background: "none", border: "none", color: T.uiTextMuted,
              cursor: "pointer", display: "flex", alignItems: "center"
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <div style={{ padding: "0 12px" }}>
        <div style={{ height: 1, background: T.uiBorder }} />
      </div>

      {/* ── INTERACTION BUTTONS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px", alignItems: "center" }}>
        
        {/* ADD NEW PROJECT */}
        <button 
          onClick={handleNewProject} 
          style={btnStyle(false)}
          title="Create New Project"
        >
          <Plus size={18} />
          {isExpanded && <span>New Project</span>}
        </button>

        {/* TEMPLATES OPTION */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={() => { setShowProgs(p => !p); setShowHistory(false); setShowProfile(false); }} 
            style={btnStyle(showProgs)}
            title="Browse Templates"
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
                    onClick={() => { loadProgram(p.id); saveToHistory(p.code); setShowProgs(false); }}
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

        {/* PROJECT HISTORY */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={() => { setShowHistory(h => !h); setShowProgs(false); setShowProfile(false); }} 
            style={btnStyle(showHistory)}
            title="Project History"
          >
            <History size={18} />
            {isExpanded && <span>History</span>}
          </button>

          {showHistory && (
            <div style={{
              position: "absolute", top: 0, left: width - 8, width: 280,
              background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
              borderRadius: 12, overflow: "hidden", zIndex: 220,
              boxShadow: "10px 10px 40px rgba(0,0,0,.6)"
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'" }}>🕒 PROJECT HISTORY</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {history.length === 0 ? (
                  <div style={{ padding: 16, textAlign: "center", fontSize: 11, color: T.uiTextMuted }}>
                    No history snapshots yet.
                  </div>
                ) : (
                  history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleLoadHistory(item.code)}
                      style={{
                        width: "100%", padding: "10px 14px", display: "flex", flexDirection: "column",
                        background: "transparent", border: "none", cursor: "pointer",
                        textAlign: "left", borderBottom: `1px solid ${T.uiBorder}`
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${T.uiAccent}0e`}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.uiText }}>{item.title}</div>
                      <div style={{ fontSize: 8, color: T.uiTextMuted, marginTop: 4 }}>{item.timestamp}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <div style={{ flex: 1 }} />

      {/* ── BOTTOM SECTION: THEME, PROFILE & SETTINGS (LEFT BOTTOM) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px", alignItems: "center" }}>
        
        {/* THEME TOGGLE */}
        <button
          onClick={() => setTheme(theme.id === "dark-plus" ? "github-light" : "dark-plus")}
          style={btnStyle(false)}
          title="Toggle Light/Dark Theme"
        >
          {theme.id.includes("light") ? <Moon size={18} /> : <Sun size={18} />}
          {isExpanded && <span>Switch Theme</span>}
        </button>

        {/* PROFILE */}
        <div style={{ width: "100%", position: "relative", display: "flex", justifyContent: "center" }}>
          <button 
            onClick={() => { setShowProfile(p => !p); setShowProgs(false); setShowHistory(false); }} 
            style={btnStyle(showProfile)}
            title="User Profile"
          >
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
                  <button
                    onClick={logout}
                    style={{
                      width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
                      background: "none", border: "none", color: "#ef4444", cursor: "pointer",
                      fontSize: 12, fontFamily: "'JetBrains Mono'", textAlign: "left"
                    }}
                  >
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

        {/* EXPAND BUTTON (when collapsed) */}
        {!isExpanded && (
          <button 
            onClick={() => setWidth(200)}
            style={{
              background: "none", border: "none", color: T.uiTextMuted,
              cursor: "pointer", display: "flex", alignItems: "center", marginTop: 8
            }}
            title="Expand Sidebar"
          >
            <ChevronRight size={16} />
          </button>
        )}

      </div>
    </div>
  );
}
