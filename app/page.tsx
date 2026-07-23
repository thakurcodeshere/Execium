"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeedbackModal from "@/components/FeedbackModal";
import { getDailyChallenge, getTimeUntilNextDaily } from "@/lib/challenges";

function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const handleResize = () => {
      if (!c) return;
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    const cols = ["#3b82f6","#a855f7","#06b6d4","#10b981","#f97316"];
    const pts = Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+.5,c:cols[Math.floor(Math.random()*5)],l:Math.random()*200,ml:150+Math.random()*150}));
    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(30,34,43,.16)"; ctx.fillRect(0,0,W,H);
      pts.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy; p.l++;
        if(p.l>p.ml){Object.assign(pts[i],{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,l:0});return;}
        const a = Math.sin((p.l/p.ml)*Math.PI)*.65;
        ctx.save(); ctx.globalAlpha=a; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c; ctx.shadowColor=p.c; ctx.shadowBlur=8; ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

const TOPICS = [
  {id:"easy_vars",icon:"📦",color:"#10b981",ver:"C++11",cat:"Basics",title:"Variables & Types",desc:"int, float, auto, const, references, and type deduction with modern C++."},
  {id:"easy_if",icon:"🔄",color:"#3b82f6",ver:"C++11",cat:"Basics",title:"Control Flow",desc:"if/else, switch, for, while, do-while, range-based loops and iterators."},
  {id:"easy_funcs",icon:"⚙️",color:"#a855f7",ver:"C++11",cat:"Basics",title:"Functions & Lambdas",desc:"Function overloading, default args, inline, and C++11 lambda expressions."},
  {id:"easy_class_basic",icon:"🏗️",color:"#f97316",ver:"C++11",cat:"OOP",title:"Classes & Objects",desc:"Constructors, destructors, access specifiers, member functions, static members."},
  {id:"easy_class_basic",icon:"🧬",color:"#ec4899",ver:"C++11",cat:"OOP",title:"Inheritance & Polymorphism",desc:"Virtual functions, abstract classes, vtables, multiple inheritance, override."},
  {id:"easy_vectors",icon:"📚",color:"#06b6d4",ver:"C++11",cat:"STL",title:"Containers",desc:"vector, list, map, set, unordered_map, deque — when to use which."},
  {id:"easy_algorithms_basic",icon:"🔀",color:"#8b5cf6",ver:"C++11",cat:"STL",title:"Algorithms & Iterators",desc:"std::sort, std::find, std::transform, std::accumulate, begin/end iterators."},
  {id:"easy_pointers",icon:"🧠",color:"#f59e0b",ver:"C++11",cat:"Memory",title:"Pointers & References",desc:"Raw pointers, pointer arithmetic, nullptr, dangling pointers, const pointers."},
  {id:"med_raii",icon:"🔒",color:"#ef4444",ver:"C++11",cat:"Memory",title:"Smart Pointers",desc:"unique_ptr, shared_ptr, weak_ptr — RAII, move semantics, ownership model."},
  {id:"med_move_semantics",icon:"🚀",color:"#10b981",ver:"C++11",cat:"Modern",title:"Move Semantics",desc:"rvalue refs, std::move, move constructors, perfect forwarding, std::forward."},
  {id:"med_templates_func",icon:"📐",color:"#3b82f6",ver:"C++11",cat:"Modern",title:"Templates",desc:"Function templates, class templates, template specialization, SFINAE basics."},
  {id:"easy_auto",icon:"🌊",color:"#a855f7",ver:"C++17",cat:"C++17",title:"Structured Bindings",desc:"auto [a,b]=pair; if constexpr; std::optional; std::variant; std::filesystem."},
  {id:"easy_algorithms_basic",icon:"⚡",color:"#f97316",ver:"C++17",cat:"C++17",title:"Parallel Algorithms",desc:"std::execution policies, parallel sort, transform_reduce, hardware concurrency."},
  {id:"easy_static_var",icon:"🧵",color:"#06b6d4",ver:"C++11",cat:"Concurrency",title:"Threads & Mutex",desc:"std::thread, mutex, lock_guard, condition_variable, atomic operations."},
  {id:"easy_range_for",icon:"🔮",color:"#8b5cf6",ver:"C++20",cat:"C++20",title:"Concepts & Ranges",desc:"requires clauses, concept definitions, std::ranges, views, lazy evaluation."},
  {id:"easy_recursion_basic",icon:"🌌",color:"#ec4899",ver:"C++20",cat:"C++20",title:"Coroutines",desc:"co_await, co_yield, co_return — asynchronous generators and lazy sequences."},
  {id:"med_templates_func",icon:"🔬",color:"#ef4444",ver:"C++11",cat:"Advanced",title:"Metaprogramming",desc:"constexpr, if constexpr, type traits, std::enable_if, variadic templates."},
  {id:"easy_hello",icon:"🧩",color:"#f59e0b",ver:"C++23",cat:"C++23",title:"C++23 Features",desc:"std::print, std::expected, deducing this, if consteval, std::flat_map."},
];

