// Hermes TUI adapter for alexeyw/lot-map's original braille renderer (MIT).
// This file contains only local event names/statuses; no tool arguments or results.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const home = process.env.HERMES_HOME || (process.platform === 'win32'
  ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'hermes')
  : join(homedir(), '.hermes'))
const eventFile = join(home, 'lot-map', 'events.jsonl')
const SETUP = LotMapBraille.setupFrom({coreName:'HERMES', theme:'dark', terminalView:'braille'})
const C = {ground:'#0a0c11', bone:'#ebe6dc', ash:'#9ba1ab', dim:'#6b7280', accent:'#e1ac6e', red:'#e8654f'}
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
  const {h,Text,Box,Dialog,React,defineWidgetApp} = sdk
  function Map({t}) {
    const [board,setBoard]=React.useState(snapshot)
    React.useEffect(() => {const timer=setInterval(()=>setBoard(snapshot()),1000);return()=>clearInterval(timer)},[])
    const cells=LotMapBraille.paintBraille(board,Date.now(),SETUP,60,19)
    const rows=LotMapBraille.foldRows(board.entries,5)
    const now=LotMapBraille.nowParts(board,SETUP.t)
    return h(Dialog,{width:62},h(Box,{flexDirection:'column'},
      ...Array.from({length:cells.rows},(_,y)=>h(Box,{key:`m${y}`,flexDirection:'row',height:1},
        ...cellSegments(cells,y).map((part,i)=>h(Text,{key:i,color:part.color},part.text)))),
      h(Text,{color:t.color.label},now.what.slice(0,58)),
      ...Array.from({length:5},(_,i)=>{
        const e=rows[i]?.entry
        const text=e ? `${e.status==='run'?'●':e.status==='err'?'✕':'·'} ${SETUP.t.stations[e.station].padEnd(8)} ${e.label}` : ''
        return h(Text,{key:`r${i}`,color:e?.status==='err'?C.red:e?.status==='run'?C.accent:C.ash},text.slice(0,59).padEnd(59))
      })
    ))
  }
  const app=defineWidgetApp({id:'lot-map',help:'original Lot Map braille for Hermes',mode:'ambient',zone:'top-right',width:62,
    init:()=>({}), reduce:state=>state, render:({t})=>h(Map,{t})})
  sdk.openWidget(app,app.init(''))
}
