import { create } from 'zustand';
import { PROGRAMS, Step } from './engine';
import { VSTheme, THEMES, DEFAULT_THEME_ID } from './themes';

type Playback = 'idle'|'playing'|'paused'|'done';
type AIMode = 'beginner'|'intermediate'|'expert';
type Panel = 'memory'|'stack'|'vars'|'output'|'algo';

export interface TabItem {
  id: string;
  type: 'project' | 'learn' | 'challenge' | 'snippet';
  title: string;
  code: string;
  projectId?: string | null;
  activeChallengeId?: string | null;
  activeLearnModuleId?: string | null;
}

interface Store {
  pid: string;
  code: string;
  steps: Step[];
  cur: number;
  playback: Playback;
  speed: number; // ms
  aiMode: AIMode;
  showAI: boolean;
  activePanel: Panel;
  _timer: ReturnType<typeof setInterval>|null;
  theme: VSTheme;
  isCollapsed: boolean;
  projectName: string;
  projectId: string | null;
  activeChallengeId: string | null;
  activeLearnModuleId: string | null;
  attemptedChallenges: string[];

  // Multi-tab workspace state
  tabs: TabItem[];
  activeTabId: string;

  openTab(tab: Partial<TabItem>): void;
  closeTab(tabId: string): void;
  switchTab(tabId: string): void;
  createNewProjectTab(): void;

  loadProgram(id:string):void;
  setCode(code:string):void;
  play():void;
  pause():void;
  fwd():void;
  bwd():void;
  restart():void;
  jump(n:number):void;
  setSpeed(ms:number):void;
  setAIMode(m:AIMode):void;
  toggleAI():void;
  setPanel(p:Panel):void;
  setTheme(id:string):void;
  setCollapsed(collapsed:boolean):void;
  toggleCollapsed():void;
  setProjectName(name:string):void;
  setProjectId(id:string|null):void;
  setChallengeId(id:string|null):void;
  setLearnModuleId(id:string|null):void;
  recordAttempt(id:string):void;
}

export const DEFAULT_UNTITLED_CODE = `#include <iostream>\nusing namespace std;\n\n// TODO: Implement your solution\n\nint main() {\n\n    // Write your code here\n\n    return 0;\n}`;

const INITIAL_TAB: TabItem = {
  id: 'tab-default',
  type: 'project',
  title: 'Untitled Project',
  code: DEFAULT_UNTITLED_CODE,
  projectId: null,
  activeChallengeId: null,
  activeLearnModuleId: null
};

function getInitialTheme(): VSTheme {
  try {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("execium_theme");
      if (savedTheme && THEMES[savedTheme]) return THEMES[savedTheme];

      const savedSettings = localStorage.getItem("execium_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme && THEMES[parsed.theme]) return THEMES[parsed.theme];
      }
    }
  } catch {}
  return THEMES[DEFAULT_THEME_ID] || THEMES['github-light'];
}

