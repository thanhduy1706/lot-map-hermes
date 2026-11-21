import assert from 'node:assert/strict'
import vm from 'node:vm'
import {readFileSync} from 'node:fs'
const refs=[],effects=[],saved=new Map();let cursor=0
const c={host:{state:{}},React:{useRef:v=>refs[cursor++]??(refs[cursor-1]={current:v}),useEffect:fn=>effects.push(fn)},jsx:(tag,props)=>({tag,props}),jsxs:(tag,props)=>({tag,props}),useQuery:()=>({}),useValue:a=>a.get(),ROUTES_AREA:'routes',SIDEBAR_NAV_AREA:'nav',PALETTE_AREA:'palette',queryClient:{}}
vm.createContext(c)
vm.runInContext(readFileSync(new URL('../desktop/plugin.js',import.meta.url),'utf8').replace(/^import [^\r\n]*\r?\n/gm,'').replace('export default {','globalThis.plugin={')+'\nglobalThis.api={MapLayer,SettingsPanel,saveSettings,getSettings:()=>mapSettings,addListener:fn=>listeners.add(fn),setStorage:s=>storage=s}',c)
c.api.setStorage({get:(k,f)=>saved.get(k)??f,set:(k,v)=>saved.set(k,v)})
const props={board:{entries:[],counts:{},faults:{}},palette:'obsidian',motion:'full',expanded:false}
cursor=0;const a=c.api.MapLayer(props);cursor=0;const b=c.api.MapLayer({...props,board:JSON.parse(JSON.stringify(props.board))});assert.equal(a.props.dangerouslySetInnerHTML.__html,b.props.dangerouslySetInnerHTML.__html)
let notices=0;c.api.addListener(()=>notices++);c.api.saveSettings({palette:'rose',themeMode:'manual'});assert.equal(notices,1);assert.equal(saved.get('settings').palette,'rose')
const C={line:'#333',raised:'#111',bone:'#fff',ash:'#bbb'}
const panel=c.api.SettingsPanel({C,provider:'nous',onClose:()=>{notices++}})
const reset=panel.props.children.at(-1);reset.props.onClick();assert.equal(c.api.getSettings().themeMode,'auto');assert.equal(c.api.getSettings().quotaCacheEnabled,false)
panel.props.onKeyDown({key:'Escape'});assert.ok(notices>=3)
let paused=0,unpaused=0;refs[1].current={querySelector:()=>({pauseAnimations:()=>paused++,unpauseAnimations:()=>unpaused++})}
cursor=0;c.api.MapLayer({...props,motion:'off'});effects.at(-1)();assert.equal(paused,1)
cursor=0;c.api.MapLayer(props);effects.at(-1)();assert.equal(unpaused,1)
console.log('PASS: actual MapLayer stable markup, SMIL pause/resume, settings persistence/broadcast/reset and Escape')
