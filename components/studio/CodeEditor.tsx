"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState, useMemo, useCallback } from "react";
import { useStore } from "@/lib/store";
import { TEMPLATES, TEMPLATE_CATEGORIES, VERSION_LABELS, CppVersion, detectTrace } from "@/lib/templates";
import { PROGRAMS } from "@/lib/engine";

// Monaco C++ theme mappings for VS themes
const MONACO_THEMES: Record<string, string> = {
  'dark-plus':'vs-dark','github-dark':'vs-dark','dracula':'vs-dark',
  'one-dark':'vs-dark','night-owl':'vs-dark','nord':'vs-dark',
  'tokyo-night':'vs-dark','monokai':'vs-dark','ayu-dark':'vs-dark',
  'solarized-dark':'vs-dark','material':'vs-dark',
  'github-light':'vs','solarized-light':'vs','quiet-light':'vs',
  'ayu-light':'vs','high-contrast':'hc-black',
};

const CAT_COLORS: Record<string, string> = {
  'Basics':'#10b981','Recursion':'#a855f7','Algorithms':'#3b82f6',
  'Data Structures':'#f97316','Memory':'#ec4899',
  'C++14':'#f59e0b','C++17':'#06b6d4','C++20':'#8b5cf6','C++23':'#ef4444',
};

const VERSION_COLORS: Record<CppVersion, string> = {
  cpp11:'#64748b', cpp14:'#f59e0b', cpp17:'#06b6d4', cpp20:'#8b5cf6', cpp23:'#ef4444',
};