export const useStore = create<Store>((set,get)=>({
  pid:'untitled',
  code: DEFAULT_UNTITLED_CODE,
  steps: PROGRAMS.for_loop.steps,
  cur:0, playback:'idle', speed:1400,
  aiMode:'beginner', showAI:false, activePanel:'memory', _timer:null,
  theme: getInitialTheme(),
  isCollapsed: true,
  projectName: 'Untitled Project',
  projectId: null,
  activeChallengeId: null,
  activeLearnModuleId: null,
  attemptedChallenges: [],

  tabs: [INITIAL_TAB],
  activeTabId: 'tab-default',

  openTab(newTab) {
    const { tabs, activeTabId, code, projectName, projectId, activeChallengeId, activeLearnModuleId } = get();

    // Determine target ID or existing match
    const targetId = newTab.id ?? (
      newTab.projectId ? `proj-${newTab.projectId}` :
      newTab.activeLearnModuleId ? `learn-${newTab.activeLearnModuleId}` :
      newTab.activeChallengeId ? `challenge-${newTab.activeChallengeId}` :
      `tab-${Date.now()}`
    );

    // Sync current active tab before switching/creating
    const syncedTabs = tabs.map(t => t.id === activeTabId ? {
      ...t,
      code,
      title: projectName,
      projectId,
      activeChallengeId,
      activeLearnModuleId
    } : t);

    const existingIdx = syncedTabs.findIndex(t => 
      t.id === targetId || 
      (newTab.projectId && t.projectId === newTab.projectId) || 
      (newTab.activeLearnModuleId && t.activeLearnModuleId === newTab.activeLearnModuleId) || 
      (newTab.activeChallengeId && t.activeChallengeId === newTab.activeChallengeId)
    );

    if (existingIdx >= 0) {
      const existing = syncedTabs[existingIdx];
      const updatedTab: TabItem = {
        ...existing,
        ...newTab,
        code: newTab.code ?? existing.code,
        title: newTab.title ?? existing.title
      };
      syncedTabs[existingIdx] = updatedTab;

      set({
        tabs: syncedTabs,
        activeTabId: updatedTab.id,
        code: updatedTab.code,
        projectName: updatedTab.title,
        projectId: updatedTab.projectId ?? null,
        activeChallengeId: updatedTab.activeChallengeId ?? null,
        activeLearnModuleId: updatedTab.activeLearnModuleId ?? null
      });
    } else {
      const createdTab: TabItem = {
        id: targetId,
        type: newTab.type ?? 'project',
        title: newTab.title ?? 'Untitled Project',
        code: newTab.code ?? DEFAULT_UNTITLED_CODE,
        projectId: newTab.projectId ?? null,
        activeChallengeId: newTab.activeChallengeId ?? null,
        activeLearnModuleId: newTab.activeLearnModuleId ?? null
      };
      const newTabsList = [...syncedTabs, createdTab];

      set({
        tabs: newTabsList,
        activeTabId: createdTab.id,
        code: createdTab.code,
        projectName: createdTab.title,
        projectId: createdTab.projectId ?? null,
        activeChallengeId: createdTab.activeChallengeId ?? null,
        activeLearnModuleId: createdTab.activeLearnModuleId ?? null
      });
    }
  },

  switchTab(tabId) {
    const { tabs, activeTabId, code, projectName, projectId, activeChallengeId, activeLearnModuleId } = get();
    if (tabId === activeTabId) return;

    // Save current active tab state before switching
    const syncedTabs = tabs.map(t => t.id === activeTabId ? {
      ...t,
      code,
      title: projectName,
      projectId,
      activeChallengeId,
      activeLearnModuleId
    } : t);

    const target = syncedTabs.find(t => t.id === tabId);
    if (!target) return;

    set({
      tabs: syncedTabs,
      activeTabId: target.id,
      code: target.code,
      projectName: target.title,
      projectId: target.projectId ?? null,
      activeChallengeId: target.activeChallengeId ?? null,
      activeLearnModuleId: target.activeLearnModuleId ?? null
    });
  },

  closeTab(tabId) {
    const { tabs, activeTabId } = get();
    if (tabs.length <= 1) {
      // Reset single tab to clean untitled project
      const resetTab: TabItem = {
        id: `tab-${Date.now()}`,
        type: 'project',
        title: 'Untitled Project',
        code: DEFAULT_UNTITLED_CODE,
        projectId: null,
        activeChallengeId: null,
        activeLearnModuleId: null
      };
      set({
        tabs: [resetTab],
        activeTabId: resetTab.id,
        code: resetTab.code,
        projectName: resetTab.title,
        projectId: null,
        activeChallengeId: null,
        activeLearnModuleId: null
      });
      return;
    }

    const remaining = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
      const closedIdx = tabs.findIndex(t => t.id === tabId);
      const nextActiveIdx = Math.max(0, closedIdx - 1);
      const nextActive = remaining[nextActiveIdx];

      set({
        tabs: remaining,
        activeTabId: nextActive.id,
        code: nextActive.code,
        projectName: nextActive.title,
        projectId: nextActive.projectId ?? null,
        activeChallengeId: nextActive.activeChallengeId ?? null,
        activeLearnModuleId: nextActive.activeLearnModuleId ?? null
      });
    } else {
      set({ tabs: remaining });
    }
  },

  createNewProjectTab() {
    const newId = `proj-tab-${Date.now()}`;
    get().openTab({
      id: newId,
      type: 'project',
      title: 'Untitled Project',
      code: DEFAULT_UNTITLED_CODE,
      projectId: null,
      activeChallengeId: null,
      activeLearnModuleId: null
    });
  },

  loadProgram(id){
    const {_timer}=get();
    if(_timer)clearInterval(_timer);
    const p=PROGRAMS[id];
    if(!p)return;
    set({pid:id,code:p.code,steps:p.steps,cur:0,playback:'idle',_timer:null});
  },

  setCode(code){
    const { tabs, activeTabId } = get();
    const updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, code } : t);
    set({ code, tabs: updatedTabs });
  },

  play(){
    const {_timer,speed,steps,cur}=get();
    if(_timer)clearInterval(_timer);
    let c=cur>=steps.length-1?0:cur;
    set({cur:c,playback:'playing'});
    const t=setInterval(()=>{
      const {cur,steps}=get();
      if(cur>=steps.length-1){clearInterval(t);set({playback:'done',_timer:null});return;}
      set({cur:cur+1});
    },speed);
    set({_timer:t});
  },

  pause(){
    const{_timer}=get();
    if(_timer)clearInterval(_timer);
    set({playback:'paused',_timer:null});
  },

  fwd(){
    const{_timer,cur,steps}=get();
    if(_timer)clearInterval(_timer);
    if(cur<steps.length-1)set({cur:cur+1,playback:'paused',_timer:null});
  },

  bwd(){
    const{_timer,cur}=get();
    if(_timer)clearInterval(_timer);
    if(cur>0)set({cur:cur-1,playback:'paused',_timer:null});
  },

  restart(){
    const{_timer}=get();
    if(_timer)clearInterval(_timer);
    set({cur:0,playback:'idle',_timer:null});
  },

  jump(n){
    const{_timer,steps}=get();
    if(_timer)clearInterval(_timer);
    set({cur:Math.max(0,Math.min(n,steps.length-1)),playback:'paused',_timer:null});
  },

  setSpeed(ms){
    const{_timer,playback}=get();
    if(_timer)clearInterval(_timer);
    set({speed:ms,_timer:null});
    if(playback==='playing')get().play();
  },

  setAIMode(m:AIMode){set({aiMode:m})},
  toggleAI(){set(s=>({showAI:!s.showAI}))},
  setPanel(p:Panel){set({activePanel:p})},
  setTheme(id: string) {
    const selected = THEMES[id] ?? THEMES[DEFAULT_THEME_ID] ?? THEMES['github-light'];
    set({ theme: selected });
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("execium_theme", id);
      }
    } catch {}
  },
  setCollapsed(collapsed){set({isCollapsed:collapsed})},
  toggleCollapsed(){set(s=>({isCollapsed:!s.isCollapsed}))},

  setProjectName(name){
    const { tabs, activeTabId } = get();
    const updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, title: name } : t);
    set({ projectName: name, tabs: updatedTabs });
  },

  setProjectId(id){
    const { tabs, activeTabId } = get();
    const updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, projectId: id } : t);
    set({ projectId: id, tabs: updatedTabs });
  },

  setChallengeId(id){
    const { tabs, activeTabId } = get();
    const updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, activeChallengeId: id, activeLearnModuleId: id ? null : t.activeLearnModuleId } : t);
    set({ activeChallengeId: id, activeLearnModuleId: id ? null : get().activeLearnModuleId, tabs: updatedTabs });
  },

  setLearnModuleId(id){
    const { tabs, activeTabId } = get();
    const updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, activeLearnModuleId: id, activeChallengeId: id ? null : t.activeChallengeId } : t);
    set({ activeLearnModuleId: id, activeChallengeId: id ? null : get().activeChallengeId, tabs: updatedTabs });
  },

  recordAttempt(id){
    if (!id) return;
    const { attemptedChallenges } = get();
    if (!attemptedChallenges.includes(id)) {
      const updated = [...attemptedChallenges, id];
      set({ attemptedChallenges: updated });
      try {
        localStorage.setItem("execium_attempted_challenges", JSON.stringify(updated));
      } catch {}
    }
  },
}));
