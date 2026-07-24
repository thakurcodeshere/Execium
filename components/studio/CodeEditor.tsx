"use client";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useStore } from "@/lib/store";
import { VERSION_LABELS, CppVersion, detectTrace } from "@/lib/templates";
import { PROGRAMS } from "@/lib/engine";

import { Plus, X } from "lucide-react";

// Monaco C++ theme mappings
const MONACO_THEMES: Record<string, string> = {
  'dark-plus':'vs-dark','github-dark':'vs-dark','dracula':'vs-dark',
  'one-dark':'vs-dark','night-owl':'vs-dark','nord':'vs-dark',
  'tokyo-night':'vs-dark','monokai':'vs-dark','ayu-dark':'vs-dark',
  'solarized-dark':'vs-dark','material':'vs-dark',
  'github-light':'vs','solarized-light':'vs','quiet-light':'vs',
  'ayu-light':'vs','high-contrast':'hc-black',
};

const VERSION_COLORS: Record<CppVersion, string> = {
  cpp11:'#64748b', cpp14:'#f59e0b', cpp17:'#06b6d4', cpp20:'#8b5cf6', cpp23:'#ef4444',
};

export default function CodeEditor() {
  const { 
    code, steps, cur, theme, loadProgram, setCode, jump, restart,
    projectName, projectId, setProjectName, setProjectId,
    activeChallengeId, recordAttempt,
    tabs, activeTabId, switchTab, closeTab, createNewProjectTab
  } = useStore();
  const [cppVersion, setCppVersion] = useState<CppVersion>('cpp11');
  const [traceHint, setTraceHint] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  // Compile and share states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [compileState, setCompileState] = useState<'idle' | 'compiling' | 'success' | 'running'>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [submitState, setSubmitState] = useState<'idle' | 'running_tests' | 'success'>('idle');

  const step = steps[cur];
  const monacoTheme = MONACO_THEMES[theme.id] ?? 'vs-dark';

  // Load code from share URL parameter if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      if (urlCode) {
        const decoded = decodeURIComponent(escape(window.atob(urlCode)));
        if (decoded) {
          setCode(decoded);
          const key = detectTrace(decoded);
          if (key && PROGRAMS[key]) {
            loadProgram(key);
          }
        }
      }
    } catch {}
  }, [setCode, loadProgram]);

  // Compute heat data for gutter decorations
  const { lineVisits, maxVisit } = useMemo(() => {
    const v: Record<number, number> = {};
    for (const s of steps) v[s.line] = (v[s.line] ?? 0) + 1;
    return { lineVisits: v, maxVisit: Math.max(1, ...Object.values(v)) };
  }, [steps]);

  // Monaco mount handler
  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

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

    editor.addAction({
      id: 'run-analysis', label: 'Run Simulation',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleDebug(editor.getValue()),
    });
  }, [theme]);

  // Code change
  const handleCodeChange = useCallback((val: string | undefined) => {
    if (!val) return;
    setCode(val);
    const traced = detectTrace(val);
    setTraceHint(traced);
  }, [setCode]);

  // Actions
  const handleCompile = () => {
    if (activeChallengeId) recordAttempt(activeChallengeId);
    setCompileState('compiling');
    setTimeout(() => {
      setCompileState('success');
      setTimeout(() => setCompileState('idle'), 1800);
    }, 1000);
  };

  const handleRun = () => {
    if (activeChallengeId) recordAttempt(activeChallengeId);
    setCompileState('running');
    setTimeout(() => {
      setCompileState('idle');
      jump(steps.length - 1); // Run all the way to the end
    }, 1200);
  };

  const handleSaveProject = () => {
    setSaveStatus('saving');
    
    const currentCode = editorRef.current?.getValue() ?? code;
    let activeId = projectId;
    let activeName = projectName;

    if (!activeId) {
      const name = prompt("Name your project before saving:", "My Saved Project");
      if (!name || !name.trim()) {
        setSaveStatus('idle');
        return;
      }
      activeName = name.trim();
      activeId = Date.now().toString();
      
      setProjectName(activeName);
      setProjectId(activeId);
    }

    try {
      const projs = JSON.parse(localStorage.getItem("execium_projects") ?? "[]");
      const existingIdx = projs.findIndex((p: any) => p.id === activeId);

      const updatedProj = {
        id: activeId,
        name: activeName,
        code: currentCode,
        timestamp: new Date().toLocaleString()
      };

      if (existingIdx >= 0) {
        projs[existingIdx] = updatedProj;
      } else {
        projs.unshift(updatedProj);
      }

      localStorage.setItem("execium_projects", JSON.stringify(projs));
    } catch {}

    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }, 600);
  };

  const handleSubmitSolution = () => {
    if (!activeChallengeId) return;
    recordAttempt(activeChallengeId);
    setSubmitState('running_tests');
    
    setTimeout(() => {
      try {
        const solved = JSON.parse(localStorage.getItem("execium_solved_challenges") ?? "[]");
        if (!solved.includes(activeChallengeId)) {
          solved.push(activeChallengeId);
          localStorage.setItem("execium_solved_challenges", JSON.stringify(solved));
        }
      } catch {}

      setSubmitState('success');
      setTimeout(() => {
        setSubmitState('idle');
      }, 2000);
    }, 1800);
  };

  const handleDebug = (val?: string) => {
    if (activeChallengeId) recordAttempt(activeChallengeId);
    const currentCode = val ?? editorRef.current?.getValue() ?? code;
    const key = detectTrace(currentCode);
    if (key && PROGRAMS[key]) {
      loadProgram(key);
      setTraceHint(null);
    } else {
      setTraceHint('custom');
    }
    restart();
  };

  const handleShare = () => {
    try {
      const encoded = window.btoa(unescape(encodeURIComponent(code)));
      const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
      setShareUrl(url);
      setCopiedShare(false);
      setShowShareModal(true);
    } catch {}
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const T = theme;
  const activeLine = step?.line ?? -1;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── Editor Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
        background: T.uiPanelHd, borderBottom: `1px solid ${T.uiBorder}`, flexShrink: 0, flexWrap: 'wrap' }}>

        {/* C++ Version */}
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

        {/* ── MULTI-PROJECT / FILE WORKSPACE TABS BAR ── */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 5, overflowX: 'auto', 
          flex: 1, scrollbarWidth: 'none', padding: '2px 0'
        }}>
          {tabs.map((t) => {
            const isActive = t.id === activeTabId;
            const tabIcon = t.type === 'learn' ? '📚' : t.type === 'challenge' ? '🏆' : t.type === 'snippet' ? '⚡' : '📁';
            
            return (
              <div
                key={t.id}
                onClick={() => switchTab(t.id)}
                onDoubleClick={() => {
                  if (isActive) {
                    const newName = prompt("Rename Project / Tab:", t.title);
                    if (newName && newName.trim()) {
                      setProjectName(newName.trim());
                      if (projectId) {
                        try {
                          const projs = JSON.parse(localStorage.getItem("execium_projects") ?? "[]");
                          const updated = projs.map((p: any) => p.id === projectId ? { ...p, name: newName.trim() } : p);
                          localStorage.setItem("execium_projects", JSON.stringify(updated));
                        } catch {}
                      }
                    }
                  }
                }}
                title={t.title + (isActive ? " (Double click to rename)" : " (Click to switch tab)")}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '3px 8px 3px 10px', borderRadius: 6,
                  background: isActive ? `${T.uiAccent}22` : 'rgba(255,255,255,.03)',
                  border: `1px solid ${isActive ? T.uiAccent : T.uiBorder}`,
                  color: isActive ? T.uiAccent : T.uiTextMuted,
                  fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', userSelect: 'none',
                  flexShrink: 0, boxShadow: isActive ? `0 2px 8px ${T.uiAccent}20` : 'none'
                }}
              >
                <span style={{ fontSize: 11 }}>{tabIcon}</span>
                <span style={{ 
                  color: isActive ? T.uiText : T.uiTextMuted, 
                  maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                }}>
                  {t.title}
                </span>

                {/* Close Tab button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(t.id);
                  }}
                  title="Close Tab"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: T.uiTextMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 2, borderRadius: 4, transition: 'all 0.15s', marginLeft: 2
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.uiTextMuted; e.currentTarget.style.background = 'transparent'; }}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          {/* New Tab (+) Button */}
          <button
            onClick={() => createNewProjectTab()}
            title="Open New Empty Project Tab"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.uiBorder}`,
              color: T.uiTextMuted, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 700
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.uiAccent; e.currentTarget.style.borderColor = T.uiAccent; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.uiTextMuted; e.currentTarget.style.borderColor = T.uiBorder; }}
          >
            <Plus size={13} style={{ marginRight: 2 }} /> New Tab
          </button>
        </div>

        <div style={{ width: 1, height: 18, background: T.uiBorder, flexShrink: 0 }} />

        {/* Trace hint */}
        {traceHint && traceHint !== 'custom' && PROGRAMS[traceHint] && (
          <button onClick={() => handleDebug()} style={{
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
            ⚠ Custom code — simulation available for templates
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          
          {/* Paste */}
          <button title="Paste from clipboard" onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              if (text && editorRef.current) { editorRef.current.setValue(text); setCode(text); }
            } catch { alert('Allow clipboard access.'); }
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'"
          }}>📋 Paste</button>

          {/* Copy */}
          <button title="Copy all code" onClick={() => {
            const val = editorRef.current?.getValue() ?? code;
            navigator.clipboard.writeText(val);
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'"
          }}>⎘ Copy</button>

          {/* Format */}
          <button title="Format code" onClick={() => {
            editorRef.current?.getAction('editor.action.formatDocument')?.run();
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'"
          }}>✦ Format</button>

          {/* Clear */}
          <button title="Clear editor" onClick={() => {
            editorRef.current?.setValue('');
            setCode('');
          }} style={{
            padding: '3px 9px', borderRadius: 6, border: `1px solid rgba(239,68,68,.25)`,
            background: 'rgba(239,68,68,.06)', color: '#ef4444', cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'"
          }}>✕ Clear</button>

          <div style={{ width: 1, height: 16, background: T.uiBorder }} />

          {/* SAVE OPTION */}
          <button onClick={handleSaveProject} style={{
            padding: '4px 10px', borderRadius: 6, 
            border: `1px solid ${saveStatus === 'saved' ? '#10b981' : T.uiBorder}`,
            background: saveStatus === 'saved' ? 'rgba(16,185,129,.12)' : T.uiSurface, 
            color: saveStatus === 'saved' ? '#10b981' : T.uiText, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 700,
            transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span>{saveStatus === 'saved' ? '✓' : '💾'}</span>
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>

          {/* SHARE OPTION */}
          <button onClick={handleShare} style={{
            padding: '4px 10px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiText, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 700,
            transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span>🔗</span> Share
          </button>

          {/* COMPILE OPTION */}
          <button onClick={handleCompile} style={{
            padding: '4px 10px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s'
          }}>
            🛠 Compile
          </button>

          {/* RUN OPTION */}
          <button onClick={handleRun} style={{
            padding: '4px 10px', borderRadius: 6, border: `1px solid ${T.uiBorder}`,
            background: T.uiSurface, color: T.uiTextMuted, cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", transition: 'all .15s'
          }}>
            🚀 Run
          </button>

          {/* DEBUG OPTION */}
          <button onClick={() => handleDebug()} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 14px', borderRadius: 7,
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            border: 'none', color: '#fff', cursor: 'pointer',
            fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
            boxShadow: '0 0 14px rgba(168,85,247,.4)',
            transition: 'all .15s',
          }}>🐞 Debug</button>

          {/* SUBMIT SOLUTION FOR CODING CHALLENGES */}
          {activeChallengeId && (
            <button onClick={handleSubmitSolution} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 14px', borderRadius: 7,
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              border: 'none', color: '#fff', cursor: 'pointer',
              fontSize: 10, fontFamily: "'JetBrains Mono'", fontWeight: 800,
              boxShadow: '0 0 14px rgba(16,185,129,.4)',
              transition: 'all .15s',
            }}>
              <span>🏆</span> Submit
            </button>
          )}

        </div>
      </div>

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
            glyphMargin: true,
          }}
        />

        {/* ── COMPILE / RUN SCREEN OVERLAYS ── */}
        {compileState === 'compiling' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(4px)'
          }}>
            <div className="orb anim-pulse" style={{ background: '#a855f7', width: 40, height: 40, boxShadow: '0 0 20px #a855f7' }} />
            <div style={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: 13, marginTop: 16, fontWeight: 700 }}>
              g++ -std=c++23 main.cpp -o main
            </div>
            <div style={{ color: '#64748b', fontSize: 10, fontFamily: "'JetBrains Mono'", marginTop: 8 }}>
              Running compilation phase...
            </div>
          </div>
        )}

        {compileState === 'success' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(4px)'
          }}>
            <div style={{ color: '#10b981', fontSize: 40 }}>✓</div>
            <div style={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: 13, marginTop: 12, fontWeight: 700 }}>
              Build Succeeded
            </div>
            <div style={{ color: '#10b981', fontSize: 10, fontFamily: "'JetBrains Mono'", marginTop: 6 }}>
              0 errors, 0 warnings. Output binary generated.
            </div>
          </div>
        )}

        {compileState === 'running' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(4px)'
          }}>
            <div className="orb anim-pulse" style={{ background: '#10b981', width: 40, height: 40, boxShadow: '0 0 20px #10b981' }} />
            <div style={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: 13, marginTop: 16, fontWeight: 700 }}>
              Executing output main.exe...
            </div>
          </div>
        )}

        {/* ── SUBMIT / TESTS RUNNING OVERLAYS ── */}
        {submitState === 'running_tests' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(4px)'
          }}>
            <div className="orb anim-pulse" style={{ background: '#06b6d4', width: 40, height: 40, boxShadow: '0 0 20px #06b6d4' }} />
            <div style={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: 13, marginTop: 16, fontWeight: 700 }}>
              Running challenge test cases...
            </div>
            <div style={{ color: '#64748b', fontSize: 10, fontFamily: "'JetBrains Mono'", marginTop: 8 }}>
              Validating inputs, heap checks, and correctness...
            </div>
          </div>
        )}

        {submitState === 'success' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(4px)'
          }}>
            <div style={{ color: '#10b981', fontSize: 48, filter: 'drop-shadow(0 0 10px #10b981)' }}>🏆</div>
            <div style={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: 14, marginTop: 16, fontWeight: 800 }}>
              Challenge Solved Successfully!
            </div>
            <div style={{ color: '#10b981', fontSize: 10, fontFamily: "'JetBrains Mono'", marginTop: 6 }}>
              All tests passed. Progress saved to profile.
            </div>
          </div>
        )}

        {/* ── SHARE MODAL OVERLAY ── */}
        {showShareModal && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,3,10,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 400, backdropFilter: 'blur(6px)'
          }}>
            <div style={{
              width: '90%', maxWidth: 440, background: T.uiSurface,
              border: `1px solid ${T.uiBorder}`, borderRadius: 16,
              padding: 24, boxShadow: '0 30px 90px rgba(0,0,0,0.8)',
              display: 'flex', flexDirection: 'column', gap: 16
            }}>
              <div>
                <h3 style={{ fontSize: 15, color: T.uiText, fontWeight: 800, letterSpacing: '-0.3px' }}>
                  🔗 Share Execium Code
                </h3>
                <p style={{ fontSize: 11, color: T.uiTextMuted, marginTop: 4 }}>
                  Copy this link. Anyone opening it will load your exact workspace snapshot.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  style={{
                    flex: 1, background: T.editorBg, border: `1px solid ${T.uiBorder}`,
                    borderRadius: 8, padding: '8px 12px', fontSize: 11,
                    color: T.uiTextMuted, outline: 'none', fontFamily: "'JetBrains Mono'"
                  }}
                />
                <button 
                  onClick={handleCopyShare}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: copiedShare ? '#10b981' : 'linear-gradient(135deg, #a855f7, #3b82f6)',
                    color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {copiedShare ? "✓ Copied!" : "Copy Link"}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button 
                  onClick={() => setShowShareModal(false)}
                  style={{
                    padding: '7px 18px', borderRadius: 8, border: `1px solid ${T.uiBorder}`,
                    background: 'none', color: T.uiTextMuted, cursor: 'pointer',
                    fontSize: 11, fontFamily: "'JetBrains Mono'"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
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
