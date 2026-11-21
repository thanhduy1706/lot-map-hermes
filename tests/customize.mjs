import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c)
for(const f of ['quota.js','themes.js','settings.js'])vm.runInContext(readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),c)
vm.runInContext('globalThis.api={normalizeSettings,DEFAULT_SETTINGS}',c)
const defaults=c.api.DEFAULT_SETTINGS;const flags=Object.keys(defaults).filter(k=>typeof defaults[k]==='boolean')
assert.ok(flags.length>=25)
const hidden=c.api.normalizeSettings(Object.fromEntries(flags.map(k=>[k,false])))
for(const key of flags)assert.equal(hidden[key],false,key)
assert.equal(c.api.normalizeSettings({fontSize:99}).fontSize,18)
assert.equal(c.api.normalizeSettings({mapWidth:1}).mapWidth,240)
assert.equal(c.api.normalizeSettings({activityRows:500}).activityRows,80)
assert.equal(c.api.normalizeSettings({cornerRadius:-1}).cornerRadius,0)
assert.equal(c.api.normalizeSettings({fontFamily:'invalid'}).fontFamily,'mono')
const source=readFileSync(new URL('../src/desktop-adapter.js',import.meta.url),'utf8')
assert.ok(!/[\u00c0-\u024f\u1e00-\u1eff]/u.test(source),'All custom UI text must be English')
console.log('PASS: '+flags.length+' visibility/data controls, sizing bounds and English-only custom UI')
