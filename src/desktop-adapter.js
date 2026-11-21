// Hermes adapter for the original alexeyw/lot-map SVG renderer (MIT).
// Upstream rendering, geometry, icons, colors, motion and feed folding are bundled above.
// Hermes events are mapped to its Board; tool arguments/results are never stored.
import { host, useValue, useQuery, queryClient, ROUTES_AREA, SIDEBAR_NAV_AREA, PALETTE_AREA } from '@hermes/plugin-sdk'
import React from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const sessions = new Map()
const listeners = new Set()
const emit = () => { for (const fn of listeners) fn() }
const IDS = { You: 'you', Model: 'model', Memory: 'memory', Files: 'files', Shell: 'shell', Network: 'web', Browser: 'browser', Agents: 'agents', Skills: 'skills', Hooks: 'hooks' }
function classify(name) {
  const n = String(name || '').toLowerCase()
  if (/memory|recall|remember|slm_|vibo/.test(n)) return 'Memory'
  if (/browser|computer.use|desktop_preview|drive_preview|screenshot|vision/.test(n)) return 'Browser'
  if (/delegate|agent|cron|process_manage|todo_list|plan_mode/.test(n)) return 'Agents'
  if (/skill|plugin|catalog|connector|tool_search|tool_describe/.test(n)) return 'Skills'
  if (/hook/.test(n)) return 'Hooks'
  if (/web|search_query|fetch|extract|finance|weather|sports|maps|image_query/.test(n)) return 'Network'
  if (/terminal|execute_code|shell|patch/.test(n)) return 'Shell'
  if (/file|read|write|search_files|git|pdf|xlsx|docx/.test(n)) return 'Files'
  return 'Shell'
}
function getSession(id) {
  if (!sessions.has(id)) sessions.set(id, { rows: [], running: new Map(), seen: new Set(), counts: {}, errors: {}, turn: false, updated: 0 })
  if (sessions.size > 24) sessions.delete(sessions.keys().next().value)
  return sessions.get(id)
}
function receive(event) {
  const id = String(event?.session_id || '')
  if (!id) return
  const s = getSession(id), p = event.payload || {}, type = event.type, now = Date.now()
  if (type === 'message.start') {
    s.turn = true; s.errors = {}
    s.rows.push({ label: 'new message', station: 'You', at: now, done: true })
    s.rows.push({ label: 'model step', station: 'Model', at: now, done: false })
    s.counts.You = (s.counts.You || 0) + 1
    s.counts.Model = (s.counts.Model || 0) + 1
  } else if (type === 'tool.start') {
    const name = String(p.name || 'tool').slice(0, 64), station = classify(name)
    const last = s.rows[s.rows.length - 1]
    if (last?.station === 'Model' && !last.done) { last.done = true; last.elapsed = now - last.at }
    const key = String(p.tool_id || name)
    if (s.seen.has(key) && p.tool_id) return
    s.seen.add(key); if (s.seen.size > 512) s.seen.delete(s.seen.values().next().value)
    const row = { label: name, station, kind: 'tool', at: now, done: false, error: false }
    s.rows.push(row); s.running.set(String(p.tool_id || name), row); if (s.running.size > 80) s.running.delete(s.running.keys().next().value)
    s.counts[station] = (s.counts[station] || 0) + 1
  } else if (type === 'tool.complete') {
    const name = String(p.name || 'tool').slice(0, 64), key = String(p.tool_id || name)
    const row = s.running.get(key)
    if (row) { row.done = true; row.elapsed = Math.max(0, now - row.at); row.cancelled = ['cancelled','canceled','blocked'].includes(p.status); row.error = !!p.is_error && !row.cancelled; s.running.delete(key) }
    if (row && row.error) { const station = row?.station || classify(name); s.errors[station] = (s.errors[station] || 0) + 1 }
  } else if (type === 'message.complete') {
    s.turn = false
    for (const row of s.running.values()) { row.done = true; row.elapsed = Math.max(0, now - row.at); row.unknown = true }
    s.running.clear()
    const model = [...s.rows].reverse().find(row => row.station === 'Model' && !row.done)
    if (model) { model.done = true; model.elapsed = now - model.at }
    s.rows.push({ label: 'answer ready', station: 'Model', at: now, done: true, error: p.status === 'error', mark: 'done' })
  } else return
  s.rows = s.rows.slice(-80); s.updated = now; emit()
}
function asBoard(s, model, usage) {
  const counts = {}, faults = {}
  for (const [name, number] of Object.entries(s.counts)) counts[IDS[name]] = number
  for (const [name, number] of Object.entries(s.errors)) faults[IDS[name]] = number
  const entries = s.rows.map((row, i) => ({
    id: `${row.at}-${i}`, station: IDS[row.station] || 'shell', label: row.label,
    from: 'core', startedAt: row.at, status: row.done ? row.error || row.unknown || row.cancelled ? 'err' : 'ok' : 'run',
    ...(row.done ? { endedAt: row.at + (row.elapsed || 0) } : {}),
    ...(row.mark ? { mark: row.mark } : {})
  }))
  return { entries, counts, faults, model: String(model || ''),
    ...(Number.isFinite(usage?.context_percent) && usage.context_max > 0 ? { context: usage.context_percent } : {}) }
}
let storage
let mapSettings = normalizeSettings()
function saveSettings(changes) {mapSettings=normalizeSettings({...mapSettings,...changes});storage?.set('settings',mapSettings);emit()}
function SettingsPanel({C,provider,onClose}) {
 const field={width:'100%',background:C.raised,color:C.bone,border:`1px solid ${C.line}`,borderRadius:6,padding:7,boxSizing:'border-box'}
 const select=(key,title,choices)=>jsxs('label',{style:{display:'block',fontSize:11,marginTop:10},children:[title,jsx('select',{value:mapSettings[key],style:field,onChange:e=>saveSettings({[key]:e.target.value}),children:choices.map(v=>jsx('option',{value:v,children:v},v))})]})
 return jsxs('section',{'aria-label':'Lot Map settings',onKeyDown:e=>{if(e.key==='Escape')onClose()},style:{padding:17,borderBottom:`1px solid ${C.line}`,background:C.raised},children:[
 jsxs('div',{style:{display:'flex',justifyContent:'space-between'},children:[jsx('strong',{children:'Settings'}),jsx('button',{onClick:onClose,style:{...field,width:'auto'},children:'Close',type:'button'})]}),
 select('themeMode','Theme mode',['auto','manual']),select('palette','Manual palette',THEME_NAMES),
 jsx('div',{style:{fontSize:10,marginTop:8,color:C.ash},children:`Provider: ${provider||'unavailable'} · auto fallback: Obsidian`}),
 provider?jsxs('label',{style:{display:'block',fontSize:11,marginTop:8},children:['This provider palette',jsx('select',{style:field,value:mapSettings.providerThemes[provider]||'',onChange:e=>{const next={...mapSettings.providerThemes};if(e.target.value)next[provider]=e.target.value;else delete next[provider];saveSettings({providerThemes:next})},children:[jsx('option',{value:'',children:'Default mapping'}),...THEME_NAMES.map(v=>jsx('option',{value:v,children:v},v))]})]}):null,
 select('motion','Motion',['auto','reduced','off']),select('density','Density',['compact','comfortable']),
 ...[['Sections',[['showMap','Activity map'],['showQuota','Quota summary'],['showUsage','Session insights'],['showStatus','Current activity strip'],['showActivity','Activity feed']]],['Header',[['showHeaderTitle','Title'],['showLiveStatus','Live / idle badge'],['showExpandButton','Expand / back button']]],['Session insights',[['showInputTokens','Input tokens'],['showOutputTokens','Output tokens'],['showCost','Estimated cost'],['showContext','Context usage'],['showToolStats','Tool counters'],['showSlowTools','Slow tool diagnostics'],['showClearButton','Clear observations button']]],['Activity feed',[['showActivityHeading','Section title and event count'],['showActivityFilters','Search and filters'],['showActivityIcons','Status icons'],['showActivityStation','Station column'],['showActivityDuration','Duration / state column']]],['Quota display',[['showQuotaBar','Remaining allowance bar'],['showQuotaIcons','Icons'],['showQuotaReset','Reset clock'],['showQuotaCountdown','Reset countdown'],['quotaCacheEnabled','Use installed quota cache plugin']]]].map(([title,fields])=>jsxs('details',{open:title==='Sections',style:{marginTop:10,borderTop:`1px solid ${C.line}`,paddingTop:8},children:[jsx('summary',{style:{cursor:'pointer',fontSize:12,fontWeight:600},children:title}),...fields.map(([key,label])=>jsxs('label',{style:{display:'flex',gap:8,alignItems:'center',marginTop:8,fontSize:11},children:[jsx('input',{type:'checkbox',checked:mapSettings[key],onChange:e=>saveSettings({[key]:e.target.checked})}),label]},key))]},title)),
 select('fontFamily','Font family',['mono','system']),
 ...[['fontSize','Text size',10,18],['mapWidth','Maximum map width',240,900],['activityRows','Activity rows',3,80],['cornerRadius','Corner radius',0,20]].map(([key,label,min,max])=>jsxs('label',{style:{display:'block',marginTop:10,fontSize:11},children:[`${label}: ${mapSettings[key]}`,jsx('input',{type:'range',min,max,value:mapSettings[key],style:{width:'100%'},onChange:e=>saveSettings({[key]:Number(e.target.value)})})]},key)),
 jsxs('div',{style:{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'},children:[['Minimal',{showMap:false,showUsage:false,showActivity:false,showQuota:true,showStatus:true}],['Balanced',{showMap:true,showUsage:true,showActivity:true,showQuota:true,showStatus:true}],['Focus',{showMap:false,showUsage:false,showActivity:true,showQuota:true,showStatus:false}]].map(([label,changes])=>jsx('button',{type:'button',style:{...field,width:'auto'},onClick:()=>saveSettings(changes),children:label},label))}),
 ...['quotaWarn','quotaCritical'].map(key=>jsxs('label',{style:{display:'block',fontSize:11,marginTop:10},children:[key==='quotaWarn'?'Quota warn %':'Quota critical %',jsx('input',{type:'number',min:1,max:100,value:mapSettings[key],style:field,onChange:e=>saveSettings({[key]:Number(e.target.value)})})]},key)),
 jsx('button',{type:'button',style:{...field,marginTop:12},onClick:()=>{mapSettings=normalizeSettings();storage?.set('settings',mapSettings);emit()},children:'Reset settings (not chat or quota data)'})]})
}
function MapLayer({board,palette,motion,expanded}) {
 const memo=React.useRef(null),container=React.useRef(null)
 const key=mapSignature(board,palette,motion)
 memo.current=stableMap(memo.current,key,()=>{const setup=LotMapOriginal.setupFrom({coreName:'HERMES',theme:palette==='paper'?'light':'dark',motion:motion==='full'?'full':'reduced',logRows:16});return recolorMap(LotMapOriginal.drawMap(board,Date.now(),setup),palette).replace('<svg ','<svg style="display:block;width:100%;height:auto" ')})
 React.useEffect(()=>{const svg=container.current?.querySelector('svg');if(motion==='off')svg?.pauseAnimations?.();else svg?.unpauseAnimations?.()},[motion])
 return jsx('div',{ref:container,style:{width:'100%',boxSizing:'border-box',maxWidth:expanded?Math.max(720,mapSettings.mapWidth):mapSettings.mapWidth,margin:'0 auto',padding:'3px 4px 0'},dangerouslySetInnerHTML:{__html:memo.current.svg},'aria-label':'Lot Map — live activity'})
}
function elapsed(ms) { return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s` }
const ALWAYS_VISIBLE = { get:()=>true, subscribe:()=>()=>{}, listen:()=>()=>{} }
const EMPTY_OWNER = { get: () => null, subscribe: () => () => {}, listen: () => () => {} }
function Metric({label, value, C}) { return jsxs('div', {style:{padding:'9px 10px',border:`1px solid ${C.line}`,borderRadius:7,minWidth:0},children:[jsx('div',{style:{fontSize:9,color:C.ash,marginBottom:4},children:label}),jsx('div',{style:{fontSize:13,color:C.bone,overflowWrap:'anywhere'},children:value})]}) }
function QuotaPanel({C, scope, visible}) {
  const [clock,setClock]=React.useState(()=>Date.now())
  React.useEffect(()=>{if(!visible)return;setClock(Date.now());const timer=setInterval(()=>setClock(Date.now()),15000);return()=>clearInterval(timer)},[visible])
  const cacheEnabled=mapSettings.quotaCacheEnabled, warn=mapSettings.quotaWarn, critical=mapSettings.quotaCritical
  const thresholds = quotaThresholds(warn,critical)
  const live = useQuery({placeholderData:undefined,queryKey:quotaKey(scope,'native'),queryFn:()=>quotaRequest(host,scope,'native'),enabled:!!scope && visible,staleTime:300000,refetchInterval:visible?300000:false,retry:false,gcTime:60000,refetchOnWindowFocus:false})
  const cache = useQuery({placeholderData:undefined,queryKey:quotaKey(scope,'cache'),queryFn:()=>quotaRequest(host,scope,'cache'),enabled:!!scope && visible && cacheEnabled,staleTime:60000,refetchInterval:visible && cacheEnabled?60000:false,retry:false,gcTime:60000,refetchOnWindowFocus:false})
  const data = cacheEnabled && scope && cache.data ? structuredQuota(cache.data,clock,thresholds) : null
  const stale = live.data && Date.now()-live.data.receivedAt > 300000
  const button = {border:`1px solid ${C.line}`,borderRadius:5,color:C.ash,background:C.raised,padding:'4px 7px',cursor:'pointer',fontSize:10}
  const note = (text,key) => jsx('div',{style:{fontSize:10,color:C.ash,lineHeight:'16px',marginTop:5},children:text},key)
  const summary=data?.windows?.filter(w=>!w.stale&&w.used!==null).sort((a,b)=>b.used-a.used)[0]
  const glance=quotaGlance(summary,clock,cache.data?.timezone)
  const tone=glance.level==='critical'?C.red:glance.level==='warning'?C.accent:glance.current?C.mem:C.ash
  const unknownLabel=data?.stale||stale?'Stale':cache.error||live.error?'Error':live.isFetching||cache.isFetching?'Loading':'Unknown'
  const chip=(icon,value,label)=>jsxs('span',{title:label,style:{display:'inline-flex',alignItems:'center',gap:5,whiteSpace:'nowrap',fontVariantNumeric:'tabular-nums'},children:[jsx('span',{'aria-hidden':true,style:{opacity:.8,fontSize:12},children:mapSettings.showQuotaIcons?icon:''}),jsx('span',{children:value})]})
  return jsxs('details',{'aria-label':'Account quota',style:{padding:'9px 14px',borderBottom:`1px solid ${C.line}`},children:[
    jsxs('summary',{'aria-label':summary?glance.title:`Quota ${unknownLabel}`,title:summary?`${summary.provider} · ${summary.label}${data.windows.length>1?' · Multiple windows overview; active account not confirmed':''}. ${glance.title}`:'Open quota details',style:{cursor:'pointer',listStyle:'none',color:tone,fontSize:12},children:[
      jsxs('span',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'},children:[
        jsxs('span',{style:{display:'inline-flex',alignItems:'center',gap:6},children:[jsx('span',{'aria-hidden':true,children:mapSettings.showQuotaIcons?(glance.level==='critical'?'⚠':glance.level==='warning'?'◔':'◉'):''}),jsx('strong',{style:{fontSize:16,letterSpacing:'-.03em'},children:summary?glance.remaining:unknownLabel}),jsx('span',{style:{fontSize:10,color:C.ash},children:summary?'left':'quota'}),data?.windows.length>1?jsx('span',{title:'Highest usage window in this overview',style:{fontSize:9,color:C.ash},children:'Σ'}):null]}),
        jsxs('span',{style:{display:'inline-flex',gap:12,alignItems:'center',color:C.ash,fontSize:11},children:[mapSettings.showQuotaReset?chip('↻',glance.reset,'Reset time; full date and timezone in details'):null,mapSettings.showQuotaCountdown?chip('◷',glance.countdown,'Time until reset'):null,jsx('span',{'aria-hidden':true,style:{fontSize:9,opacity:.7},children:'⌄'})]})
      ]}),
      mapSettings.showQuotaBar&&summary?jsx('progress',{max:100,value:summary.remaining,'aria-label':'Remaining quota percent',style:{display:'block',width:'100%',height:3,marginTop:6,accentColor:tone}}):null
    ]}),
    jsxs('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:10},children:[jsx('strong',{style:{fontSize:10,letterSpacing:'.08em'},children:'ACCOUNT QUOTA'}),jsx('button',{type:'button',style:button,disabled:!scope || live.isFetching || cache.isFetching,onClick:()=>{live.refetch();if(cacheEnabled)cache.refetch()},children:live.isFetching?'Loading…':'Refresh'})]}),
    !scope ? note('Select a session. Profile-safe quota routing is unavailable.') : live.error ? note('Account limits unavailable: unsupported RPC, access denied or request failure. No remaining quota assumed.') : !live.data ? note('Loading provider account limits…') : jsxs('div',{children:[note(`${stale?'STALE · ':''}Hermes account limits · received ${new Date(live.data.receivedAt).toLocaleTimeString()}`),...(live.data.lines.length?live.data.lines.map((line,i)=>note(line,i)):[note('Provider has no reported account limits. Context usage is not account quota.')])]}),
    cacheEnabled ? jsxs('div',{children:[
      cache.error ? note('Quota plugin cache unavailable. Install/enable it separately; no provider refresh is run here.') : !data ? note('Reading cached quota…') : jsxs('div',{children:[note(`${data.stale?'STALE / UNKNOWN':'Cached'} · ${data.fetchedAt?new Date(data.fetchedAt).toLocaleString():'no timestamp'}`),...data.windows.slice(0,20).map((w,i)=>{const g=quotaGlance(w,clock,cache.data?.timezone);const color=g.level==='critical'?C.red:g.level==='warning'?C.accent:g.current?C.mem:C.ash;return jsxs('div',{style:{marginTop:8,padding:10,border:`1px solid ${C.line}`,borderLeft:`3px solid ${color}`,borderRadius:7,fontSize:11},children:[jsx('div',{title:`${w.provider} · ${w.label}`,style:{color:C.ash,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:7},children:`${w.provider} · ${w.label}`}),jsxs('div',{'aria-label':g.title,title:g.title,style:{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',flexWrap:'wrap'},children:[jsxs('span',{style:{color},children:[jsx('strong',{style:{fontSize:18},children:g.remaining}),jsx('span',{style:{fontSize:10,color:C.ash},children:g.current?' left':' unknown'})]}),mapSettings.showQuotaReset?chip('↻',g.reset,`Reset: ${quotaWindowText(w,clock,cache.data?.timezone).reset}`):null,mapSettings.showQuotaCountdown?chip('◷',g.countdown,quotaWindowText(w,clock,cache.data?.timezone).countdown):null]}),g.current&&mapSettings.showQuotaBar?jsx('progress',{max:100,value:w.remaining,'aria-label':`${w.provider}: remaining quota`,style:{width:'100%',height:4,marginTop:7,accentColor:color}}):!g.current?note(w.stale?'Stale data; unconfirmed':'No current data'):null]},i)}),!data.windows.length?note('No structured quota windows reported.'):null]})
    ]}):null
  ]})
}
function Pane({ expanded = false } = {}) {
  const id = useValue(host.state.focusedSessionId)
  const model = useValue(host.state.model)
  const usage = useValue(host.state.focusedUsage)
  const owner = useValue(host.state.focusedSessionOwner || EMPTY_OWNER)
  const scope = quotaScope(owner,id)
  const paneVisible = useValue(host.paneVisibility?.('lot-map:pane') || ALWAYS_VISIBLE)
  const [settingsOpen,setSettingsOpen]=React.useState(false)
  const [tabVisible,setTabVisible]=React.useState(()=>typeof document==='undefined'||!document.hidden)
  const [prefersReduced,setPrefersReduced]=React.useState(()=>typeof window!=='undefined'&&!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  React.useEffect(()=>{if(typeof document==='undefined')return;const fn=()=>setTabVisible(!document.hidden);document.addEventListener('visibilitychange',fn);return()=>document.removeEventListener('visibilitychange',fn)},[])
  React.useEffect(()=>{if(typeof window==='undefined')return;const mq=window.matchMedia?.('(prefers-reduced-motion: reduce)');const fn=()=>setPrefersReduced(!!mq?.matches);mq?.addEventListener?.('change',fn);return()=>mq?.removeEventListener?.('change',fn)},[])
  const visible=(expanded||paneVisible)&&tabVisible
  const providerQuery=useQuery({queryKey:quotaKey(scope,'provider'),enabled:!!scope&&visible,staleTime:60000,refetchInterval:visible?60000:false,retry:false,placeholderData:undefined,queryFn:()=>providerForScope(host,scope)})
  const provider=typeof providerQuery.data==='string'?providerQuery.data:''
  const palette=resolveMapTheme(mapSettings,provider)
  const motion=motionMode(mapSettings.motion,prefersReduced,visible)
  const [filter,setFilter] = React.useState('all')
  const [search,setSearch] = React.useState('')
  const [, setTick] = React.useState(0)
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1)
    listeners.add(fn)
    const timer = visible ? setInterval(() => { if (sessions.get(String(id))?.running.size) fn() }, 1000) : null
    return () => { listeners.delete(fn); clearInterval(timer) }
  }, [id, visible])
  const s = sessions.get(String(id)) || { rows: [], running: new Map(), counts: {}, errors: {} }
  const board = asBoard(s, model, usage)
  const C = themePalette(palette)
  const setup = LotMapOriginal.setupFrom({coreName:'HERMES',theme:palette==='paper'?'light':'dark',motion:motion==='full'?'full':'reduced',logRows:16})
  const now = LotMapOriginal.nowParts(board, setup.t)
  const filtered = filterInsightRows(s.rows,filter,search)
  const rows = LotMapOriginal.foldRows(asBoard({...s,rows:filtered},model,usage).entries)
  const metrics = insightSummary(s.rows)
  const usageData = usageInsights(usage)
  const active = s.running.size > 0 || s.turn
  const total = Object.values(s.counts).reduce((a, b) => a + b, 0)
  const mono = 'SF Mono, ui-monospace, Menlo, Consolas, monospace'
  const headerCell = { fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '.10em', textTransform: 'uppercase' }
  return jsxs('div', { className:'lot-map-ui','data-motion':motion,style: {'--map-accent':C.accent,fontSize:mapSettings.fontSize,height: '100%', overflowY: 'auto', width: '100%', boxSizing: 'border-box', maxWidth: expanded ? 920 : undefined, margin: expanded ? '0 auto' : undefined, background: C.ground, color: C.bone, fontFamily:mapSettings.fontFamily==='system'?'system-ui, sans-serif':mono,'--map-font-size':`${mapSettings.fontSize}px`,'--map-radius':`${mapSettings.cornerRadius}px`, scrollbarColor: `${C.line} ${C.ground}` }, children: [
    jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '14px 17px 12px', borderBottom: `1px solid ${C.line}` }, children: [
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }, children: [
        jsx('span', { style: { width: 7, height: 7, flexShrink: 0, borderRadius: '50%', background: active ? C.accent : C.dim, boxShadow: active ? `0 0 10px ${C.accent}` : 'none' }, 'aria-hidden': true }),
        jsx('span', { style: { ...headerCell, color: C.bone, whiteSpace: 'nowrap' }, children:mapSettings.showHeaderTitle?'LOT MAP':'' }),
        jsx('span', { style: { ...headerCell, fontWeight: 400, color: C.dim, letterSpacing: '.04em', whiteSpace: 'nowrap' }, children:mapSettings.showLiveStatus?(active?'LIVE':'IDLE'):'' })
      ] }),
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }, children: [
        mapSettings.showExpandButton?jsx('button', { type: 'button', title: expanded ? 'Back to chat' : 'Open full map', 'aria-label': expanded ? 'Back to chat' : 'Open full map', onClick: () => host.navigate(expanded ? '/' : '/lot-map'), style: { border: `1px solid ${C.line}`, borderRadius: 6, background: C.raised, color: C.ash, padding: '4px 8px', cursor: 'pointer', fontSize: 12, lineHeight: '14px' }, children: expanded ? '↩ CHAT' : '↗' }):null,
        jsx('button',{type:'button','aria-label':'Open settings','aria-expanded':settingsOpen,onClick:()=>setSettingsOpen(v=>!v),style:{border:`1px solid ${C.line}`,borderRadius:6,background:C.raised,color:C.ash,padding:'4px 8px',cursor:'pointer'},children:'⚙'})
      ] })
    ] }),
    settingsOpen?jsx(SettingsPanel,{C,provider,onClose:()=>setSettingsOpen(false)}):null,
    mapSettings.showQuota?jsx(QuotaPanel,{C,scope,visible}):null,
    mapSettings.showMap?jsx(MapLayer,{board,palette,motion,expanded}):null,
    jsx('style',{children:MAP_CSS}),
    mapSettings.showUsage?jsxs('section',{style:{padding:'0 17px 13px',borderBottom:`1px solid ${C.line}`},'aria-label':'Session insights',children:[
      jsx('div',{style:{fontSize:10,color:C.ash,marginBottom:8},children:'SESSION USAGE · HERMES-REPORTED'}),
      jsx('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(80px,1fr))',gap:6},children:[['INPUT TOKENS',usageData.input],['OUTPUT TOKENS',usageData.output],['COST (USD)',usageData.cost===null?null:`$${usageData.cost.toFixed(4)}*`]].filter(([label])=>label==='INPUT TOKENS'?mapSettings.showInputTokens:label==='OUTPUT TOKENS'?mapSettings.showOutputTokens:mapSettings.showCost).map(([label,value])=>jsx(Metric,{label,value:value===null?'Not reported':String(value),C},label))}),
      mapSettings.showContext?jsx('div',{style:{fontSize:10,color:usageData.context>=80?C.accent:C.ash,marginTop:8},children:usageData.context===null || !usageData.contextMax?'Context not reported':`Context ${usageData.context.toFixed(1)}%${usageData.estimated?' (estimated)':''} · not account quota${usageData.context>=80?' · consider compacting or a new chat':''}`}):null,
      mapSettings.showCost&&usageData.cost!==null?jsx('div',{style:{fontSize:9,color:C.dim,marginTop:4},children:'* Hermes estimate; not an invoice or account balance.'}):null,
      mapSettings.showToolStats?jsx('div',{style:{fontSize:10,color:C.ash,marginTop:9},children:`Observed tools (last 80 events): ${metrics.succeeded} OK · ${metrics.failed} failed · ${metrics.running} running · ${metrics.unknown} unconfirmed/cancelled`}):null,
      ...(mapSettings.showSlowTools?metrics.slow:[]).slice(0,3).map((r,i)=>jsx('div',{style:{fontSize:10,color:C.accent,marginTop:5},children:`Long running: ${r.name} · ${elapsed(r.ms)} (may be expected)`},i)),
      ...(mapSettings.showSlowTools?metrics.slowest:[]).map((r,i)=>jsx('div',{style:{fontSize:10,color:C.dim,marginTop:4},children:`Slow completed: ${r.label} · ${elapsed(r.elapsed)}`},`slow-${i}`)),
      mapSettings.showClearButton?jsx('button',{type:'button',style:{marginTop:8,border:`1px solid ${C.line}`,background:C.raised,color:C.ash,borderRadius:5,padding:'4px 7px',fontSize:10,cursor:'pointer'},onClick:()=>{sessions.delete(String(id));emit()},children:'Clear local observations (not chat or billing)'}):null
    ]}):null,
    mapSettings.showStatus?jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '1px 17px 13px', borderBottom: `1px solid ${C.line}` }, children: [
      jsx('span', { style: { color: active ? C.accent : C.ash, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: now.what, children: active ? `●  ${now.what}` : now.what }),
      jsx('span', { style: { color: C.dim, fontSize: 10, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }, children: now.meter })
    ] }):null,
    mapSettings.showActivity&&mapSettings.showActivityHeading?jsxs('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 17px 8px' }, children: [
      jsx('span', { style: { ...headerCell, color: C.bone }, children: 'RECENT ACTIVITY' }),
      jsx('span', { style: { ...headerCell, color: C.dim, fontVariantNumeric: 'tabular-nums' }, children: `${total} EVENT${total === 1 ? '' : 'S'}` })
    ] }):null,
    mapSettings.showActivity&&mapSettings.showActivityFilters?jsxs('div',{style:{display:'flex',gap:7,padding:'0 17px 8px'},children:[jsx('select',{'aria-label':'Activity filter',value:filter,onChange:e=>setFilter(e.target.value),style:{minWidth:0,background:C.raised,color:C.ash,border:`1px solid ${C.line}`,borderRadius:5},children:['all','errors','running'].map(v=>jsx('option',{value:v,children:v==='errors'?'Errors / unknown':v},v))}),jsx('input',{'aria-label':'Search tool names',placeholder:'Find tool…',value:search,onChange:e=>setSearch(e.target.value.slice(0,100)),style:{width:'100%',minWidth:0,background:C.raised,color:C.bone,border:`1px solid ${C.line}`,borderRadius:5,padding:5}})]}):null,
    mapSettings.showActivity?jsx('div', { style: { padding: '0 17px 22px', fontSize: 11 }, children: rows.length ? rows.slice(-mapSettings.activityRows).map((r, i) => {
      const e = r.entry, running = e.status === 'run', bad = e.status === 'err'
      const tone = bad ? C.red : running ? e.station === 'memory' ? C.mem : C.accent : C.dim
      return jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, minHeight: mapSettings.density==='compact'?26:34, borderBottom: `1px solid ${C.line}`, fontVariantNumeric: 'tabular-nums' }, children: [
        mapSettings.showActivityIcons?jsx('span', { style: { width: 11, flexShrink: 0, color: tone, fontSize: 12 }, children: bad ? '✕' : running ? '●' : '·' }):null,
        mapSettings.showActivityStation?jsx('span', { style: { width: 61, flexShrink: 0, color: running ? C.bone : C.ash }, children: setup.t.stations[e.station] }):null,
        jsx('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: running ? tone : C.ash }, title: e.label, children: `${e.label}${r.times > 1 ? ` +${r.times - 1}` : ''}` }),
        mapSettings.showActivityDuration?jsx('span', { style: { flexShrink: 0, color: running ? tone : C.dim, textAlign: 'right' }, children: running ? 'RUNNING' : filtered.find(x=>x.label===e.label && x.at===e.startedAt)?.unknown ? 'UNCONFIRMED' : filtered.find(x=>x.label===e.label && x.at===e.startedAt)?.cancelled ? 'CANCELLED' : e.mark ? '—' : elapsed(r.tookMs) }):null
      ] }, `${e.id}-${i}`)
    }) : jsx('div', { style: { color: C.dim, padding: '12px 0', lineHeight: '18px' }, children: 'No activity yet. Start a conversation to trace its path.' }) }):null
  ] })
}
export default {
  id: 'lot-map', name: 'Lot Map for Hermes',
  register(ctx) {
    storage = ctx.storage
    mapSettings=loadMapSettings(storage)
    for (const type of ['message.start', 'message.complete', 'tool.start', 'tool.complete']) ctx.onEvent(type, receive)
    ctx.onDispose(() => { sessions.clear(); listeners.clear(); queryClient?.cancelQueries({queryKey:['lot-map']}); queryClient?.removeQueries({queryKey:['lot-map']}); storage = undefined })
    ctx.register({ id: 'pane', area: 'panes', title: 'Lot Map', data: { placement: 'right', width: '390px' }, render: () => jsx(Pane, {}) })
    ctx.register({ id: 'page', area: ROUTES_AREA, data: { path: '/lot-map' }, render: () => jsx(Pane, { expanded: true }) })
    ctx.register({ id: 'nav', area: SIDEBAR_NAV_AREA, data: { path: '/lot-map', label: 'Lot Map', codicon: 'map' } })
    ctx.register({ id: 'open', area: PALETTE_AREA, data: { id: 'lot-map.open', label: 'Open Lot Map', keywords: ['map', 'activity', 'tools'], run: () => host.navigate('/lot-map') } })
  }
}