export default function CodeEditor() {
  const { code, steps, cur, theme, loadProgram, setCode } = useStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Basics');
  const [cppVersion, setCppVersion] = useState<CppVersion>('cpp11');
  const [searchQuery, setSearchQuery] = useState('');
  const [traceHint, setTraceHint] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const step = steps[cur];
  const monacoTheme = MONACO_THEMES[theme.id] ?? 'vs-dark';

  // Compute heat data for gutter decorations
  const { lineVisits, maxVisit } = useMemo(() => {
    const v: Record<number, number> = {};
    for (const s of steps) v[s.line] = (v[s.line] ?? 0) + 1;
    return { lineVisits: v, maxVisit: Math.max(1, ...Object.values(v)) };
  }, [steps]);

  // Monaco mount handler — add C++ config + decorations
  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // C++ language config
    monaco.languages.setLanguageConfiguration('cpp', {
      comments: { lineComment: '//', blockComment: ['/*', '*/'] },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: [
        { open: '{', close: '}' }, { open: '[', close: ']' },
        { open: '(', close: ')' }, { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' }, { open: '[', close: ']' },
        { open: '(', close: ')' }, { open: '"', close: '"' },
      ],
    });

    // Extra C++ snippets
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          { label:'cout', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'cout << ${1:value} << endl;', insertTextRules:4,
            documentation:'Print to console' },
          { label:'cin', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'cin >> ${1:var};', insertTextRules:4 },
          { label:'for', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3:// body}\n}',
            insertTextRules:4, documentation:'For loop' },
          { label:'while', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'while (${1:condition}) {\n\t${2:// body}\n}', insertTextRules:4 },
          { label:'if', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'if (${1:condition}) {\n\t${2:// body}\n}', insertTextRules:4 },
          { label:'func', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'${1:int} ${2:name}(${3:params}) {\n\t${4:// body}\n\treturn ${5:0};\n}',
            insertTextRules:4, documentation:'Function template' },
          { label:'class', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'class ${1:Name} {\npublic:\n\t${2:// members}\n};', insertTextRules:4 },
          { label:'vector', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'vector<${1:int}> ${2:v};', insertTextRules:4 },
          { label:'map', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'map<${1:string}, ${2:int}> ${3:m};', insertTextRules:4 },
          { label:'unique_ptr', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'auto ${1:p} = make_unique<${2:Type}>(${3:args});', insertTextRules:4 },
          { label:'main', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'int main() {\n\t${1:// code}\n\treturn 0;\n}', insertTextRules:4 },
          { label:'include', kind:monaco.languages.CompletionItemKind.Snippet,
            insertText:'#include <${1:iostream}>', insertTextRules:4 },
        ];
        return { suggestions: suggestions as any };
      },
    });

    // Key binding: Ctrl+Enter to run analysis
    editor.addAction({
      id: 'run-analysis', label: 'Run Simulation',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleRunAnalysis(editor.getValue()),
    });
  }, [theme]);

  // Code change handler
  const handleCodeChange = useCallback((val: string | undefined) => {
    if (!val) return;
    setCode(val);
    const traced = detectTrace(val);
    setTraceHint(traced);
  }, [setCode]);

  // Run analysis — detect + load matching trace or show message
  const handleRunAnalysis = useCallback((val?: string) => {
    const currentCode = val ?? editorRef.current?.getValue() ?? code;
    const key = detectTrace(currentCode);
    if (key && PROGRAMS[key]) {
      loadProgram(key);
      setTraceHint(null);
    } else {
      setTraceHint('custom');
    }
  }, [code, loadProgram]);

  // Load a template
  const handleLoadTemplate = (template: typeof TEMPLATES[0]) => {
    editorRef.current?.setValue(template.code);
    setCode(template.code);
    setCppVersion(template.version);
    setShowTemplates(false);
    if (template.traceKey && PROGRAMS[template.traceKey]) {
      loadProgram(template.traceKey);
    }
    const traced = detectTrace(template.code);
    setTraceHint(traced && traced !== template.traceKey ? traced : null);
  };

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchCat = t.category === activeCategory;
    const matchSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const T = theme;
  const activeLine = step?.line ?? -1;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── Editor Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
        background: T.uiPanelHd, borderBottom: `1px solid ${T.uiBorder}`, flexShrink: 0, flexWrap: 'wrap' }}>

        {/* C++ Version selector */}
        <select
          value={cppVersion}
          onChange={e => setCppVersion(e.target.value as CppVersion)}
          style={{
            background: `${VERSION_COLORS[cppVersion]}15`,
            border: `1px solid ${VERSION_COLORS[cppVersion]}50`,
            color: VERSION_COLORS[cppVersion], borderRadius: 6,
            padding: '3px 8px', fontSize: 10, fontFamily: "'JetBrains Mono'",
            fontWeight: 800, cursor: 'pointer', outline: 'none',
          }}>
          {(Object.entries(VERSION_LABELS) as [CppVersion, string][]).map(([k, v]) => (
            <option key={k} value={k} style={{ background: '#0f172a', color: '#e2e8f0' }}>{v}</option>
          ))}
        </select>

        <div style={{ width: 1, height: 18, background: T.uiBorder }} />

        {/* Templates button */}
        <button onClick={() => setShowTemplates(s => !s)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 6,
          border: `1px solid ${showTemplates ? '#06b6d4' : T.uiBorder}`,
          background: showTemplates ? 'rgba(6,182,212,.15)' : T.uiSurface,
          color: showTemplates ? '#06b6d4' : T.uiTextMuted,
          cursor: 'pointer', fontSize: 10, fontFamily: "'JetBrains Mono'",
          transition: 'all .15s',
        }}>
          📂 Templates ({TEMPLATES.length})
        </button>

        {/* Trace hint */}
        {traceHint && traceHint !== 'custom' && PROGRAMS[traceHint] && (
          <button onClick={() => handleRunAnalysis()} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 6,
            border: '1px solid rgba(16,185,129,.4)',
            background: 'rgba(16,185,129,.12)',
            color: '#10b981', cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            animation: 'pulse-node .8s ease-in-out infinite',
          }}>
            ✅ Load simulation trace →
          </button>
        )}

        {traceHint === 'custom' && (
          <span style={{ fontSize: 9, color: '#f59e0b', fontFamily: "'JetBrains Mono'",
            background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)',
            borderRadius: 4, padding: '2px 8px' }}>
            ⚠ Custom code — simulation available for known patterns
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          {/* Heat legend */}
          {Object.keys(lineVisits).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8,
              fontFamily: "'JetBrains Mono'", color: T.uiTextMuted }}>
              <span>cool</span>
              {['#3b82f6','#f59e0b','#ef4444'].map((c,i)=>(
                <div key={i} style={{ width:12, height:5, borderRadius:2, background:c }}/>
              ))}
              <span>hot</span>
            </div>
          )}

          {/* Paste from clipboard */}
          <button title="Paste from clipboard" onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              if (text && editorRef.current) { editorRef.current.setValue(text); setCode(text); }
            } catch { alert('Allow clipboard access to paste.'); }
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s',
          }}>📋 Paste</button>

          {/* Copy code */}
          <button title="Copy all code" onClick={() => {
            const val = editorRef.current?.getValue() ?? code;
            navigator.clipboard.writeText(val);
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s',
          }}>⎘ Copy</button>

          {/* Format */}
          <button title="Format code (Shift+Alt+F)" onClick={() => {
            editorRef.current?.getAction('editor.action.formatDocument')?.run();
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s',
          }}>✦ Format</button>

          {/* Clear */}
          <button title="Clear editor" onClick={() => {
            editorRef.current?.setValue('');
            setCode('');
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid rgba(239,68,68,.25)`,
            background: 'rgba(239,68,68,.06)', color: '#ef4444', cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s',
          }}>✕ Clear</button>

          {/* Godbolt */}
          <a
            href={`https://godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1iN`}
            target="_blank" rel="noopener noreferrer"
            title="Open in Compiler Explorer (godbolt.org)"
            style={{
              padding: '3px 9px', borderRadius: 6, border: '1px solid rgba(245,158,11,.3)',
              background: 'rgba(245,158,11,.08)', color: '#f59e0b', cursor: 'pointer',
              fontSize: 10, fontFamily: "'JetBrains Mono'", textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>🔗 Godbolt</a>

          <div style={{ width: 1, height: 16, background: T.uiBorder }} />

          {/* Ctrl+Enter hint */}
          <span style={{ fontSize: 8, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>
            Ctrl+↵
          </span>

          {/* Run button */}
          <button onClick={() => handleRunAnalysis()} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 14px', borderRadius: 7,
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            border: 'none', color: '#fff', cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            boxShadow: '0 0 14px rgba(168,85,247,.4)',
            transition: 'all .15s',
          }}>▶ Simulate</button>
        </div>
      </div>

      {/* ── Template Library Panel ── */}
      {showTemplates && (
        <div style={{
          position: 'absolute', top: 44, left: 0, right: 0, zIndex: 100,
          background: T.uiSurface, borderBottom: `1px solid ${T.uiBorder}`,
          boxShadow: '0 20px 60px rgba(0,0,0,.8)', maxHeight: 420, display: 'flex', flexDirection: 'column',
        }}>
          {/* Search + header */}
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${T.uiBorder}`,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.uiText }}>
              📂 C++ Template Library
            </span>
            <input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
                borderRadius: 6, padding: '4px 10px', color: T.uiText,
                fontSize: 11, fontFamily: "'JetBrains Mono'", outline: 'none',
              }}
            />
            <button onClick={() => setShowTemplates(false)} style={{
              background: 'transparent', border: 'none', color: T.uiTextMuted,
              cursor: 'pointer', fontSize: 16, padding: '0 4px',
            }}>✕</button>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Category sidebar */}
            <div style={{ width: 130, flexShrink: 0, borderRight: `1px solid ${T.uiBorder}`,
              overflow: 'auto', padding: '6px 0' }}>
              {TEMPLATE_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  width: '100%', padding: '7px 12px', textAlign: 'left',
                  background: activeCategory === cat ? `${CAT_COLORS[cat] ?? '#3b82f6'}15` : 'transparent',
                  border: 'none', borderLeft: `3px solid ${activeCategory === cat ? (CAT_COLORS[cat] ?? '#3b82f6') : 'transparent'}`,
                  color: activeCategory === cat ? (CAT_COLORS[cat] ?? '#3b82f6') : T.uiTextMuted,
                  cursor: 'pointer', fontSize: 11, fontFamily: "'JetBrains Mono'",
                  fontWeight: activeCategory === cat ? 800 : 400, transition: 'all .12s',
                }}>
                  {cat}
                  <div style={{ fontSize: 8, opacity: .6 }}>
                    {TEMPLATES.filter(t => t.category === cat).length} templates
                  </div>
                </button>
              ))}
            </div>

            {/* Template cards */}
            <div style={{ flex: 1, overflow: 'auto', padding: 10,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, alignContent: 'start' }}>
              {filteredTemplates.map(tpl => (
                <button key={tpl.id} onClick={() => handleLoadTemplate(tpl)} style={{
                  padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                  background: T.editorBg,
                  border: `1px solid ${tpl.traceKey ? 'rgba(16,185,129,.3)' : T.uiBorder}`,
                  cursor: 'pointer', transition: 'all .15s', color: T.uiText,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${CAT_COLORS[tpl.category] ?? '#3b82f6'}`; (e.currentTarget as HTMLElement).style.background = `${CAT_COLORS[tpl.category] ?? '#3b82f6'}0a`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${tpl.traceKey ? 'rgba(16,185,129,.3)' : T.uiBorder}`; (e.currentTarget as HTMLElement).style.background = T.editorBg; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{tpl.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.uiText }}>{tpl.title}</div>
                      <div style={{ fontSize: 8, color: VERSION_COLORS[tpl.version],
                        fontFamily: "'JetBrains Mono'", fontWeight: 800 }}>
                        {VERSION_LABELS[tpl.version]}
                        {tpl.traceKey && <span style={{ marginLeft: 4, color: '#10b981' }}>· ✅ traced</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: T.uiTextMuted, lineHeight: 1.5 }}>
                    {tpl.description}
                  </div>
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30,
                  color: T.uiTextMuted, fontSize: 11, fontFamily: "'JetBrains Mono'" }}>
                  No templates match "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Monaco Editor ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Editor
          language="cpp"
          value={code}
          onChange={handleCodeChange}
          onMount={onMount}
          theme={monacoTheme}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'off',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'advanced',
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'smart',
            tabSize: 4,
            insertSpaces: true,
            bracketPairColorization: { enabled: true },
            renderWhitespace: 'selection',
            padding: { top: 10, bottom: 10 },
            glyphMargin: true,  // for heat decorations
            // Highlight current active execution line
            ...(activeLine > 0 ? {} : {}),
          }}
        />

        {/* Active line glow overlay — positioned over editor */}
        {activeLine > 0 && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none', overflow: 'hidden',
          }}>
            {/* We can't easily overlay without Monaco line height — show a status strip instead */}
          </div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '3px 12px',
        background: step ? `${['#3b82f6','#10b981','#f59e0b','#a855f7','#f97316','#ef4444','#06b6d4','#ec4899'][cur % 8]}20` : T.uiPanelHd,
        borderTop: `1px solid ${T.uiBorder}`, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>
          {cppVersion.toUpperCase()} · {code.split('\n').length} lines
        </span>
        {step && (
          <>
            <div style={{ width: 1, height: 12, background: T.uiBorder }} />
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'",
              color: ['#3b82f6','#10b981','#f59e0b','#a855f7','#f97316'][cur % 5] }}>
              ▶ Line {step.line} · {step.type}
            </span>
            <span style={{ fontSize: 9, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>
              Step {cur + 1}/{steps.length}
            </span>
          </>
        )}
        {/* Heat summary */}
        {Object.keys(lineVisits).length > 0 && (
          <>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {Object.entries(lineVisits)
                .filter(([,v]) => v > 1)
                .sort((a,b) => b[1]-a[1])
                .slice(0,4)
                .map(([ln, v]) => {
                  const pct = v / maxVisit;
                  const col = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f97316' : '#f59e0b';
                  return (
                    <span key={ln} style={{ fontSize: 8, fontFamily: "'JetBrains Mono'",
                      color: col, fontWeight: 800 }}>
                      L{ln}:{v}×
                    </span>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
