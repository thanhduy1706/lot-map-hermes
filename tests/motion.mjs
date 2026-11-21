import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const c={};vm.createContext(c)
vm.runInContext(readFileSync(new URL('../src/motion.js',import.meta.url),'utf8')+'\nglobalThis.api={motionMode,mapSignature,stableMap}',c)
const a=c.api;assert.equal(a.motionMode('auto',true,true),'reduced');assert.equal(a.motionMode('auto',false,false),'off');assert.equal(a.motionMode('off',false,true),'off')
let renders=0;const board={entries:[]};let previous=a.stableMap(null,a.mapSignature(board,'emerald','full'),()=>{renders++;return '<svg/>'})
assert.equal(a.stableMap(previous,a.mapSignature({...board},'emerald','full'),()=>{renders++;return 'wrong'}),previous);assert.equal(renders,1)
assert.notEqual(a.stableMap(previous,a.mapSignature(board,'paper','full'),()=>'<svg/>'),previous)
console.log('PASS: motion policy, reduced/hidden/off and stable SVG across clock ticks')
