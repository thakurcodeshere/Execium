"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

/* Canvas-based Memory Universe — draws stack + heap as glowing blocks */
export default function MemoryUniverse(){
  const {steps,cur}=useStore();
  const step=steps[cur];
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||!step)return;
    const ctx=canvas.getContext('2d')!;
    const W=canvas.width=canvas.offsetWidth;
    const H=canvas.height=canvas.offsetHeight;
    ctx.clearRect(0,0,W,H);

    /* Background */
    ctx.fillStyle='#06060f';
    ctx.fillRect(0,0,W,H);

    /* Grid */
    ctx.strokeStyle='rgba(59,130,246,.04)';
    ctx.lineWidth=1;
    for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    /* ── STACK REGION ── */
    const stackVars=step.frames.flatMap(f=>f.vars);
    const sectionW=Math.min(W*.45,220);
    const sX=16,sY=50;

    // Label
    ctx.font='800 9px JetBrains Mono';
    ctx.fillStyle='rgba(59,130,246,.7)';
    ctx.letterSpacing='2px';
    ctx.fillText('◈ STACK MEMORY',sX,sY-8);

    stackVars.slice().reverse().forEach((v,i)=>{
      const bY=sY+i*46;
      const bH=38;
      const grd=ctx.createLinearGradient(sX,bY,sX+sectionW,bY+bH);
      const baseCol=v.isNew?'rgba(59,130,246,.25)':v.isMut?'rgba(245,158,11,.18)':'rgba(59,130,246,.08)';
      const borderCol=v.isNew?'#3b82f6':v.isMut?'#f59e0b':'rgba(59,130,246,.3)';
      grd.addColorStop(0,baseCol);
      grd.addColorStop(1,'rgba(0,0,0,0)');

      // Cell bg
      ctx.save();
      ctx.shadowColor=borderCol;
      ctx.shadowBlur=v.isNew?18:v.isMut?12:0;
      ctx.fillStyle=grd;
      ctx.beginPath();
      ctx.roundRect(sX,bY,sectionW,bH,6);
      ctx.fill();
      ctx.strokeStyle=borderCol;
      ctx.lineWidth=v.isNew||v.isMut?1.5:1;
      ctx.stroke();
      ctx.restore();

      // Address
      ctx.font='600 9px JetBrains Mono';
      ctx.fillStyle='rgba(255,255,255,.2)';
      ctx.fillText(v.addr,sX+6,bY+13);

      // Name
      ctx.font=`700 12px JetBrains Mono`;
      ctx.fillStyle=v.isPtr?'#a855f7':v.isNew?'#3b82f6':v.isMut?'#f59e0b':'#94a3b8';
      ctx.fillText((v.isPtr?'*':'')+v.name,sX+6,bY+28);

      // Value
      ctx.font='600 12px JetBrains Mono';
      ctx.fillStyle=v.isNew?'#3b82f6':v.isMut?'#f59e0b':'#10b981';
      const valStr=String(v.value);
      ctx.fillText(valStr,sX+sectionW-ctx.measureText(valStr).width-8,bY+28);

      // Type badge
      ctx.font='700 8px JetBrains Mono';
      ctx.fillStyle='rgba(255,255,255,.25)';
      ctx.fillText(v.type,sX+6,bY+bH+2);
    });

    /* Stack bottom line */
    const sBotY=sY+Math.max(stackVars.length,1)*46+8;
    ctx.strokeStyle='rgba(255,255,255,.06)';
    ctx.setLineDash([4,4]);
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sX,sBotY);ctx.lineTo(sX+sectionW,sBotY);ctx.stroke();
    ctx.setLineDash([]);
    ctx.font='700 8px JetBrains Mono';
    ctx.fillStyle='rgba(255,255,255,.12)';
    ctx.fillText('── stack bottom ──',sX+sectionW/2-40,sBotY+12);

    /* ── HEAP REGION ── */
    const hX=W*.5+8,hY=50;
    ctx.font='800 9px JetBrains Mono';
    ctx.fillStyle='rgba(249,115,22,.7)';
    ctx.letterSpacing='2px';
    ctx.fillText('◈ HEAP MEMORY',hX,hY-8);

    if(step.heap.length===0){
      ctx.strokeStyle='rgba(249,115,22,.15)';
      ctx.lineWidth=1;
      ctx.setLineDash([5,5]);
      ctx.beginPath();ctx.roundRect(hX,hY,W-hX-16,60,8);ctx.stroke();
      ctx.setLineDash([]);
      ctx.font='600 11px JetBrains Mono';
      ctx.fillStyle='rgba(255,255,255,.12)';
      ctx.fillText('no heap allocations',hX+16,hY+34);
    } else {
      step.heap.forEach((blk,i)=>{
        const bY=hY+i*70,bH=60,bW=W-hX-16;
        const bc=blk.freed?'rgba(239,68,68,.15)':blk.isNew?'rgba(249,115,22,.25)':'rgba(249,115,22,.09)';
        const bBorder=blk.freed?'#ef4444':blk.isNew?'#f97316':'rgba(249,115,22,.3)';

        ctx.save();
        ctx.shadowColor=bBorder;
        ctx.shadowBlur=blk.isNew?22:6;
        ctx.fillStyle=bc;
        ctx.beginPath();ctx.roundRect(hX,bY,bW,bH,7);ctx.fill();
        ctx.strokeStyle=bBorder;
        ctx.lineWidth=blk.isNew?2:1;
        ctx.stroke();
        ctx.restore();

        // Address
        ctx.font='600 9px JetBrains Mono';
        ctx.fillStyle='rgba(249,115,22,.6)';
        ctx.fillText(blk.addr,hX+8,bY+14);

        // Type + size
        ctx.font='700 11px JetBrains Mono';
        ctx.fillStyle=blk.freed?'#ef4444':blk.isNew?'#f97316':'#94a3b8';
        ctx.fillText(`${blk.type} [${blk.size}B]`,hX+8,bY+30);

        // Values
        ctx.font='600 10px JetBrains Mono';
        let vX=hX+8;
        blk.vals.forEach(val=>{
          ctx.fillStyle=val==='null'?'#ef4444':'#cbd5e1';
          ctx.fillText(val,vX,bY+48);
          vX+=ctx.measureText(val).width+10;
        });

        if(blk.freed){
          ctx.font='800 9px JetBrains Mono';
          ctx.fillStyle='#ef4444';
          ctx.fillText('FREED',hX+bW-54,bY+14);
        }
        if(blk.isNew){
          ctx.font='800 9px JetBrains Mono';
          ctx.fillStyle='#f97316';
          ctx.fillText('NEW',hX+bW-40,bY+14);
        }
      });
    }

    /* ── POINTER ARROWS ── */
    const ptrs=stackVars.filter(v=>v.isPtr&&v.pointsTo);
    ptrs.forEach(ptr=>{
      const heapBlk=step.heap.find(h=>h.addr===ptr.pointsTo);
      if(!heapBlk)return;
      const idx=stackVars.findIndex(v=>v.id===ptr.id);
      const fromX=sX+sectionW,fromY=sY+(stackVars.length-1-idx)*46+20;
      const toX=hX,toY=hY+step.heap.indexOf(heapBlk)*70+30;

      ctx.save();
      ctx.strokeStyle='rgba(168,85,247,.7)';
      ctx.lineWidth=1.5;
      ctx.setLineDash([5,3]);
      ctx.shadowColor='#a855f7';
      ctx.shadowBlur=8;
      ctx.beginPath();
      ctx.moveTo(fromX,fromY);
      ctx.bezierCurveTo(fromX+40,fromY,toX-40,toY,toX,toY);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrowhead
      const angle=Math.atan2(toY-(fromY+toY)/2,toX-((fromX+40+toX-40)/2+toX-40));
      ctx.fillStyle='#a855f7';
      ctx.beginPath();
      ctx.moveTo(toX,toY);
      ctx.lineTo(toX-10*Math.cos(angle-0.4),toY-10*Math.sin(angle-0.4));
      ctx.lineTo(toX-10*Math.cos(angle+0.4),toY-10*Math.sin(angle+0.4));
      ctx.closePath();ctx.fill();
      ctx.restore();
    });

  },[step]);

  if(!step)return(
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div className="panel-hd"><div className="orb orb-orange"/><span>Memory Universe</span></div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',
        color:'#1e293b',fontSize:12,fontFamily:"'JetBrains Mono'"}}>▶ Press play to visualize memory</div>
    </div>
  );

  const stackVars=step.frames.flatMap(f=>f.vars);

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div className="panel-hd">
        <div className="orb orb-orange"/>
        <span>Memory Universe</span>
        <span style={{marginLeft:'auto',color:'#334155'}}>
          stack:{stackVars.length*4}B · heap:{step.heap.filter(h=>!h.freed).reduce((a,b)=>a+b.size,0)}B
        </span>
      </div>
      <div style={{flex:1,position:'relative'}}>
        <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block'}}/>
      </div>
    </div>
  );
}
