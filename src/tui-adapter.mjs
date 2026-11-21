// Hermes TUI adapter for alexeyw/lot-map's original braille renderer (MIT).
// This file contains only local event names/statuses; no tool arguments or results.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const home = process.env.HERMES_HOME || (process.platform === 'win32'
  ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'hermes')
  : join(homedir(), '.hermes'))
const eventFile = join(home, 'lot-map', 'events.jsonl')
let SETUP = LotMapBraille.setupFrom({coreName:'HERMES', theme:'dark', terminalView:'braille'})
let C = {ground:'#0a0c11', bone:'#ebe6dc', ash:'#9ba1ab', dim:'#6b7280', accent:'#e1ac6e', red:'#e8654f'}
const IDS = {You:'you',Model:'model',Memory:'memory',Files:'files',Shell:'shell',Network:'web',Browser:'browser',Agents:'agents',Skills:'skills',Hooks:'hooks'}
function station(name) {
  const n = String(name || '').toLowerCase()
  if (/memory|recall|remember|slm_|vibo/.test(n)) return 'memory'
  if (/browser|computer.use|desktop_preview|drive_preview|screenshot|vision/.test(n)) return 'browser'
  if (/delegate|agent|cron|process_manage|todo_list|plan_mode/.test(n)) return 'agents'
  if (/skill|plugin|catalog|connector|tool_search|tool_describe/.test(n)) return 'skills'
  if (/hook/.test(n)) return 'hooks'
  if (/web|search_query|fetch|extract|finance|weather|sports|maps|image_query/.test(n)) return 'web'
  if (/terminal|execute_code|shell|patch/.test(n)) return 'shell'
  if (/file|read|write|search_files|git|pdf|xlsx|docx/.test(n)) return 'files'
  return 'shell'
}
function snapshot() {
  let lines = []
  try { lines = readFileSync(eventFile, 'utf8').trim().split('\n').slice(-300) } catch { /* no events yet */ }
  const all = lines.map(line => {try {return JSON.parse(line)} catch {return null}}).filter(e => e && Number.isFinite(e.t) && typeof e.tool === 'string' && ['start', 'complete'].includes(e.kind))
  const session = all.at(-1)?.session
  const events = all.filter(e => e.session === session)
  const board = {entries:[], counts:{}, faults:{}}
  const active = new Map()
  for (const e of events) {
    const id = station(e.tool), name = String(e.tool || 'tool').slice(0,64)
    if (e.kind === 'start') {
      const row = {id:`${e.t}-${board.entries.length}`, station:id, label:name, from:'core', startedAt:e.t, status:'run'}
      board.entries.push(row)
      const group = active.get(e.call || name) || []
      group.push(row); active.set(e.call || name, group)
      board.counts[id] = (board.counts[id] || 0) + 1
    } else if (e.kind === 'complete') {
      const group = active.get(e.call || name)
      const row = group?.shift()
      if (row) {row.status = e.error ? 'err' : 'ok'; row.endedAt = e.t}
      if (e.error) board.faults[id] = (board.faults[id] || 0) + 1
    }
  }
  board.entries = board.entries.slice(-80)
  return board
}
function cellSegments(c, row) {
  const out = [], n = c.columns
  for (let x=0; x<n; x++) {
    const i=row*n+x, code=c.dots[i] ? 0x2800+c.dots[i] : c.glyph[i]
    const color=c.ink[i] === 0x01000000 ? C.bone : `#${c.ink[i].toString(16).padStart(6,'0')}`
    const glyph=String.fromCodePoint(code || 32)
    const last=out[out.length-1]
    if (last?.color === color) last.text += glyph
    else out.push({color,text:glyph})
  }
  return out
}
export default function register(sdk) {
 const {h,Text,Box,Dialog,React,defineWidgetApp}=sdk
 const settingsPath=join(home,'lot-map','tui-settings.json')
 let options;try{options=terminalOptions(JSON.parse(readFileSync(settingsPath,'utf8')))}catch{options=terminalOptions()}
 const subscribers=new Set();let stamp='',cached={entries:[],counts:{},faults:{}}
 function cachedSnapshot(){try{const st=statSync(eventFile);const key=`${st.mtimeMs}:${st.size}`;if(key!==stamp){cached=snapshot();stamp=key}}catch{stamp='';cached={entries:[],counts:{},faults:{}}}return cached}
 function persist(){try{mkdirSync(join(home,'lot-map'),{recursive:true});writeFileSync(settingsPath,JSON.stringify(options)+'\n')}catch{}for(const fn of subscribers)fn()}
 function Card({t}) {
  const [board,setBoard]=React.useState(cachedSnapshot),[,setTick]=React.useState(0)
  React.useEffect(()=>{const update=()=>setTick(v=>v+1);subscribers.add(update);const timer=setInterval(()=>{setBoard(cachedSnapshot());update()},1000);return()=>{clearInterval(timer);subscribers.delete(update)}},[])
  const width=terminalWidth(process.stdout.columns),plain=Object.hasOwn(process.env,'NO_COLOR')
  const tones=options.theme==='auto'?{bone:t.color?.label,ash:t.color?.muted,accent:t.color?.primary,red:t.color?.error}:themePalette(options.theme)
  const color=value=>plain?undefined:value
  const content=terminalRows(board,width-2,Date.now(),options.density==='comfortable')
  const map=[]
  if(options.layout==='map'&&width>=52&&(process.stdout.rows||32)>=28){
   SETUP=LotMapBraille.setupFrom({coreName:'HERMES',theme:options.theme==='paper'?'light':'dark',terminalView:'braille',motion:options.motion==='auto'?'full':'reduced'})
   C={...themePalette(options.theme==='auto'?'obsidian':options.theme),...tones}
   const frameTime=options.motion==='auto'&&!Object.hasOwn(process.env,'NO_COLOR')?Date.now():(board.entries.at(-1)?.endedAt||board.entries.at(-1)?.startedAt||0)
   const cells=LotMapBraille.paintBraille(board,frameTime,SETUP,width-2,Math.min(19,Math.max(17,(process.stdout.rows||36)-14)))
   for(let y=0;y<cells.rows;y++)map.push(h(Box,{key:`m${y}`,height:1,flexDirection:'row'},...cellSegments(cells,y).map((part,i)=>h(Text,{key:i,color:color(options.theme==='auto'?tones.ash:part.color)},part.text))))
  }
  return h(Dialog,{width},h(Box,{flexDirection:'column'},...map,...content.map((row,i)=>h(Text,{key:`s${i}`,color:color(i===0?tones.accent:tones.ash)},row))))
 }
 const app=defineWidgetApp({id:'lot-map',help:'compact activity; /lot-map-settings for map and themes',mode:'ambient',zone:'top-right',width:terminalWidth(process.stdout.columns),init:()=>({}),reduce:state=>state,render:({t})=>h(Card,{t})})
 const fields=['layout','theme','motion','density'],values={layout:['compact','map'],theme:['auto',...THEME_NAMES],motion:['auto','reduced','off'],density:['compact','comfortable']}
 defineWidgetApp({id:'lot-map-settings',help:'configure Lot Map (arrows; Esc/q closes)',mode:'modal',init:()=>({index:0}),reduce:(state,{ch,key={}})=>{
  if(key.escape||ch==='q')return null
  if(key.upArrow)return {index:(state.index+3)%4}
  if(key.downArrow)return {index:(state.index+1)%4}
  if(key.leftArrow||key.rightArrow||key.return){const field=fields[state.index],list=values[field],i=list.indexOf(options[field]);options={...options,[field]:list[(i+(key.leftArrow?list.length-1:1))%list.length]};persist();return {...state}}
  return state
 },render:({state,t})=>h(sdk.Overlay||Box,{},h(Dialog,{width:Math.min(48,terminalWidth(process.stdout.columns))},h(Box,{flexDirection:'column'},h(Text,{color:process.env.NO_COLOR?undefined:t.color?.label},'LOT MAP SETTINGS'),...fields.map((field,i)=>h(Text,{key:field},`${state.index===i?'>':' '} ${field}: ${options[field]}`)),h(Text,{},'Arrows change | Esc/q close'))))})
 sdk.openWidget(app,app.init(''))
}
