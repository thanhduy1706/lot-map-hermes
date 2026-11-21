import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const context={setTimeout,clearTimeout}
vm.createContext(context)
vm.runInContext(readFileSync(new URL('../src/quota.js',import.meta.url),'utf8')+'\nglobalThis.q={quotaScope,quotaKey,quotaThresholds,nativeQuota,structuredQuota,parseQuotaOutput,quotaRequest}',context)
const q=context.q, now=Date.now(),fetched_at=new Date(now).toISOString()
assert.equal(q.parseQuotaOutput(JSON.stringify({providers:{p:{label:'slash \\ and quote \" and } brace',windows:[]}}})).providers.p.windows.length,0)
assert.equal(q.quotaScope(null,'s'),null)
assert.equal(q.structuredQuota({fetched_at,providers:{bad:null,nested:{accounts:[null,{windows:[null]}]}}},now).windows.length,0)
assert.notDeepEqual(q.quotaKey(q.quotaScope({connectionId:'a',profile:'same'},'s'),'cache'),q.quotaKey(q.quotaScope({connectionId:'b',profile:'same'},'s'),'cache'))
assert.equal(q.quotaThresholds(99,20).critical,99)
let data=q.structuredQuota({fetched_at,providers:{test:{windows:[{label:'zero',used_percent:0},{used_percent:95},{used_percent:null},{used_percent:100,reset_at:new Date(now-1).toISOString()}]}}},now)
assert.equal(data.windows[0].remaining,100);assert.equal(data.windows[0].level,'normal')
assert.equal(data.windows[1].level,'critical');assert.equal(data.windows[2].level,'unknown');assert.equal(data.windows[3].level,'unknown')
assert.equal(q.structuredQuota({fetched_at:new Date(now-1800001).toISOString(),providers:{p:{windows:[{used_percent:99}]}}},now).windows[0].level,'unknown')
assert.equal(q.structuredQuota({providers:{p:{windows:[{used_percent:0}]}}},now).stale,true)
assert.equal(q.structuredQuota({fetched_at,providers:{p:{unavailable_reason:'offline',windows:[{used_percent:10}]}}},now).windows[0].level,'unknown')
assert.equal(q.parseQuotaOutput('diagnostic\n'+JSON.stringify({fetched_at,providers:{p:{label:'quoted " string',windows:[]}}})+'\ntrailer').providers.p.label,'quoted " string')
assert.throws(()=>q.parseQuotaOutput('bad response'))
assert.equal(q.nativeQuota({lines:['remaining not reported'],nous_lines:[]},0).receivedAt,0)
assert.throws(()=>q.nativeQuota({}))
const calls=[],scope=q.quotaScope({connectionId:'b',profile:'same'},'session-b')
const sdk={profileRoutes:async()=>[{connectionId:'a',profile:'same',targetProfile:'one'},{connectionId:'b',profile:'same',targetProfile:'two'}],requestProfile:async(...args)=>{calls.push(args);return {lines:['Provider native text']}}}
await q.quotaRequest(sdk,scope,'native');assert.equal(calls[0][0].connectionId,'b');assert.equal(calls[0][2].session_id,'session-b')
sdk.requestProfile=async(...args)=>{calls.push(args);return {code:0,output:JSON.stringify({fetched_at,providers:{}})}}
await q.quotaRequest(sdk,scope,'cache');assert.equal(calls[1][2].argv.join(' '),'--profile two quota status --json --cached')
await assert.rejects(q.quotaRequest({...sdk,requestProfile:async()=>({code:1,blocked:true})},scope,'cache'))
await assert.rejects(q.quotaRequest({...sdk,profileRoutes:async()=>[]},scope,'native'))
await assert.rejects(q.quotaRequest({...sdk,requestProfile:async()=>new Promise(()=>{})},scope,'native',5),/timed out/)
let release;const old=q.quotaRequest({...sdk,requestProfile:()=>new Promise(r=>release=r)},scope,'native')
await new Promise(r=>setTimeout(r,0));release({lines:['old route']});await old
// Results remain keyed to the source/connection/profile/session captured for each query.
assert.notDeepEqual(q.quotaKey(scope,'native'),q.quotaKey({...scope,sessionId:'new'},'native'))
console.log('PASS: quota zeros/missing/stale/expiry, thresholds, exact routes, denial, native text, timeout and focus keys')
