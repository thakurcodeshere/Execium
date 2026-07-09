"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeedbackModal from "@/components/FeedbackModal";

function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    window.addEventListener("resize", () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; });
    const cols = ["#3b82f6","#a855f7","#06b6d4","#10b981","#f97316"];
    const pts = Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2+.5,c:cols[Math.floor(Math.random()*5)],l:Math.random()*200,ml:150+Math.random()*150}));
    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(3,3,10,.16)"; ctx.fillRect(0,0,W,H);
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
    return () => cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

const TOPICS = [
  {icon:"📦",color:"#10b981",ver:"C++11",cat:"Basics",title:"Variables & Types",desc:"int, float, auto, const, references, and type deduction with modern C++."},
  {icon:"🔄",color:"#3b82f6",ver:"C++11",cat:"Basics",title:"Control Flow",desc:"if/else, switch, for, while, do-while, range-based loops and iterators."},
  {icon:"⚙️",color:"#a855f7",ver:"C++11",cat:"Basics",title:"Functions & Lambdas",desc:"Function overloading, default args, inline, and C++11 lambda expressions."},
  {icon:"🏗️",color:"#f97316",ver:"C++11",cat:"OOP",title:"Classes & Objects",desc:"Constructors, destructors, access specifiers, member functions, static members."},
  {icon:"🧬",color:"#ec4899",ver:"C++11",cat:"OOP",title:"Inheritance & Polymorphism",desc:"Virtual functions, abstract classes, vtables, multiple inheritance, override."},
  {icon:"📚",color:"#06b6d4",ver:"C++11",cat:"STL",title:"Containers",desc:"vector, list, map, set, unordered_map, deque — when to use which."},
  {icon:"🔀",color:"#8b5cf6",ver:"C++11",cat:"STL",title:"Algorithms & Iterators",desc:"std::sort, std::find, std::transform, std::accumulate, begin/end iterators."},
  {icon:"🧠",color:"#f59e0b",ver:"C++11",cat:"Memory",title:"Pointers & References",desc:"Raw pointers, pointer arithmetic, nullptr, dangling pointers, const pointers."},
  {icon:"🔒",color:"#ef4444",ver:"C++11",cat:"Memory",title:"Smart Pointers",desc:"unique_ptr, shared_ptr, weak_ptr — RAII, move semantics, ownership model."},
  {icon:"🚀",color:"#10b981",ver:"C++11",cat:"Modern",title:"Move Semantics",desc:"rvalue refs, std::move, move constructors, perfect forwarding, std::forward."},
  {icon:"📐",color:"#3b82f6",ver:"C++11",cat:"Modern",title:"Templates",desc:"Function templates, class templates, template specialization, SFINAE basics."},
  {icon:"🌊",color:"#a855f7",ver:"C++17",cat:"C++17",title:"Structured Bindings",desc:"auto [a,b]=pair; if constexpr; std::optional; std::variant; std::filesystem."},
  {icon:"⚡",color:"#f97316",ver:"C++17",cat:"C++17",title:"Parallel Algorithms",desc:"std::execution policies, parallel sort, transform_reduce, hardware concurrency."},
  {icon:"🧵",color:"#06b6d4",ver:"C++11",cat:"Concurrency",title:"Threads & Mutex",desc:"std::thread, mutex, lock_guard, condition_variable, atomic operations."},
  {icon:"🔮",color:"#8b5cf6",ver:"C++20",cat:"C++20",title:"Concepts & Ranges",desc:"requires clauses, concept definitions, std::ranges, views, lazy evaluation."},
  {icon:"🌌",color:"#ec4899",ver:"C++20",cat:"C++20",title:"Coroutines",desc:"co_await, co_yield, co_return — asynchronous generators and lazy sequences."},
  {icon:"🔬",color:"#ef4444",ver:"C++11",cat:"Advanced",title:"Metaprogramming",desc:"constexpr, if constexpr, type traits, std::enable_if, variadic templates."},
  {icon:"🧩",color:"#f59e0b",ver:"C++23",cat:"C++23",title:"C++23 Features",desc:"std::print, std::expected, deducing this, if consteval, std::flat_map."},
];

