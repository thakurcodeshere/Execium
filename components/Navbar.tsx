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
    { href: "/guidelines", label: "Guidelines" },
    { href: "/studio", label: "Studio ⚡" },
  ];

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60,
      display: "flex", alignItems: "center", padding: "0 32px", gap: 12,
      background: "rgba(3,3,10,.88)", borderBottom: "1px solid rgba(255,255,255,.06)",
      backdropFilter: "blur(24px)", fontFamily: "'Inter', sans-serif",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg,#a855f7,#3b82f6,#06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, fontWeight: 900, color: "#fff",
          boxShadow: "0 0 22px rgba(168,85,247,.55)",
        }}>Ω</div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 14,
            background: "linear-gradient(90deg,#a855f7,#3b82f6,#06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Execium Ω∞</div>
          <div style={{ fontSize: 8, color: "#334155", fontFamily: "'JetBrains Mono'", letterSpacing: 1 }}>
            COMPUTATIONAL REALITY OS
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 2, marginLeft: 24 }}>
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding: "6px 14px", borderRadius: 8, textDecoration: "none", fontSize: 13,
            fontWeight: isActive(l.href) ? 700 : 500,
            color: isActive(l.href) ? "#a855f7" : "#64748b",
            background: isActive(l.href) ? "rgba(168,85,247,.1)" : "transparent",
            transition: "all .15s",
          }}>{l.label}</Link>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Live indicator */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "pulse-node 2.5s ease-in-out infinite" }} />
        <span style={{ fontSize: 10, color: "#10b981", fontFamily: "'JetBrains Mono'" }}>LIVE</span>
      </div>

      {/* Settings */}
      <Link href="/settings" style={{
        width: 36, height: 36, borderRadius: 9, border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16, textDecoration: "none",
        transition: "all .15s", color: "#64748b",
      }}
        title="Settings"
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,.4)"; (e.currentTarget as HTMLElement).style.color = "#a855f7"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.08)"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
      >⚙</Link>

      {/* User / Login */}
      {user ? (
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "5px 10px",
            borderRadius: 10, border: "1px solid rgba(168,85,247,.25)",
            background: "rgba(168,85,247,.1)", cursor: "pointer",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg,#a855f7,#3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#fff",
            }}>{user.name[0].toUpperCase()}</div>
            <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{user.name}</span>
            <span style={{ fontSize: 9, color: "#64748b" }}>▾</span>
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, width: 180,
              background: "#0a0a1a", border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.7)",
            }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{user.name}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>via {user.provider}</div>
              </div>
              <Link href="/settings" style={{ display: "block", padding: "10px 14px", fontSize: 13, color: "#94a3b8", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>⚙ Settings</Link>
              <button onClick={logout} style={{ width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>↩ Sign Out</button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login">
          <button style={{
            padding: "7px 18px", borderRadius: 9, border: "1px solid rgba(168,85,247,.35)",
            background: "rgba(168,85,247,.12)", color: "#a855f7", fontSize: 12,
            fontFamily: "'JetBrains Mono'", fontWeight: 700, cursor: "pointer",
            transition: "all .18s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,.22)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(168,85,247,.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,.12)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >Sign In</button>
        </Link>
      )}
    </nav>
  );
}
