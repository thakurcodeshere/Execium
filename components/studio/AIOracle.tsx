"use client";
import { useStore } from "@/lib/store";

const TIPS:{[k:string]:string[]}={
  beginner:[
    "The call stack is like a stack of trays — you can only add/remove from the top.",
    "Heap memory stays alive until you explicitly free it. Stack memory auto-destroys.",
    "Pointers store addresses — they 'point' to where data lives in memory.",
    "Recursion means a function calls itself. Each call gets its own memory frame.",
    "unique_ptr automatically frees heap memory when it goes out of scope — no leaks!",
  ],
  intermediate:[
    "Each stack frame holds: return addr, saved registers, local vars, and parameters.",
    "Heap allocation (new/malloc) uses OS syscalls — far slower than stack allocation.",
    "Stack depth for recursion is O(n) — deep recursion risks stack overflow at ~8MB.",
    "arr[i] == *(arr+i) — array indexing is just pointer arithmetic in disguise.",
    "RAII: Resource Acquisition Is Initialization — tie resource lifetime to object lifetime.",
  ],
  expert:[
    "x86-64: stack frames are 16-byte aligned (System V ABI requirement).",
    "The heap allocator maintains size-class free lists for O(1) amortized allocation.",
    "Tail call optimization (TCO) can collapse recursive frames with -O2 in GCC/Clang.",
    "Binary search has cache-friendly access only at large arrays; small ones prefer linear.",
    "unique_ptr has zero overhead vs raw pointer — optimizer eliminates the wrapper entirely.",
  ],
};

const STEP_LORE:{[k:string]:string}={
  declaration:"Memory is reserved — a new location is mapped at a valid address.",
  assignment:"Bits at the target address are overwritten with the new encoded value.",
  call:"Stack pointer (RSP) decremented. Return address pushed. New frame established.",
  return:"Frame cleaned. RSP restored. Return value placed in RAX register. Control transferred.",
  loop:"Conditional branch instruction. CPU checks flags register and may jump backward.",
  compare:"CMP instruction subtracts operands, sets EFLAGS. No result stored — only flags.",
  output:"Writes to stdout file descriptor via write() syscall. Buffered by libc.",
  alloc:"brk/mmap syscall expands heap. Allocator marks block header. Pointer returned.",
  dealloc:"Allocator marks block free. Coalesces adjacent free blocks. May return to OS.",
  recursion:"Recursive call — stack grows deeper. Parameters copied into new frame.",
};

export default function AIOracle(){
  const {steps,cur,aiMode,setAIMode}=useStore();
  const step=steps[cur];
  const tips=TIPS[aiMode];
  const tip=tips[cur%tips.length];
  const mc={beginner:'#10b981',intermediate:'#3b82f6',expert:'#a855f7'}[aiMode];

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div className="panel-hd">
        <span style={{fontSize:14}}>Ω</span>
        <span>AI Oracle</span>
      </div>

      {/* Mode */}
      <div style={{padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',gap:4}}>
        {(['beginner','intermediate','expert'] as const).map(m=>(
          <button key={m} onClick={()=>setAIMode(m)} style={{
            flex:1,padding:'5px 3px',borderRadius:7,cursor:'pointer',
            border:`1px solid ${aiMode===m?({beginner:'rgba(16,185,129,.4)',intermediate:'rgba(59,130,246,.4)',expert:'rgba(168,85,247,.4)'}[m]):'rgba(255,255,255,.06)'}`,
            background:aiMode===m?({beginner:'rgba(16,185,129,.12)',intermediate:'rgba(59,130,246,.12)',expert:'rgba(168,85,247,.12)'}[m]):'transparent',
            color:aiMode===m?({beginner:'#10b981',intermediate:'#3b82f6',expert:'#a855f7'}[m]):'#334155',
            fontSize:9,fontWeight:800,fontFamily:"'JetBrains Mono'",
            textTransform:'uppercase',letterSpacing:.5,transition:'all .18s',
          }}>{m.slice(0,3)}</button>
        ))}
      </div>

      <div style={{flex:1,overflow:'auto',padding:12,display:'flex',flexDirection:'column',gap:10}}>

        {/* Current explanation */}
        {step?(
          <>
            <div style={{padding:'12px',background:`${mc}0e`,
              border:`1px solid ${mc}25`,borderRadius:9}}>
              <div style={{fontSize:9,fontWeight:800,color:mc,
                fontFamily:"'JetBrains Mono'",textTransform:'uppercase',
                letterSpacing:1,marginBottom:8,display:'flex',alignItems:'center',gap:5}}>
                <div className="orb" style={{background:mc,boxShadow:`0 0 6px ${mc}`,width:6,height:6}}/>
                What happened?
              </div>
              <p style={{fontSize:12,color:'#64748b',lineHeight:1.75,fontFamily:"'Inter'"}}>
                {aiMode==='beginner'?step.explainBeg:step.explain}
              </p>
            </div>

            {/* Machine perspective */}
            {aiMode==='expert'&&(
              <div style={{padding:'10px 12px',background:'rgba(255,255,255,.02)',
                border:'1px solid rgba(255,255,255,.06)',borderRadius:8}}>
                <div style={{fontSize:9,color:'#334155',fontFamily:"'JetBrains Mono'",
                  textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Machine Reality</div>
                <p style={{fontSize:11,color:'#475569',lineHeight:1.65,fontFamily:"'Inter'"}}>
                  {STEP_LORE[step.type]??'Instruction executed at current program counter.'}
                </p>
              </div>
            )}

            {/* Step type */}
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="badge" style={{background:`${mc}18`,color:mc,border:`1px solid ${mc}30`,fontSize:9}}>
                {step.type.replace(/_/g,' ')}
              </span>
              <span style={{fontSize:10,color:'#334155',fontFamily:"'JetBrains Mono'"}}>line {step.line}</span>
            </div>
          </>
        ):(
          <div style={{padding:'14px',background:'rgba(255,255,255,.02)',
            border:'1px solid rgba(255,255,255,.05)',borderRadius:9,
            textAlign:'center',color:'#1e293b',fontSize:12,fontFamily:"'JetBrains Mono'"}}>
            Ω Press ▶ to activate<br/>AI cognitive layer
          </div>
        )}

        {/* Tip */}
        <div style={{padding:'12px',background:'rgba(6,182,212,.07)',
          border:'1px solid rgba(6,182,212,.18)',borderRadius:9}}>
          <div style={{fontSize:9,fontWeight:800,color:'#06b6d4',
            fontFamily:"'JetBrains Mono'",textTransform:'uppercase',
            letterSpacing:1,marginBottom:7}}>💡 Cognitive Note</div>
          <p style={{fontSize:11,color:'#475569',lineHeight:1.75,fontFamily:"'Inter'"}}>{tip}</p>
        </div>

        {/* Ops counter */}
        {step&&(
          <div style={{padding:'10px 12px',background:'rgba(168,85,247,.07)',
            border:'1px solid rgba(168,85,247,.18)',borderRadius:9}}>
            <div style={{fontSize:9,color:'#a855f7',fontFamily:"'JetBrains Mono'",
              textTransform:'uppercase',letterSpacing:1,marginBottom:3}}>Operations</div>
            <div style={{fontFamily:"'JetBrains Mono'",fontSize:28,
              fontWeight:900,color:'#e2e8f0',letterSpacing:'-1px'}}>
              {step.ops}<span style={{fontSize:12,color:'#334155',marginLeft:4}}>ops</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
