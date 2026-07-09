"use client";
import { useRef, useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ConsoleOutput(){
  const {steps, cur} = useStore();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),[cur]);

  // Build cumulative output log — each entry knows which step produced it
  type LogEntry = { line: string; stepIdx: number; isNew: boolean };
  const log: LogEntry[] = [];
  steps.slice(0, cur + 1).forEach((step, i) => {
    const prevLen = i > 0 ? steps[i-1].output.length : 0;
    const newLines = step.output.slice(prevLen);
    newLines.forEach(ln => {
      log.push({ line: ln, stepIdx: i, isNew: i === cur });
    });
  });

  const currentStep = steps[cur];
  const isOutputStep = currentStep?.type === 'output';

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div className="panel-hd" style={{borderBottom:'1px solid rgba(255,255,255,.05)'}}>
        <div className="orb orb-green"/>
        <span>Console Output</span>
        <span style={{marginLeft:'auto',color:'#334155',fontSize:10,fontFamily:"'JetBrains Mono'"}}>{log.length} lines</span>
        {isOutputStep && (
          <span style={{background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',
            borderRadius:4,padding:'1px 8px',fontSize:9,color:'#10b981',fontFamily:"'JetBrains Mono'",
            marginLeft:6,fontWeight:800}}>● PRINTING</span>
        )}
      </div>

      <div style={{flex:1,overflow:'auto',padding:'10px 14px',background:'#040408',fontFamily:"'JetBrains Mono'",fontSize:12}}>
        {/* Prompt */}
        <div style={{color:'#1e293b',marginBottom:8,fontSize:10,display:'flex',alignItems:'center',gap:6}}>
          <span style={{color:'#a855f7'}}>$</span>
          <span style={{color:'#334155'}}>execium run</span>
          <div style={{flex:1,height:1,background:'rgba(255,255,255,.04)',marginLeft:6}}/>
        </div>

        {log.length === 0 ? (
          <div style={{color:'#1e293b',display:'flex',alignItems:'center',gap:8}}>
            <span className="anim-blink" style={{color:'#3b82f6',fontSize:16}}>█</span>
            <span style={{fontSize:10,color:'#1e293b'}}>waiting for output...</span>
          </div>
        ) : (
          <>
            {log.map((entry, i) => (
              <div key={i} style={{
                display:'flex',gap:10,alignItems:'flex-start',lineHeight:1.8,
                padding:'1px 0',
                background:entry.isNew?'rgba(16,185,129,.07)':'transparent',
                borderLeft:entry.isNew?'2px solid #10b981':'2px solid transparent',
                paddingLeft:entry.isNew?6:0,
                borderRadius:2,
                transition:'all .2s',
              }}>
                {/* Step that produced this */}
                <span style={{color:'#1e293b',userSelect:'none',fontSize:9,width:28,flexShrink:0,paddingTop:2,textAlign:'right'}}>
                  S{entry.stepIdx+1}
                </span>
                {/* Output arrow */}
                <span style={{color:'#334155',fontSize:10,paddingTop:2}}>›</span>
                {/* Content */}
                <span style={{
                  color:entry.isNew?'#10b981':'#4ade80',
                  fontWeight:entry.isNew?700:400,
                  fontSize:entry.isNew?12.5:12,
                  flex:1,
                }}>
                  {entry.line}
                </span>
                {entry.isNew && (
                  <span style={{fontSize:8,color:'#10b981',opacity:.7,paddingTop:3,fontWeight:800}}>NEW</span>
                )}
              </div>
            ))}

            {/* Process exit — only show when done */}
            {cur === steps.length - 1 && (
              <div style={{marginTop:10,paddingTop:8,borderTop:'1px solid rgba(255,255,255,.05)',
                display:'flex',alignItems:'center',gap:8,fontSize:10,color:'#334155'}}>
                <span>Process exited with code</span>
                <span style={{color:'#10b981',fontWeight:800}}>0</span>
                <span style={{color:'#1e293b'}}>·</span>
                <span style={{color:'#1e293b'}}>{log.length} output line{log.length!==1?'s':''}</span>
              </div>
            )}
          </>
        )}
        <div ref={endRef}/>
      </div>
    </div>
  );
}
