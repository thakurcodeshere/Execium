"use client";
import { useStore } from "@/lib/store";
import { useMemo, useRef } from "react";

// Heat color for a cell
function cellColor(isExecuted: boolean, isCurrent: boolean, stepHl: string, visitCount: number, maxVisit: number): string {
  if (isCurrent) return stepHl;
  if (!isExecuted) return 'transparent';
  const intensity = visitCount / maxVisit;
  if (intensity < 0.3) return '#3b82f6';
  if (intensity < 0.6) return '#f59e0b';
  return '#ef4444';
}

const HL: Record<string, string> = {
  blue:'#3b82f6',green:'#10b981',yellow:'#f59e0b',purple:'#a855f7',
  orange:'#f97316',red:'#ef4444',cyan:'#06b6d4',pink:'#ec4899',
};

export default function ExecutionWaterfall() {
  const { steps, cur, code } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Build the grid data ───────────────────────────────────────────────
  const { sourceLines, grid, lineVisits, maxVisit, lineLabels } = useMemo(() => {
    // Unique source lines in order of first appearance
    const lineSet = new Set<number>();
    for (const s of steps) lineSet.add(s.line);
    const srcLines = Array.from(lineSet).sort((a, b) => a - b);

    // Code line content for labels
    const codeLines = code.split('\n');
    const labels: Record<number, string> = {};
    for (const ln of srcLines) {
      const raw = codeLines[ln - 1]?.trim() ?? '';
      labels[ln] = raw.length > 22 ? raw.slice(0, 22) + '…' : raw;
    }

    // line visit total
    const visits: Record<number, number> = {};
    for (const s of steps) visits[s.line] = (visits[s.line] ?? 0) + 1;
    const maxV = Math.max(1, ...Object.values(visits));

    // Grid: grid[lineIndex][stepIndex] = color | null
    // Each cell = (line, step): was line executed at this step?
    const g: Array<Array<{ col: string; active: boolean; stepIdx: number } | null>> =
      srcLines.map(() => steps.map(() => null));

    steps.forEach((step, si) => {
      const li = srcLines.indexOf(step.line);
      if (li >= 0) {
        const col = HL[step.hl] ?? '#3b82f6';
        g[li][si] = { col, active: si === cur, stepIdx: si };
      }
    });

    return { sourceLines: srcLines, grid: g, lineVisits: visits, maxVisit: maxV, lineLabels: labels };
  }, [steps, cur, code]);

  const CELL = 10; // cell size in px
  const GAP  = 1;
  const totalW = steps.length * (CELL + GAP);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div className="panel-hd">
        <div className="orb orb-purple"/>
        <span>Execution Waterfall</span>
        <span style={{ marginLeft:'auto', color:'#334155', fontSize:9, fontFamily:"'JetBrains Mono'" }}>
          {sourceLines.length} src lines × {steps.length} steps
        </span>
      </div>

      {/* Legend */}
      <div style={{ padding:'5px 12px', borderBottom:'1px solid rgba(255,255,255,.05)',
        display:'flex', alignItems:'center', gap:12, fontSize:8,
        fontFamily:"'JetBrains Mono'", color:'#334155' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:10, height:10, borderRadius:2, background:'#3b82f6', opacity:.7 }}/>
          <span>executed once</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:10, height:10, borderRadius:2, background:'#f59e0b' }}/>
          <span>moderate freq</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:10, height:10, borderRadius:2, background:'#ef4444' }}/>
          <span>high freq (loop/recursion)</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:10, height:10, borderRadius:2, border:'1px solid #a855f7', background:'rgba(168,85,247,.3)' }}/>
          <span>current step</span>
        </div>
        <div style={{ marginLeft:'auto', color:'#1e293b' }}>
          Each column = 1 execution step · Each row = 1 source line
        </div>
      </div>

      {/* Grid area */}
      <div style={{ flex:1, overflow:'auto', padding:'8px' }}>
        {sourceLines.length === 0 ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            height:'100%', flexDirection:'column', gap:10,
            color:'#1e293b', fontFamily:"'JetBrains Mono'" }}>
            <div style={{ fontSize:28 }}>⬜</div>
            <div style={{ fontSize:11 }}>Run the program to see the execution waterfall</div>
            <div style={{ fontSize:9, color:'#0f172a', textAlign:'center', lineHeight:1.6, maxWidth:260 }}>
              The waterfall shows every line's execution pattern over time.<br/>
              Loops create repeating column patterns. Recursion creates cascades.
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', gap:0 }}>
            {/* Row labels */}
            <div style={{ flexShrink:0, display:'flex', flexDirection:'column', gap:GAP, paddingTop:20, marginRight:8 }}>
              {sourceLines.map(ln => {
                const visits = lineVisits[ln] ?? 0;
                const intensity = visits / maxVisit;
                const heatCol = intensity < 0.3 ? '#3b82f6' : intensity < 0.6 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={ln} style={{ height:CELL, display:'flex', alignItems:'center', gap:5 }}>
                    {/* Heat bar */}
                    <div style={{
                      width: Math.max(2, intensity * 20), height:CELL, borderRadius:1,
                      background: visits > 0 ? heatCol : '#1e293b',
                      transition:'width .3s', flexShrink:0,
                    }}/>
                    {/* Line number */}
                    <span style={{ fontSize:8, fontFamily:"'JetBrains Mono'", color: visits>0?heatCol:'#1e293b',
                      width:20, textAlign:'right', flexShrink:0, fontWeight: visits>0?800:400 }}>
                      L{ln}
                    </span>
                    {/* Visit count */}
                    {visits > 1 && (
                      <span style={{ fontSize:7, color:'#a855f7', fontFamily:"'JetBrains Mono'", fontWeight:800, flexShrink:0 }}>
                        ×{visits}
                      </span>
                    )}
                    {/* Code snippet */}
                    <span style={{ fontSize:7.5, color:'#1e293b', fontFamily:"'JetBrains Mono'",
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      maxWidth:120 }}>
                      {lineLabels[ln]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Waterfall grid */}
            <div style={{ overflow:'auto' }} ref={scrollRef}>
              {/* Step number ruler */}
              <div style={{ display:'flex', gap:GAP, marginBottom:4, paddingLeft:0 }}>
                {steps.map((_, si) => (
                  <div key={si} style={{
                    width:CELL, flexShrink:0, fontSize:6, fontFamily:"'JetBrains Mono'",
                    color: si===cur?'#a855f7':si%5===0?'#334155':'#1e293b',
                    textAlign:'center', fontWeight: si===cur?800:400,
                    transform: si%5===0?'none':'none',
                  }}>
                    {si%5===0 || si===cur ? si+1 : ''}
                  </div>
                ))}
              </div>

              {/* Grid rows */}
              {sourceLines.map((ln, li) => (
                <div key={ln} style={{ display:'flex', gap:GAP, marginBottom:GAP }}>
                  {steps.map((step, si) => {
                    const cell = grid[li][si];
                    const isHere = !!cell;
                    const isCur  = si === cur;
                    const isExecLine = step.line === ln;

                    if (!isExecLine) {
                      // Empty cell — but show a faint "time axis" line
                      return (
                        <div key={si} style={{
                          width:CELL, height:CELL, borderRadius:1, flexShrink:0,
                          background: si===cur ? 'rgba(168,85,247,.08)' : 'rgba(255,255,255,.02)',
                          borderLeft: si===cur ? '1px solid rgba(168,85,247,.2)' : 'none',
                          transition:'background .2s',
                        }}/>
                      );
                    }

                    // Executed cell
                    const visits = lineVisits[ln] ?? 1;
                    const intensity = visits / maxVisit;
                    const col = cell?.col ?? '#3b82f6';
                    return (
                      <div
                        key={si}
                        title={`Step ${si+1}: Line ${ln} executed`}
                        onClick={() => useStore.getState().jump(si)}
                        style={{
                          width:CELL, height:CELL, borderRadius:2, flexShrink:0,
                          background: isCur
                            ? col
                            : intensity < 0.3 ? 'rgba(59,130,246,.5)'
                            : intensity < 0.6 ? 'rgba(245,158,11,.6)'
                            : 'rgba(239,68,68,.7)',
                          boxShadow: isCur
                            ? `0 0 8px ${col}, 0 0 14px ${col}60`
                            : intensity > 0.6 ? `0 0 4px rgba(239,68,68,.3)` : 'none',
                          border: isCur ? `1px solid ${col}` : '1px solid rgba(255,255,255,.1)',
                          cursor:'pointer',
                          transform: isCur ? 'scale(1.3)' : 'scale(1)',
                          transition:'all .2s ease',
                          zIndex: isCur ? 10 : 1,
                          position:'relative',
                        }}
                      />
                    );
                  })}
                </div>
              ))}

              {/* Current step vertical indicator */}
              <div style={{ position:'relative', height:0 }}>
                <div style={{
                  position:'absolute',
                  left: cur * (CELL + GAP) + CELL/2,
                  bottom: 0,
                  width:1, height:sourceLines.length * (CELL + GAP) + 24,
                  background:'rgba(168,85,247,.3)',
                  top: -(sourceLines.length * (CELL + GAP) + 24),
                  pointerEvents:'none',
                  transition:'left .2s ease',
                }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      {steps.length > 0 && (
        <div style={{ padding:'6px 12px', borderTop:'1px solid rgba(255,255,255,.05)',
          background:'rgba(255,255,255,.015)', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span style={{ fontSize:9, color:'#334155', fontFamily:"'JetBrains Mono'" }}>
            ▶ Click any cell to jump to that execution step
          </span>
          {sourceLines.map(ln => {
            const v = lineVisits[ln] ?? 0;
            if (v <= 1) return null;
            const pct = v / maxVisit;
            return (
              <span key={ln} style={{
                fontSize:8, fontFamily:"'JetBrains Mono'",
                color: pct>0.6?'#ef4444':pct>0.3?'#f59e0b':'#3b82f6',
                fontWeight:800,
              }}>L{ln}:{v}×</span>
            );
          })}
        </div>
      )}
    </div>
  );
}
