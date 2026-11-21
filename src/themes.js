const THEME_COLORS = {
 obsidian:['#0a0c11','#12151c','#272c36','#ebe6dc','#a5acb8','#7f899a','#e1ac6e','#f0c595','#ed7a6a','#62c7ba'],
 paper:['#f5f2ea','#ffffff','#ccc6b9','#20252c','#58616d','#697482','#986021','#784308','#b73625','#18756b'],
 emerald:['#081411','#10231c','#244438','#e1f5eb','#9bbcae','#789a8c','#52d6a4','#96f2c7','#ff887c','#7edcce'],
 ember:['#160e0b','#261913','#493026','#f5e6dc','#c5a89b','#a28679','#f3a16d','#ffd2a1','#ff8585','#80cdbd'],
 azure:['#0a111e','#121e31','#283d59','#e4edfb','#a4bad5','#7f99b9','#76baff','#b7dcff','#fa8c8c','#6fd3cc'],
 violet:['#130e20','#20172f','#423256','#f0e8fb','#bca8d5','#a08ab8','#bba1ff','#dfccff','#ff8f9c','#7dd9cf'],
 rose:['#1a0d17','#2a1525','#503046','#fbe7f4','#d3a7c4','#b188a3','#f29acb','#ffd0eb','#ff9a89','#86d6c3'],
 midnight:['#080e18','#0f1928','#29384e','#dfecfb','#9eb4d0','#8099b7','#89a4ff','#cad5ff','#ff8e94','#64d8d0']
}
const THEME_NAMES = Object.keys(THEME_COLORS)
function themePalette(name) { const keys=['ground','raised','line','bone','ash','dim','accent','hot','red','mem'];return Object.fromEntries(keys.map((k,i)=>[k,(Object.hasOwn(THEME_COLORS,name)?THEME_COLORS[name]:THEME_COLORS.obsidian)[i]])) }
const PROVIDER_THEMES = {'openai':'emerald','openai-codex':'emerald','anthropic':'ember','claude':'ember','google':'azure','gemini':'azure','nous':'violet','openrouter':'rose','deepseek':'midnight'}
function resolveMapTheme(settings,provider) { if(settings.themeMode==='manual')return settings.palette;const id=String(provider||'').toLowerCase();return Object.hasOwn(settings.providerThemes||{},id)?settings.providerThemes[id]:Object.hasOwn(PROVIDER_THEMES,id)?PROVIDER_THEMES[id]:'obsidian' }
function recolorMap(svg,name) { const keys=['ground','raised','line','spoke','bone','ash','dim','accent','hot','red','mem','memHot','trail'];const colors=name==='paper'?['#f5f2ea','#ffffff','#cfc9bc','#e3ded2','#1f2228','#5f6570','#8b909a','#b8762a','#8f560f','#c5402b','#1c8c81','#136a62','#9c978b']:['#0a0c11','#12151c','#272c36','#1a1e27','#ebe6dc','#9ba1ab','#6b7280','#e1ac6e','#f0c595','#e8654f','#62c7ba','#a5e6dc','#ebe6dd'];const to={...themePalette(name)};to.spoke=to.line;to.memHot=to.mem;to.trail=to.bone;return svg.replace(/#[0-9a-fA-F]{6}/g,c=>{const i=colors.indexOf(c.toLowerCase());return i>=0?to[keys[i]]:c}) }
