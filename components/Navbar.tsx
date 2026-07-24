"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavUser { name: string; avatar: string; provider: string; }

export default function Navbar() {
  const path = usePathname();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem("execium_user");
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

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
      {/* ── DOUBLE THICKNESS BRAND LOGO ICON & TYPOGRAPHY ── */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 16 }}>
        {/* Scaled Quantum Omega SVG Icon Badge */}
        <div style={{
          width: 54, height: 54, borderRadius: 16,
          background: "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.3), rgba(6,182,212,0.25))",
          border: "1.5px solid rgba(255, 255, 255, 0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 35px rgba(168,85,247,0.6), inset 0 1.5px 2px rgba(255,255,255,0.5)",
          position: "relative", overflow: "hidden", transition: "all 0.3s ease"
        }}>
          {/* Inner Ambient Glow Dot */}
          <div style={{
            position: "absolute", width: 30, height: 30, borderRadius: "50%",
            background: "radial-gradient(circle, #a855f7 0%, #3b82f6 70%, transparent 100%)",
            filter: "blur(6px)", opacity: 0.85
          }} />

          {/* Scaled Glowing Quantum Omega + Infinity SVG Logo */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2 }}>
            <path
              d="M12 4C8.13401 4 5 7.13401 5 11C5 13.8241 6.67138 16.2573 9.07007 17.3621L6 20H9.5L11.5 17.5H12.5L14.5 20H18L14.9299 17.3621C17.3286 16.2573 19 13.8241 19 11C19 7.13401 15.866 4 12 4ZM12 6.5C14.4853 6.5 16.5 8.51472 16.5 11C16.5 12.8252 15.4116 14.396 13.8447 15.1055L12 13.2L10.1553 15.1055C8.58841 14.396 7.5 12.8252 7.5 11C7.5 8.51472 9.51472 6.5 12 6.5Z"
              fill="url(#execium-logo-grad-lg)"
            />
            <defs>
              <linearGradient id="execium-logo-grad-lg" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#e9d5ff" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div>
          {/* Scaled Logo Title */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: 22,
            letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #ffffff 0%, #e9d5ff 40%, #60a5fa 75%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "flex", alignItems: "center", gap: 6,
            filter: "drop-shadow(0 0 16px rgba(168,85,247,0.4))"
          }}>
            Execium <span style={{ fontSize: 15, color: "#a855f7", WebkitTextFillColor: "#a855f7" }}>Ω∞</span>
          </div>

          {/* Scaled Subtitle */}
          <div style={{
            fontSize: 10.5, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 2.2, fontWeight: 800, textTransform: "uppercase", marginTop: 2
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
