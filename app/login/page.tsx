"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [alreadyIn, setAlreadyIn] = useState(false);
  
  // Modes: 'signin' | 'signup' | 'forgot'
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("execium_user")) setAlreadyIn(true);
    } catch {}
  }, []);

  const handleProviderLogin = (provider: string) => {
    setLoading(provider);
    const mockNames: Record<string, string> = {
      github: "thakurcodeshere",
      google: "Gyan Thakur"
    };
    const displayName = mockNames[provider] || "Developer User";
    setTimeout(() => {
      localStorage.setItem("execium_user", JSON.stringify({ name: displayName, provider, ts: Date.now() }));
      router.push("/");
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      setLoading("email");
      setTimeout(() => {
        setResetSent(true);
        setLoading(null);
      }, 1200);
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading("email");
    const displayName = name || email.split("@")[0] || "User";
    setTimeout(() => {
      localStorage.setItem("execium_user", JSON.stringify({ name: displayName, provider: "email", ts: Date.now() }));
      router.push("/");
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#1e222b",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden",
    }}>
      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "15%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,.08),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.06),transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 440, padding: "0 20px",
        zIndex: 10, position: "relative"
      }}>
        {/* Card */}
        <div style={{
          background: "#282c34",
          border: "1px solid #181a1f",
          borderRadius: 24, padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,.6)",
        }}>
          {alreadyIn ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981", marginBottom: 8 }}>Already Signed In</div>
              <p style={{ color: "#858585", fontSize: 13, marginBottom: 24 }}>You are logged in as thakurcodeshere.</p>
              <button onClick={() => router.push("/")} style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#a855f7,#3b82f6)",
                color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
              }}>Go to Homepage</button>
              <button onClick={() => { localStorage.removeItem("execium_user"); setAlreadyIn(false); }} style={{
                marginTop: 10, width: "100%", padding: "11px", borderRadius: 10,
                border: "1px solid rgba(239,68,68,.25)", background: "rgba(239,68,68,.08)",
                color: "#ef4444", fontSize: 12, cursor: "pointer",
              }}>Sign Out & Switch Account</button>
            </div>
          ) : (
            <>
              {/* Logo / Header */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, margin: "0 auto 16px",
                    background: "linear-gradient(135deg,#a855f7,#3b82f6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 900, color: "#fff",
                    boxShadow: "0 0 20px rgba(168,85,247,.4)",
                  }}>Ω</div>
                </Link>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#abb2bf", marginBottom: 6, letterSpacing: "-0.5px" }}>
                  {mode === "signin" && "Sign In to Execium"}
                  {mode === "signup" && "Create Your Account"}
                  {mode === "forgot" && "Reset Password"}
                </h1>
                <p style={{ fontSize: 12, color: "#5c6370" }}>
                  {mode === "signin" && "Unlock high-fidelity visual execution debugging."}
                  {mode === "signup" && "Join engineers who think in computational execution."}
                  {mode === "forgot" && "Enter your email to request password recovery link."}
                </p>
              </div>

              {/* Form Input fields */}
              {resetSent && mode === "forgot" ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 32, color: "#98c379", marginBottom: 12 }}>✓ Check Your Inbox</div>
                  <p style={{ fontSize: 12, color: "#858585", lineHeight: 1.6, marginBottom: 20 }}>
                    We have dispatched password recovery instructions to **{email}**.
                  </p>
                  <button onClick={() => { setResetSent(false); setMode("signin"); }} style={{
                    width: "100%", padding: "11px", borderRadius: 10, border: "1px solid #181a1f",
                    background: "#21252b", color: "#abb2bf", fontSize: 12, cursor: "pointer"
                  }}>
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {mode === "signup" && (
                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "#5c6370", marginBottom: 6, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>FULL NAME</label>
                      <input 
                        type="text" value={name} onChange={e=>setName(e.target.value)}
                        placeholder="John Doe" required
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #181a1f", background: "#21252b", color: "#abb2bf", outline: "none", fontSize: 13 }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#5c6370", marginBottom: 6, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>EMAIL OR USERNAME</label>
                    <input 
                      type="text" value={email} onChange={e=>setEmail(e.target.value)}
                      placeholder="you@domain.com" required
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #181a1f", background: "#21252b", color: "#abb2bf", outline: "none", fontSize: 13 }}
                    />
                  </div>

                  {mode !== "forgot" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <label style={{ fontSize: 10, color: "#5c6370", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>PASSWORD</label>
                        {mode === "signin" && (
                          <span onClick={() => setMode("forgot")} style={{ fontSize: 10, color: "#528bff", cursor: "pointer" }}>
                            Forgot password?
                          </span>
                        )}
                      </div>
                      <input 
                        type="password" value={password} onChange={e=>setPassword(e.target.value)}
                        placeholder="••••••••" required
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #181a1f", background: "#21252b", color: "#abb2bf", outline: "none", fontSize: 13 }}
                      />
                    </div>
                  )}

                  {mode === "signup" && (
                    <div>
                      <label style={{ display: "block", fontSize: 10, color: "#5c6370", marginBottom: 6, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>CONFIRM PASSWORD</label>
                      <input 
                        type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                        placeholder="••••••••" required
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #181a1f", background: "#21252b", color: "#abb2bf", outline: "none", fontSize: 13 }}
                      />
                    </div>
                  )}

                  <button type="submit" disabled={!!loading} style={{
                    width: "100%", padding: "12px", borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg,#a855f7,#3b82f6)",
                    color: "#fff", fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(168,85,247,.3)", marginTop: 6, transition: "all 0.15s"
                  }}>
                    {loading === "email" ? "Processing..." : (
                      <>
                        {mode === "signin" && "Sign In with Email"}
                        {mode === "signup" && "Sign Up"}
                        {mode === "forgot" && "Send Reset Link"}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mode Toggler */}
              <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#5c6370" }}>
                {mode === "signin" && (
                  <>
                    Don&apos;t have an account?{" "}
                    <span onClick={() => setMode("signup")} style={{ color: "#528bff", cursor: "pointer", fontWeight: 700 }}>
                      Sign Up
                    </span>
                  </>
                )}
                {mode === "signup" && (
                  <>
                    Already have an account?{" "}
                    <span onClick={() => setMode("signin")} style={{ color: "#528bff", cursor: "pointer", fontWeight: 700 }}>
                      Sign In
                    </span>
                  </>
                )}
                {mode === "forgot" && !resetSent && (
                  <span onClick={() => setMode("signin")} style={{ color: "#528bff", cursor: "pointer", fontWeight: 700 }}>
                    Back to Sign In
                  </span>
                )}
              </div>

              {/* OR Continue With Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: "#181a1f" }} />
                <span style={{ fontSize: 10, color: "#5c6370", fontFamily: "'JetBrains Mono'" }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: 1, background: "#181a1f" }} />
              </div>

              {/* Social Login (GitHub & Google only) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* GitHub */}
                <button
                  onClick={() => handleProviderLogin("github")}
                  disabled={!!loading}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 16px", borderRadius: 10,
                    border: "1px solid #181a1f", background: "#21252b",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all .15s", opacity: loading && loading !== "github" ? .5 : 1
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#282c34"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#21252b"; }}
                >
                  <svg height="18" width="18" viewBox="0 0 16 16" fill="#abb2bf" style={{ flexShrink: 0 }}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#abb2bf", flex: 1, textAlign: "left" }}>
                    {loading === "github" ? "Connecting GitHub..." : "Continue with GitHub"}
                  </span>
                  {loading !== "github" && <span style={{ fontSize: 11, color: "#5c6370" }}>→</span>}
                </button>

                {/* Google */}
                <button
                  onClick={() => handleProviderLogin("google")}
                  disabled={!!loading}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 16px", borderRadius: 10,
                    border: "1px solid #181a1f", background: "#21252b",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all .15s", opacity: loading && loading !== "google" ? .5 : 1
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#282c34"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#21252b"; }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#abb2bf", flex: 1, textAlign: "left" }}>
                    {loading === "google" ? "Connecting Google..." : "Continue with Google"}
                  </span>
                  {loading !== "google" && <span style={{ fontSize: 11, color: "#5c6370" }}>→</span>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Tagline below card */}
        <p style={{
          textAlign: "center", marginTop: 24, fontSize: 11, color: "#5c6370",
          fontFamily: "'JetBrains Mono'", letterSpacing: 1,
        }}>
          EXECIUM Ω∞ · COMPUTATIONAL REALITY OS
        </p>
      </div>
    </div>
  );
}
