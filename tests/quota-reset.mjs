import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c);vm.runInContext(readFileSync(new URL('../src/quota.js',import.meta.url),'utf8')+'\nglobalThis.api={quotaResetInfo,quotaWindowText}',c)
const {quotaResetInfo:r,quotaWindowText:w}=c.api
const now=Date.parse('2026-11-21T12:00:00Z')
assert.equal(r(now+7500000,now,'Asia/Bangkok').countdown,'in 2h 5m')
assert.match(r(now+7500000,now,'Asia/Bangkok').at,/21[:.]05/)
assert.equal(r(now+86460000,now).countdown,'in 1d 1m')
assert.equal(r(now+1,now).countdown,'in 1m')
assert.equal(r(now,now).expired,true)
assert.match(r(null,now).countdown,/unavailable/)
assert.doesNotThrow(()=>r(now+60000,now,'not-a-zone'))
assert.equal(w({remaining:0,reset:now+60000,stale:false},now).allowance,'0.0% / 100% remaining')
assert.equal(w({remaining:100,reset:null,stale:false},now).allowance,'100.0% / 100% remaining')
assert.match(w({remaining:50,reset:now+60000,stale:true},now).allowance,/unconfirmed/)
assert.match(w({remaining:50,reset:now-1,stale:false},now).allowance,/unconfirmed/)
assert.notEqual(r(now+120000,now).countdown,r(now+120000,now+60000).countdown)
console.log('PASS: remaining percent, timezone/reset clock, countdown, zero/full, expired/stale/missing')
