import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c);vm.runInContext(readFileSync(new URL('../src/quota.js',import.meta.url),'utf8')+'\nglobalThis.glance=quotaGlance',c)
const now=Date.parse('2026-11-21T12:00:00Z'),reset=now+7500000
const g=c.glance({remaining:16,used:84,reset,stale:false,level:'warning'},now,'Asia/Bangkok')
assert.equal(g.remaining,'16%');assert.equal(g.reset,'21:05');assert.equal(g.countdown,'2h5m');assert.match(g.title,/100%/)
assert.equal(c.glance({remaining:0,reset,level:'critical'},now).remaining,'0%')
assert.equal(c.glance({remaining:100,reset,stale:true},now).remaining,'—')
assert.equal(c.glance({remaining:16,reset:now-1},now).countdown,'↻')
assert.equal(c.glance(null,now).countdown,'—')
assert.ok(c.glance({remaining:10,reset:now+86400000},now,'Asia/Bangkok').reset.length>5)
console.log('PASS: compact glance, accessible full text, zero/stale/expired/missing and next-day reset')
