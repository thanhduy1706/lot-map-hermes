import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c)
for(const f of ['quota.js','themes.js','settings.js'])vm.runInContext(readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),c)
vm.runInContext("globalThis.api={normalizeSettings,loadMapSettings}",c)
const a=c.api;assert.equal(a.normalizeSettings().themeMode,'auto');assert.equal(a.normalizeSettings({palette:'evil',motion:'x'}).palette,'obsidian')
assert.equal(a.normalizeSettings({quotaWarn:99,quotaCritical:2}).quotaCritical,99)
const s=a.normalizeSettings({providerThemes:{'bad.key':'rose',nous:'violet'}});assert.equal(s.providerThemes.nous,'violet');assert.equal(s.providerThemes['bad.key'],undefined)
s.providerThemes.nous='rose';assert.equal(a.normalizeSettings().providerThemes.nous,undefined)
const store={get:(key,fallback)=>({theme:'light',quotaCacheEnabled:true}[key]??fallback)};const old=a.loadMapSettings(store);assert.equal(old.palette,'paper');assert.equal(old.themeMode,'manual');assert.equal(old.quotaCacheEnabled,true)
assert.equal(a.loadMapSettings({get:(k,f)=>f}).themeMode,'auto')
assert.equal(a.loadMapSettings({get:()=>({version:999,palette:'rose'})}).palette,'obsidian')
assert.equal(a.normalizeSettings({providerThemes:JSON.parse('{"__proto__":"rose"}')}).providerThemes.__proto__,Object.getPrototypeOf(a.normalizeSettings().providerThemes))
console.log('PASS: settings defaults, validation, independent maps, legacy manual migration and opt-in')