const ARTICLES = [
  {icon:"📝",color:"#3b82f6",tag:"Deep Dive",time:"8 min",title:"Understanding RAII in Modern C++",excerpt:"Resource Acquisition Is Initialization is C++'s most powerful idiom. We break down how unique_ptr, lock_guard, and file handles all follow this pattern — and why it makes your code exception-safe by default."},
  {icon:"🧪",color:"#a855f7",tag:"Tutorial",time:"12 min",title:"Move Semantics Explained Visually",excerpt:"rvalue references, std::move, and perfect forwarding are often misunderstood. This article explains the ownership transfer model with step-by-step memory diagrams showing exactly what happens during a move."},
  {icon:"🔬",color:"#10b981",tag:"Performance",time:"6 min",title:"Cache-Friendly Data Structures",excerpt:"How to structure C++ objects for CPU cache efficiency. We compare AoS vs SoA layouts, show profiling results, and demonstrate how cache misses silently kill performance in vector vs list traversal."},
  {icon:"⚡",color:"#f97316",tag:"C++20",time:"10 min",title:"Concepts: The Type System Revolution",excerpt:"C++20 Concepts finally give us readable template constraints. Learn how to write requires clauses, define named concepts, and replace cryptic SFINAE with expressive interfaces."},
  {icon:"🧵",color:"#06b6d4",tag:"Concurrency",time:"9 min",title:"Lock-Free Programming with Atomics",excerpt:"std::atomic enables safe shared state without mutex overhead. We cover memory ordering models — relaxed, acquire, release, seq_cst — with real-world examples for counters and ring buffers."},
  {icon:"🎯",color:"#ec4899",tag:"Patterns",time:"7 min",title:"Design Patterns in Modern C++",desc:"Classic GoF patterns rewritten with lambdas, templates, and type erasure. Strategy, Observer, and CRTP — implemented in idiomatic C++17 with zero virtual overhead."},
];

const CATS = ["All","Basics","OOP","STL","Memory","Modern","Concurrency","C++17","C++20","C++23","Advanced"];
const VER_COLOR: Record<string,string> = {
  "C++11":"#64748b","C++14":"#f59e0b","C++17":"#06b6d4","C++20":"#8b5cf6","C++23":"#ef4444",
};

