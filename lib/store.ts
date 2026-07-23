import { create } from 'zustand';
import { PROGRAMS, Step } from './engine';
import { VSTheme, THEMES, DEFAULT_THEME_ID } from './themes';

type Playback = 'idle'|'playing'|'paused'|'done';
type AIMode = 'beginner'|'intermediate'|'expert';
type Panel = 'memory'|'stack'|'vars'|'output'|'algo';

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

export const DEFAULT_UNTITLED_CODE = `// Untitled Project\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`;

export const useStore = create<Store>((set,get)=>({
  pid:'untitled',
  code: DEFAULT_UNTITLED_CODE,
  steps: PROGRAMS.for_loop.steps,
  cur:0, playback:'idle', speed:1400,
  aiMode:'beginner', showAI:false, activePanel:'memory', _timer:null,
  theme: THEMES[DEFAULT_THEME_ID],
  isCollapsed: true,
  projectName: 'Untitled Project',
  projectId: null,
  activeChallengeId: null,
  activeLearnModuleId: null,
  attemptedChallenges: [],

  loadProgram(id){
    const {_timer}=get();
    if(_timer)clearInterval(_timer);
    const p=PROGRAMS[id];
    if(!p)return;
    set({pid:id,code:p.code,steps:p.steps,cur:0,playback:'idle',_timer:null});
  },

  setCode(code){
    set({code});
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
  setTheme(id:string){set({theme:THEMES[id]??THEMES[DEFAULT_THEME_ID]})},
  setCollapsed(collapsed){set({isCollapsed:collapsed})},
  toggleCollapsed(){set(s=>({isCollapsed:!s.isCollapsed}))},
  setProjectName(name){set({projectName:name})},
  setProjectId(id){set({projectId:id})},
  setChallengeId(id){set({activeChallengeId:id, activeLearnModuleId: id ? null : null})},
  setLearnModuleId(id){set({activeLearnModuleId:id, activeChallengeId: id ? null : null})},
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
