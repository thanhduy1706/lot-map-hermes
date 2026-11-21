import assert from 'node:assert/strict'
import {readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {tmpdir} from 'node:os'
import {fileURLToPath, pathToFileURL} from 'node:url'
import vm from 'node:vm'
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const events = new Map(), contributions = [], disposers = [], saved = new Map(), routes = []
let focused = 'synthetic-session'
const storage = {get:(key,fallback)=>saved.get(key)??fallback, set:(key,value)=>saved.set(key,value)}
const host = {state:{focusedSessionId:{get:()=>focused}, model:{get:()=> 'Demo model'}, focusedUsage:{get:()=>({context_max:100000,context_percent:42,input:18400,output:2300,cost_usd:0.048})}},navigate:path=>routes.push(path)}
const context = {storage, register:p=>contributions.push(p), onEvent:(type,fn)=>events.set(type,fn), onDispose:fn=>disposers.push(fn)}
const box = {host, useQuery:()=>({data:null,refetch:()=>{},isFetching:false}), queryClient:{cancelQueries:()=>{},removeQueries:()=>{}}, ROUTES_AREA:'routes', SIDEBAR_NAV_AREA:'sidebar', PALETTE_AREA:'palette', React:{useRef:v=>({current:v}),useState:v=>[typeof v==='function'?v():v,()=>{}],useEffect:()=>{}}, jsx:(tag,props)=>({tag,props}),jsxs:(tag,props)=>({tag,props}),useValue:atom=>atom.get()}
const code = readFileSync(join(root,'desktop/plugin.js'),'utf8').replace(/^import [^\r\n]*\r?\n/gm,'').replace('export default {','globalThis.plugin = {')+'\nglobalThis.inspectSession = id => sessions.get(id); globalThis.sessionCount = () => sessions.size'
vm.runInNewContext(code,box)
box.plugin.register(context)
assert.deepEqual(contributions.map(p=>p.area),['panes','routes','sidebar','palette'])
assert.equal(contributions[1].data.path,'/lot-map')
contributions[3].data.run();assert.equal(routes.pop(),'/lot-map')
const send=(type,payload={},session=focused)=>events.get(type)({type,session_id:session,payload})
send('message.start',{content:'PRIVATE_PAYLOAD'})
send('tool.start',{name:'web_extract',tool_id:'one',args:{key:'PRIVATE_PAYLOAD'}})
send('tool.start',{name:'web_extract',tool_id:'two'})
send('tool.complete',{name:'web_extract',tool_id:'two',is_error:true,result:'PRIVATE_PAYLOAD'})
send('tool.complete',{name:'web_extract',tool_id:'one',is_error:false})
let s=box.inspectSession(focused)
assert.equal(s.counts.Network,2);assert.equal(s.errors.Network,1);assert.equal(s.running.size,0)
assert.equal(s.rows.at(-1).error,true)
assert.ok(!JSON.stringify(s).includes('PRIVATE_PAYLOAD'))
send('tool.complete',{name:'web_extract',tool_id:'two',is_error:true})
assert.equal(s.errors.Network,1)
send('tool.start',{name:'web_extract',tool_id:'two'})
assert.equal(s.counts.Network,2)
send('tool.start',{name:'terminal',tool_id:'cancel'})
send('tool.complete',{name:'terminal',tool_id:'cancel',is_error:true,status:'cancelled'})
assert.equal(s.rows.at(-1).cancelled,true);assert.equal(s.rows.at(-1).error,false)
send('tool.start',{name:'read_file',tool_id:'three'})
send('message.complete')
assert.equal(s.running.size,0);assert.equal(s.turn,false)
assert.equal(s.rows.find(r=>r.label==='read_file').unknown,true)
const render=(index=0)=>{const node=contributions[index].render();return node.tag(node.props)}
const getSvg=node=>{const child=node.props.children.find(c=>c?.tag?.name==='MapLayer');return child.tag(child.props).props.dangerouslySetInnerHTML.__html}
let pane=render(),svg=getSvg(pane)
for(const pattern of [/viewBox="0 0 460 430"/,/HERMES/,/42%/,/Memory/,/<path transform="translate\(/,/<animateMotion/]) assert.match(svg,pattern)
pane.props.children[0].props.children[1].props.children[0].props.onClick();assert.equal(routes.pop(),'/lot-map')
let full=render(1);assert.equal(full.props.style.maxWidth,920);assert.equal(full.props.children.find(c=>c?.tag?.name==='MapLayer').props.expanded,true)
full.props.children[0].props.children[1].props.children[0].props.onClick();assert.equal(routes.pop(),'/')
vm.runInNewContext("saveSettings({themeMode:'manual',palette:'paper'})",box);assert.equal(saved.get('settings').palette,'paper');assert.match(getSvg(render()),/#f5f2ea/)
box.window={matchMedia:()=>({matches:true})};assert.ok(!getSvg(render()).includes('<animateMotion'));delete box.window
for(let i=0;i<120;i++)send('tool.start',{name:'read_file',tool_id:`limit-${i}`})
assert.equal(box.inspectSession(focused).rows.length,80)
assert.ok(box.inspectSession(focused).running.size<=80)
send('message.complete')
for(let i=0;i<35;i++)send('message.start',{},`bounded-${i}`)
assert.equal(box.sessionCount(),24)
focused='demo';send('message.start')
for(const [name,id] of [['read_file','d1'],['terminal','d2'],['memory','d3'],['browser_exec','d4']]){send('tool.start',{name,tool_id:id});send('tool.complete',{name,tool_id:id})}
send('tool.start',{name:'web_search',tool_id:'d5'})
pane=render();pane.props.children[0].props.children[1].props.children[1].props.onClick()
const dark=render();dark.props.children[0].props.children[1].props.children[1].props.onClick();const light=render()
function escape(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}
function html(node){
 if(node==null)return '';if(Array.isArray(node))return node.map(html).join('');if(typeof node!=='object')return escape(node)
 if(typeof node.tag==='function')return html(node.tag(node.props));
 const p=node.props||{};const style=Object.entries(p.style||{}).filter(([,v])=>v!==undefined).map(([k,v])=>`${k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}:${typeof v==='number'&&!['fontWeight','opacity','flex','zIndex','order'].includes(k)?v+'px':v}`).join(';')
 const attrs=['type','value','min','max','placeholder','aria-label','class','data-motion'].filter(k=>p[k]!==undefined).map(k=>` ${k}="${escape(p[k])}"`).join('')+(p.checked?' checked':'')+(p.className?` class="${escape(p.className)}"`:'')+(p['data-motion']?` data-motion="${escape(p['data-motion'])}"`:'')
 return `<${node.tag}${attrs}${style?` style="${escape(style)}"`:''}>${p.dangerouslySetInnerHTML?p.dangerouslySetInnerHTML.__html:html(p.children)}</${node.tag}>`
}
if(process.env.LOT_MAP_PREVIEW_DIR){
 saved.set('quotaCacheEnabled',true)
 host.state.focusedSessionOwner={get:()=>({connectionId:'synthetic',profile:'demo'})}
 box.useQuery=opts=>({data:opts.queryKey[2]==='native'?{receivedAt:Date.now(),lines:['Synthetic provider account · demo only']}:{fetched_at:new Date().toISOString(),providers:{demo:{label:'Demo provider',windows:[{label:'5-hour window',used_percent:84,reset_at:new Date(Date.now()+7200000).toISOString()}]}}},refetch:()=>{},isFetching:false})
 saved.set('settings',{themeMode:'manual',palette:'emerald',quotaCacheEnabled:true});box.plugin.register({...context,onEvent:()=>{},onDispose:()=>{}});const previewDark=render();
 saved.set('settings',{themeMode:'manual',palette:'paper',quotaCacheEnabled:true});box.plugin.register({...context,onEvent:()=>{},onDispose:()=>{}});const previewLight=render();
 const settingsPreview=vm.runInNewContext("jsx(SettingsPanel,{C:themePalette('paper'),provider:'anthropic',onClose:()=>{}})",box)
 mkdirSync(process.env.LOT_MAP_PREVIEW_DIR,{recursive:true})
 writeFileSync(join(process.env.LOT_MAP_PREVIEW_DIR,'settings.html'),`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#f5f2ea;color:#20252c;font:13px monospace}*{box-sizing:border-box}</style><p>SYNTHETIC SETTINGS PREVIEW</p>${html(settingsPreview)}`)
 writeFileSync(join(process.env.LOT_MAP_PREVIEW_DIR,'preview.html'),`<!doctype html><meta charset="utf-8"><title>Lot Map for Hermes — synthetic demonstration</title><style>body{margin:0;background:#16191e;color:#ebe6dc;font:14px system-ui}*{box-sizing:border-box}.top{padding:22px 30px 16px;display:flex;justify-content:space-between;align-items:center}.label{color:#b5becb;font-size:11px;letter-spacing:.1em}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:0 30px 25px}.card{border:1px solid #373d47;border-radius:12px;overflow:hidden;height:1420px}h1{margin:0;font-size:24px;letter-spacing:-.03em}p{color:#aeb6c2;margin:5px 0 0}</style><div class="top"><div><h1>Lot Map for Hermes</h1><p>Quota awareness. Session insights. Original geometry.</p></div><span class="label">SYNTHETIC DEMONSTRATION · NOT A LIVE SESSION</span></div><div class="grid"><div class="card">${html(previewDark)}</div><div class="card">${html(previewLight)}</div></div>`)
}
// TUI uses a temporary profile, never the user's runtime data.
const temp=mkdtempSync(join(process.env.TMPDIR||tmpdir(),'lot-map-smoke-'));const previous=process.env.HERMES_HOME
try{
 process.env.HERMES_HOME=temp;mkdirSync(join(temp,'lot-map'))
 const rows=[{t:1,kind:'start',tool:'terminal',session:'a',call:'first'},{t:2,kind:'start',tool:'terminal',session:'a',call:'second'},{t:3,kind:'complete',tool:'terminal',session:'a',call:'second',error:true},{t:4,kind:'complete',tool:'terminal',session:'a',call:'first',error:false}]
 writeFileSync(join(temp,'lot-map/events.jsonl'),rows.map(JSON.stringify).join('\n')+'\nBROKEN\nnull\n')
 const tui=await import(pathToFileURL(join(root,'tui/lot-map.mjs')).href)
 let app,opened;let initial;const apps=[]
 const h=(tag,props,...children)=>({tag,props,children})
 tui.default({h,Text:'Text',Box:'Box',Dialog:'Dialog',React:{useRef:v=>({current:v}),useState:f=>{const v=typeof f==='function'?f():f;if(v?.entries)initial=v;return[v,()=>{}]},useEffect:()=>{}},defineWidgetApp:x=>{apps.push(x);if(x.id==='lot-map')app=x;return x},openWidget:a=>(opened=a)})
 assert.equal(app.id,'lot-map');assert.equal(opened,app)
 const view=app.render({t:{color:{label:'gray'}}});const tree=view.tag(view.props)
 assert.equal(tree.tag,'Dialog');assert.equal(initial.entries[0].status,'ok');assert.equal(initial.entries[1].status,'err');assert.equal(initial.faults.shell,1)
 assert.equal(tree.children[0].children.length,4)
 const settings=apps.find(x=>x.id==='lot-map-settings');assert.equal(settings.reduce({index:0},{key:{escape:true}}),null);settings.reduce({index:0},{key:{rightArrow:true}})
 const expandedTree=view.tag(view.props);const mapRows=expandedTree.children[0].children.filter(c=>c.tag==='Box');assert.ok(mapRows.length>=7)
 assert.ok(mapRows.some(row=>row.children.some(c=>/[\u2800-\u28ff]/u.test(c.children[0]))))
}finally{if(previous===undefined)delete process.env.HERMES_HOME;else process.env.HERMES_HOME=previous;rmSync(temp,{recursive:true,force:true})}
for(const dispose of disposers)dispose()
assert.equal(box.sessionCount(),0)
console.log('PASS: desktop events, privacy, themes, reduced motion, navigation, limits, disposal; TUI braille and parallel call matching')
