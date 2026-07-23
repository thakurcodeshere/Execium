import { useStore } from "./store";
import { getLearnModuleDetails } from "./learn";
import { getChallengeDetails } from "./challenges";

export interface ActiveSession {
  activeLearnModuleId: string | null;
  activeChallengeId: string | null;
  projectId: string | null;
  projectName: string;
  code: string;
  timestamp: number;
}

export function saveSessionToStorageAndUrl(sessionData: {
  activeLearnModuleId?: string | null;
  activeChallengeId?: string | null;
  projectId?: string | null;
  projectName?: string;
  code?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const store = useStore.getState();
    const session: ActiveSession = {
      activeLearnModuleId: sessionData.activeLearnModuleId !== undefined ? sessionData.activeLearnModuleId : store.activeLearnModuleId,
      activeChallengeId: sessionData.activeChallengeId !== undefined ? sessionData.activeChallengeId : store.activeChallengeId,
      projectId: sessionData.projectId !== undefined ? sessionData.projectId : store.projectId,
      projectName: sessionData.projectName !== undefined ? sessionData.projectName : store.projectName,
      code: sessionData.code !== undefined ? sessionData.code : store.code,
      timestamp: Date.now()
    };
    
    localStorage.setItem("execium_active_session", JSON.stringify(session));

    const url = new URL(window.location.href);
    if (session.activeLearnModuleId) {
      url.searchParams.set("learn", session.activeLearnModuleId);
      url.searchParams.delete("challenge");
      url.searchParams.delete("project");
    } else if (session.activeChallengeId) {
      url.searchParams.set("challenge", session.activeChallengeId);
      url.searchParams.delete("learn");
      url.searchParams.delete("project");
    } else if (session.projectId) {
      url.searchParams.set("project", session.projectId);
      url.searchParams.delete("learn");
      url.searchParams.delete("challenge");
    } else {
      url.searchParams.delete("learn");
      url.searchParams.delete("challenge");
      url.searchParams.delete("project");
    }
    window.history.replaceState(null, "", url.toString());
  } catch {}
}

export function hydrateSessionFromStore() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const learnParam = params.get("learn");
    const challengeParam = params.get("challenge");
    const projectParam = params.get("project");
    const codeParam = params.get("code");

    const store = useStore.getState();

    // 1. If URL has ?learn=param
    if (learnParam) {
      const mod = getLearnModuleDetails(learnParam);
      if (mod) {
        useStore.setState({
          activeLearnModuleId: learnParam,
          activeChallengeId: null,
          projectName: mod.title,
          projectId: null
        });
        const currentCode = store.code;
        if (!currentCode || currentCode.includes("Untitled Project") || currentCode.includes("Hello, World!")) {
          const boilerplate = `// ${mod.title}\n// Category: ${mod.category} | Difficulty: ${mod.difficulty.toUpperCase()}\n// ${mod.shortDesc}\n\n#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// TODO: Implement your solution for ${mod.title}\n\nint main() {\n    cout << "=== ${mod.title} ===" << endl;\n\n    // Write your code here\n\n    return 0;\n}\n`;
          useStore.setState({ code: boilerplate });
        }
        return;
      }
    }

    // 2. If URL has ?challenge=param
    if (challengeParam) {
      const challenge = getChallengeDetails(challengeParam);
      if (challenge) {
        useStore.setState({
          activeChallengeId: challengeParam,
          activeLearnModuleId: null,
          projectName: challenge.title,
          projectId: null
        });
        const currentCode = store.code;
        if (!currentCode || currentCode.includes("Untitled Project") || currentCode.includes("Hello, World!")) {
          useStore.setState({ code: challenge.code });
        }
        return;
      }
    }

    // 3. If URL has ?project=param
    if (projectParam) {
      const projs = localStorage.getItem("execium_projects");
      if (projs) {
        const parsed: any[] = JSON.parse(projs);
        const proj = parsed.find(p => p.id === projectParam);
        if (proj) {
          useStore.setState({
            projectId: proj.id,
            projectName: proj.name,
            code: proj.code,
            activeLearnModuleId: null,
            activeChallengeId: null
          });
          return;
        }
      }
    }

    // 4. Shared code param is handled in CodeEditor
    if (codeParam) {
      return;
    }

    // 5. Fallback: Restore from execium_active_session in localStorage!
    const savedSession = localStorage.getItem("execium_active_session");
    if (savedSession) {
      const sess: ActiveSession = JSON.parse(savedSession);
      if (sess.activeLearnModuleId) {
        const mod = getLearnModuleDetails(sess.activeLearnModuleId);
        if (mod) {
          useStore.setState({
            activeLearnModuleId: sess.activeLearnModuleId,
            activeChallengeId: null,
            projectName: sess.projectName || mod.title,
            projectId: sess.projectId || null,
            code: sess.code || store.code
          });
          // Also set URL search param without reloading
          const url = new URL(window.location.href);
          url.searchParams.set("learn", sess.activeLearnModuleId);
          window.history.replaceState(null, "", url.toString());
          return;
        }
      } else if (sess.activeChallengeId) {
        const challenge = getChallengeDetails(sess.activeChallengeId);
        if (challenge) {
          useStore.setState({
            activeChallengeId: sess.activeChallengeId,
            activeLearnModuleId: null,
            projectName: sess.projectName || challenge.title,
            projectId: sess.projectId || null,
            code: sess.code || store.code
          });
          const url = new URL(window.location.href);
          url.searchParams.set("challenge", sess.activeChallengeId);
          window.history.replaceState(null, "", url.toString());
          return;
        }
      } else if (sess.projectName || sess.code) {
        useStore.setState({
          projectName: sess.projectName || store.projectName,
          projectId: sess.projectId || store.projectId,
          code: sess.code || store.code
        });
        if (sess.projectId) {
          const url = new URL(window.location.href);
          url.searchParams.set("project", sess.projectId);
          window.history.replaceState(null, "", url.toString());
        }
      }
    }
  } catch {}
}
