"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

/* Canvas-based recursive call stack with depth visualization */
export default function RecursionDimension(){
  const {steps,cur}=useStore();
  const step=steps[cur];
  const ref=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const c=ref.current; if(!c||!step)return;
    const ctx=c.getContext('2d')!;
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#06060f'; ctx.fillRect(0,0,W,H);

    const frames=[...step.frames];
    const n=frames.length;
    if(!n)return;

    const depth_colors=['#3b82f6','#10b981','#f59e0b','#f97316','#a855f7','#06b6d4','#ec4899'];
    const frameH=Math.min(72,(H-60)/Math.max(n,1));
    const maxW=W-32;

    // Title
    ctx.font='800 9px JetBrains Mono';
    ctx.fillStyle='rgba(168,85,247,.6)';
    ctx.fillText('◈ CALL STACK DIMENSION',16,20);

    // Depth bar
    const depthPct=Math.min(n/8,1);
    ctx.fillStyle='rgba(255,255,255,.05)';
    ctx.beginPath();ctx.roundRect(16,30,maxW,4,2);ctx.fill();
    const grd=ctx.createLinearGradient(16,0,16+maxW*depthPct,0);
    grd.addColorStop(0,'#a855f7');grd.addColorStop(1,'#3b82f6');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(16,30,maxW*depthPct,4,2);ctx.fill();
    ctx.font='700 9px JetBrains Mono';
    ctx.fillStyle='rgba(168,85,247,.8)';
    ctx.fillText(`depth ${n}`,16+maxW*depthPct+4,36);

    // Frames — reversed so top of stack is at top
    [...frames].reverse().forEach((fr,i)=>{
      const color=depth_colors[fr.depth%depth_colors.length];
      const isTop=(i===0);
      const indent=fr.depth*10;
      const fW=maxW-indent;
      const fY=48+i*frameH;
      const alpha=isTop?1:Math.max(0.35,1-i*.15);

      ctx.save();
      ctx.globalAlpha=alpha;

      // Frame bg
      const grd2=ctx.createLinearGradient(16+indent,fY,16+indent+fW,fY+frameH-4);
      grd2.addColorStop(0,isTop?`${color}25`:`${color}10`);
      grd2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=grd2;
      ctx.beginPath();ctx.roundRect(16+indent,fY,fW,frameH-6,7);ctx.fill();
      ctx.strokeStyle=isTop?color:`${color}55`;
      ctx.lineWidth=isTop?1.5:1;
      ctx.stroke();

      if(isTop){
        ctx.shadowColor=color;
        ctx.shadowBlur=16;
      }

      // Return address
      ctx.font='600 8px JetBrains Mono';
      ctx.fillStyle='rgba(255,255,255,.2)';
      ctx.fillText(fr.id.includes('main')?'0x0000':`0x${(fr.depth*0x100+0x1000).toString(16).toUpperCase()}`,
        24+indent,fY+13);

      // Function name
      ctx.font=`800 ${isTop?14:12}px JetBrains Mono`;
      ctx.fillStyle=color;
      ctx.shadowColor=isTop?color:'transparent';
      ctx.shadowBlur=isTop?8:0;
      ctx.fillText(`${fr.fn}()`,24+indent,fY+30);

      // ACTIVE badge
      if(fr.active&&isTop){
        ctx.font='800 8px JetBrains Mono';
        ctx.fillStyle=color;
        ctx.fillText('ACTIVE',16+indent+fW-60,fY+13);
      }

      // Return value
      if(fr.retVal!==undefined){
        ctx.font='700 10px JetBrains Mono';
        ctx.fillStyle='#10b981';
        ctx.fillText(`→ ${fr.retVal}`,16+indent+fW-80,fY+30);
      }

      // Local vars summary
      if(fr.vars.length>0){
        ctx.font='600 9px JetBrains Mono';
        ctx.fillStyle='rgba(255,255,255,.3)';
        const varStr=fr.vars.map(v=>`${v.name}=${v.value}`).join('  ');
        ctx.fillText(varStr.slice(0,45)+(varStr.length>45?'…':''),24+indent,fY+frameH-10);
      }

      ctx.restore();

      // Connector line to next
      if(i<frames.length-1){
        ctx.save();
        ctx.globalAlpha=.2;
        ctx.strokeStyle=color;
        ctx.lineWidth=1;
        ctx.setLineDash([3,3]);
        ctx.beginPath();
        ctx.moveTo(24+indent+12,fY+frameH-6);
        ctx.lineTo(24+indent+12,fY+frameH+2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    });

    // Stack bottom
    const botY=48+n*frameH;
    ctx.strokeStyle='rgba(255,255,255,.06)';
    ctx.setLineDash([4,6]);
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(16,botY);ctx.lineTo(W-16,botY);ctx.stroke();
    ctx.setLineDash([]);

  },[step,cur]);

  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div className="panel-hd">
        <div className="orb orb-purple"/>
        <span>Recursion Dimension</span>
        <span style={{marginLeft:'auto',color:'#334155'}}>depth: {step?.frames.length??0}</span>
      </div>
      <div style={{flex:1,position:'relative'}}>
        {!step?(
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
            justifyContent:'center',color:'#1e293b',fontSize:12,fontFamily:"'JetBrains Mono'"}}>
            Awaiting execution...
          </div>
        ):<canvas ref={ref} style={{width:'100%',height:'100%',display:'block'}}/>}
      </div>
    </div>
  );
}
