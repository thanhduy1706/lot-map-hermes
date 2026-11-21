// Pure quota parsing and public SDK routing. No credential or direct file access.
const finiteQuota = n => typeof n === 'number' && Number.isFinite(n)
function quotaScope(owner, sessionId) {
  return owner && typeof owner.connectionId === 'string' && typeof owner.profile === 'string' && sessionId
    ? { connectionId: owner.connectionId, profile: owner.profile, sessionId: String(sessionId) } : null
}
function quotaKey(scope, source) { return ['lot-map', 'quota', source, scope?.connectionId || '', scope?.profile || '', scope?.sessionId || ''] }
function quotaThresholds(warn, critical) {
  const w = finiteQuota(warn) ? Math.max(1, Math.min(98, warn)) : 80
  return { warn: w, critical: finiteQuota(critical) ? Math.max(w + 1, Math.min(100, critical)) : Math.max(w + 1, 95) }
}
function nativeQuota(data, now = Date.now()) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.lines)) throw new Error('Unsupported account usage response')
  return { lines: [...data.lines, ...(Array.isArray(data.nous_lines) ? data.nous_lines : [])].filter(x => typeof x === 'string').slice(0, 60).map(x => x.slice(0, 1500)), receivedAt: now }
}
function parseQuotaOutput(output) {
  // Diagnostics may surround a single CLI JSON object; do not evaluate output.
  const text = String(output || '').slice(0, 1_000_000); let depth = 0, start = -1, quoted = false, escaped = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) { if (escaped) escaped = false; else if (c.charCodeAt(0) === 92) escaped = true; else if (c === '"') quoted = false; continue }
    if (c === '"' && depth) quoted = true
    else if (c === '{') { if (!depth) start = i; depth++ }
    else if (c === '}' && depth && --depth === 0) {
      try { const value = JSON.parse(text.slice(start, i + 1)); if (value.providers && typeof value.providers === 'object') return value } catch { /* try next block */ }
    }
  }
  throw new Error('Quota cache response unavailable')
}
function quotaProviderOptions(data) {
 return Object.entries(data?.providers||{}).slice(0,100).map(([id,p])=>({id,label:typeof p?.label==='string'?p.label.slice(0,120):id}))
}
function filterQuotaProviders(data, hidden=[], shown=null) {
 if(!data||typeof data!=='object')return data
 const excluded=new Set(hidden)
 return {...data,providers:Object.fromEntries(Object.entries(data.providers||{}).filter(([id])=>Array.isArray(shown)?shown.includes(id):!excluded.has(id)))}
}
function structuredQuota(data, now = Date.now(), thresholds = quotaThresholds()) {
  const fetched = Date.parse(data?.fetched_at)
  const stale = !Number.isFinite(fetched) || now - fetched > 30 * 60_000 || fetched > now + 60_000
  const windows = []
  for (const [id, provider] of Object.entries(data?.providers || {}).slice(0, 30)) {
    if (!provider || typeof provider !== 'object') continue
    const accounts = Array.isArray(provider?.accounts) ? provider.accounts : [provider]
    for (const record of accounts.slice(0, 20)) {
      if (!record || typeof record !== 'object') continue
      for (const w of (Array.isArray(record?.windows) ? record.windows : []).slice(0, 20)) {
        if (!w || typeof w !== 'object') continue
        const reset = Date.parse(w.reset_at), expired = Number.isFinite(reset) && reset <= now
        const used = finiteQuota(w.used_percent) && w.used_percent >= 0 && w.used_percent <= 100 ? w.used_percent : null
        const unavailable = !!record.unavailable_reason || !!provider.unavailable_reason
        windows.push({ provider: String(`${provider.label || id}${record !== provider ? ` · ${record?.label || 'Account'}` : ''}`).slice(0,120), label: String(w.label || 'Window').slice(0,80), used, remaining: used === null ? null : 100 - used, reset: Number.isFinite(reset) ? reset : null, stale: stale || expired || unavailable,
          level: stale || expired || unavailable || used === null ? 'unknown' : used >= thresholds.critical ? 'critical' : used >= thresholds.warn ? 'warning' : 'normal' })
      }
      if (record?.unavailable_reason || provider?.unavailable_reason) windows.push({provider:String(`${provider.label || id}${record !== provider ? ` · ${record?.label || 'Account'}` : ''}`).slice(0,120),label:'Unavailable',used:null,remaining:null,reset:null,stale:true,level:'unknown'})
    }
  }
  return { fetchedAt: Number.isFinite(fetched) ? fetched : null, stale, windows }
}
function quotaResetInfo(reset, now = Date.now(), timeZone) {
  if (typeof reset !== 'number' || !Number.isFinite(reset)) return { at: 'Reset time not reported', countdown: 'Countdown unavailable', expired: false }
  let options = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', day: '2-digit', month: '2-digit', timeZoneName: 'short' }
  if (typeof timeZone === 'string' && timeZone) options.timeZone = timeZone
  let at
  try { at = new Intl.DateTimeFormat(undefined, options).format(new Date(reset)) }
  catch { delete options.timeZone; at = new Intl.DateTimeFormat(undefined, options).format(new Date(reset)) }
  if (reset <= now) return { at, countdown: 'Reset time passed; awaiting fresh quota', expired: true }
  const minutes = Math.ceil((reset - now) / 60000), days = Math.floor(minutes / 1440), hours = Math.floor((minutes % 1440) / 60), mins = minutes % 60
  const parts = []; if (days) parts.push(`${days}d`); if (hours) parts.push(`${hours}h`); if (mins || !parts.length) parts.push(`${mins}m`)
  return { at, countdown: `in ${parts.join(' ')}`, expired: false }
}
function quotaWindowText(window, now = Date.now(), timeZone) {
  const timing = quotaResetInfo(window?.reset, now, timeZone)
  const available = window && !window.stale && !timing.expired && finiteQuota(window.remaining)
  return { allowance: available ? `${window.remaining.toFixed(1)}% / 100% remaining` : 'Remaining quota unconfirmed', reset: timing.at, countdown: timing.countdown }
}
function quotaGlance(window, now = Date.now(), timeZone) {
  const text = quotaWindowText(window,now,timeZone)
  const current = !!window && !window.stale && finiteQuota(window.remaining) && !(finiteQuota(window.reset) && window.reset <= now)
  let reset = '—'
  if (finiteQuota(window?.reset)) {
    const opts={hour:'2-digit',minute:'2-digit',hourCycle:'h23'}
    if(typeof timeZone==='string'&&timeZone)opts.timeZone=timeZone
    try{reset=new Intl.DateTimeFormat(undefined,opts).format(new Date(window.reset))}catch{delete opts.timeZone;reset=new Intl.DateTimeFormat(undefined,opts).format(new Date(window.reset))}
    // A future calendar date must not look like today's reset.
    const dateOpts={year:'numeric',month:'2-digit',day:'2-digit'};if(opts.timeZone)dateOpts.timeZone=opts.timeZone
    const day=new Intl.DateTimeFormat('en-CA',dateOpts)
    if(day.format(new Date(window.reset))!==day.format(new Date(now))){const d={day:'2-digit',month:'2-digit'};if(opts.timeZone)d.timeZone=opts.timeZone;reset+=' · '+new Intl.DateTimeFormat(undefined,d).format(new Date(window.reset))}
  }
  return {remaining:current?`${Number(window.remaining.toFixed(1))}%`:'—',reset,countdown:text.countdown.startsWith('in ')?text.countdown.slice(3).replaceAll(' ',''):finiteQuota(window?.reset)&&window.reset<=now?'↻':'—',level:current?window.level:'unknown',current,title:`${text.allowance}. Reset: ${text.reset}. ${text.countdown}`}
}
async function quotaRequest(sdk, scope, source, timeoutMs = 12_000) {
  if (!scope) throw new Error('Select a session with an identifiable owner')
  let timer, expired = false
  try {
    return await Promise.race([
      (async () => {
        const routes = await sdk.profileRoutes()
        const matches = routes.filter(r => r.connectionId === scope.connectionId && r.profile === scope.profile)
        if (matches.length !== 1) throw new Error('Profile route unavailable or ambiguous')
        if (expired) throw new Error('Quota request timed out')
        const route = matches[0]
        const result = await sdk.requestProfile(route, source === 'cache' ? 'cli.exec' : 'session.account_usage', source === 'cache'
          ? {argv:['--profile', route.targetProfile, 'quota','status','--json','--cached']}
          : {session_id:scope.sessionId}, timeoutMs)
        if (source === 'cache') {
          if (result?.blocked || result?.code !== 0) throw new Error('Quota plugin unavailable or access denied')
          return parseQuotaOutput(result.output)
        }
        return nativeQuota(result)
      })(),
      new Promise((_, reject) => { timer = setTimeout(() => { expired = true; reject(new Error('Quota request timed out')) }, timeoutMs) })
    ])
  } finally { clearTimeout(timer) }
}