const ARTICLES = [
  {icon:"📝",color:"#3b82f6",tag:"Deep Dive",time:"8 min",title:"Understanding RAII in Modern C++",excerpt:"Resource Acquisition Is Initialization is C++'s most powerful idiom. We break down how unique_ptr, lock_guard, and file handles all follow this pattern — and why it makes your code exception-safe by default."},
  {icon:"🧪",color:"#a855f7",tag:"Tutorial",time:"12 min",title:"Move Semantics Explained Visually",excerpt:"rvalue references, std::move, and perfect forwarding are often misunderstood. This article explains the ownership transfer model with step-by-step memory diagrams showing exactly what happens during a move."},
  {icon:"🔬",color:"#10b981",tag:"Performance",time:"6 min",title:"Cache-Friendly Data Structures",excerpt:"How to structure C++ objects for CPU cache efficiency. We compare AoS vs SoA layouts, show profiling results, and demonstrate how cache misses silently kill performance in vector vs list traversal."},
  {icon:"⚡",color:"#f97316",tag:"C++20",time:"10 min",title:"Concepts: The Type System Revolution",excerpt:"C++20 Concepts finally give us readable template constraints. Learn how to write requires clauses, define named concepts, and replace cryptic SFINAE with expressive interfaces."},
  {icon:"🧵",color:"#06b6d4",tag:"Concurrency",time:"9 min",title:"Lock-Free Programming with Atomics",excerpt:"std::atomic enables safe shared state without mutex overhead. We cover memory ordering models — relaxed, acquire, release, seq_cst — with real-world examples for counters and ring buffers."},
  {icon:"🎯",color:"#ec4899",tag:"Patterns",time:"7 min",title:"Design Patterns in Modern C++",excerpt:"Classic GoF patterns rewritten with lambdas, templates, and type erasure. Strategy, Observer, and CRTP — implemented in idiomatic C++17 with zero virtual overhead."},
];

const CATS = ["All","Basics","OOP","STL","Memory","Modern","Concurrency","C++17","C++20","C++23","Advanced"];
const VER_COLOR: Record<string,string> = {
  "C++11":"#64748b","C++14":"#f59e0b","C++17":"#06b6d4","C++20":"#8b5cf6","C++23":"#ef4444",
};

