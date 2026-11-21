import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c)
for(const f of ['themes.js','tui-layout.mjs'])vm.runInContext(readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),c)
vm.runInContext('globalThis.api={terminalWidth,terminalRows,terminalOptions,terminalText}',c)
const a=c.api;assert.equal(a.terminalWidth(80),62);assert.equal(a.terminalWidth(30),26)
const board={entries:[{label:'long'.repeat(40)+'\x1b[31m',status:'run',startedAt:0}]};for(const width of [18,26,60]){const rows=a.terminalRows(board,width,1000);assert.equal(rows.length,4);for(const r of rows){assert.equal(r.length,width);assert.ok(!r.includes('\x1b'))}}
assert.equal(a.terminalRows({entries:[]},40,0,true).length,6);assert.equal(a.terminalOptions({layout:'bad'}).layout,'compact')
console.log('PASS: stable compact rows, terminal widths, sanitized names and safe options')
