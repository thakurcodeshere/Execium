"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { getProgramList, PROGRAMS } from "@/lib/engine";
import ExecutionFlow from "@/components/studio/ExecutionFlow";
import VariablesPanel from "@/components/studio/VariablesPanel";
import ConsoleOutput from "@/components/studio/ConsoleOutput";
import AIOracle from "@/components/studio/AIOracle";
import TemporalEngine from "@/components/studio/TemporalEngine";
import ThemeSwitcher from "@/components/studio/ThemeSwitcher";

const CodeEditor    = dynamic(()=>import("@/components/studio/CodeEditor"),    {ssr:false});
const MemoryUniverse= dynamic(()=>import("@/components/studio/MemoryUniverse"),{ssr:false});
const RecursionDim  = dynamic(()=>import("@/components/studio/RecursionDimension"),{ssr:false});
const ExecutionWaterfall = dynamic(()=>import("@/components/studio/ExecutionWaterfall"),{ssr:false});

const HL:Record<string,string>={blue:'#3b82f6',green:'#10b981',yellow:'#f59e0b',purple:'#a855f7',orange:'#f97316',red:'#ef4444',cyan:'#06b6d4',pink:'#ec4899'};
const CAT:Record<string,string>={Recursion:'#a855f7','Data Structures':'#f97316',Algorithms:'#3b82f6',Memory:'#10b981',Basics:'#10b981'};

type RightTab = 'flow'|'waterfall'|'memory'|'recursion'|'vars';

