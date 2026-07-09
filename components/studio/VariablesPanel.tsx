"use client";
import { useStore } from "@/lib/store";
import { useMemo } from "react";

const TYPE_COLS: Record<string, string> = {
  int:'#3b82f6', float:'#06b6d4', double:'#06b6d4', char:'#f59e0b',
  bool:'#10b981', string:'#a855f7', 'int[]':'#f97316',
  'Node*':'#f97316', 'unique_ptr<Resource>':'#ec4899',
};

function MiniSparkline({ values, color, width=80, height=24 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) {
    return (
      <div style={{ width, height, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 6px ${color}` }}/>
      </div>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={width} height={height} style={{ overflow:'visible' }}>
      {/* Area fill */}
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline
        points={[...pts, `${(width-pad).toFixed(1)},${(height-pad).toFixed(1)}`, `${pad},${(height-pad).toFixed(1)}`].join(' ')}
        fill={`url(#g${color.replace('#','')})`} stroke="none"
      />
      {/* Line */}
      <polyline points={pts.join(' ')}
        fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round"/>
      {/* Current dot */}
      <circle cx={pts[pts.length-1].split(',')[0]} cy={pts[pts.length-1].split(',')[1]}
        r="2.5" fill={color} style={{ filter:`drop-shadow(0 0 3px ${color})` }}/>
    </svg>
  );
}

export default function VariablesPanel() {
  const { steps, cur, theme } = useStore();
  const T = theme;

  // ── Collect variable history across all steps up to cur ──────────────
  const { varMap } = useMemo(() => {
    const map: Record<string, {
      name: string; type: string; scope: string;
      history: Array<{ value: string; stepIdx: number; isNew: boolean; isMut: boolean }>;
      numericHistory: number[];
    }> = {};

    steps.slice(0, cur + 1).forEach((step, si) => {
      step.frames.forEach(frame => {
        frame.vars.forEach(v => {
          if (!map[v.id]) {
            map[v.id] = { name:v.name, type:v.type, scope:frame.fn, history:[], numericHistory:[] };
          }
          const entry = { value:v.value, stepIdx:si, isNew:!!v.isNew, isMut:!!v.isMut };
          const last = map[v.id].history[map[v.id].history.length - 1];
          if (!last || last.value !== v.value) {
            map[v.id].history.push(entry);
          }
          const num = parseFloat(v.value);
          if (!isNaN(num)) map[v.id].numericHistory.push(num);
        });
      });
    });

    return { varMap: map };
  }, [steps, cur]);

  const currentStep = steps[cur];
  const currentVarIds = new Set(currentStep?.frames.flatMap(f => f.vars.map(v => v.id)) ?? []);
  const allVarIds = Object.keys(varMap);

  if (allVarIds.length === 0) {
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div className="panel-hd"><div className="orb orb-yellow"/><span>Variables</span></div>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column', gap:10, color:'#1e293b', fontFamily:"'JetBrains Mono'" }}>
          <span style={{ fontSize:24 }}>📦</span>
          <span style={{ fontSize:11 }}>No variables yet</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div className="panel-hd" style={{ background:T.uiPanelHd, borderBottom:`1px solid ${T.uiBorder}` }}>
        <div className="orb orb-yellow"/>
        <span style={{ color:T.uiText }}>Variables</span>
        <span style={{ marginLeft:'auto', color:T.uiTextMuted, fontSize:9, fontFamily:"'JetBrains Mono'" }}>
          {allVarIds.length} vars tracked
        </span>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'6px 0' }}>
        {allVarIds.map(vid => {
          const info = varMap[vid];
          const isActive = currentVarIds.has(vid);
          const lastEntry = info.history[info.history.length - 1];
          const isNew = lastEntry?.isNew;
          const isMut = lastEntry?.isMut;
          const col = TYPE_COLS[info.type] ?? '#64748b';
          const mutCount = info.history.filter(h => h.isMut).length;

          return (
            <div key={vid} style={{
              padding:'8px 12px',
              borderBottom:`1px solid ${T.uiBorder}`,
              background: isNew ? `${col}10` : isMut ? `${col}08` : 'transparent',
              borderLeft:`3px solid ${isNew||isMut ? col : 'transparent'}`,
              opacity: isActive ? 1 : 0.4,
              transition:'all .2s',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                {/* Type dot */}
                <div style={{ width:8, height:8, borderRadius:'50%', background:col,
                  boxShadow: isActive?`0 0 6px ${col}`:'none', flexShrink:0 }}/>

                {/* Name */}
                <span style={{ fontSize:12, fontWeight:700, color:T.uiText,
                  fontFamily:"'JetBrains Mono'" }}>{info.name}</span>

                {/* Type */}
                <span style={{ fontSize:9, color:col, fontFamily:"'JetBrains Mono'",
                  background:`${col}15`, border:`1px solid ${col}30`,
                  borderRadius:3, padding:'1px 5px' }}>{info.type}</span>

                {/* Mutation counter */}
                {mutCount > 0 && (
                  <span style={{ fontSize:8, color:'#a855f7', fontFamily:"'JetBrains Mono'",
                    fontWeight:800, marginLeft:'auto' }}>
                    ✏️ {mutCount}×
                  </span>
                )}

                {/* Status badge */}
                {isNew && <span style={{ fontSize:8, color:'#10b981', fontWeight:800,
                  fontFamily:"'JetBrains Mono'", background:'rgba(16,185,129,.12)',
                  border:'1px solid rgba(16,185,129,.3)', borderRadius:3, padding:'1px 5px' }}>NEW</span>}
                {isMut && !isNew && <span style={{ fontSize:8, color:col, fontWeight:800,
                  fontFamily:"'JetBrains Mono'", background:`${col}12`,
                  border:`1px solid ${col}30`, borderRadius:3, padding:'1px 5px' }}>CHANGED</span>}
              </div>

              {/* Current value + sparkline row */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {/* Current value */}
                <div style={{
                  flex:1, padding:'5px 8px',
                  background:`${col}12`, border:`1px solid ${col}25`,
                  borderRadius:6, fontFamily:"'JetBrains Mono'", fontSize:12,
                  color: isNew||isMut ? col : T.uiText,
                  fontWeight: isNew||isMut ? 800 : 400,
                  textShadow: isNew||isMut ? `0 0 10px ${col}50` : 'none',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  transition:'all .2s',
                }}>
                  {lastEntry?.value ?? '—'}
                </div>

                {/* Sparkline (only for numeric) */}
                {info.numericHistory.length >= 2 && (
                  <div style={{ flexShrink:0 }}>
                    <MiniSparkline values={info.numericHistory} color={col} width={72} height={22}/>
                  </div>
                )}

                {/* Scope */}
                <span style={{ fontSize:8, color:T.uiTextMuted, fontFamily:"'JetBrains Mono'",
                  flexShrink:0 }}>{info.scope}</span>
              </div>

              {/* Value history trail (last 5 changes) */}
              {info.history.length > 1 && (
                <div style={{ display:'flex', gap:4, marginTop:5, alignItems:'center', flexWrap:'wrap' }}>
                  <span style={{ fontSize:8, color:T.uiTextMuted, fontFamily:"'JetBrains Mono'" }}>history:</span>
                  {info.history.slice(-5).map((h, i, arr) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:3 }}>
                      {i > 0 && <span style={{ fontSize:8, color:T.uiTextMuted }}>→</span>}
                      <span style={{
                        fontSize:9, fontFamily:"'JetBrains Mono'",
                        color: i===arr.length-1 ? col : T.uiTextMuted,
                        fontWeight: i===arr.length-1 ? 700 : 400,
                        background: i===arr.length-1 ? `${col}12` : 'transparent',
                        borderRadius:3, padding:'0 3px',
                      }}>{h.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
