import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c)
for(const f of ['quota.js','themes.js','settings.js'])vm.runInContext(readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),c)
vm.runInContext('globalThis.api={filterQuotaProviders,quotaProviderOptions,structuredQuota,normalizeSettings}',c)
const a=c.api,now=Date.now(),data={fetched_at:new Date(now).toISOString(),timezone:'UTC',providers:{codex:{label:'Codex',windows:[{used_percent:95}]},copilot:{label:'Copilot',windows:[{used_percent:10}]}}}
assert.equal(a.quotaProviderOptions(data).length,2)
let filtered=a.filterQuotaProviders(data,['codex']);assert.equal(filtered.providers.codex,undefined)
assert.equal(a.structuredQuota(filtered,now).windows[0].used,10)
assert.equal(a.structuredQuota(a.filterQuotaProviders(data,['codex','copilot']),now).windows.length,0)
assert.equal(Object.keys(data.providers).length,2);assert.equal(filtered.timezone,'UTC')
assert.equal(a.normalizeSettings({quotaHiddenProviders:['codex','codex',null,2]}).quotaHiddenProviders.length,1)
assert.equal(a.normalizeSettings().quotaHiddenProviders.length,0)
const custom=a.filterQuotaProviders(data,[],['codex']);assert.equal(Object.keys(custom.providers).join(','),'codex')
assert.equal(Object.keys(a.filterQuotaProviders(data,[],[]).providers).length,0)
assert.equal(a.normalizeSettings({quotaProviderMode:'custom',quotaShownProviders:['codex','codex',null]}).quotaShownProviders.length,1)
const added={...data,providers:{...data.providers,newProvider:{windows:[]}}};assert.equal(a.filterQuotaProviders(added,[],['codex']).providers.newProvider,undefined)
console.log('PASS: provider selection filters summary/details, hide all, no mutation and validated persistence')