export default function StudioPage(){
  const {pid,steps,cur,showAI,toggleAI,loadProgram,theme}=useStore();
  const [showProgs,setShowProgs]=useState(false);
  const [rightTab,setRightTab]=useState<RightTab>('flow');
  const programs=getProgramList();
  const step=steps[cur];
  const prog=PROGRAMS[pid];
  const pct=steps.length>1?cur/(steps.length-1)*100:0;
  const hlCol=step?HL[step.hl]??'#3b82f6':'#3b82f6';
  const T=theme;

  const TAB_BTNS:Array<{id:RightTab;label:string;icon:string;col:string}> = [
    {id:'flow',      label:'Execution Flow',  icon:'📋', col:'#06b6d4'},
    {id:'waterfall', label:'Waterfall',       icon:'🌊', col:'#a855f7'},
    {id:'memory',    label:'Memory',          icon:'📦', col:'#f97316'},
    {id:'recursion', label:'Call Stack',      icon:'🌀', col:'#ec4899'},
    {id:'vars',      label:'Variables',       icon:'✏️', col:'#10b981'},
  ];

  return(
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:T.uiBg,overflow:'hidden',fontFamily:"'Inter'",transition:'background .3s'}}>

      {/* ── Topbar ── */}
      <header style={{height:50,display:'flex',alignItems:'center',padding:'0 12px',gap:10,
        borderBottom:`1px solid ${T.uiBorder}`,background:T.uiPanelHd,flexShrink:0,zIndex:50}}>

        <Link href="/"><div style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer'}}>
          <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#a855f7,#3b82f6)',
            display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',
            boxShadow:'0 0 14px rgba(168,85,247,.5)'}}>Ω</div>
          <span style={{fontFamily:"'JetBrains Mono'",fontWeight:800,fontSize:12,
            background:'linear-gradient(90deg,#a855f7,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Execium Ω∞</span>
        </div></Link>

        <div style={{width:1,height:22,background:T.uiBorder}}/>

        {/* Program selector */}
        <div style={{position:'relative'}}>
          <button onClick={()=>setShowProgs(p=>!p)} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 12px',
            borderRadius:7,border:`1px solid ${T.uiBorder}`,background:T.uiSurface,color:T.uiText,
            cursor:'pointer',fontFamily:"'JetBrains Mono'",fontSize:11,transition:'all .15s'}}>
            <span>{prog?.icon}</span>
            <span style={{color:T.uiTextMuted}}>{prog?.title??'Select Program'}</span>
            <span style={{color:T.uiTextMuted,fontSize:9}}>▾</span>
          </button>
          {showProgs&&(
            <div style={{position:'absolute',top:'calc(100%+6px)',left:0,width:300,background:T.uiSurface,
              border:`1px solid ${T.uiBorder}`,borderRadius:12,overflow:'hidden',zIndex:200,marginTop:4,
              boxShadow:'0 20px 60px rgba(0,0,0,.7)'}}>
              {programs.map(p=>(
                <button key={p.id} onClick={()=>{loadProgram(p.id);setShowProgs(false);}}
                  style={{width:'100%',padding:'10px 14px',display:'flex',alignItems:'center',gap:10,
                    background:p.id===pid?`${T.uiAccent}15`:'transparent',border:'none',cursor:'pointer',
                    textAlign:'left',borderBottom:`1px solid ${T.uiBorder}`,transition:'background .12s'}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=`${T.uiAccent}0e`}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=p.id===pid?`${T.uiAccent}15`:'transparent'}>
                  <span style={{fontSize:18}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:T.uiText}}>{p.title}</div>
                    <div style={{fontSize:9,color:T.uiTextMuted,fontFamily:"'JetBrains Mono'",textTransform:'uppercase',letterSpacing:.5}}>{p.category} · {p.description.slice(0,38)}…</div>
                  </div>
                  <div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:CAT[p.category]??'#3b82f6',boxShadow:`0 0 6px ${CAT[p.category]??'#3b82f6'}`}}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step badges */}
        {step&&<div className="badge" style={{background:`${hlCol}15`,color:hlCol,border:`1px solid ${hlCol}35`,fontSize:9}}>
          Step {cur+1}/{steps.length}
        </div>}
        {step&&<div className="badge" style={{background:`${hlCol}10`,color:hlCol,border:`1px solid ${hlCol}25`,fontSize:9}}>
          Line {step.line} · {step.type.replace(/_/g,' ')}
        </div>}

        {/* Progress */}
        <div style={{flex:1,height:2,background:T.uiBorder,borderRadius:1,overflow:'hidden',margin:'0 4px'}}>
          <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${hlCol},#a855f7)`,borderRadius:1,transition:'width .35s ease'}}/>
        </div>

        <ThemeSwitcher/>

        <button onClick={toggleAI} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 12px',borderRadius:7,
          border:`1px solid ${showAI?'rgba(6,182,212,.3)':T.uiBorder}`,
          background:showAI?'rgba(6,182,212,.1)':T.uiSurface,
          color:showAI?'#06b6d4':T.uiTextMuted,cursor:'pointer',fontFamily:"'JetBrains Mono'",fontSize:10,transition:'all .18s'}}>
          Ω AI {showAI?'ON':'OFF'}
        </button>
        {step&&<span style={{fontSize:10,color:T.uiTextMuted,fontFamily:"'JetBrains Mono'",flexShrink:0}}>{step.ops} ops</span>}
      </header>

      {/* ── Main Layout ── */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>

        {/* Left: Code Editor */}
        <div style={{width:390,flexShrink:0,borderRight:`1px solid ${T.uiBorder}`,display:'flex',flexDirection:'column',background:T.editorBg}}>
          <CodeEditor/>
        </div>

        {/* Center: Tabbed Right Panel */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* Tab bar */}
          <div style={{display:'flex',gap:0,borderBottom:`1px solid ${T.uiBorder}`,background:T.uiPanelHd,flexShrink:0}}>
            {TAB_BTNS.map(tab=>(
              <button key={tab.id} onClick={()=>setRightTab(tab.id)} style={{
                display:'flex',alignItems:'center',gap:6,padding:'8px 16px',
                border:'none',borderBottom:rightTab===tab.id?`2px solid ${tab.col}`:'2px solid transparent',
                background:rightTab===tab.id?`${tab.col}12`:'transparent',
                color:rightTab===tab.id?tab.col:T.uiTextMuted,cursor:'pointer',
                fontFamily:"'JetBrains Mono'",fontSize:10,fontWeight:rightTab===tab.id?800:400,
                transition:'all .15s',
              }}>
                <span style={{fontSize:12}}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{flex:1,overflow:'hidden',background:T.uiSurface}}>
            {rightTab==='flow'      && <ExecutionFlow/>}
            {rightTab==='waterfall' && <ExecutionWaterfall/>}
            {rightTab==='memory'    && <MemoryUniverse/>}
            {rightTab==='recursion' && <RecursionDim/>}
            {rightTab==='vars'      && <VariablesPanel/>}
          </div>

          {/* Console always visible below */}
          <div style={{height:180,flexShrink:0,borderTop:`1px solid ${T.uiBorder}`,background:T.editorBg}}>
            <ConsoleOutput/>
          </div>

          {/* Temporal Engine */}
          <div style={{height:116,flexShrink:0,borderTop:`1px solid ${T.uiBorder}`,background:T.uiPanelHd}}>
            <TemporalEngine/>
          </div>
        </div>

        {/* Right: AI Oracle */}
        {showAI&&(
          <div style={{width:264,flexShrink:0,borderLeft:`1px solid ${T.uiBorder}`,background:T.uiSurface,overflow:'hidden'}}>
            <AIOracle/>
          </div>
        )}
      </div>
    </div>
  );
}
