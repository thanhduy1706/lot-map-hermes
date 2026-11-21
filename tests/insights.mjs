import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c);vm.runInContext(readFileSync(new URL('../src/insights.js',import.meta.url),'utf8')+'\nglobalThis.i={insightSummary,usageInsights,filterInsightRows}',c)
const rows=[{kind:'tool',label:'terminal',at:0,done:false},{kind:'tool',label:'read_file',at:1,done:true,error:true,elapsed:20},{kind:'tool',label:'cancel',at:2,done:true,cancelled:true},{kind:'tool',label:'missing',at:2,done:true,unknown:true},{kind:'tool',label:'ok',at:3,done:true,elapsed:3},{kind:'message',label:'model',at:0,done:true}]
const s=c.i.insightSummary(rows,31000);assert.equal(s.completed,2);assert.equal(s.succeeded,1);assert.equal(s.failed,1);assert.equal(s.running,1);assert.equal(s.unknown,2);assert.equal(s.slow[0].name,'terminal')
assert.equal(c.i.usageInsights({input:0,output:0,cost_usd:0}).cost,0);assert.equal(c.i.usageInsights({}).cost,null)
assert.equal(c.i.filterInsightRows(rows,'errors','').length,3);assert.equal(c.i.filterInsightRows(rows,'running','TERMINAL').length,1)
assert.equal(c.i.insightSummary([],0).elapsed,0)
console.log('PASS: operational metrics, unknown/cancelled states, slow tools, zero/missing billing and filters')
