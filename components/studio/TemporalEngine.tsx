"use client";
import { useStore } from "@/lib/store";

const SPEEDS=[{l:'0.5×',ms:2800},{l:'1×',ms:1400},{l:'2×',ms:700},{l:'4×',ms:350}];
const HL:Record<string,string>={
  blue:'#3b82f6',green:'#10b981',yellow:'#f59e0b',purple:'#a855f7',
  orange:'#f97316',red:'#ef4444',cyan:'#06b6d4',pink:'#ec4899',
};
const ICONS:Record<string,string>={
  declaration:'📦',assignment:'✏️',compare:'⚖️',call:'📞',
  return:'↩',loop:'🔄',recursion:'🌀',output:'📤',alloc:'🟠',dealloc:'💥',
};

export default function TemporalEngine(){
  const {steps,cur,playback,speed,play,pause,fwd,bwd,restart,setSpeed,jump}=useStore();
  const step=steps[cur];
  const playing=playback==='playing';
  const done=playback==='done';
  const pct=steps.length>1?cur/(steps.length-1)*100:0;

  const C=(active:boolean,col='#3b82f6'):React.CSSProperties=>({
    display:'flex',alignItems:'center',justifyContent:'center',
    width:34,height:34,borderRadius:8,cursor:'pointer',border:'none',
    background:active?`${col}20`:'rgba(255,255,255,.03)',
    color:active?col:'#334155',fontSize:14,
    boxShadow:active?`0 0 12px ${col}30`:'none',
    transition:'all .18s',
  });

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column',
      background:'rgba(3,3,10,.9)',borderTop:'1px solid rgba(255,255,255,.04)'}}>

      {/* Scrubber */}
      <div style={{padding:'6px 16px 0',display:'flex',alignItems:'center',gap:3,overflowX:'auto',flexShrink:0}}>
        <span style={{fontSize:9,color:'#1e293b',fontFamily:"'JetBrains Mono'",
          textTransform:'uppercase',letterSpacing:1,marginRight:6,flexShrink:0}}>TIMELINE</span>
        {steps.map((s,i)=>{
          const col=HL[s.hl]??'#3b82f6';
          const active=i===cur,past=i<cur;
          return(
            <button key={s.id} onClick={()=>jump(i)}
              title={`Step ${i+1}: ${s.type} · L${s.line}`}
              style={{
                width:active?34:20,height:active?34:20,borderRadius:active?8:'50%',
                flexShrink:0,border:`2px solid ${active?col:past?col+'40':'rgba(255,255,255,.05)'}`,
                background:active?`${col}28`:past?`${col}12`:'rgba(255,255,255,.02)',
                color:active?col:past?col+'90':'#1e293b',
                cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:active?14:8,
                boxShadow:active?`0 0 16px ${col}55`:'none',
                transition:'all .22s cubic-bezier(.34,1.56,.64,1)',
              }}>
              {active?(ICONS[s.type]??'●'):<div style={{width:5,height:5,borderRadius:'50%',background:past?col:'rgba(255,255,255,.08)'}}/>}
            </button>
          );
        })}
      </div>

      {/* Controls row */}
      <div style={{flex:1,display:'flex',alignItems:'center',padding:'0 16px',gap:10}}>
        <button onClick={restart} style={C(false)} title="Restart">⟳</button>
        <button onClick={bwd} disabled={cur===0}
          style={{...C(cur>0,'#a855f7'),opacity:cur===0?.3:1,cursor:cur===0?'default':'pointer'}}>⏮</button>

        {/* Big play/pause */}
        <button onClick={playing?pause:play} style={{
          display:'flex',alignItems:'center',justifyContent:'center',
          width:44,height:44,borderRadius:10,border:'none',cursor:'pointer',
          background:playing?'rgba(245,158,11,.18)':'rgba(16,185,129,.18)',
          color:playing?'#f59e0b':'#10b981',fontSize:18,
          boxShadow:playing?'0 0 24px rgba(245,158,11,.4)':'0 0 24px rgba(16,185,129,.4)',
          transition:'all .2s',
        }}>{playing?'⏸':done?'↩':'▶'}</button>

        <button onClick={fwd} disabled={cur===steps.length-1}
          style={{...C(cur<steps.length-1,'#3b82f6'),opacity:cur===steps.length-1?.3:1,cursor:cur===steps.length-1?'default':'pointer'}}>⏭</button>

        <div style={{width:1,height:20,background:'rgba(255,255,255,.06)',margin:'0 4px'}}/>

        {/* Speed */}
        <span style={{fontSize:9,color:'#1e293b',fontFamily:"'JetBrains Mono'",textTransform:'uppercase',letterSpacing:1}}>SPEED</span>
        {SPEEDS.map(s=>(
          <button key={s.l} onClick={()=>setSpeed(s.ms)} style={{
            padding:'4px 10px',borderRadius:6,border:`1px solid ${speed===s.ms?'rgba(59,130,246,.4)':'rgba(255,255,255,.05)'}`,
            background:speed===s.ms?'rgba(59,130,246,.14)':'transparent',
            color:speed===s.ms?'#3b82f6':'#334155',cursor:'pointer',
            fontSize:10,fontFamily:"'JetBrains Mono'",fontWeight:700,transition:'all .15s',
          }}>{s.l}</button>
        ))}

        <div style={{width:1,height:20,background:'rgba(255,255,255,.06)',margin:'0 4px'}}/>

        {/* Progress scrub */}
        <div style={{flex:1,display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1,height:3,background:'rgba(255,255,255,.05)',borderRadius:2,cursor:'pointer',position:'relative'}}
            onClick={e=>{
              const r=e.currentTarget.getBoundingClientRect();
              jump(Math.round(((e.clientX-r.left)/r.width)*(steps.length-1)));
            }}>
            <div style={{position:'absolute',inset:0,borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${pct}%`,
                background:'linear-gradient(90deg,#10b981,#3b82f6,#a855f7)',
                borderRadius:2,transition:'width .3s ease'}}/>
            </div>
            <div style={{position:'absolute',top:-4,
              left:`calc(${pct}% - 5px)`,width:10,height:10,
              borderRadius:'50%',background:'#fff',
              border:'2px solid #3b82f6',
              boxShadow:'0 0 10px #3b82f6',transition:'left .3s ease'}}/>
          </div>
          <span style={{fontSize:10,color:'#334155',fontFamily:"'JetBrains Mono'",flexShrink:0,whiteSpace:'nowrap'}}>
            {cur+1}/{steps.length}
          </span>
        </div>

        {/* Status */}
        <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
          <div className="orb anim-pulse" style={{
            background:playing?'#f59e0b':done?'#10b981':'#1e293b',
            boxShadow:playing?'0 0 8px #f59e0b':done?'0 0 8px #10b981':'none',
          }}/>
          <span style={{fontSize:9,fontFamily:"'JetBrains Mono'",
            color:playing?'#f59e0b':done?'#10b981':'#1e293b',
            textTransform:'uppercase',letterSpacing:.5}}>
            {playing?'EXECUTING':done?'COMPLETE':playback==='paused'?'PAUSED':'READY'}
          </span>
        </div>

        {/* ops */}
        {step&&<span style={{fontSize:10,color:'#1e293b',fontFamily:"'JetBrains Mono'",flexShrink:0}}>ops:{step.ops}</span>}
      </div>
    </div>
  );
}
