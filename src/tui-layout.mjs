function terminalWidth(columns=80) {return Math.max(8,Math.min(62,Math.floor(Number(columns)||80)-4))}
function terminalText(text,width) {const clean=String(text||'').replace(/[\x00-\x1f\x7f-\x9f]/g,'').replace(/[^\x20-\x7e]/g,'?');return clean.length>width?clean.slice(0,Math.max(0,width-1))+'~':clean.padEnd(width)}
function terminalRows(board,width,now=Date.now(),comfortable=false) {
 const entries=board.entries||[],ok=entries.filter(e=>e.status==='ok').length,err=entries.filter(e=>e.status==='err').length,run=entries.filter(e=>e.status==='run').length
 const rows=[`LOT MAP | ${ok} OK  ${err} ERR  ${run} OPEN`, 'Quota: unavailable in terminal']
 for(const e of entries.slice(-(comfortable?4:2)).reverse()) {const elapsed=Math.max(0,(e.endedAt||now)-e.startedAt);rows.push(`${e.status==='err'?'ERR':e.status==='run'?'RUN':' OK'} ${e.label} | ${(elapsed/1000).toFixed(1)}s`)}
 while(rows.length<(comfortable?6:4))rows.push('No recent activity')
 return rows.map(x=>terminalText(x,width))
}
function terminalOptions(raw={}) {return {layout:raw.layout==='map'?'map':'compact',theme:THEME_NAMES.includes(raw.theme)?raw.theme:'auto',motion:['auto','reduced','off'].includes(raw.motion)?raw.motion:'auto',density:raw.density==='comfortable'?'comfortable':'compact'}}