export default function HomePage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = TOPICS.filter(t =>
    (cat === "All" || t.cat === cat) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{minHeight:"100vh",background:"#03030a",position:"relative",overflow:"hidden",fontFamily:"'Inter',sans-serif"}}>
      <ParticleField/>
      <div style={{position:"fixed",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,rgba(168,85,247,.6),transparent)",animation:"scan 6s linear infinite",zIndex:1,pointerEvents:"none"}}/>
      <Navbar/>

      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"80px 48px 60px",position:"relative",zIndex:2}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div className="anim-up">
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(168,85,247,.1)",border:"1px solid rgba(168,85,247,.25)",borderRadius:50,padding:"5px 18px",marginBottom:28}}>
              <div className="orb orb-purple anim-pulse"/>
              <span style={{fontSize:10,fontWeight:800,color:"#a855f7",fontFamily:"'JetBrains Mono'",letterSpacing:1.5,textTransform:"uppercase"}}>Computational Reality OS</span>
            </div>
            <h1 style={{fontSize:"clamp(40px,5.5vw,72px)",fontWeight:900,lineHeight:1.0,letterSpacing:"-3px",marginBottom:24,fontFamily:"'Inter'"}}>
              Master C++<br/><span className="gt-spectrum">from first line to mastery.</span>
            </h1>
            <p style={{fontSize:17,color:"#475569",lineHeight:1.8,maxWidth:480,marginBottom:36}}>
              Write code, visualize execution, explore every C++ concept topic by topic — with live memory maps, call stacks, and AI explanations.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Link href="/studio">
                <button className="btn btn-exec" style={{padding:"13px 28px",fontSize:13,borderRadius:11}}>⚡ Enter Studio</button>
              </Link>
              <Link href="/guidelines">
                <button className="btn" style={{padding:"13px 24px",fontSize:13,borderRadius:11}}>📖 How It Works</button>
              </Link>
              <Link href="/login">
                <button className="btn" style={{padding:"13px 24px",fontSize:13,borderRadius:11}}>🔐 Sign In</button>
              </Link>
            </div>
          </div>
          {/* Live code window */}
          <div className="anim-up" style={{animationDelay:".15s"}}>
            <div style={{background:"#06060f",border:"1px solid rgba(168,85,247,.25)",borderRadius:14,overflow:"hidden",boxShadow:"0 0 80px rgba(168,85,247,.1),0 40px 80px rgba(0,0,0,.7)"}}>
              <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.02)"}}>
                {["#ef4444","#f59e0b","#10b981"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
                <span style={{fontSize:10,color:"#334155",fontFamily:"'JetBrains Mono'",marginLeft:6}}>fibonacci.cpp  ·  C++17</span>
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
                  <div className="orb orb-purple anim-pulse"/>
                  <span style={{fontSize:9,color:"#a855f7",fontFamily:"'JetBrains Mono'"}}>SIMULATING</span>
                </div>
              </div>
              <div style={{padding:"16px",fontFamily:"'JetBrains Mono'",fontSize:12,lineHeight:2.2,color:"#64748b"}}>
                {[
                  {t:"#include <iostream>",c:"#475569"},
                  {t:"using namespace std;",c:"#475569"},
                  {t:"",c:""},
                  {t:"int fib(int n) {",c:"#3b82f6"},
                  {t:"  if (n <= 1) return n;",c:"#f59e0b"},
                  {t:"  return fib(n-1) + fib(n-2);",c:"#a855f7"},
                  {t:"}",c:"#3b82f6"},
                  {t:"",c:""},
                  {t:"int main() {",c:"#10b981"},
                  {t:"  cout << fib(7);  // → 13",c:"#06b6d4"},
                  {t:"}",c:"#10b981"},
                ].map((l,i)=>(
                  <div key={i} style={{display:"flex",gap:12,color:l.c||"#1e293b"}}>
                    <span style={{color:"#1e293b",width:18,textAlign:"right",userSelect:"none",fontSize:10}}>{l.t?i+1:""}</span>
                    <span>{l.t||"\u00a0"}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,.05)",background:"rgba(16,185,129,.04)",display:"flex",gap:14,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#10b981",fontFamily:"'JetBrains Mono'"}}>✓ output: 13</span>
                <span style={{fontSize:10,color:"#334155",fontFamily:"'JetBrains Mono'"}}>stack depth: 8</span>
                <span style={{fontSize:10,color:"#334155",fontFamily:"'JetBrains Mono'"}}>ops: 41</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── C++ TOPICS ── */}
      <section style={{padding:"80px 48px",position:"relative",zIndex:2}} id="topics">
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:10,color:"#a855f7",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:12}}>// C++ Curriculum</div>
            <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:900,letterSpacing:"-2px",marginBottom:14}}>
              Every Topic. <span className="gt-spectrum">Every Version.</span>
            </h2>
            <p style={{fontSize:15,color:"#475569",maxWidth:560,margin:"0 auto"}}>
              From fundamentals to C++23 — explore every concept with live execution demos. Click any topic to open it in the Studio.
            </p>
          </div>

          {/* Filter bar */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"6px 16px",borderRadius:20,fontSize:11,cursor:"pointer",transition:"all .15s",
                fontFamily:"'JetBrains Mono'",fontWeight:cat===c?800:500,
                border:`1px solid ${cat===c?"#a855f7":"rgba(255,255,255,.08)"}`,
                background:cat===c?"rgba(168,85,247,.15)":"rgba(255,255,255,.02)",
                color:cat===c?"#a855f7":"#475569",
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
                background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",
                borderRadius:10,color:"#e2e8f0",fontSize:13,fontFamily:"'Inter'",outline:"none",
              }}
            />
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {filtered.map(t=>(
              <Link key={t.title} href={`/studio`} style={{textDecoration:"none"}}>
                <div
                  style={{padding:22,borderRadius:14,background:"rgba(10,10,26,.8)",border:"1px solid rgba(255,255,255,.06)",cursor:"pointer",transition:"all .2s",height:"100%"}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=t.color+"50";el.style.transform="translateY(-3px)";el.style.boxShadow=`0 12px 40px ${t.color}12`;}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.06)";el.style.transform="translateY(0)";el.style.boxShadow="none";}}
                >
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{width:42,height:42,borderRadius:11,background:`${t.color}18`,border:`1px solid ${t.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{t.icon}</div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",fontWeight:800,color:VER_COLOR[t.ver]||"#64748b",background:`${VER_COLOR[t.ver]||"#64748b"}15`,border:`1px solid ${VER_COLOR[t.ver]||"#64748b"}30`,borderRadius:5,padding:"2px 7px"}}>{t.ver}</span>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",color:"#334155"}}>{t.cat}</span>
                    </div>
                  </div>
                  <h3 style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>{t.title}</h3>
                  <p style={{fontSize:12,color:"#475569",lineHeight:1.7}}>{t.desc}</p>
                  <div style={{marginTop:12,fontSize:10,color:t.color,fontFamily:"'JetBrains Mono'",display:"flex",alignItems:"center",gap:4}}>Open in Studio →</div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"60px 0",color:"#334155",fontSize:14}}>
              No topics match &quot;{search}&quot; in {cat}. Try another filter.
            </div>
          )}
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section style={{padding:"60px 48px",position:"relative",zIndex:2,background:"rgba(255,255,255,.01)"}} id="articles">
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{marginBottom:40}}>
            <div style={{fontSize:10,color:"#06b6d4",fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:3,marginBottom:10}}>// C++ Articles</div>
            <h2 style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-1.5px"}}>
              Learn From The <span className="gt-cold">Best Minds in C++</span>
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {ARTICLES.map(a=>(
              <div key={a.title}
                style={{padding:24,borderRadius:14,background:"rgba(10,10,26,.8)",border:"1px solid rgba(255,255,255,.06)",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=a.color+"45";el.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.06)";el.style.transform="translateY(0)";}}
              >
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${a.color}15`,border:`1px solid ${a.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{a.icon}</div>
                  <div>
                    <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",fontWeight:800,color:a.color,background:`${a.color}12`,border:`1px solid ${a.color}25`,borderRadius:5,padding:"2px 8px",textTransform:"uppercase",letterSpacing:.8}}>{a.tag}</span>
                    <div style={{fontSize:10,color:"#334155",marginTop:3}}>{a.time} read</div>
                  </div>
                </div>
                <h3 style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:8,lineHeight:1.4}}>{a.title}</h3>
                <p style={{fontSize:12,color:"#475569",lineHeight:1.75}}>{a.excerpt || (a as any).desc}</p>
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
          <h2 style={{fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-1.5px",marginBottom:14}}>
            From Zero to <span className="gt-spectrum">Execution Clarity</span> in 3 Steps
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:40,marginBottom:40}}>
            {[
              {n:"01",icon:"✍️",color:"#3b82f6",title:"Write or Paste Code",desc:"Use the Monaco editor with full C++ support. Paste from clipboard, use templates, or write from scratch."},
              {n:"02",icon:"▶️",color:"#a855f7",title:"Simulate & Visualize",desc:"Ctrl+Enter to simulate. Watch memory, variables, and call stack update live as your code executes."},
              {n:"03",icon:"🔍",color:"#10b981",title:"Explore & Understand",desc:"Step through execution, scrub the timeline, ask the AI Oracle — understand every byte and every call."},
            ].map(s=>(
              <div key={s.n} style={{padding:28,borderRadius:14,background:"rgba(10,10,26,.8)",border:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{width:48,height:48,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 16px"}}>{s.icon}</div>
                <div style={{fontSize:10,color:s.color,fontFamily:"'JetBrains Mono'",fontWeight:800,marginBottom:8}}>{s.n}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:12,color:"#475569",lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/guidelines">
            <button className="btn" style={{padding:"12px 28px",fontSize:13}}>📖 Full Guidelines →</button>
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:"60px 48px 120px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(32px,4vw,52px)",fontWeight:900,letterSpacing:"-2px",marginBottom:14,lineHeight:1.05}}>
            For the first time,<br/>execution is <span className="gt-fire">not invisible.</span>
          </h2>
          <p style={{fontSize:15,color:"#475569",marginBottom:32}}>Every line. Every byte. Every pointer. Every moment. Visible.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/studio"><button className="btn btn-exec" style={{padding:"13px 32px",fontSize:14,borderRadius:12}}>Ω Enter Studio</button></Link>
            <Link href="/login"><button className="btn" style={{padding:"13px 28px",fontSize:14,borderRadius:12}}>🔐 Join Free</button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{position:"relative",zIndex:2,borderTop:"1px solid rgba(255,255,255,.04)",padding:"20px 48px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,color:"#1e293b",fontSize:11,fontFamily:"'JetBrains Mono'"}}>
        <span>Execium Ω∞ — Computational Reality OS</span>
        <div style={{display:"flex",gap:20}}>
          <Link href="/guidelines" style={{color:"#334155",textDecoration:"none"}}>Guidelines</Link>
          <Link href="/settings" style={{color:"#334155",textDecoration:"none"}}>Settings</Link>
          <Link href="/login" style={{color:"#334155",textDecoration:"none"}}>Sign In</Link>
        </div>
        <span>v∞.0 · Truth becomes visual</span>
      </footer>

      <FeedbackModal/>
    </div>
  );
}
