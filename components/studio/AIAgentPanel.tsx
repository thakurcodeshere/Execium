"use client";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Sparkles, Send, Terminal, HelpCircle } from "lucide-react";
import { PROGRAMS } from "@/lib/engine";

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function AIAgentPanel() {
  const {
    steps, cur, aiMode, setAIMode, pid, loadProgram,
    play, pause, fwd, bwd, restart, setSpeed, setTheme, theme
  } = useStore();

  const step = steps[cur];
  const T = theme;
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize conversation
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: "Hello! I am your AI Debugger & Copilot. Ask me questions about the code, C++ memory management, or use commands to run the simulation (try typing `/help`).",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const explanation = step
    ? (aiMode === 'beginner' ? step.explainBeg : step.explain)
    : "No simulation step active. Load a program or write code and click ▶ Simulate.";

  const executeCommand = (cmd: string): string | null => {
    const clean = cmd.trim().toLowerCase();
    
    if (clean === "/play" || clean === "/run") {
      play();
      return "Running simulation...";
    }
    if (clean === "/pause" || clean === "/stop") {
      pause();
      return "Paused simulation.";
    }
    if (clean === "/step" || clean === "/next" || clean === "/fwd") {
      fwd();
      return "Stepped forward.";
    }
    if (clean === "/back" || clean === "/prev" || clean === "/bwd") {
      bwd();
      return "Stepped backward.";
    }
    if (clean === "/restart" || clean === "/reset") {
      restart();
      return "Restarted simulation.";
    }
    if (clean === "/speed 0.5x") {
      setSpeed(2800);
      return "Speed set to 0.5x.";
    }
    if (clean === "/speed 1x") {
      setSpeed(1400);
      return "Speed set to 1x.";
    }
    if (clean === "/speed 2x") {
      setSpeed(700);
      return "Speed set to 2x.";
    }
    if (clean === "/speed 4x") {
      setSpeed(350);
      return "Speed set to 4x.";
    }
    if (clean === "/theme dark") {
      setTheme("dark-plus");
      return "Switched to Dark theme.";
    }
    if (clean === "/theme light") {
      setTheme("github-light");
      return "Switched to Light theme.";
    }
    if (clean.startsWith("/load ") || clean.startsWith("/program ")) {
      const progName = clean.split(" ")[1];
      if (PROGRAMS[progName]) {
        loadProgram(progName);
        return `Loaded program: ${PROGRAMS[progName].title}`;
      } else {
        return `Program '${progName}' not found. Available: ${Object.keys(PROGRAMS).join(", ")}`;
      }
    }
    if (clean === "/help") {
      return `Supported commands:
• /play - Start simulation
• /pause - Pause simulation
• /step - Move to next step
• /back - Move to previous step
• /restart - Reset to step 1
• /speed [0.5x|1x|2x|4x] - Change playback speed
• /theme [dark|light] - Change interface theme
• /load [program_key] - Load program (e.g. \`/load factorial\`)`;
    }
    return null;
  };

  const generateAnswer = (userText: string): string => {
    const cleanText = userText.toLowerCase();

    // Check commands first
    if (cleanText.startsWith("/")) {
      const commandResult = executeCommand(userText);
      if (commandResult) return commandResult;
      return "Unknown slash command. Type `/help` for list of commands.";
    }

    // Dynamic C++ contextual answers
    if (cleanText.includes("raii")) {
      return "RAII (Resource Acquisition Is Initialization) is the core C++ idiom. It means resources (memory, file handles, sockets) are acquired in constructors and freed in destructors. By tying resource lifetime to object lifetime on the stack, C++ guarantees resources are cleaned up even if exceptions are thrown.";
    }
    if (cleanText.includes("pointer") || cleanText.includes("address")) {
      return "A pointer is a variable that stores the memory address of another variable. For example, `int* p = &x;` stores the address of `x`. De-referencing it via `*p` lets you read or write the actual value stored at that address.";
    }
    if (cleanText.includes("smart pointer") || cleanText.includes("unique_ptr") || cleanText.includes("shared_ptr")) {
      return "Smart pointers are templates (`std::unique_ptr`, `std::shared_ptr`) that wrap raw pointers and use RAII to automatically delete heap-allocated memory when they leave scope. `unique_ptr` has exclusive ownership, while `shared_ptr` uses reference counting.";
    }
    if (cleanText.includes("move semantics") || cleanText.includes("rvalue") || cleanText.includes("std::move")) {
      return "Move semantics (introduced in C++11) allows resources (like heap blocks) to be 'moved' from temporary objects to new ones rather than making deep copies. This is done using rvalue references (`&&`) and `std::move()`, which casts an lvalue to an rvalue ref.";
    }
    if (cleanText.includes("recursion") || cleanText.includes("stack overflow")) {
      return "Recursion is when a function calls itself. Each call pushes a new stack frame (containing arguments and local variables) onto the stack. If a base case is missing or recursion is too deep, the stack exceeds its memory limit (~8MB), resulting in a Stack Overflow crash.";
    }
    if (cleanText.includes("explain") || cleanText.includes("current line") || cleanText.includes("what is happening")) {
      return `At step ${cur + 1} (${step ? step.type : 'none'}): ${step ? step.explain : 'No step running'}. The active line is line ${step ? step.line : 'N/A'}.`;
    }
    if (cleanText.includes("bubble sort")) {
      return "Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Its time complexity is O(N²) in the worst/average case, making it inefficient for large lists.";
    }

    // Default responses
    return `I can help you with your C++ simulation! 

Active Program: ${PROGRAMS[pid]?.title || 'Custom'}
Active Line: ${step ? step.line : 'N/A'}
Type of Instruction: ${step ? step.type : 'N/A'}

You can ask me questions about concepts like RAII, Pointers, Memory allocation, recursion, or type \`/help\` to issue commands directly through this chat window.`;
  };

  const handleSend = () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAnswer(userMessage.text);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const mc = { beginner: '#10b981', intermediate: '#3b82f6', expert: '#a855f7' }[aiMode];

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: T.uiSurface, borderLeft: `1px solid ${T.uiBorder}`, overflow: "hidden"
    }}>
      {/* ── AI Header ── */}
      <div style={{
        padding: "10px 14px", borderBottom: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, display: "flex", alignItems: "center", gap: 8, flexShrink: 0
      }}>
        <Sparkles size={14} color="#06b6d4" />
        <span style={{ fontSize: 11, fontWeight: 800, color: T.uiText, fontFamily: "'JetBrains Mono'", letterSpacing: 0.5 }}>AI COGNITIVE AGENT</span>
        
        {/* Toggle AI mode */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
          {(['beginner', 'intermediate', 'expert'] as const).map(m => (
            <button
              key={m}
              onClick={() => setAIMode(m)}
              style={{
                padding: "2px 6px", borderRadius: 4, cursor: "pointer", border: "none",
                background: aiMode === m ? `${mc}20` : "transparent",
                color: aiMode === m ? mc : T.uiTextMuted,
                fontSize: 8, fontWeight: 800, fontFamily: "'JetBrains Mono'", textTransform: "uppercase"
              }}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Live Step Explanation Card (Integrated Oracle) ── */}
      <div style={{
        padding: 10, background: "rgba(3,3,10,0.4)",
        borderBottom: `1px solid ${T.uiBorder}`, flexShrink: 0
      }}>
        <div style={{
          padding: 10, background: `${mc}0e`,
          border: `1px solid ${mc}25`, borderRadius: 8
        }}>
          <div style={{
            fontSize: 8, fontWeight: 900, color: mc,
            fontFamily: "'JetBrains Mono'", textTransform: "uppercase",
            letterSpacing: 0.8, marginBottom: 4, display: "flex", alignItems: "center", gap: 4
          }}>
            <div style={{ background: mc, width: 4, height: 4, borderRadius: "50%", boxShadow: `0 0 4px ${mc}` }} />
            Current Line Analysis
          </div>
          <div style={{ fontSize: 11, color: T.uiTextMuted, lineHeight: 1.5, fontFamily: "'Inter'" }}>
            {explanation}
          </div>
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: "85%", display: "flex", flexDirection: "column",
              alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Sender badge */}
            <span style={{ fontSize: 8, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'", marginBottom: 2 }}>
              {m.sender === 'user' ? 'YOU' : 'AI CO-PILOT'}
            </span>
            {/* Bubble */}
            <div style={{
              padding: "8px 12px", borderRadius: 10,
              background: m.sender === 'user' ? "rgba(168,85,247,.12)" : T.uiPanelHd,
              border: `1px solid ${m.sender === 'user' ? "rgba(168,85,247,.25)" : T.uiBorder}`,
              color: T.uiText, fontSize: 11, lineHeight: 1.6, fontFamily: "'Inter'",
              whiteSpace: "pre-wrap"
            }}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ alignSelf: "flex-start", display: "flex", gap: 3, padding: 8 }}>
            <span style={{ fontSize: 8, color: T.uiTextMuted, fontFamily: "'JetBrains Mono'" }}>AI is analyzing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Chat Command helper list ── */}
      <div style={{
        padding: "4px 10px", background: "rgba(0,0,0,0.15)",
        borderTop: `1px solid ${T.uiBorder}`, display: "flex", gap: 8, overflowX: "auto", flexShrink: 0
      }}>
        {["/help", "/play", "/step", "/restart", "/theme light", "/theme dark"].map(c => (
          <button
            key={c}
            onClick={() => setQuery(c)}
            style={{
              padding: "2px 6px", borderRadius: 4, border: `1px solid ${T.uiBorder}`,
              background: T.uiSurface, color: T.uiTextMuted, fontSize: 8,
              fontFamily: "'JetBrains Mono'", cursor: "pointer", whiteSpace: "nowrap"
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: 8, borderTop: `1px solid ${T.uiBorder}`,
        background: T.uiPanelHd, display: "flex", gap: 6, alignItems: "center", flexShrink: 0
      }}>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or type '/' command..."
          rows={1}
          style={{
            flex: 1, background: T.uiSurface, border: `1px solid ${T.uiBorder}`,
            borderRadius: 8, padding: "6px 10px", color: T.uiText, fontSize: 11,
            fontFamily: "'Inter'", outline: "none", resize: "none"
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: 28, height: 28, borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            color: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
