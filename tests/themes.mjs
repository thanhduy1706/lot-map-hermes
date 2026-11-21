import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={setTimeout,clearTimeout};vm.createContext(c)
for(const f of ['quota.js','themes.js','settings.js','provider.js'])vm.runInContext(readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),c)
vm.runInContext("globalThis.api={themePalette,resolveMapTheme,THEME_NAMES,normalizeSettings,providerForScope}",c)
const a=c.api;assert.equal(a.THEME_NAMES.length,8)
for(const name of a.THEME_NAMES){const p=a.themePalette(name);assert.equal(Object.keys(p).length,10);for(const v of Object.values(p))assert.match(v,/^#[0-9a-f]{6}$/)}
assert.equal(a.resolveMapTheme(a.normalizeSettings(),'anthropic'),'ember');assert.equal(a.resolveMapTheme(a.normalizeSettings(),'openai-codex'),'emerald');assert.equal(a.resolveMapTheme(a.normalizeSettings(),'unknown'),'obsidian')
assert.equal(a.resolveMapTheme(a.normalizeSettings({themeMode:'manual',palette:'rose'}),'anthropic'),'rose')
assert.equal(a.resolveMapTheme(a.normalizeSettings({providerThemes:{anthropic:'azure'}}),'anthropic'),'azure')
let called;const sdk={profileRoutes:async()=>[{connectionId:'b',profile:'same',targetProfile:'p'}],requestProfile:async(...args)=>{called=args;return{provider:'Nous'}}}
assert.equal(await a.providerForScope(sdk,{connectionId:'b',profile:'same',sessionId:'s'}),'nous');assert.equal(called[2].session_id,'s')
await assert.rejects(a.providerForScope(sdk,{connectionId:'a',profile:'same',sessionId:'s'}))
assert.equal(a.resolveMapTheme(a.normalizeSettings(),'constructor'),'obsidian')
await assert.rejects(a.providerForScope({profileRoutes:()=>new Promise(()=>{})},{sessionId:'s'},5),/timed out/)
console.log('PASS: eight themes, manual/auto/provider fallback and exact route')
