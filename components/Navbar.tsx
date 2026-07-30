"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";

interface NavUser { name: string; avatar: string; provider: string; }

export default function Navbar() {
  const path = usePathname();
  const { theme, setTheme } = useStore();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem("execium_user");
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const toggleTheme = () => {
    if (theme.type === 'light') {
      setTheme('dark-plus');
    } else {
      setTheme('github-light');
    }
  };

  const logout = () => {
    localStorage.removeItem("execium_user");
    setUser(null);
    setMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/learn", label: "Learn" },
    { href: "/practice", label: "Practice" },
    { href: "/guidelines", label: "Guidelines" },
    { href: "/studio", label: "Studio ⚡" },
  ];

  const isActive = (href: string) => {
    if (!path) return false;
    return href === "/" ? path === "/" : path.startsWith(href);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 96,
      display: "flex", alignItems: "center", padding: "0 40px", gap: 20,
      background: "rgba(6, 8, 18, 0.92)",
      borderBottom: "1.5px solid rgba(168, 85, 247, 0.3)",
      backdropFilter: "blur(32px) saturate(200%)",
      WebkitBackdropFilter: "blur(32px) saturate(200%)",
      fontFamily: "'Inter', sans-serif",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)"
    }}>
      {/* ── SUPREME HIGH-IMPACT EXECIUM BRAND LOGO ICON & TYPOGRAPHY ── */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 16 }}>
        {/* Supreme Hyper-Highlighted Quantum Omega Badge */}
        <div style={{
          width: 58, height: 58, borderRadius: 16,
          background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #06b6d4 100%)",
          border: "2px solid #ffffff",
          outline: "3px solid rgba(168, 85, 247, 0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 35px #a855f7, 0 0 65px rgba(59,130,246,0.7), inset 0 2px 4px rgba(255,255,255,0.8)",
          position: "relative", overflow: "hidden", transition: "all 0.3s ease",
          cursor: "pointer", flexShrink: 0
        }}>
          {/* Pulsing Core Energy Orb */}
          <div style={{
            position: "absolute", width: 40, height: 40, borderRadius: "50%",
            background: "radial-gradient(circle, #ffffff 0%, #e9d5ff 40%, transparent 100%)",
            filter: "blur(6px)", opacity: 0.9
          }} />

          {/* Bold Supreme Quantum Omega SVG Emblem */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 3, filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.8))" }}>
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 15.8906 4.22541 19.2605 7.4878 20.8711L3.5 22H9L11.5 19H12.5L15 22H20.5L16.5122 20.8711C19.7746 19.2605 22 15.8906 22 12C22 6.47715 17.5228 2 12 2ZM12 5.5C15.5899 5.5 18.5 8.41015 18.5 12C18.5 14.5422 17.0392 16.7423 14.9316 17.7842L12 14.8L9.06836 17.7842C6.96084 16.7423 5.5 14.5422 5.5 12C5.5 8.41015 8.41015 5.5 12 5.5Z"
              fill="#ffffff"
            />
            <circle cx="12" cy="12" r="3.5" fill="url(#supreme-core-grad)" />
            <defs>
              <linearGradient id="supreme-core-grad" x1="8.5" y1="8.5" x2="15.5" y2="15.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div>
          {/* Supreme Logo Title */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 24,
            letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #ffffff 0%, #f3e8ff 35%, #93c5fd 70%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "flex", alignItems: "center", gap: 6,
            filter: "drop-shadow(0 0 20px rgba(168,85,247,0.6))"
          }}>
            Execium <span style={{ fontSize: 16, color: "#c084fc", WebkitTextFillColor: "#c084fc", fontWeight: 900 }}>Ω∞</span>
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 10.5, color: "#a5b4fc", fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 2.4, fontWeight: 900, textTransform: "uppercase", marginTop: 2
          }}>
            COMPUTATIONAL REALITY OS
          </div>
        </div>
      </Link>

      {/* ── DOUBLE SCALED NAVIGATION PILLS ── */}
      <div style={{ display: "flex", gap: 8, marginLeft: 28 }}>
        {navLinks.map(l => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "10px 22px", borderRadius: 12, textDecoration: "none", fontSize: 14.5,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: active ? 800 : 600,
                color: active ? "#ffffff" : "#94a3b8",
                background: active
                  ? "linear-gradient(135deg, rgba(168,85,247,0.32), rgba(59,130,246,0.32))"
                  : "transparent",
                border: `1.5px solid ${active ? "rgba(168,85,247,0.55)" : "transparent"}`,
                boxShadow: active ? "0 6px 20px rgba(168,85,247,0.35)" : "none",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.15s ease"
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {active && (
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#a855f7", boxShadow: "0 0 10px #a855f7"
                }} />
              )}
              {l.label}
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* ── SCALED RIGHT ACTIONS: LIVE STATUS, SETTINGS & SIGN IN ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Live Laser Capsule */}
        <div style={{
          display: "flex", gap: 8, alignItems: "center", padding: "6px 14px",
          borderRadius: 20, background: "rgba(16,185,129,0.12)", border: "1.5px solid rgba(16,185,129,0.35)"
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#10b981",
            boxShadow: "0 0 12px #10b981", animation: "pulse-node 2s ease-in-out infinite"
          }} />
          <span style={{ fontSize: 11.5, color: "#34d399", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>LIVE</span>
        </div>

        {/* Interactive Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: 48, height: 48, borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease",
            color: theme?.type === 'light' ? "#f59e0b" : "#a855f7"
          }}
          title={theme?.type === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
            e.currentTarget.style.background = "rgba(168,85,247,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          {theme?.type === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Scaled Settings Button */}
        <Link href="/settings" style={{
          width: 48, height: 48, borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20, textDecoration: "none",
          transition: "all 0.2s ease", color: "#94a3b8",
        }}
          title="Settings"
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
            e.currentTarget.style.color = "#a855f7";
            e.currentTarget.style.background = "rgba(168,85,247,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >⚙</Link>

        {/* Scaled User / Login Glass CTA */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 16px",
              borderRadius: 14, border: "1.5px solid rgba(168,85,247,0.5)",
              background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(59,130,246,0.2))",
              cursor: "pointer", boxShadow: "0 0 20px rgba(168,85,247,0.3)"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "#fff",
              }}>{user.name[0].toUpperCase()}</div>
              <span style={{ fontSize: 14, color: "#ffffff", fontWeight: 800, fontFamily: "'JetBrains Mono'" }}>{user.name}</span>
              <span style={{ fontSize: 11, color: "#a855f7" }}>▾</span>
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, width: 200,
                background: "#0a0a1a", border: "1.5px solid rgba(168,85,247,0.4)",
                borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.85)",
                backdropFilter: "blur(20px)"
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>via {user.provider}</div>
                </div>
                <Link href="/settings" style={{ display: "block", padding: "12px 16px", fontSize: 13, color: "#94a3b8", textDecoration: "none", fontFamily: "'JetBrains Mono'" }} onClick={() => setMenuOpen(false)}>⚙ Settings</Link>
                <button onClick={logout} style={{ width: "100%", padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono'" }}>↩ Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button style={{
              padding: "11px 26px", borderRadius: 14,
              border: "1.5px solid rgba(168,85,247,0.6)",
              background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))",
              color: "#ffffff", fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800, cursor: "pointer", transition: "all 0.2s ease",
              boxShadow: "0 0 25px rgba(168,85,247,0.45)", letterSpacing: 0.3
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168,85,247,0.45), rgba(59,130,246,0.45))";
                e.currentTarget.style.boxShadow = "0 0 35px rgba(168,85,247,0.7)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.9)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(168,85,247,0.45)";
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
              }}
            >Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