export default function HomePage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<"about" | "faq" | "terms" | "privacy" | "contact" | "blog" | null>(null);
  
  // Contact Form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Daily Challenge timer state
  const [dailyTimer, setDailyTimer] = useState(getTimeUntilNextDaily());
  useEffect(() => {
    const interval = setInterval(() => setDailyTimer(getTimeUntilNextDaily()), 1000);
    return () => clearInterval(interval);
  }, []);
  const dailyPick = getDailyChallenge();

  const filtered = TOPICS.filter(t =>
    (cat === "All" || t.cat === cat) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMsg) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div style={{minHeight:"100vh",background:"#1e222b",position:"relative",overflow:"hidden",fontFamily:"'Inter',sans-serif"}}>
      <ParticleField/>
      <div style={{position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,rgba(168,85,247,.6),transparent)",animation:"scan 6s linear infinite",zIndex:1,pointerEvents:"none"}}/>
      <Navbar/>

      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 48px 60px",position:"relative",zIndex:2}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div className="anim-up">
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(168,85,247,.15)",border:"1px solid rgba(168,85,247,.3)",borderRadius:50,padding:"5px 18px",marginBottom:28}}>
              <div className="orb orb-purple anim-pulse"/>
              <span style={{fontSize:10,fontWeight:800,color:"#a855f7",fontFamily:"'JetBrains Mono'",letterSpacing:1.5,textTransform:"uppercase"}}>Computational Reality OS</span>
            </div>
            <h1 style={{fontSize:"clamp(40px,5.5vw,72px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-3px",marginBottom:24,fontFamily:"'Inter'",color:"#abb2bf"}}>
              Master C++<br/><span style={{background:"linear-gradient(135deg,#528bff,#c678dd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>from first line to mastery.</span>
            </h1>
            <p style={{fontSize:17,color:"#858585",lineHeight:1.8,maxWidth:480,marginBottom:36}}>
              Write code, visualize execution, explore every C++ concept topic by topic — with live memory maps, call stacks, and AI explanations.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Link href="/studio">
                <button className="btn btn-exec" style={{padding:"13px 28px",fontSize:13,borderRadius:11}}>⚡ Enter Studio</button>
              </Link>
              <Link href="/guidelines">
                <button className="btn" style={{padding:"13px 24px",fontSize:13,borderRadius:11,background:"#282c34",color:"#abb2bf",border:"1px solid #181a1f"}}>📖 How It Works</button>
              </Link>
              <Link href="/login">
                <button className="btn" style={{padding:"13px 24px",fontSize:13,borderRadius:11,background:"#282c34",color:"#abb2bf",border:"1px solid #181a1f"}}>🔐 Sign In</button>
              </Link>
            </div>
          </div>
          {/* Live code window */}
          <div className="anim-up" style={{animationDelay:".15s"}}>
            <div style={{background:"#282c34",border:"1px solid rgba(168,85,247,.25)",borderRadius:14,overflow:"hidden",boxShadow:"0 0 80px rgba(168,85,247,.1),0 40px 80px rgba(0,0,0,.7)"}}>
              <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:8,background:"#21252b"}}>
                {["#ef4444","#f59e0b","#10b981"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                <span style={{fontSize:10,color:"#abb2bf",fontFamily:"'JetBrains Mono'",marginLeft:6}}>fibonacci.cpp  ·  C++17</span>
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                  <div className="orb orb-purple anim-pulse"/>
                  <span style={{fontSize:9,color:"#a855f7",fontFamily:"'JetBrains Mono'"}}>SIMULATING</span>
                </div>
              </div>
              <div style={{padding:"16px",fontFamily:"'JetBrains Mono'",fontSize:12,lineHeight:2.2,color:"#abb2bf"}}>
                {[
                  {t:"#include <iostream>",c:"#5c6370"},
                  {t:"using namespace std;",c:"#5c6370"},
                  {t:"",c:""},
                  {t:"int fib(int n) {",c:"#61afef"},
                  {t:"  if (n <= 1) return n;",c:"#d19a66"},
                  {t:"  return fib(n-1) + fib(n-2);",c:"#c678dd"},
                  {t:"}",c:"#61afef"},
                  {t:"",c:""},
                  {t:"int main() {",c:"#98c379"},
                  {t:"  cout << fib(7);  // → 13",c:"#56b6c2"},
                  {t:"}",c:"#98c379"},
                ].map((l,i)=>(
                  <div key={i} style={{display:"flex",gap:12,color:l.c||"#3e4451"}}>
                    <span style={{color:"#495162",width:18,textAlign:"right",userSelect:"none",fontSize:10}}>{l.t?i+1:""}</span>
                    <span>{l.t||"\u00a0"}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,.05)",background:"rgba(16,185,129,.04)",display:"flex",gap:14,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#10b981",fontFamily:"'JetBrains Mono'"}}>✓ output: 13</span>
                <span style={{fontSize:10,color:"#5c6370",fontFamily:"'JetBrains Mono'"}}>stack depth: 8</span>
                <span style={{fontSize:10,color:"#5c6370",fontFamily:"'JetBrains Mono'"}}>ops: 41</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GITHUB INTEGRATIONS ── */}
      <section style={{padding:"80px 48px",background:"#21252b",borderTop:"1px solid #181a1f",borderBottom:"1px solid #181a1f",position:"relative",zIndex:2}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <div style={{background:"#282c34",border:"1px solid #181a1f",borderRadius:16,padding:32,boxShadow:"0 20px 50px rgba(0,0,0,0.3)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:40,height:40,borderRadius:10,background:"#21252b",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg height="24" width="24" viewBox="0 0 16 16" fill="#abb2bf"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#abb2bf"}}>GitHub Integrations</div>
                  <div style={{fontSize:10,color:"#10b981",fontFamily:"'JetBrains Mono'"}}>CONNECTED & SYNCHRONIZED</div>
                </div>
              </div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:11,lineHeight:2.0,color:"#5c6370",background:"#21252b",borderRadius:8,padding:16,border:"1px solid #181a1f"}}>
                <div><span style={{color:"#c678dd"}}>$</span> gh auth status</div>
                <div style={{color:"#abb2bf"}}>✓ Logged in to github.com as thakurcodeshere</div>
                <div><span style={{color:"#c678dd"}}>$</span> git commit -m "Fix memory leak"</div>
                <div style={{color:"#98c379"}}>[main 62eeec4] Commit pushed successfully</div>
                <div style={{color:"#495162"}}>To https://github.com/thakurcodeshere/Execium.git</div>
              </div>
            </div>
            <div>
              <div style={{fontSize:10,color:"#528bff",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:12}}>// Sync & Backup</div>
              <h2 style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-1.5px",marginBottom:16,lineHeight:1.15,color:"#abb2bf"}}>
                Code on Execium.<br/><span style={{background:"linear-gradient(135deg,#61afef,#528bff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Push straight to GitHub.</span>
              </h2>
              <p style={{fontSize:14,color:"#858585",lineHeight:1.75,marginBottom:28}}>
                Save and manage your simulations inside public or private GitHub repositories. With built-in git tracking, you can push updates, branch workspaces, restore edit history, and host live C++ simulations in the cloud effortlessly.
              </p>
              <div style={{display:"flex",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#abb2bf",marginBottom:6}}>🔗 Public & Private Repos</div>
                  <p style={{fontSize:11,color:"#5c6370",lineHeight:1.5}}>Connect securely and fetch folders into browser sandboxes directly.</p>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#abb2bf",marginBottom:6}}>⚡ One-Click Commits</div>
                  <p style={{fontSize:11,color:"#5c6370",lineHeight:1.5}}>Publish code changes to main branches in real time from the Studio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAILY CODING CHALLENGE SECTION ── */}
      <section style={{padding:"70px 48px",position:"relative",zIndex:2,background:"linear-gradient(180deg, #181a1f 0%, #21252b 100%)",borderTop:"1px solid #282c34",borderBottom:"1px solid #282c34"}} id="daily-challenge">
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{
            background:"linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(168,85,247,0.08) 100%)",
            border:"1px solid rgba(249,115,22,0.25)", borderRadius:24, padding:"36px 44px",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:32,
            boxShadow:"0 20px 60px rgba(0,0,0,0.4)"
          }}>
            <div style={{flex:"1 1 500px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{
                  fontSize:11,fontFamily:"'JetBrains Mono'",fontWeight:800,
                  padding:"4px 12px",borderRadius:20,
                  background:"rgba(249,115,22,0.18)",color:"#f97316",
                  border:"1px solid rgba(249,115,22,0.35)",display:"inline-flex",alignItems:"center",gap:6
                }}>
                  🔥 DAILY CODING CHALLENGE • NEW EVERY 24 HOURS
                </span>
                <span style={{fontSize:11,fontFamily:"'JetBrains Mono'",color:"#858585"}}>
                  {dailyPick.formattedDate}
                </span>
              </div>

              <h2 style={{fontSize:"clamp(26px,3.5vw,40px)",fontWeight:900,color:"#abb2bf",marginBottom:12,letterSpacing:"-1px"}}>
                Today&apos;s Pick: <span style={{background:"linear-gradient(135deg,#f97316,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{dailyPick.challenge.title}</span>
              </h2>

              <p style={{fontSize:14,color:"#858585",lineHeight:1.7,marginBottom:24,maxWidth:560}}>
                {dailyPick.challenge.desc} Test your problem solving skills daily in Execium&apos;s interactive C++ memory sandbox.
              </p>

              <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <Link href="/studio" style={{textDecoration:"none"}}>
                  <button style={{
                    padding:"12px 28px",borderRadius:12,border:"none",
                    background:"linear-gradient(135deg, #f97316, #a855f7)",
                    color:"#fff",fontSize:13,fontFamily:"'JetBrains Mono'",fontWeight:800,
                    cursor:"pointer",boxShadow:"0 0 25px rgba(249,115,22,0.4)",
                    transition:"all 0.2s"
                  }}>
                    ⚡ Solve Today&apos;s Challenge in Studio →
                  </button>
                </Link>
                <span style={{
                  fontSize:11,fontFamily:"'JetBrains Mono'",fontWeight:800,padding:"4px 10px",borderRadius:6,
                  background: dailyPick.challenge.difficulty === 'easy' ? "rgba(16,185,129,0.15)" : dailyPick.challenge.difficulty === 'medium' ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                  color: dailyPick.challenge.difficulty === 'easy' ? "#10b981" : dailyPick.challenge.difficulty === 'medium' ? "#f59e0b" : "#ef4444",
                  border: `1px solid ${dailyPick.challenge.difficulty === 'easy' ? "rgba(16,185,129,0.3)" : dailyPick.challenge.difficulty === 'medium' ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`
                }}>
                  DIFFICULTY: {dailyPick.challenge.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Countdown Timer Block */}
            <div style={{
              background:"#21252b",border:"1px solid #282c34",borderRadius:18,padding:"24px 32px",
              textAlign:"center",minWidth:240,boxShadow:"0 10px 30px rgba(0,0,0,0.3)"
            }}>
              <div style={{fontSize:10,fontFamily:"'JetBrains Mono'",color:"#5c6370",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>
                NEXT DAILY REFRESH IN
              </div>
              <div style={{
                fontSize:26,fontWeight:900,fontFamily:"'JetBrains Mono'",
                color:"#abb2bf",letterSpacing:1,display:"flex",justifyContent:"center",gap:6
              }}>
                <span>{String(dailyTimer.hours).padStart(2, '0')}h</span>
                <span style={{color:"#f97316"}}>:</span>
                <span>{String(dailyTimer.mins).padStart(2, '0')}m</span>
                <span style={{color:"#f97316"}}>:</span>
                <span style={{color:"#f97316"}}>{String(dailyTimer.secs).padStart(2, '0')}s</span>
              </div>
              <div style={{fontSize:10,color:"#10b981",fontFamily:"'JetBrains Mono'",marginTop:10}}>
                ✓ Fresh Challenge Every Midnight
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── C++ TOPICS ── */}
      <section style={{padding:"80px 48px",position:"relative",zIndex:2}} id="topics">
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:10,color:"#c678dd",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:12}}>// C++ Curriculum</div>
            <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:900,letterSpacing:"-2px",marginBottom:14,color:"#abb2bf"}}>
              Every Topic. <span style={{background:"linear-gradient(135deg,#c678dd,#61afef)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Every Version.</span>
            </h2>
            <p style={{fontSize:15,color:"#858585",maxWidth:560,margin:"0 auto"}}>
              From fundamentals to C++23 — explore every concept with live execution demos. Click any topic to open it in the Studio.
            </p>
          </div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"6px 16px",borderRadius:20,fontSize:11,cursor:"pointer",transition:"all .15s",
                fontFamily:"'JetBrains Mono'",fontWeight:cat===c?800:500,
                border:`1px solid ${cat===c?"#c678dd":"#181a1f"}`,
                background:cat===c?"rgba(198,120,221,0.15)":"#282c34",
                color:cat===c?"#c678dd":"#5c6370",
              }}>{c}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:36}}>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍  Search topics..."
              style={{
                width:"100%",maxWidth:400,padding:"10px 18px",
                background:"#282c34",border:"1px solid #181a1f",
                borderRadius:10,color:"#abb2bf",fontSize:13,fontFamily:"'Inter'",outline:"none",
              }}
            />
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {filtered.map(t=>(
              <Link key={t.title} href={`/studio?learn=${t.id}`} style={{textDecoration:"none"}}>
                <div
                  style={{padding:22,borderRadius:14,background:"#282c34",border:"1px solid #181a1f",cursor:"pointer",transition:"all .2s",height:"100%"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=t.color+"50";el.style.transform="translateY(-3px)";el.style.boxShadow=`0 12px 40px ${t.color}12`;}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#181a1f";el.style.transform="translateY(0)";el.style.boxShadow="none";}}
                >
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{width:42,height:42,borderRadius:11,background:`${t.color}18`,border:`1px solid ${t.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.icon}</div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",fontWeight:800,color:VER_COLOR[t.ver]||"#64748b",background:`${VER_COLOR[t.ver]||"#64748b"}15`,border:`1px solid ${VER_COLOR[t.ver]||"#64748b"}30`,borderRadius:5,padding:"2px 7px"}}>{t.ver}</span>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",color:"#5c6370"}}>{t.cat}</span>
                    </div>
                  </div>
                  <h3 style={{fontSize:15,fontWeight:700,color:"#abb2bf",marginBottom:6}}>{t.title}</h3>
                  <p style={{fontSize:12,color:"#5c6370",lineHeight:1.7}}>{t.desc}</p>
                  <div style={{marginTop:12,fontSize:10,color:t.color,fontFamily:"'JetBrains Mono'",display:"flex",alignItems:"center",gap:4}}>Open in Studio →</div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"60px 0",color:"#5c6370",fontSize:14}}>
              No topics match &quot;{search}&quot; in {cat}. Try another filter.
            </div>
          )}
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{padding:"60px 48px",position:"relative",zIndex:2,background:"#21252b",borderTop:"1px solid #181a1f",borderBottom:"1px solid #181a1f"}} id="articles">
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{marginBottom:40,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{fontSize:10,color:"#528bff",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:10}}>// C++ Articles</div>
              <h2 style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-1.5px",color:"#abb2bf"}}>
                Learn From The <span style={{background:"linear-gradient(135deg,#528bff,#61afef)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Best Minds in C++</span>
              </h2>
            </div>
            <button onClick={() => setActiveModal("blog")} style={{
              background:"rgba(82,139,255,0.12)",border:"1px solid rgba(82,139,255,0.3)",
              color:"#528bff",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,
              padding:"8px 20px",borderRadius:8,cursor:"pointer",transition:"all 0.15s"
            }}>View Full Blog →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {ARTICLES.map(a=>(
              <div key={a.title}
                onClick={() => setActiveModal("blog")}
                style={{padding:24,borderRadius:14,background:"#282c34",border:"1px solid #181a1f",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=a.color+"45";el.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#181a1f";el.style.transform="translateY(0)";}}
              >
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${a.color}15`,border:`1px solid ${a.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{a.icon}</div>
                  <div>
                    <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",fontWeight:800,color:a.color,background:`${a.color}12`,border:`1px solid ${a.color}25`,borderRadius:5,padding:"2px 8px",textTransform:"uppercase",letterSpacing:.8}}>{a.tag}</span>
                    <div style={{fontSize:10,color:"#5c6370",marginTop:3}}>{a.time} read</div>
                  </div>
                </div>
                <h3 style={{fontSize:15,fontWeight:700,color:"#abb2bf",marginBottom:8,lineHeight:1.4}}>{a.title}</h3>
                <p style={{fontSize:12,color:"#5c6370",lineHeight:1.75}}>{a.excerpt || (a as any).desc}</p>
                <div style={{marginTop:14,fontSize:10,color:a.color,fontFamily:"'JetBrains Mono'"}}>Read article →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIDELINES PREVIEW ── */}
      <section style={{padding:"80px 48px",position:"relative",zIndex:2}} id="guidelines">
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#10b981",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:12}}>// How It Works</div>
          <h2 style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-1.5px",marginBottom:14,color:"#abb2bf"}}>
            From Zero to <span style={{background:"linear-gradient(135deg,#10b981,#528bff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Execution Clarity</span> in 3 Steps
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:40,marginBottom:40}}>
            {[
              {n:"01",icon:"✍️",color:"#3b82f6",title:"Write or Paste Code",desc:"Use the Monaco editor with full C++ support. Paste from clipboard, use templates, or write from scratch."},
              {n:"02",icon:"▶️",color:"#a855f7",title:"Simulate & Visualize",desc:"Ctrl+Enter to simulate. Watch memory, variables, and call stack update live as your code executes."},
              {n:"03",icon:"🔍",color:"#10b981",title:"Explore & Understand",desc:"Step through execution, scrub the timeline, ask the AI Oracle — understand every byte and every call."},
            ].map(s=>(
              <div key={s.n} style={{padding:28,borderRadius:14,background:"#282c34",border:"1px solid #181a1f"}}>
                <div style={{width:48,height:48,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>{s.icon}</div>
                <div style={{fontSize:10,color:s.color,fontFamily:"'JetBrains Mono'",fontWeight:800,marginBottom:8}}>{s.n}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:"#abb2bf",marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:12,color:"#5c6370",lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/guidelines">
            <button className="btn" style={{padding:"12px 28px",fontSize:13,background:"#282c34",color:"#abb2bf",border:"1px solid #181a1f"}}>📖 Full Guidelines →</button>
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:"60px 48px 120px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:900,letterSpacing:"-2px",marginBottom:14,lineHeight:1.05,color:"#abb2bf"}}>
            For the first time,<br/>execution is <span style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>not invisible.</span>
          </h2>
          <p style={{fontSize:15,color:"#5c6370",marginBottom:32}}>Every line. Every byte. Every pointer. Every moment. Visible.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/studio"><button className="btn btn-exec" style={{padding:"13px 32px",fontSize:14,borderRadius:12}}>Ω Enter Studio</button></Link>
            <Link href="/login"><button className="btn" style={{padding:"13px 28px",fontSize:14,borderRadius:12,background:"#282c34",color:"#abb2bf",border:"1px solid #181a1f"}}>🔐 Join Free</button></Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER (Detailed Multi-Column Grid matching user mockup) ── */}
      <footer style={{
        position: "relative", zIndex: 2, borderTop: "1px solid #181a1f",
        background: "#21252b", padding: "60px 48px 30px", color: "#abb2bf"
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .footer-grid {
            display: grid;
            grid-template-columns: 2.2fr 1.2fr 1.2fr 1.2fr 1.2fr;
            gap: 30px;
          }
          @media (max-width: 1024px) {
            .footer-grid {
              grid-template-columns: 1.5fr 1fr 1fr;
              gap: 40px;
            }
          }
          @media (max-width: 680px) {
            .footer-grid {
              grid-template-columns: 1fr;
              gap: 30px;
            }
          }
        `}} />
        <div className="footer-grid" style={{
          maxWidth: 1200, margin: "0 auto"
        }}>
          {/* Logo Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 900, color: "#fff",
                boxShadow: "0 0 14px rgba(168,85,247,.4)",
              }}>Ω</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono'" }}>Execium</span>
            </div>
            <p style={{ fontSize: 12, color: "#5c6370", lineHeight: 1.6, maxWidth: 320 }}>
              Interactive courses, animations, and AI-powered practice to help you master C++ and software engineering interviews.
            </p>
            {/* Social Icons — real brand SVGs */}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {/* Discord */}
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" title="Discord" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#5865F2"; e.currentTarget.style.background = "rgba(88,101,242,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="16" height="12" viewBox="0 0 71 55" fill="#5865F2"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.7 58.7 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.4 45.6v-.1c1.4-15-2.3-28.1-9.8-39.7a.2.2 0 00-.1 0zM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7zm23.3 0c-3.5 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.style.background = "rgba(10,102,194,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF0000"; e.currentTarget.style.background = "rgba(255,0,0,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="16" height="12" viewBox="0 0 24 17" fill="#FF0000"><path d="M23.498 2.186A3.016 3.016 0 0021.382.073C19.505-.39 12-.39 12-.39S4.495-.39 2.618.073A3.016 3.016 0 00.502 2.186C.11 4.064.11 8.01.11 8.01s0 3.946.392 5.825a3.016 3.016 0 002.116 2.112C4.495 16.39 12 16.39 12 16.39s7.505 0 9.382-.443a3.016 3.016 0 002.116-2.112c.392-1.879.392-5.825.392-5.825s0-3.946-.392-5.825z"/><path d="M9.545 11.568V4.452l6.284 3.558-6.284 3.558z" fill="#fff"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#E4405F"; e.currentTarget.style.background = "rgba(228,64,95,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="X (Twitter)" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#abb2bf"; e.currentTarget.style.background = "rgba(171,178,191,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#abb2bf"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub" style={{ display: "flex", width: 34, height: 34, borderRadius: 8, background: "#282c34", border: "1px solid #181a1f", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#abb2bf"; e.currentTarget.style.background = "rgba(171,178,191,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#181a1f"; e.currentTarget.style.background = "#282c34"; }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#abb2bf"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              </a>
            </div>
          </div>

          {/* Learn Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono'", letterSpacing: 0.5 }}>LEARN</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
              <Link href="/studio?code=DSA_PATTERNS" style={{ color: "#5c6370", textDecoration: "none" }}>DSA Patterns</Link>
              <Link href="/guidelines" style={{ color: "#5c6370", textDecoration: "none" }}>System Design</Link>
              <Link href="/guidelines" style={{ color: "#5c6370", textDecoration: "none" }}>System Design Interviews</Link>
              <Link href="/studio?code=SMART_PTR" style={{ color: "#5c6370", textDecoration: "none" }}>Low-Level Design</Link>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>Behavioral Interviews</Link>
              <a href="#topics" style={{ color: "#5c6370", textDecoration: "none" }}>All Courses</a>
            </div>
          </div>

          {/* Practice Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono'", letterSpacing: 0.5 }}>PRACTICE</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>DSA Problems</Link>
              <Link href="/guidelines" style={{ color: "#5c6370", textDecoration: "none" }}>System Design</Link>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>Low-Level Design</Link>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>Coding Interviews</Link>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>Company Questions</Link>
            </div>
          </div>

          {/* Tools Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono'", letterSpacing: 0.5 }}>TOOLS</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
              <Link href="/studio?code=bubble_sort" style={{ color: "#5c6370", textDecoration: "none" }}>Algorithm Animations</Link>
              <Link href="/guidelines" style={{ color: "#5c6370", textDecoration: "none" }}>Roadmaps</Link>
              <Link href="/settings" style={{ color: "#5c6370", textDecoration: "none" }}>Resume Builder</Link>
              <Link href="/studio" style={{ color: "#5c6370", textDecoration: "none" }}>Leaderboard</Link>
            </div>
          </div>

          {/* Company Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono'", letterSpacing: 0.5 }}>COMPANY</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
              <Link href="/login" style={{ color: "#5c6370", textDecoration: "none" }}>Premium</Link>
              <Link href="/settings" style={{ color: "#5c6370", textDecoration: "none" }}>Newsletter</Link>
              <button onClick={() => setActiveModal("faq")} style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono'", padding: 0, textAlign: "left", outline: "none" }}>FAQs</button>
              <button onClick={() => setActiveModal("contact")} style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono'", padding: 0, textAlign: "left", outline: "none" }}>Contact</button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div style={{
          maxWidth: 1200, margin: "40px auto 0", paddingTop: 20, borderTop: "1px solid #181a1f",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap",
          gap: 12, color: "#5c6370", fontSize: 11, fontFamily: "'JetBrains Mono'"
        }}>
          <span>© {new Date().getFullYear()} Execium Ω∞. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => setActiveModal("about")} style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono'", outline: "none" }}>About Us</button>
            <button onClick={() => setActiveModal("terms")} style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono'", outline: "none" }}>Terms</button>
            <button onClick={() => setActiveModal("privacy")} style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono'", outline: "none" }}>Privacy</button>
          </div>
        </div>
      </footer>

      {/* ── STUNNING GLASSMORPHIC MODALS OVERLAYS ── */}
      {activeModal && (
        <div style={{
          position:"fixed",inset:0,background:"rgba(30,34,43,0.85)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20
        }}>
          <div style={{
            background:"#282c34",border:"1px solid #181a1f",
            borderRadius:20,width:"100%",maxWidth:600,maxHeight:"85vh",overflowY:"auto",
            padding:32,boxShadow:"0 30px 90px rgba(0,0,0,0.8)",position:"relative",
            display:"flex",flexDirection:"column",gap:20
          }}>
            {/* Close Button */}
            <button 
              onClick={() => { setActiveModal(null); setContactSubmitted(false); }}
              style={{
                position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.05)",
                border:"none",color:"#abb2bf",width:28,height:28,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
                transition:"all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >✕</button>

            {/* About Modal */}
            {activeModal === "about" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  🤖 About Execium Ω∞
                </h3>
                <p style={{fontSize:13,color:"#abb2bf",lineHeight:1.8}}>
                  Execium is a **Computational Reality Operating System** designed to remove the abstraction between writing code and physical computer operations.
                </p>
                <p style={{fontSize:13,color:"#abb2bf",lineHeight:1.8}}>
                  Our mission is to help engineers master C++ by visualizing stack frame allocation, pointer maps, dynamic memory allocations, and visual timeline scrubbers in real time. We believe execution should never be invisible.
                </p>
                <div style={{height:1,background:"#181a1f"}}/>
                <div style={{display:"flex",gap:16}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#c678dd",marginBottom:4}}>Visual Reality</div>
                    <p style={{fontSize:11,color:"#5c6370",lineHeight:1.5}}>No compiler simulation is abstract; we track variables down to their memory offsets.</p>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#61afef",marginBottom:4}}>Educational First</div>
                    <p style={{fontSize:11,color:"#5c6370",lineHeight:1.5}}>A curriculum built to take students from initial basics to modern standard C++23.</p>
                  </div>
                </div>
              </>
            )}

            {/* FAQ Modal */}
            {activeModal === "faq" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  ❓ Frequently Asked Questions
                </h3>
                <div style={{display:"flex",flexDirection:"column",gap:16,marginTop:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#abb2bf",marginBottom:6}}>How does the execution simulation engine work?</div>
                    <p style={{fontSize:12,color:"#858585",lineHeight:1.6}}>Execium analyzes syntax structures, tracks memory updates, variables, pointer offsets, and call frames, and feeds these traces directly into our graphical rendering interfaces.</p>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#abb2bf",marginBottom:6}}>Can I link my GitHub repositories?</div>
                    <p style={{fontSize:12,color:"#858585",lineHeight:1.6}}>Yes! Execium features full GitHub integration, allowing you to load projects, commit code, and sync progress seamlessly.</p>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#abb2bf",marginBottom:6}}>Is Execium suitable for custom projects?</div>
                    <p style={{fontSize:12,color:"#858585",lineHeight:1.6}}>Absolutely. You can clear the compiler, paste custom code snippets, and use the debugger tool flow to visualize standard templates in real time.</p>
                  </div>
                </div>
              </>
            )}

            {/* Terms Modal */}
            {activeModal === "terms" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  📄 Terms of Service
                </h3>
                <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:12,color:"#abb2bf",lineHeight:1.75}}>
                  <p>Welcome to Execium. By utilizing our platforms, compiler tools, and simulation sandboxes, you agree to comply with the following regulations.</p>
                  <p><strong>1. Usage License:</strong> Execium allows educational use and personal sandbox testing of C++ code snippets. Reverse engineering the trace layout engine or embedding it without authorization is restricted.</p>
                  <p><strong>2. Account Integrity:</strong> You are responsible for protecting access to synced auth tokens, including GitHub integration credentials.</p>
                  <p><strong>3. Disclaimer:</strong> Simulations are designed for pedagogical clarity; minor differences may occur between visual tracing stack frames and native target optimizations under compilers like GCC or Clang.</p>
                </div>
              </>
            )}

            {/* Privacy Modal */}
            {activeModal === "privacy" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  🔒 Privacy Policy
                </h3>
                <div style={{display:"flex",flexDirection:"column",gap:12,fontSize:12,color:"#abb2bf",lineHeight:1.75}}>
                  <p>At Execium, user privacy is paramount. Your code snippets and workspaces are held locally inside browser storage sandboxes.</p>
                  <p><strong>Data Sync:</strong> Integrating GitHub tokens stores auth keys securely client-side in secure cookie/localStorage models, communicating directly with GitHub APIs without passing keys to intermediate databases.</p>
                  <p><strong>Telemetry:</strong> Next.js metrics gathered are fully anonymous and can be toggled off inside user configuration screens.</p>
                </div>
              </>
            )}

            {/* Contact Us Modal */}
            {activeModal === "contact" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  ✉️ Contact Execium Team
                </h3>
                {contactSubmitted ? (
                  <div style={{textAlign:"center",padding:"40px 0"}}>
                    <div style={{fontSize:32,color:"#10b981",marginBottom:12}}>✓ Message Dispatched</div>
                    <p style={{fontSize:13,color:"#abb2bf"}}>Thanks for reaching out! We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
                    <div style={{display:"flex",gap:12}}>
                      <div style={{flex:1}}>
                        <label style={{fontSize:10,color:"#5c6370",display:"block",marginBottom:6,fontFamily:"'JetBrains Mono'"}}>NAME</label>
                        <input 
                          type="text" value={contactName} onChange={e=>setContactName(e.target.value)}
                          placeholder="Name" required
                          style={{width:"100%",background:"#21252b",border:"1px solid #181a1f",borderRadius:8,padding:"8px 12px",color:"#fff",outline:"none",fontSize:13}}
                        />
                      </div>
                      <div style={{flex:1}}>
                        <label style={{fontSize:10,color:"#5c6370",display:"block",marginBottom:6,fontFamily:"'JetBrains Mono'"}}>EMAIL ADDRESS</label>
                        <input 
                          type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)}
                          placeholder="Email" required
                          style={{width:"100%",background:"#21252b",border:"1px solid #181a1f",borderRadius:8,padding:"8px 12px",color:"#fff",outline:"none",fontSize:13}}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{fontSize:10,color:"#5c6370",display:"block",marginBottom:6,fontFamily:"'JetBrains Mono'"}}>YOUR MESSAGE</label>
                      <textarea 
                        value={contactMsg} onChange={e=>setContactMsg(e.target.value)}
                        placeholder="Write message..." rows={4} required
                        style={{width:"100%",background:"#21252b",border:"1px solid #181a1f",borderRadius:8,padding:"8px 12px",color:"#fff",outline:"none",fontSize:13,resize:"none"}}
                      />
                    </div>
                    <button type="submit" className="btn btn-exec" style={{width:"100%",padding:"12px 0",borderRadius:10,fontWeight:800,fontSize:13,marginTop:8}}>
                      Send Message
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Blog Modal */}
            {activeModal === "blog" && (
              <>
                <h3 style={{fontSize:22,fontWeight:900,color:"#abb2bf",letterSpacing:"-0.5px"}}>
                  📝 Execium Engineering Blog
                </h3>
                <div style={{display:"flex",flexDirection:"column",gap:24,marginTop:12,maxHeight:"50vh",overflowY:"auto",paddingRight:8}}>
                  <div style={{borderBottom:"1px solid #181a1f",paddingBottom:16}}>
                    <span style={{fontSize:9,color:"#c678dd",fontFamily:"'JetBrains Mono'"}}>JULY 18, 2026</span>
                    <h4 style={{fontSize:15,color:"#abb2bf",margin:"4px 0 8px"}}>Visualizing the Stack vs Heap</h4>
                    <p style={{fontSize:12,color:"#5c6370",lineHeight:1.6}}>
                      Why do recursion overflows crash at 8MB while the heap can swallow gigabytes? We break down visual timeline memory allocation traces and explain how memory engines represent variable references.
                    </p>
                  </div>
                  <div style={{borderBottom:"1px solid #181a1f",paddingBottom:16}}>
                    <span style={{fontSize:9,color:"#61afef",fontFamily:"'JetBrains Mono'"}}>JULY 12, 2026</span>
                    <h4 style={{fontSize:15,color:"#abb2bf",margin:"4px 0 8px"}}>C++23: The Modern Revolution</h4>
                    <p style={{fontSize:12,color:"#5c6370",lineHeight:1.6}}>
                      Modern C++ features like std::print and flat_map are finally simplifying legacy template structures. Learn how Execium integrates C++23 features into standard curriculum simulation runs.
                    </p>
                  </div>
                  <div>
                    <span style={{fontSize:9,color:"#10b981",fontFamily:"'JetBrains Mono'"}}>JUNE 28, 2026</span>
                    <h4 style={{fontSize:15,color:"#abb2bf",margin:"4px 0 8px"}}>Pointers are Just Numbers</h4>
                    <p style={{fontSize:12,color:"#5c6370",lineHeight:1.6}}>
                      Demystifying memory addresses, raw pointer values, and dereference logic with visual boxes. Read about standard pointer arithmetic patterns and dangling references.
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <FeedbackModal/>
    </div>
  );
}
