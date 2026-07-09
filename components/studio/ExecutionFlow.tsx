"use client";
import { useRef, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";

const HL: Record<string, string> = {
  blue:'#3b82f6', green:'#10b981', yellow:'#f59e0b',
  red:'#ef4444', purple:'#a855f7', orange:'#f97316', cyan:'#06b6d4', pink:'#ec4899',
};
const TYPE_ICONS: Record<string, string> = {
  declaration:'📦', assignment:'✏️', compare:'⚖️', call:'📞',
  return:'↩', loop:'🔄', recursion:'🌀', output:'📤',
  alloc:'🟠', dealloc:'💥', condition:'🔀',
};

export default function ExecutionFlow() {
  const { steps, cur } = useStore();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [cur]);

  // ── Pre-compute visit numbers for each step ──────────────────────────────
  // stepVisit[i] = "this is the Nth time step i's line has been visited"
  const { stepVisit, totalVisits, uniqueLines, maxVisit } = useMemo(() => {
    const count: Record<number, number> = {};
    const visit: number[] = [];
    for (const step of steps) {
      count[step.line] = (count[step.line] ?? 0) + 1;
      visit.push(count[step.line]);
    }
    const totalV: Record<number, number> = {};
    for (const step of steps) totalV[step.line] = (totalV[step.line] ?? 0) + 1;
    const max = Math.max(1, ...Object.values(totalV));
    return { stepVisit: visit, totalVisits: totalV, uniqueLines: Object.keys(totalV).length, maxVisit: max };
  }, [steps]);

  // ── Line heatmap: top visited lines ─────────────────────────────────────
  const heatLines = useMemo(() => {
    return Object.entries(totalVisits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [totalVisits]);

  const next = steps[cur + 1];
  const multiVisitCount = Object.values(totalVisits).filter(v => v > 1).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div className="panel-hd">
        <div className="orb orb-cyan" />
        <span>Execution Flow</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Key insight badge */}
          {multiVisitCount > 0 && (
            <span style={{
              background: 'rgba(168,85,247,.15)', border: '1px solid rgba(168,85,247,.35)',
              borderRadius: 4, padding: '1px 7px', fontSize: 9,
              color: '#a855f7', fontFamily: "'JetBrains Mono'", fontWeight: 800,
            }}>↺ {multiVisitCount} line{multiVisitCount>1?'s':''} repeat</span>
          )}
          <span style={{ fontSize: 9, color: '#334155', fontFamily: "'JetBrains Mono'" }}>
            {steps.length} steps · {uniqueLines} src lines
          </span>
        </div>
      </div>

      {/* ── Line Heatmap strip ── */}
      {heatLines.length > 0 && (
        <div style={{
          padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,.05)',
          background: 'rgba(255,255,255,.015)',
        }}>
          <div style={{ fontSize: 8, color: '#334155', fontFamily: "'JetBrains Mono'",
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, fontWeight: 800 }}>
            Line Execution Frequency
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {heatLines.map(([line, count]) => {
              const pct = count / maxVisit;
              const col = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f97316' : pct > 0.2 ? '#f59e0b' : '#3b82f6';
              return (
                <div key={line} style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: `${col}12`, border: `1px solid ${col}30`,
                  borderRadius: 4, padding: '2px 6px',
                }}>
                  <div style={{
                    width: Math.max(3, pct * 24), height: 6, borderRadius: 2,
                    background: col, transition: 'width .3s',
                  }} />
                  <span style={{ fontSize: 9, color: col, fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>
                    L{line}
                  </span>
                  <span style={{ fontSize: 8, color: '#475569', fontFamily: "'JetBrains Mono'" }}>
                    ×{count}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 5, fontSize: 8, color: '#1e293b', fontFamily: "'JetBrains Mono'" }}>
            {steps.length} total executions from {uniqueLines} unique source lines
            {maxVisit > 1 ? ` — L${heatLines[0][0]} ran ${heatLines[0][1]}× (loops/recursion)` : ''}
          </div>
        </div>
      )}

      {/* ── Column headers ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '26px 72px 1fr 80px 38px',
        padding: '4px 12px', borderBottom: '1px solid rgba(255,255,255,.05)',
        fontSize: 9, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
        color: '#334155', fontFamily: "'JetBrains Mono'",
      }}>
        <span>#</span><span>LINE · VISIT</span><span>WHAT EXECUTED</span>
        <span style={{ textAlign:'right' }}>RESULT</span><span style={{ textAlign:'right' }}>OPS</span>
      </div>

      {/* ── Flow list ── */}
      <div ref={listRef} style={{ flex: 1, overflow: 'auto' }}>
        {steps.length === 0 ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            height:'100%', flexDirection:'column', gap:10,
            color:'#334155', fontFamily:"'JetBrains Mono'" }}>
            <span style={{ fontSize:32 }}>▶</span>
            <span style={{ fontSize:11 }}>Press play to trace execution</span>
            <span style={{ fontSize:9, color:'#1e293b', textAlign:'center', lineHeight:1.6, maxWidth:220 }}>
              A 20-line program can produce 100+ execution steps<br/>
              — loops and recursion visit the same lines repeatedly
            </span>
          </div>
        ) : steps.map((step, i) => {
          const isCurrent = i === cur;
          const isPast    = i < cur;
          const isFuture  = i > cur;
          const col = HL[step.hl] ?? '#3b82f6';
          const visitNum = stepVisit[i] ?? 1;
          const totalForThisLine = totalVisits[step.line] ?? 1;
          const isRepeatLine = totalForThisLine > 1;

          // Result summary
          const prevOut = i > 0 ? steps[i-1].output.length : 0;
          const newOutput = step.output.slice(prevOut);
          const currVars  = step.frames.flatMap(f => f.vars);
          const newVars   = currVars.filter(v => v.isNew);
          const mutVars   = currVars.filter(v => v.isMut);
          const retFrame  = step.frames.find(f => f.retVal);
          let result = '';
          if (newOutput.length) result = `"${newOutput[0].slice(0,14)}${newOutput[0].length>14?'…':''}"`;
          else if (newVars.length) result = newVars.map(v=>`${v.name}=${v.value}`).join(', ');
          else if (mutVars.length) result = mutVars.map(v=>`${v.name}→${v.value}`).join(', ');
          else if (retFrame) result = `→ ${retFrame.retVal}`;

          return (
            <div
              key={`${step.id}-${i}`}
              data-active={isCurrent}
              onClick={() => useStore.getState().jump(i)}
              style={{
                display: 'grid', gridTemplateColumns: '26px 72px 1fr 80px 38px',
                alignItems: 'center', padding: '5px 12px',
                background: isCurrent ? `${col}18` : 'transparent',
                borderLeft: `3px solid ${isCurrent ? col : 'transparent'}`,
                opacity: isFuture ? 0.18 : 1,
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,.025)',
                transition: 'all .15s ease',
              }}
              onMouseEnter={e => { if (!isCurrent)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isCurrent?`${col}18`:'transparent'; }}
            >
              {/* Step # */}
              <div style={{ fontSize:9, fontFamily:"'JetBrains Mono'",
                color: isCurrent?col:'#334155', fontWeight: isCurrent?800:400 }}>
                {isCurrent ? '▶' : String(i+1).padStart(2,'0')}
              </div>

              {/* Line chip + visit badge */}
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                <span style={{
                  background: isCurrent?`${col}28`:isPast?'rgba(255,255,255,.05)':'transparent',
                  border: `1px solid ${isCurrent?col+'55':isPast?'rgba(255,255,255,.08)':'transparent'}`,
                  borderRadius:4, padding:'1px 5px', fontSize:9,
                  fontFamily:"'JetBrains Mono'",
                  color: isCurrent?col:isPast?'#475569':'#334155',
                  fontWeight: isCurrent?800:400, flexShrink:0,
                }}>L{step.line}</span>

                {/* Visit counter — the KEY insight */}
                {isRepeatLine && (
                  <span style={{
                    background: isCurrent?`rgba(168,85,247,.2)`:'rgba(168,85,247,.07)',
                    border: `1px solid ${isCurrent?'rgba(168,85,247,.5)':'rgba(168,85,247,.15)'}`,
                    borderRadius:3, padding:'1px 4px', fontSize:8,
                    fontFamily:"'JetBrains Mono'",
                    color: isCurrent?'#a855f7':'#475569',
                    fontWeight:800, flexShrink:0,
                    title:`This line executes ${totalForThisLine}× total`,
                  }}>
                    {visitNum}/{totalForThisLine}
                  </span>
                )}
              </div>

              {/* Type icon + code */}
              <div style={{ display:'flex', alignItems:'center', gap:5, minWidth:0 }}>
                <span style={{ fontSize:11, flexShrink:0 }}>{TYPE_ICONS[step.type]??'●'}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{
                    fontSize:11, fontFamily:"'JetBrains Mono'",
                    color: isCurrent?'#e2e8f0':isPast?'#475569':'#334155',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    fontWeight: isCurrent?600:400,
                  }}>
                    {step.code.length>34 ? step.code.slice(0,34)+'…' : step.code}
                  </div>
                  {isCurrent && (
                    <div style={{ fontSize:8, color:col, fontFamily:"'JetBrains Mono'",
                      textTransform:'uppercase', letterSpacing:.5, marginTop:1,
                      display:'flex', alignItems:'center', gap:4 }}>
                      <span>{step.type.replace(/_/g,' ')}</span>
                      {isRepeatLine && (
                        <span style={{ color:'#a855f7' }}>
                          · visit {visitNum} of {totalForThisLine}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              <div style={{
                fontSize:10, fontFamily:"'JetBrains Mono'", textAlign:'right',
                color: newOutput.length?'#10b981':result.startsWith('→')?'#a855f7':'#f59e0b',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                fontWeight: result?700:400,
              }}>{result||'—'}</div>

              {/* Ops */}
              <div style={{ fontSize:9, fontFamily:"'JetBrains Mono'",
                color: isCurrent?col:'#1e293b', textAlign:'right' }}>
                {step.ops}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Next line preview ── */}
      {next && (
        <div style={{ padding:'7px 12px', borderTop:'1px solid rgba(255,255,255,.05)',
          background:'rgba(255,255,255,.015)', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:8, color:'#334155', fontFamily:"'JetBrains Mono'",
            textTransform:'uppercase', letterSpacing:1, flexShrink:0 }}>NEXT ↓</span>
          <div style={{
            background:`${HL[next.hl]??'#3b82f6'}12`,
            border:`1px solid ${HL[next.hl]??'#3b82f6'}35`,
            borderRadius:5, padding:'3px 10px', fontSize:10,
            fontFamily:"'JetBrains Mono'", color:HL[next.hl]??'#3b82f6',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
          }}>
            {TYPE_ICONS[next.type]} L{next.line} · {next.code.slice(0,28)}{next.code.length>28?'…':''}
            {(totalVisits[next.line]??0) > 1 && (
              <span style={{ marginLeft:8, color:'#a855f7', fontSize:8, fontWeight:800 }}>
                visit {(stepVisit[cur+1]??1)}/{totalVisits[next.line]}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Done ── */}
      {cur === steps.length-1 && steps.length>0 && (
        <div style={{ padding:'7px 12px', borderTop:'1px solid rgba(16,185,129,.2)',
          background:'rgba(16,185,129,.07)', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}/>
          <span style={{ fontSize:10, color:'#10b981', fontFamily:"'JetBrains Mono'", fontWeight:700 }}>
            COMPLETE · {steps.length} steps · {uniqueLines} source lines
            {maxVisit>1 ? ` · max ${maxVisit}× repeats` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
