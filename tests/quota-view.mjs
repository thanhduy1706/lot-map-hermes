import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const states=[],queries=[],effects=[],saved=new Map();let hook=0,filters={}
const box={host:{state:{},},React:{useState:init=>{const i=hook++;if(!(i in states))states[i]=typeof init==='function'?init():init;return [states[i],v=>states[i]=v]},useEffect:fn=>effects.push(fn)},useQuery:opts=>{queries.push(opts);return {data:null,refetch:()=>{},isFetching:false}},jsx:(tag,props)=>({tag,props}),jsxs:(tag,props)=>({tag,props}),useValue:a=>a.get(),ROUTES_AREA:'routes',SIDEBAR_NAV_AREA:'sidebar',PALETTE_AREA:'palette',queryClient:{cancelQueries:()=>{},removeQueries:()=>{}}}
vm.createContext(box)
const code=readFileSync(new URL('../desktop/plugin.js',import.meta.url),'utf8').replace(/^import [^\r\n]*\r?\n/gm,'').replace('export default {','globalThis.plugin = {')+'\nglobalThis.test={QuotaPanel,quotaScope}; globalThis.setStorage=x=>storage=x'
vm.runInContext(code,box)
box.setStorage({get:(key,fallback)=>saved.get(key)??fallback,set:(key,value)=>saved.set(key,value)})
const C={line:'#333',ash:'#aaa',raised:'#111',red:'#f00',accent:'#fa0'}
const scope=box.test.quotaScope({connectionId:'a',profile:'p'},'s')
function render(scope,visible=true){hook=0;queries.length=0;return box.test.QuotaPanel({C,scope,visible})}
let view=render(scope)
assert.equal(queries[0].enabled,true);assert.equal(queries[0].refetchInterval,300000)
assert.equal(queries[1].enabled,false);assert.equal(queries[1].refetchInterval,false)
assert.equal(view.tag,'details');assert.equal(view.props.open,undefined)
vm.runInContext('saveSettings({quotaCacheEnabled:true})',box)
render(scope);assert.equal(queries[1].enabled,true);assert.equal(queries[1].refetchInterval,60000)
assert.equal(saved.get('settings').quotaCacheEnabled,true)
render(scope,false);assert.equal(queries[0].enabled,false);assert.equal(queries[1].enabled,false)
assert.equal(queries[0].refetchInterval,false);assert.equal(queries[1].refetchInterval,false)
render(null);assert.equal(queries[0].enabled,false);assert.equal(queries[1].enabled,false)
assert.equal(queries[0].placeholderData,undefined)
render(scope);const k=JSON.stringify(queries[0].queryKey)
render({...scope,connectionId:'b'});assert.notEqual(JSON.stringify(queries[0].queryKey),k)
console.log('PASS: shipped query policy, cache opt-in, visibility, no owner, exact keys and no previous-account placeholder')
