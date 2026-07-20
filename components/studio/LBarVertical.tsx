"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getProgramList, PROGRAMS } from "@/lib/engine";
import { FolderGit2, User, Settings, LogOut, Sun, Moon } from "lucide-react";

interface NavUser { name: string; avatar: string; provider: string; }

export default function LBarVertical() {
  const { pid, loadProgram, theme, setTheme } = useStore();
  const [user, setUser] = useState<NavUser | null>(null);
  const [showProgs, setShowProgs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const programs = getProgramList();
  const prog = PROGRAMS[pid];
  const T = theme;

  useEffect(() => {
    try {
      const u = localStorage.getItem("execium_user");
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const logout = () => {
    localStorage.removeItem("execium_user");
    setUser(null);
    setShowProfile(false);
  };

  const CAT_COLORS: Record<string, string> = {
    'Basics': '#10b981', 'Recursion': '#a855f7', 'Algorithms': '#3b82f6',
    'Data Structures': '#f97316', 'Memory': '#ec4899',
  };

  return (
    <div style={{
      width: 64, height: "100%", background: T.uiPanelHd,
      borderRight: `1px solid ${T.uiBorder}`, display: "flex",
      flexDirection: "column", alignItems: "center", padding: "16px 0",
      gap: 20, zIndex: 110, position: "relative", flexShrink: 0
    }}>
      {/* ── LOGO ── */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900, color: "#fff", cursor: "pointer",
          boxShadow: "0 0 16px rgba(168,85,247,.45)",
          transition: "transform 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >Ω</div>
      </Link>

      <div style={{ width: 32, height: 1, background: T.uiBorder }} />

      {/* ── PROJECT / PROGRAM SELECTOR ── */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setShowProgs(p => !p); setShowProfile(false); }}
          title="Select Project / Template"
          style={{
            width: 42, height: 42, borderRadius: 10, border: `1px solid ${showProgs ? "#a855f7" : T.uiBorder}`,
            background: showProgs ? "rgba(168,85,247,.15)" : T.uiSurface,
            color: showProgs ? "#a855f7" : T.uiTextMuted,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => { if(!showProgs) e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"; }}
          onMouseLeave={e => { if(!showProgs) e.currentTarget.style.borderColor = T.uiBorder; }}
        >
          <FolderGit2 size={18} />
        </button>

        {showProgs && (
          <div style={{
            position: "absolute", top: 0, left: 54, width: 280,
            background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
            borderRadius: 12, overflow: "hidden", zIndex: 220,
            boxShadow: "10px 10px 40px rgba(0,0,0,.6)", animation: "scan 0.2s ease-out"
          }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`, background: T.uiPanelHd }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'", letterSpacing: 1 }}>📂 SELECT PROGRAM</span>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {programs.map(p => (
                <button
                  key={p.id}
                  onClick={() => { loadProgram(p.id); setShowProgs(false); }}
                  style={{
                    width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
                    background: p.id === pid ? `${T.uiAccent}15` : "transparent", border: "none", cursor: "pointer",
                    textAlign: "left", borderBottom: `1px solid ${T.uiBorder}`, transition: "background .12s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${T.uiAccent}0e`}
                  onMouseLeave={e => e.currentTarget.style.background = p.id === pid ? `${T.uiAccent}15` : "transparent"}
                >
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.uiText }}>{p.title}</div>
                    <div style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>{p.category}</div>
                  </div>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: CAT_COLORS[p.category] ?? "#3b82f6",
                    boxShadow: `0 0 6px ${CAT_COLORS[p.category] ?? "#3b82f6"}`
                  }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PROFILE STATUS ── */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setShowProfile(p => !p); setShowProgs(false); }}
          title={user ? `Profile: ${user.name}` : "User Profile"}
          style={{
            width: 42, height: 42, borderRadius: 10, border: `1px solid ${showProfile ? "#3b82f6" : T.uiBorder}`,
            background: showProfile ? "rgba(59,130,246,.15)" : T.uiSurface,
            color: showProfile ? "#3b82f6" : T.uiTextMuted,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => { if(!showProfile) e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; }}
          onMouseLeave={e => { if(!showProfile) e.currentTarget.style.borderColor = T.uiBorder; }}
        >
          {user ? (
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff"
            }}>{user.name[0].toUpperCase()}</div>
          ) : (
            <User size={18} />
          )}
        </button>

        {showProfile && (
          <div style={{
            position: "absolute", top: 0, left: 54, width: 220,
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
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
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

      {/* ── SETTINGS SHORTCUT ── */}
      <Link href="/settings" style={{ textDecoration: "none" }}>
        <button
          title="Open Settings"
          style={{
            width: 42, height: 42, borderRadius: 10, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.uiBorder; e.currentTarget.style.color = T.uiTextMuted; }}
        >
          <Settings size={18} />
        </button>
      </Link>

      <div style={{ flex: 1 }} />

      {/* ── THEME SWITCHER ── */}
      <button
        onClick={() => setTheme(theme.id === "dark-plus" ? "github-light" : "dark-plus")}
        title="Toggle Light/Dark Theme"
        style={{
          width: 36, height: 36, borderRadius: 50, border: "none",
          background: "rgba(255,255,255,.03)", color: T.uiTextMuted,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = T.uiText; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.03)"; e.currentTarget.style.color = T.uiTextMuted; }}
      >
        {theme.id.includes("light") ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {/* ── ACTIVE PROGRAM BADGE INDICATOR ── */}
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: "#10b981", boxShadow: "0 0 8px #10b981",
        animation: "pulse-node 2s infinite"
      }} title="System Online" />
    </div>
  );
}
