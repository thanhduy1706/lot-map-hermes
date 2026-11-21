// Hermes adapter for the original alexeyw/lot-map SVG renderer (MIT).
// Upstream rendering, geometry, icons, colors, motion and feed folding are bundled above.
// Hermes events are mapped to its Board; tool arguments/results are never stored.
import { host, useValue, ROUTES_AREA, SIDEBAR_NAV_AREA, PALETTE_AREA } from '@hermes/plugin-sdk'
import React from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const sessions = new Map()
const listeners = new Set()
const emit = () => { for (const fn of listeners) fn() }
const IDS = { You: 'you', Model: 'model', Memory: 'memory', Files: 'files', Shell: 'shell', Network: 'web', Browser: 'browser', Agents: 'agents', Skills: 'skills', Hooks: 'hooks' }
function classify(name) {
  const n = String(name || '').toLowerCase()
  if (/memory|recall|remember|slm_|vibo/.test(n)) return 'Memory'
  if (/browser|computer.use|desktop_preview|drive_preview|screenshot|vision/.test(n)) return 'Browser'
  if (/delegate|agent|cron|process_manage|todo_list|plan_mode/.test(n)) return 'Agents'
  if (/skill|plugin|catalog|connector|tool_search|tool_describe/.test(n)) return 'Skills'
  if (/hook/.test(n)) return 'Hooks'
  if (/web|search_query|fetch|extract|finance|weather|sports|maps|image_query/.test(n)) return 'Network'
  if (/terminal|execute_code|shell|patch/.test(n)) return 'Shell'
  if (/file|read|write|search_files|git|pdf|xlsx|docx/.test(n)) return 'Files'
  return 'Shell'
}
function getSession(id) {
  if (!sessions.has(id)) sessions.set(id, { rows: [], running: new Map(), counts: {}, errors: {}, turn: false, updated: 0 })
  if (sessions.size > 24) sessions.delete(sessions.keys().next().value)
  return sessions.get(id)
}
function receive(event) {
  const id = String(event?.session_id || '')
  if (!id) return
  const s = getSession(id), p = event.payload || {}, type = event.type, now = Date.now()
  if (type === 'message.start') {
    s.turn = true; s.errors = {}
    s.rows.push({ label: 'new message', station: 'You', at: now, done: true })
    s.rows.push({ label: 'model step', station: 'Model', at: now, done: false })
    s.counts.You = (s.counts.You || 0) + 1
    s.counts.Model = (s.counts.Model || 0) + 1
  } else if (type === 'tool.start') {
    const name = String(p.name || 'tool').slice(0, 64), station = classify(name)
    const last = s.rows[s.rows.length - 1]
    if (last?.station === 'Model' && !last.done) { last.done = true; last.elapsed = now - last.at }
    const row = { label: name, station, at: now, done: false, error: false }
    s.rows.push(row); s.running.set(String(p.tool_id || name), row)
    s.counts[station] = (s.counts[station] || 0) + 1
  } else if (type === 'tool.complete') {
    const name = String(p.name || 'tool').slice(0, 64), key = String(p.tool_id || name)
    const row = s.running.get(key)
    if (row) { row.done = true; row.elapsed = now - row.at; row.error = !!p.is_error; s.running.delete(key) }
    if (p.is_error) { const station = row?.station || classify(name); s.errors[station] = (s.errors[station] || 0) + 1 }
  } else if (type === 'message.complete') {
    s.turn = false
    for (const row of s.running.values()) { row.done = true; row.elapsed = now - row.at }
    s.running.clear()
    const model = [...s.rows].reverse().find(row => row.station === 'Model' && !row.done)
    if (model) { model.done = true; model.elapsed = now - model.at }
    s.rows.push({ label: 'answer ready', station: 'Model', at: now, done: true, error: p.status === 'error', mark: 'done' })
  } else return
  s.rows = s.rows.slice(-80); s.updated = now; emit()
}
function asBoard(s, model, usage) {
  const counts = {}, faults = {}
  for (const [name, number] of Object.entries(s.counts)) counts[IDS[name]] = number
  for (const [name, number] of Object.entries(s.errors)) faults[IDS[name]] = number
  const entries = s.rows.map((row, i) => ({
    id: `${row.at}-${i}`, station: IDS[row.station] || 'shell', label: row.label,
    from: 'core', startedAt: row.at, status: row.done ? row.error ? 'err' : 'ok' : 'run',
    ...(row.done ? { endedAt: row.at + (row.elapsed || 0) } : {}),
    ...(row.mark ? { mark: row.mark } : {})
  }))
  return { entries, counts, faults, model: String(model || ''),
    ...(Number.isFinite(usage?.context_percent) && usage.context_max > 0 ? { context: usage.context_percent } : {}) }
}
let theme = 'dark'
let storage
const PALETTE = {
  dark: { ground: '#0a0c11', raised: '#12151c', line: '#272c36', bone: '#ebe6dc', ash: '#9ba1ab', dim: '#6b7280', accent: '#e1ac6e', hot: '#f0c595', red: '#e8654f', mem: '#62c7ba' },
  light: { ground: '#f5f2ea', raised: '#ffffff', line: '#cfc9bc', bone: '#1f2228', ash: '#5f6570', dim: '#8b909a', accent: '#b8762a', hot: '#8f560f', red: '#c5402b', mem: '#1c8c81' }
}
function elapsed(ms) { return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s` }
function Pane({ expanded = false } = {}) {
  const id = useValue(host.state.focusedSessionId)
  const model = useValue(host.state.model)
  const usage = useValue(host.state.focusedUsage)
  const [, setTick] = React.useState(0)
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1)
    listeners.add(fn)
    const timer = setInterval(() => { if (sessions.get(String(id))?.updated) fn() }, 1000)
    return () => { listeners.delete(fn); clearInterval(timer) }
  }, [id])
  const s = sessions.get(String(id)) || { rows: [], running: new Map(), counts: {}, errors: {} }
  const board = asBoard(s, model, usage)
  const C = PALETTE[theme]
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const setup = LotMapOriginal.setupFrom({ coreName: 'HERMES', theme, motion: reduced ? 'reduced' : 'full', logRows: 16 })
  const svg = LotMapOriginal.drawMap(board, Date.now(), setup).replace('<svg ', '<svg style="display:block;width:100%;height:auto" ')
  const now = LotMapOriginal.nowParts(board, setup.t)
  const rows = LotMapOriginal.foldRows(board.entries)
  const active = s.running.size > 0 || s.turn
  const total = Object.values(s.counts).reduce((a, b) => a + b, 0)
  const mono = 'SF Mono, ui-monospace, Menlo, Consolas, monospace'
  const headerCell = { fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '.10em', textTransform: 'uppercase' }
  return jsxs('div', { style: { height: '100%', overflowY: 'auto', width: '100%', boxSizing: 'border-box', maxWidth: expanded ? 920 : undefined, margin: expanded ? '0 auto' : undefined, background: C.ground, color: C.bone, fontFamily: mono, scrollbarColor: `${C.line} ${C.ground}` }, children: [
    jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '14px 17px 12px', borderBottom: `1px solid ${C.line}` }, children: [
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }, children: [
        jsx('span', { style: { width: 7, height: 7, flexShrink: 0, borderRadius: '50%', background: active ? C.accent : C.dim, boxShadow: active ? `0 0 10px ${C.accent}` : 'none' }, 'aria-hidden': true }),
        jsx('span', { style: { ...headerCell, color: C.bone, whiteSpace: 'nowrap' }, children: 'LOT MAP' }),
        jsx('span', { style: { ...headerCell, fontWeight: 400, color: C.dim, letterSpacing: '.04em', whiteSpace: 'nowrap' }, children: active ? 'LIVE' : 'IDLE' })
      ] }),
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }, children: [
        jsx('button', { type: 'button', title: expanded ? 'Back to chat' : 'Open full map', 'aria-label': expanded ? 'Back to chat' : 'Open full map', onClick: () => host.navigate(expanded ? '/' : '/lot-map'), style: { border: `1px solid ${C.line}`, borderRadius: 6, background: C.raised, color: C.ash, padding: '4px 8px', cursor: 'pointer', fontSize: 12, lineHeight: '14px' }, children: expanded ? '↩ CHAT' : '↗' }),
        jsx('button', { type: 'button', title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} map`, 'aria-label': `Switch to ${theme === 'dark' ? 'light' : 'dark'} map`, onClick: () => { theme = theme === 'dark' ? 'light' : 'dark'; storage?.set('theme', theme); emit() }, style: { border: `1px solid ${C.line}`, borderRadius: 6, background: C.raised, color: C.ash, padding: '4px 8px', cursor: 'pointer', fontSize: 12, lineHeight: '14px' }, children: theme === 'dark' ? '☼' : '☾' })
      ] })
    ] }),
    jsx('div', { style: { width: '100%', boxSizing: 'border-box', maxWidth: expanded ? 720 : 560, margin: '0 auto', padding: '3px 4px 0' }, dangerouslySetInnerHTML: { __html: svg }, 'aria-label': 'Lot Map — live activity' }),
    jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '1px 17px 13px', borderBottom: `1px solid ${C.line}` }, children: [
      jsx('span', { style: { color: active ? C.accent : C.ash, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: now.what, children: active ? `●  ${now.what}` : now.what }),
      jsx('span', { style: { color: C.dim, fontSize: 10, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }, children: now.meter })
    ] }),
    jsxs('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 17px 8px' }, children: [
      jsx('span', { style: { ...headerCell, color: C.bone }, children: 'RECENT ACTIVITY' }),
      jsx('span', { style: { ...headerCell, color: C.dim, fontVariantNumeric: 'tabular-nums' }, children: `${total} EVENT${total === 1 ? '' : 'S'}` })
    ] }),
    jsx('div', { style: { padding: '0 17px 22px', fontSize: 11 }, children: rows.length ? rows.map((r, i) => {
      const e = r.entry, running = e.status === 'run', bad = e.status === 'err'
      const tone = bad ? C.red : running ? e.station === 'memory' ? C.mem : C.accent : C.dim
      return jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, minHeight: 29, borderBottom: `1px solid ${C.line}`, fontVariantNumeric: 'tabular-nums' }, children: [
        jsx('span', { style: { width: 11, flexShrink: 0, color: tone, fontSize: 12 }, children: bad ? '✕' : running ? '●' : '·' }),
        jsx('span', { style: { width: 61, flexShrink: 0, color: running ? C.bone : C.ash }, children: setup.t.stations[e.station] }),
        jsx('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: running ? tone : C.ash }, title: e.label, children: `${e.label}${r.times > 1 ? ` +${r.times - 1}` : ''}` }),
        jsx('span', { style: { flexShrink: 0, color: running ? tone : C.dim, textAlign: 'right' }, children: running ? 'RUNNING' : e.mark ? '—' : elapsed(r.tookMs) })
      ] }, `${e.id}-${i}`)
    }) : jsx('div', { style: { color: C.dim, padding: '12px 0', lineHeight: '18px' }, children: 'No activity yet. Start a conversation to trace its path.' }) })
  ] })
}
export default {
  id: 'lot-map', name: 'Lot Map for Hermes',
  register(ctx) {
    storage = ctx.storage
    theme = storage?.get('theme', 'dark') === 'light' ? 'light' : 'dark'
    for (const type of ['message.start', 'message.complete', 'tool.start', 'tool.complete']) ctx.onEvent(type, receive)
    ctx.onDispose(() => { sessions.clear(); listeners.clear(); storage = undefined })
    ctx.register({ id: 'pane', area: 'panes', title: 'Lot Map', data: { placement: 'right', width: '390px' }, render: () => jsx(Pane, {}) })
    ctx.register({ id: 'page', area: ROUTES_AREA, data: { path: '/lot-map' }, render: () => jsx(Pane, { expanded: true }) })
    ctx.register({ id: 'nav', area: SIDEBAR_NAV_AREA, data: { path: '/lot-map', label: 'Lot Map', codicon: 'map' } })
    ctx.register({ id: 'open', area: PALETTE_AREA, data: { id: 'lot-map.open', label: 'Open Lot Map', keywords: ['map', 'activity', 'tools'], run: () => host.navigate('/lot-map') } })
  }
}
