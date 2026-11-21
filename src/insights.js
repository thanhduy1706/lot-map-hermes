// Bounded local operational metrics, not provider billing estimates.
function insightSummary(rows, now = Date.now(), slowMs = 30_000) {
  const tools = rows.filter(r => r.kind === 'tool')
  const completed = tools.filter(r => r.done && !r.unknown && !r.cancelled)
  const failed = completed.filter(r => r.error).length
  const running = tools.filter(r => !r.done)
  return { completed: completed.length, failed, succeeded: completed.length - failed,
    unknown: tools.filter(r => r.unknown || r.cancelled).length, running: running.length,
    slow: running.filter(r => now - r.at >= slowMs).map(r => ({name:r.label, ms:Math.max(0,now-r.at)})).sort((a,b)=>b.ms-a.ms),
    slowest: completed.filter(r=>Number.isFinite(r.elapsed)).slice().sort((a,b)=>b.elapsed-a.elapsed).slice(0,3),
    elapsed: tools.length ? Math.max(0, (running.length ? now : Math.max(...tools.map(r => r.at + (r.elapsed || 0)))) - Math.min(...tools.map(r=>r.at))) : 0 }
}
function usageInsights(usage) {
  const num = n => typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : null
  return {input:num(usage?.input),output:num(usage?.output),cost:num(usage?.cost_usd),context:num(usage?.context_percent),contextMax:num(usage?.context_max),estimated:usage?.context_estimated === true}
}
function filterInsightRows(rows, mode, query) {
  const q = String(query || '').toLowerCase().slice(0,100)
  return rows.filter(r => (!q || r.label.toLowerCase().includes(q)) && (mode === 'errors' ? r.error || r.unknown || r.cancelled : mode === 'running' ? !r.done : true))
}
