import { host, useValue, useQuery, queryClient, ROUTES_AREA, SIDEBAR_NAV_AREA, PALETTE_AREA } from '@hermes/plugin-sdk'
import React from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

// Renderer from alexeyw/lot-map v0.13.0 (MIT); see LICENSE.upstream and NOTICE.md.
var LotMapOriginal=(()=>{var ce=Object.defineProperty;var _e=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var Le=Object.prototype.hasOwnProperty;var Fe=(e,t)=>{for(var o in t)ce(e,o,{get:t[o],enumerable:!0})},We=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ie(t))!Le.call(e,i)&&i!==o&&ce(e,i,{get:()=>t[i],enumerable:!(n=_e(t,i))||n.enumerable});return e};var De=e=>We(ce({},"__esModule",{value:!0}),e);var ut={};Fe(ut,{drawMap:()=>Ee,foldRows:()=>Oe,nowParts:()=>ze,setupFrom:()=>xe});function qe(e,t){if(e.length<=t)return e;let o=[...e];return o.length>t?`${o.slice(0,t-1).join("")}\u2026`:e}function pe(e,t=120){let o=e.replace(/(?:(?![‌‍])[\p{Cc}\p{Cf}\p{Zl}\p{Zp}])+/gu," ").replace(/ {2,}/g," ").trim();return qe(o,t)}function J(e){let t=/claude-([a-z]+)-(\d+)(?:-(\d+))?/.exec(e);return t===null?e:`${t[1]} ${t[2]}${t[3]!==void 0?`.${t[3]}`:""}`}function he(e){let t=Math.max(0,Math.round(e));if(t<1e3)return String(t);let o=Math.round(t/1e3);return o<1e3?`${o}k`:`${Math.round(t/1e6)}M`}var B={ground:"#0a0c11",raised:"#12151c",line:"#272c36",spoke:"#1a1e27",bone:"#ebe6dc",ash:"#9ba1ab",dim:"#6b7280",accent:"#e1ac6e",hot:"#f0c595",red:"#e8654f",mem:"#62c7ba",memHot:"#a5e6dc",trail:"#ebe6dd"},ee={ground:"#f5f2ea",raised:"#ffffff",line:"#cfc9bc",spoke:"#e3ded2",bone:"#1f2228",ash:"#5f6570",dim:"#8b909a",accent:"#b8762a",hot:"#8f560f",red:"#c5402b",mem:"#1c8c81",memHot:"#136a62",trail:"#9c978b"},$e=(e={})=>`<style>@media (prefers-color-scheme: light){${Object.keys(B).filter(t=>e[t]===void 0&&!Object.values(e).includes(B[t])).map(t=>`[fill="${B[t]}"]{fill:${ee[t]}}[stroke="${B[t]}"]{stroke:${ee[t]}}`).join("")}}</style>`,be={background:"ground",node:"raised",line:"line",spoke:"spoke",text:"bone",label:"ash",faint:"dim",accent:"accent",active:"hot",error:"red",memory:"mem",memoryActive:"memHot",route:"trail"};var ye={title:"Work map",command:"Open the work map beside the chat",opened:"Work map opened.",cannotOpen:e=>`Nowhere to show the map right now: ${e}`,zoomOut:"Zoom out",zoomIn:"Zoom in",hideMap:"Hide map",showMap:"Show map",stations:{you:"You",model:"Model",memory:"Memory",files:"Files",shell:"Shell",web:"Network",browser:"Browser",agents:"Agents",skills:"Skills",hooks:"Hooks"},newMessage:"new message",answerReady:"answer ready",turnAborted:"turn interrupted",step:e=>`step ${e}`,subagent:"subagent",compacting:"compacting context",addedContext:e=>`added context ${e}`,addedMemory:e=>`added memory ${e}`,toMessage:"to the message",atStart:"at session start",records:(e,t)=>`${e} record${e===1?"":"s"}: ${t}`,stopped:e=>`stopped ${e}`,askedPermission:e=>`asked permission: ${e}`,checkBefore:e=>`check before ${e}`,running:"running",nothingYet:"Nothing yet.",noCounts:"No counts yet.",noPictureHere:"No picture in iTerm2 before 3.7.8: it keeps every frame in memory. See the README.",idle:"Nothing is running.",context:"context",andMore:e=>` and ${e} more`,webSearch:"web search",artifact:"artifact",workflow:"workflow",skill:"skill",loadingTools:"loading tools",questionForYou:"question for you",fileForYou:"file for you",ms:e=>`${e} ms`,seconds:e=>`${e} s`,minutes:(e,t)=>`${e} min ${t} s`,hours:(e,t)=>`${e} h ${t} min`},je={title:"\u041A\u0430\u0440\u0442\u0430 \u0440\u0430\u0431\u043E\u0442\u044B",command:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0440\u0430\u0431\u043E\u0442\u044B \u0440\u044F\u0434\u043E\u043C \u0441 \u0447\u0430\u0442\u043E\u043C",opened:"\u041A\u0430\u0440\u0442\u0430 \u0440\u0430\u0431\u043E\u0442\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u0430.",cannotOpen:e=>`\u041A\u0430\u0440\u0442\u0443 \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0433\u0434\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C: ${e}`,zoomOut:"\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C",zoomIn:"\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C",hideMap:"\u0421\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u0443",showMap:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u0443",stations:{you:"\u0422\u044B",model:"\u041C\u043E\u0434\u0435\u043B\u044C",memory:"\u041F\u0430\u043C\u044F\u0442\u044C",files:"\u0424\u0430\u0439\u043B\u044B",shell:"\u0422\u0435\u0440\u043C\u0438\u043D\u0430\u043B",web:"\u0421\u0435\u0442\u044C",browser:"\u0411\u0440\u0430\u0443\u0437\u0435\u0440",agents:"\u0410\u0433\u0435\u043D\u0442\u044B",skills:"\u0421\u043A\u0438\u043B\u043B\u044B",hooks:"\u0425\u0443\u043A\u0438"},newMessage:"\u043D\u043E\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",answerReady:"\u043E\u0442\u0432\u0435\u0442 \u0433\u043E\u0442\u043E\u0432",turnAborted:"\u0445\u043E\u0434 \u043F\u0440\u0435\u0440\u0432\u0430\u043D",step:e=>`\u0448\u0430\u0433 ${e}`,subagent:"\u0441\u0443\u0431\u0430\u0433\u0435\u043D\u0442",compacting:"\u0441\u0436\u0430\u0442\u0438\u0435 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430",addedContext:e=>`\u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442 ${e}`,addedMemory:e=>`\u043F\u043E\u0434\u043C\u0435\u0448\u0430\u043B \u043F\u0430\u043C\u044F\u0442\u044C ${e}`,toMessage:"\u043A \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044E",atStart:"\u043F\u0440\u0438 \u0441\u0442\u0430\u0440\u0442\u0435",records:(e,t)=>`\u0437\u0430\u043F\u0438\u0441\u0435\u0439 ${e}: ${t}`,stopped:e=>`\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B ${e}`,askedPermission:e=>`\u0441\u043F\u0440\u043E\u0441\u0438\u043B \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435: ${e}`,checkBefore:e=>`\u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0435\u0440\u0435\u0434 ${e}`,running:"\u0438\u0434\u0451\u0442",nothingYet:"\u041F\u043E\u043A\u0430 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0431\u044B\u043B\u043E.",noCounts:"\u0421\u0447\u0451\u0442\u0447\u0438\u043A\u0438 \u043F\u0443\u0441\u0442\u044B.",noPictureHere:"\u0412 iTerm2 \u0434\u043E 3.7.8 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u043D\u0435\u0442: \u043E\u043D \u0434\u0435\u0440\u0436\u0438\u0442 \u0432 \u043F\u0430\u043C\u044F\u0442\u0438 \u043A\u0430\u0436\u0434\u044B\u0439 \u043A\u0430\u0434\u0440. \u0421\u043C. README.",idle:"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435",context:"\u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442",andMore:e=>` \u0438 \u0435\u0449\u0451 ${e}`,webSearch:"\u043F\u043E\u0438\u0441\u043A \u0432 \u0441\u0435\u0442\u0438",artifact:"\u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442",workflow:"\u0440\u0430\u0431\u043E\u0447\u0438\u0439 \u043F\u0440\u043E\u0446\u0435\u0441\u0441",skill:"\u0441\u043A\u0438\u043B\u043B",loadingTools:"\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432",questionForYou:"\u0432\u043E\u043F\u0440\u043E\u0441 \u0442\u0435\u0431\u0435",fileForYou:"\u0444\u0430\u0439\u043B \u0442\u0435\u0431\u0435",ms:e=>`${e} \u043C\u0441`,seconds:e=>`${e} \u0441`,minutes:(e,t)=>`${e} \u043C\u0438\u043D ${t} \u0441`,hours:(e,t)=>`${e} \u0447 ${t} \u043C\u0438\u043D`},He={title:"Mapa de trabajo",command:"Abrir el mapa de trabajo junto al chat",opened:"Mapa de trabajo abierto.",cannotOpen:e=>`Ahora no hay d\xF3nde mostrar el mapa: ${e}`,zoomOut:"Alejar",zoomIn:"Acercar",hideMap:"Ocultar mapa",showMap:"Mostrar mapa",stations:{you:"T\xFA",model:"Modelo",memory:"Memoria",files:"Archivos",shell:"Terminal",web:"Red",browser:"Navegador",agents:"Agentes",skills:"Skills",hooks:"Hooks"},newMessage:"mensaje nuevo",answerReady:"respuesta lista",turnAborted:"turno interrumpido",step:e=>`paso ${e}`,subagent:"subagente",compacting:"compactando el contexto",addedContext:e=>`a\xF1adi\xF3 contexto ${e}`,addedMemory:e=>`a\xF1adi\xF3 memoria ${e}`,toMessage:"al mensaje",atStart:"al iniciar la sesi\xF3n",records:(e,t)=>`${e} registro${e===1?"":"s"}: ${t}`,stopped:e=>`detuvo ${e}`,askedPermission:e=>`pidi\xF3 permiso: ${e}`,checkBefore:e=>`comprobaci\xF3n antes de ${e}`,running:"en curso",nothingYet:"Todav\xEDa nada.",noCounts:"A\xFAn no hay recuentos.",noPictureHere:"Sin imagen en iTerm2 anterior a 3.7.8: guarda en memoria cada fotograma. Ver el README.",idle:"No hay nada en ejecuci\xF3n.",context:"contexto",andMore:e=>` y ${e} m\xE1s`,webSearch:"b\xFAsqueda web",artifact:"artefacto",workflow:"flujo de trabajo",skill:"skill",loadingTools:"cargando herramientas",questionForYou:"pregunta para ti",fileForYou:"archivo para ti",ms:e=>`${e} ms`,seconds:e=>`${e} s`,minutes:(e,t)=>`${e} min ${t} s`,hours:(e,t)=>`${e} h ${t} min`},Be={title:"Carte du travail",command:"Ouvrir la carte du travail \xE0 c\xF4t\xE9 du chat",opened:"Carte du travail ouverte.",cannotOpen:e=>`Impossible d'afficher la carte pour le moment : ${e}`,zoomOut:"D\xE9zoomer",zoomIn:"Zoomer",hideMap:"Masquer la carte",showMap:"Afficher la carte",stations:{you:"Vous",model:"Mod\xE8le",memory:"M\xE9moire",files:"Fichiers",shell:"Terminal",web:"R\xE9seau",browser:"Navigateur",agents:"Agents",skills:"Skills",hooks:"Hooks"},newMessage:"nouveau message",answerReady:"r\xE9ponse pr\xEAte",turnAborted:"tour interrompu",step:e=>`\xE9tape ${e}`,subagent:"sous-agent",compacting:"compactage du contexte",addedContext:e=>`contexte ajout\xE9 ${e}`,addedMemory:e=>`m\xE9moire ajout\xE9e ${e}`,toMessage:"au message",atStart:"au d\xE9marrage de la session",records:(e,t)=>`${e} enregistrement${e>1?"s":""} : ${t}`,stopped:e=>`${e} arr\xEAt\xE9`,askedPermission:e=>`autorisation demand\xE9e : ${e}`,checkBefore:e=>`v\xE9rification avant ${e}`,running:"en cours",nothingYet:"Rien pour le moment.",noCounts:"Aucun compteur pour le moment.",noPictureHere:"Pas d'image dans iTerm2 avant 3.7.8 : il garde chaque image en m\xE9moire. Voir le README.",idle:"Rien en cours.",context:"contexte",andMore:e=>` et ${e} de plus`,webSearch:"recherche web",artifact:"artefact",workflow:"workflow",skill:"skill",loadingTools:"chargement des outils",questionForYou:"question pour vous",fileForYou:"fichier pour vous",ms:e=>`${e} ms`,seconds:e=>`${e.replace(".",",")} s`,minutes:(e,t)=>`${e} min ${t} s`,hours:(e,t)=>`${e} h ${t} min`},Ye={title:"Arbeitskarte",command:"Arbeitskarte neben dem Chat \xF6ffnen",opened:"Arbeitskarte ge\xF6ffnet.",cannotOpen:e=>`Die Karte kann gerade nirgends angezeigt werden: ${e}`,zoomOut:"Verkleinern",zoomIn:"Vergr\xF6\xDFern",hideMap:"Karte ausblenden",showMap:"Karte zeigen",stations:{you:"Du",model:"Modell",memory:"Ged\xE4chtnis",files:"Dateien",shell:"Terminal",web:"Netzwerk",browser:"Browser",agents:"Agenten",skills:"Skills",hooks:"Hooks"},newMessage:"neue Nachricht",answerReady:"Antwort fertig",turnAborted:"Durchgang abgebrochen",step:e=>`Schritt ${e}`,subagent:"Subagent",compacting:"Kontext wird komprimiert",addedContext:e=>`Kontext ${e} hinzugef\xFCgt`,addedMemory:e=>`Erinnerungen ${e} hinzugef\xFCgt`,toMessage:"zur Nachricht",atStart:"beim Sitzungsstart",records:(e,t)=>`${e} ${e===1?"Eintrag":"Eintr\xE4ge"}: ${t}`,stopped:e=>`${e} gestoppt`,askedPermission:e=>`um Erlaubnis gefragt: ${e}`,checkBefore:e=>`Pr\xFCfung vor ${e}`,running:"l\xE4uft",nothingYet:"Noch nichts.",noCounts:"Noch keine Z\xE4hlerst\xE4nde.",noPictureHere:"Kein Bild in iTerm2 vor 3.7.8: Es beh\xE4lt jedes Einzelbild im Speicher. Siehe README.",idle:"Nichts l\xE4uft.",context:"Kontext",andMore:e=>` und ${e} weitere`,webSearch:"Websuche",artifact:"Artefakt",workflow:"Workflow",skill:"Skill",loadingTools:"Werkzeuge werden geladen",questionForYou:"Frage an dich",fileForYou:"Datei f\xFCr dich",ms:e=>`${e} ms`,seconds:e=>`${e.replace(".",",")} s`,minutes:(e,t)=>`${e} Min. ${t} s`,hours:(e,t)=>`${e} Std. ${t} Min.`},Ke={title:"Mappa del lavoro",command:"Apri la mappa del lavoro accanto alla chat",opened:"Mappa del lavoro aperta.",cannotOpen:e=>`Al momento non c'\xE8 dove mostrare la mappa: ${e}`,zoomOut:"Riduci",zoomIn:"Ingrandisci",hideMap:"Nascondi mappa",showMap:"Mostra mappa",stations:{you:"Tu",model:"Modello",memory:"Memoria",files:"File",shell:"Terminale",web:"Rete",browser:"Browser",agents:"Agenti",skills:"Skill",hooks:"Hook"},newMessage:"nuovo messaggio",answerReady:"risposta pronta",turnAborted:"turno interrotto",step:e=>`passo ${e}`,subagent:"subagente",compacting:"compattazione del contesto",addedContext:e=>`contesto aggiunto ${e}`,addedMemory:e=>`memoria aggiunta ${e}`,toMessage:"al messaggio",atStart:"all'avvio della sessione",records:(e,t)=>`${e} ${e===1?"voce":"voci"}: ${t}`,stopped:e=>`${e} fermato`,askedPermission:e=>`permesso chiesto: ${e}`,checkBefore:e=>`controllo prima di ${e}`,running:"in corso",nothingYet:"Ancora niente.",noCounts:"Ancora nessun conteggio.",noPictureHere:"Nessuna immagine in iTerm2 prima della 3.7.8: tiene in memoria ogni fotogramma. Vedi il README.",idle:"Niente in esecuzione.",context:"contesto",andMore:e=>` e altri ${e}`,webSearch:"ricerca web",artifact:"artefatto",workflow:"workflow",skill:"skill",loadingTools:"caricamento strumenti",questionForYou:"domanda per te",fileForYou:"file per te",ms:e=>`${e} ms`,seconds:e=>`${e.replace(".",",")} s`,minutes:(e,t)=>`${e} min ${t} s`,hours:(e,t)=>`${e} h ${t} min`},Ue={title:"Mapa de trabalho",command:"Abrir o mapa de trabalho ao lado do chat",opened:"Mapa de trabalho aberto.",cannotOpen:e=>`De momento n\xE3o h\xE1 onde mostrar o mapa: ${e}`,zoomOut:"Reduzir",zoomIn:"Ampliar",hideMap:"Ocultar mapa",showMap:"Mostrar mapa",stations:{you:"Tu",model:"Modelo",memory:"Mem\xF3ria",files:"Ficheiros",shell:"Terminal",web:"Rede",browser:"Navegador",agents:"Agentes",skills:"Skills",hooks:"Hooks"},newMessage:"nova mensagem",answerReady:"resposta pronta",turnAborted:"turno interrompido",step:e=>`passo ${e}`,subagent:"subagente",compacting:"a compactar o contexto",addedContext:e=>`adicionou contexto ${e}`,addedMemory:e=>`adicionou mem\xF3ria ${e}`,toMessage:"\xE0 mensagem",atStart:"no in\xEDcio da sess\xE3o",records:(e,t)=>`${e} registo${e===1?"":"s"}: ${t}`,stopped:e=>`travou ${e}`,askedPermission:e=>`pediu permiss\xE3o: ${e}`,checkBefore:e=>`verifica\xE7\xE3o antes de ${e}`,running:"em curso",nothingYet:"Ainda nada.",noCounts:"Ainda sem contagens.",noPictureHere:"Sem imagem no iTerm2 antes da 3.7.8: ele guarda cada quadro na mem\xF3ria. Veja o README.",idle:"Nada em execu\xE7\xE3o.",context:"contexto",andMore:e=>` e mais ${e}`,webSearch:"pesquisa na web",artifact:"artefacto",workflow:"workflow",skill:"skill",loadingTools:"a carregar ferramentas",questionForYou:"pergunta para ti",fileForYou:"ficheiro para ti",ms:e=>`${e} ms`,seconds:e=>`${e.replace(".",",")} s`,minutes:(e,t)=>`${e} min ${t} s`,hours:(e,t)=>`${e} h ${t} min`},Ve=new Map([["en",ye],["ru",je],["es",He],["fr",Be],["de",Ye],["it",Ke],["pt",Ue]]),ke=e=>Ve.get(e)??ye;var F=[{id:"you",icon:`${T(0,-3.6,3.4)}M-6.5 8c0-4 3-6.2 6.5-6.2s6.5 2.2 6.5 6.2`},{id:"model",icon:"M-5 -5h10v10h-10zM-2 -8.5v3.5M2 -8.5v3.5M-2 5v3.5M2 5v3.5M-8.5 -2h3.5M-8.5 2h3.5M5 -2h3.5M5 2h3.5"},{id:"memory",icon:`M-5 4.5L0 -5L6 3.5M-5 4.5L6 3.5${T(-5,4.5,2.1)}${T(0,-5,2.1)}${T(6,3.5,2.1)}`},{id:"files",icon:"M-5.5 -8h7.5l3.5 3.5v12.5h-11zM2 -8v3.5h3.5"},{id:"shell",icon:"M-7.5 -5l5 5l-5 5M0 6h7.5"},{id:"web",icon:`${T(0,0,7.8)}M-7.8 0h15.6M0 -7.8c-4.2 4.2 -4.2 11.4 0 15.6M0 -7.8c4.2 4.2 4.2 11.4 0 15.6`},{id:"browser",icon:"M-8.5 -6.5h17v13h-17zM-8.5 -2.8h17M-6.3 -4.7h.1M-3.8 -4.7h.1"},{id:"agents",icon:`M0 -4v3.5M0 -.5L-6 4M0 -.5L6 4${T(0,-6,2.1)}${T(-6.5,5.5,2.1)}${T(6.5,5.5,2.1)}`},{id:"skills",icon:"M1.5 -8.5L-5.5 1h4.5l-1.5 7.5l7.5 -9.8h-4.5z"},{id:"hooks",icon:`M2.5 -5.5v8a4.2 4.2 0 1 1 -8.4 0v-1.5${T(2.5,-7.3,1.8)}`}];function T(e,t,o){return`M${e-o} ${t}a${o} ${o} 0 1 0 ${2*o} 0a${o} ${o} 0 1 0 ${-2*o} 0`}var Ge=2.4;function Ze(e){let t=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):Number.NaN;return Number.isFinite(t)&&t>=1.2&&t<=4?t:Ge}var Xe=["files","shell","web","browser","agents","skills","you"],Y=(e,t)=>e===!0||e==="true"?!0:e===!1||e==="false"?!1:t,L=e=>(Array.isArray(e)?e:typeof e=="string"?e.split(","):[]).map(t=>String(t).trim()).filter(t=>t!=="");function xe(e={}){let t=new Map;for(let u of L(e.memoryLabels)){let c=u.indexOf("=");c>0&&c<u.length-1&&t.set(u.slice(0,c).trim(),u.slice(c+1).trim())}let o=u=>{let c=new Map;for(let l of L(u)){let h=l.indexOf("="),m=Xe.find(p=>p===l.slice(h+1).trim());h>0&&m!==void 0&&c.set(l.slice(0,h).trim(),m)}return c},n=o(e.serverStations),i=o(e.commandStations),r=typeof e.coreName=="string"?[...pe(e.coreName)].slice(0,10).join("").trim():"";return{t:ke(e.language),core:r===""?"CLAUDE":r,memoryServers:new Set(L(e.memoryServers)),memoryCommands:L(e.memoryCommands),memorySubcommands:new Set(L(e.memorySubcommands)),memoryPaths:L(e.memoryPaths),memoryLabels:t,serverStations:n,commandStations:i,hookRecords:Y(e.hookRecords,!1),hookReasons:Y(e.hookReasons,!1),guardedHooks:Y(e.guardedHooks,!0),openAtStart:Y(e.openAtStart,!0),subagentNames:Y(e.subagentNames,!1),contextCost:Y(e.contextCost,!1),contextWindow:e.contextWindow==="compaction"?"compaction":"model",theme:e.theme==="dark"||e.theme==="light"?e.theme:"auto",background:e.background==="transparent"?"transparent":"solid",paneBackground:Qe(e.paneBackground),colors:Je(e.colors),layout:e.layout==="you-bottom"?"you-bottom":"you-top",motion:e.motion==="reduced"?"reduced":"full",textSize:e.textSize==="caption"||e.textSize==="body"?e.textSize:"footnote",logRows:e.logRows==="fill"?"fill":16,terminalView:e.terminalView==="picture"||e.terminalView==="braille"?e.terminalView:"text",cellShape:Ze(e.cellShape)}}function Qe(e){let t=typeof e=="string"?e.trim().toLowerCase():"";if(t==="transparent")return"transparent";let o=/^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(t)?.[1];return o===void 0?"theme":`#${o.length===3?[...o].map(n=>n+n).join(""):o}`}function Je(e){let t={};for(let o of L(e)){let n=o.indexOf("="),i=be[o.slice(0,n).trim()],r=/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.exec(o.slice(n+1).trim())?.[0].toLowerCase();n<1||i===void 0||r===void 0||(t[i]=r.length===4?`#${r[1]}${r[1]}${r[2]}${r[2]}${r[3]}${r[3]}`:r)}return t}var te=460,ne=430,wt=ne/te,M=230,R=212,et=176,tt=164,b=22,A=40,le=A+8,W='font-family="SF Mono, ui-monospace, Menlo, monospace"',oe=800,fe=450,se=3200,Se=6e3,we=8e3,Me=1100,nt=7,de=4e4,ue=2e4,Pe=(e,t)=>(e+t)*2*Math.PI/F.length,Ne=(e,t=1)=>({x:M+et*t*Math.sin(e),y:R-tt*t*Math.cos(e)}),O=(e,t)=>Ne(Pe(e,t)),K=e=>F.findIndex(t=>t.id===e),a=e=>(Math.round(e*10)/10).toString(),g=e=>`${(e/1e3).toFixed(3)}s`;function U(e,t,o){let n=Math.hypot(t.x-e.x,t.y-e.y)||1;return{x:e.x+(t.x-e.x)*o/n,y:e.y+(t.y-e.y)*o/n}}function Re(e,t,o){let n=Math.hypot(t.x-e.x,t.y-e.y)||1,i=-(t.y-e.y)*o/n,r=(t.x-e.x)*o/n;return[{x:e.x+i,y:e.y+r},{x:t.x+i,y:t.y+r}]}function me(e,t,o,n,i,r=!1){let u=`M${a(e.x)} ${a(e.y)}L${a(t.x)} ${a(t.y)}`,c="";for(let l=r?0:2;l>=0;l--){let h=`begin="${g(l*45-n)}" dur="${g(oe)}" fill="freeze"`,m=a(1-.36*l),p=r?`fill="none" stroke="${o}" stroke-width="1.4"`:`fill="${o}"`;c+=`<circle r="${a(i*(1-.27*l))}" ${p} opacity="0"><animateMotion path="${u}" ${h}/><animate attributeName="opacity" values="${m};${m};0" keyTimes="0;.82;1" ${h}/></circle>`}return c}function Ae(e,t,o,n){let i=`begin="${g(oe-n)}" dur="${g(fe)}" fill="freeze"`;return`<circle cx="${a(e.x)}" cy="${a(e.y)}" r="${t}" fill="none" stroke="${o}" stroke-width="1.2" opacity="0"><animate attributeName="r" values="${t};${t+11}" ${i}/><animate attributeName="opacity" values=".7;0" ${i}/></circle>`}function ot(e,t,o,n,i){return`<line x1="${a(e.x)}" y1="${a(e.y)}" x2="${a(t.x)}" y2="${a(t.y)}" stroke="${o}" stroke-width="1.4"${i?' stroke-dasharray="3 4"':""} opacity="0"><animate attributeName="opacity" values=".75;0" begin="${g(-n)}" dur="${g(se/2)}" fill="freeze"/></line>`}var st=[.5,.5,.4,.45,.55,.75];function rt(e,t,o){let n=F.length,i=((t-e)%n+n)%n;i>n/2&&(i-=n);let r=Ne(Pe(e+i/2,o),st[Math.abs(i)]??.5),u=U(O(e,o),r,b+4),c=U(O(t,o),r,b+4);return{path:`M${a(u.x)} ${a(u.y)}Q${a(r.x)} ${a(r.y)} ${a(c.x)} ${a(c.y)}`,end:c}}function it(e,t=nt){let o=[];for(let n of e){if(n.from==="agents"||n.station==="model")continue;let i=o[o.length-1];i!==void 0&&i.station===n.station?i.at=n.startedAt:o.push({station:n.station,at:n.startedAt})}return o.slice(-t)}function at(e,t,o,n,i){let r=it(e),u="";for(let c=1;c<r.length;c++){let l=r[c-1],h=r[c];if(l===void 0||h===void 0)continue;let{path:m,end:p}=rt(K(l.station),K(h.station),i),y=c===r.length-1,v=t-h.at;if(v>=de+ue)continue;let P=a(.12+.5*c/(r.length-1)),f=`<animate attributeName="opacity" values="${P};0" begin="${g(de-v)}" dur="${g(ue)}" fill="freeze"/>`,z=y&&!n?` pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;0" begin="${g(h.at-t)}" dur=".5s" fill="freeze"/>`:">";u+=`<path d="${m}" fill="none" stroke="${o.trail}" stroke-width="${y?1.5:1.1}" stroke-linecap="round" opacity="${P}"${z}${f}</path>`,y&&(u+=`<circle cx="${a(p.x)}" cy="${a(p.y)}" r="2.4" fill="${o.trail}" opacity="${n?".85":"0"}">`+(n?"":`<animate attributeName="opacity" values="0;.85" begin="${g(h.at-t+400)}" dur=".15s" fill="freeze"/>`)+`<animate attributeName="opacity" values=".85;0" begin="${g(de-v)}" dur="${g(ue)}" fill="freeze"/></circle>`)}return u}function ct(e,t,{entries:o,board:n,now:i,c:r,names:u,isStill:c,shift:l,spent:h}){let m=O(t,l),p=a(m.x),y=a(m.y),v=n.counts[e.id]??0,P=o.filter(x=>x.station===e.id),f=P.filter(x=>x.status==="run"),z=P.length>0?P[P.length-1]:void 0,V=z===void 0?1/0:i-(z.endedAt??z.startedAt),_=P.filter(x=>x.status==="block"||x.status==="err").pop(),G=_===void 0?1/0:i-(_.endedAt??_.startedAt),w=G<Se,I=f.length>0||V<se,[D,q]=e.id==="memory"?[r.mem,r.memHot]:[r.accent,r.hot],E=w?r.red:D,Z=w?G:V,j=w?Se:se,s="";if((I||w)&&(s+=f.length>0&&!w?`<circle cx="${p}" cy="${y}" r="${b+10}" fill="${E}" opacity=".16"/>`:`<circle cx="${p}" cy="${y}" r="${b+10}" fill="${E}" opacity="0"><animate attributeName="opacity" values=".3;0" begin="${g(-Z)}" dur="${g(j)}" fill="freeze"/></circle>`),f.length>0){let x=i-Math.min(...f.map(H=>H.startedAt)),X=`begin="${g(-(x%1400))}" dur="1.4s" repeatCount="indefinite"`;c||(s+=`<circle cx="${p}" cy="${y}" r="${b}" fill="none" stroke="${E}" stroke-width="1.3"><animate attributeName="r" values="${b};${b+15}" ${X}/><animate attributeName="opacity" values=".9;0" ${X}/></circle>`);let Q=(H,ie,ae,ge)=>`<circle cx="${p}" cy="${y}" r="${H}" fill="none" stroke="${q}" stroke-width="${ie}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" transform="rotate(-90 ${p} ${y})"><animate attributeName="stroke-dashoffset" values="1;0" begin="${g(-(ge?Math.min(x,ae):x%ae))}" dur="${g(ae)}" ${ge?'fill="freeze"':'repeatCount="indefinite"'}/></circle>`;s+=Q(b+4,2.2,6e4,!1)+Q(b+8,1.2,6e5,!0)}let d=`<circle cx="${p}" cy="${y}" r="${b}" fill="none" stroke="${E}" stroke-width="1.2"`,$=f.length>0?`${d}/>`:I||w?`${d} opacity="0"><animate attributeName="opacity" values="1;0" begin="${g(-Z)}" dur="${g(j)}" fill="freeze"/></circle>`:"",k=w?r.red:I?q:e.id==="memory"&&v>0?D:r.ash,S=`paint-order="stroke" stroke="${r.ground}" stroke-width="3.5" stroke-linejoin="round"`,C=`<circle cx="${p}" cy="${y}" r="${b}" fill="${r.raised}" stroke="${r.line}" stroke-width="1.2"/>${$}<path transform="translate(${p} ${y})" d="${e.icon}" fill="none" stroke="${k}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><text x="${p}" y="${a(m.y+b+15)}" text-anchor="middle" ${W} font-size="11.5" ${S} fill="${I||w?r.bone:r.ash}">${u[e.id]}</text>`;if(v>0){let x=e.id==="memory"?Math.min(v,n.pushed??0):0,X=v-x,Q=x===0?String(v):`${X>0?`${X} `:""}<tspan fill="${D}">\u2193${x}</tspan>`,H=h?.[e.id]??0,ie=H>0?` \xB7 ${he(H)}`:"";C+=`<text x="${p}" y="${a(m.y+b+28)}" text-anchor="middle" ${W} font-size="9.5" ${S} fill="${r.dim}">${Q}${ie}</text>`}let N=b*.74;f.length>1&&(C+=`<circle cx="${a(m.x+N)}" cy="${a(m.y-N)}" r="8" fill="${r.raised}" stroke="${E}" stroke-width="1"/><text x="${a(m.x+N)}" y="${a(m.y-N+3)}" text-anchor="middle" ${W} font-size="8.5" fill="${q}">\xD7${f.length}</text>`);let re=n.faults?.[e.id]??0;return re>0&&(C+=`<circle cx="${a(m.x-N)}" cy="${a(m.y-N)}" r="7.5" fill="${r.red}"/><text x="${a(m.x-N)}" y="${a(m.y-N+3.1)}" text-anchor="middle" ${W} font-size="9" font-weight="700" fill="${r.ground}">${re>99?"99+":re}</text>`),{under:s,over:C}}function Ee(e,t,o){let n={...o.theme==="light"?ee:B,...o.colors},i=o.layout==="you-bottom"?F.length/2:0,r={x:M,y:R},u=e.entries.slice(-40),c=o.motion==="reduced",l=c?[]:u.filter(s=>t-s.startedAt<oe+fe).slice(-14),h=c?[]:u.filter(s=>s.endedAt!==void 0&&s.from!=="inbound"&&t-s.endedAt<oe+fe).slice(-14),m=u.filter(s=>t-s.startedAt<se/2).slice(-10),p=u.some(s=>s.status==="run"),y=O(K("agents"),i),v=s=>s.status==="block"||s.status==="err",P=s=>s.station==="memory"?[n.mem,n.memHot]:[n.accent,n.hot],f=o.background==="transparent"?"":`<rect width="${te}" height="${ne}" rx="12" fill="${n.ground}"/>`;for(let[s,d]of[[66,62],[104,97],[142,132]])f+=`<ellipse cx="${M}" cy="${R}" rx="${s}" ry="${d}" fill="none" stroke="${n.line}" stroke-width=".7" opacity=".45" stroke-dasharray="2 5"/>`;F.forEach((s,d)=>{let $=O(d,i),k=U(r,$,le),S=U($,r,b),C=Math.min(1,Math.log2(1+(e.counts[s.id]??0))/7),N=`<line x1="${a(k.x)}" y1="${a(k.y)}" x2="${a(S.x)}" y2="${a(S.y)}" stroke-width="${a(1+2.6*C)}" stroke-linecap="round"`;f+=`${N} stroke="${n.spoke}"/>`,C>0&&(f+=`${N} stroke="${s.id==="memory"?n.mem:n.accent}" opacity="${a(C*.55)}"/>`)});let z={entries:u,board:e,now:t,c:n,names:o.t.stations,isStill:c,shift:i,spent:o.contextCost?e.spent:void 0},V=F.map((s,d)=>ct(s,d,z));f+=V.map(s=>s.under).join(""),f+=at(u,t,n,c,i);let _=s=>{let d=O(K(s.station),i),$=s.from==="agents"?y:r;return[U($,d,s.from==="agents"?b:le),U(d,$,b)]},G=(s,d)=>{let $=s.filter(k=>k.station===d.station&&k.from===d.from);return($.indexOf(d)-($.length-1)/2)*5};for(let s of m){let[d,$]=_(s);f+=ot(d,$,v(s)?n.red:P(s)[0],t-s.startedAt,s.from==="inbound")}for(let s of l){let[d,$]=Re(..._(s),G(l,s)),k=t-s.startedAt,S=s.status==="block"?n.red:P(s)[1];s.from==="inbound"?f+=me($,d,S,k,3.8,!0)+Ae(r,le-2,S,k):f+=me(d,$,S,k,3.8)+Ae(O(K(s.station),i),b,S,k)}for(let s of h){let[d,$]=Re(..._(s),G(h,s));f+=me($,d,s.status==="ok"?n.ash:n.red,t-s.endedAt,2.6)}f+=V.map(s=>s.over).join("");let w=(e.agents??[]).slice(0,6);w.forEach((s,d)=>{let k=`${a(y.x)} ${a(y.y)}`;if(c){f+=`<g transform="rotate(${a(360*d/w.length)} ${k})"><circle cx="${a(y.x)}" cy="${a(y.y-b-6)}" r="3" fill="${n.hot}"/></g>`;return}f+=`<g><animateTransform attributeName="transform" type="rotate" from="0 ${k}" to="360 ${k}" begin="${g(-((t+d*7e3/w.length)%7e3))}" dur="${g(7e3)}" repeatCount="indefinite"/><circle cx="${a(y.x)}" cy="${a(y.y-b-6)}" r="3" fill="${n.hot}"/></g>`});let I=Math.min(17,62/(.75*o.core.length)),D=p?1600:4800,q=`begin="${g(-(t%D))}" dur="${g(D)}" repeatCount="indefinite"`;if(f+=(c?`<circle cx="${M}" cy="${R}" r="${A+8}" fill="${n.accent}" opacity="${p?".16":".08"}"/>`:`<circle cx="${M}" cy="${R}" r="${A+6}" fill="${n.accent}" opacity=".08"><animate attributeName="r" values="${A+3};${A+13};${A+3}" ${q}/><animate attributeName="opacity" values=".05;${p?".24":".12"};.05" ${q}/></circle>`)+`<circle cx="${M}" cy="${R}" r="${A}" fill="${n.raised}" stroke="${p?n.accent:n.line}" stroke-width="1.3"/>`,e.context!==void 0){let s=Math.max(0,Math.min(100,Math.round(e.context))),d=`cx="${M}" cy="${R}" r="${A+5}" fill="none" stroke-width="2.2"`;f+=`<circle ${d} stroke="${n.line}" opacity=".7"/><circle ${d} stroke="${s>=90?n.red:s>=70?n.accent:n.ash}" pathLength="100" stroke-dasharray="${s} 100" transform="rotate(-90 ${M} ${R})"/><text x="${M}" y="${R-19}" text-anchor="middle" ${W} font-size="8" fill="${n.dim}">${s}%</text>`}let E=e.switchedAt===void 0?1/0:t-e.switchedAt,Z=E>=0&&E<we;if(f+=`<text x="${M}" y="${R+(e.model===void 0?6:1)}" text-anchor="middle" ${W} font-size="${a(I)}" letter-spacing="${a(I*.147)}" fill="${n.bone}">${ve(o.core)}</text>`,e.model!==void 0&&(f+=`<text x="${M}" y="${R+17}" text-anchor="middle" ${W} font-size="9" fill="${Z?n.hot:n.ash}">${ve(J(e.model))}</text>`),Z&&!c){let s=O(K("model"),i),d=Math.ceil((we-E)/1600);for(let[$,k]of[[r,A],[s,b]]){let S=`begin="${g(-(E%1600))}" dur="1.6s" repeatCount="${d}" fill="freeze"`;f+=`<circle cx="${a($.x)}" cy="${a($.y)}" r="${k}" fill="none" stroke="${n.bone}" stroke-width="1.4" opacity="0"><animate attributeName="r" values="${k};${k+26}" ${S}/><animate attributeName="opacity" values=".7;0" ${S}/></circle>`}}let j=u.filter(s=>s.mark==="done").pop();if(j!==void 0&&t-j.startedAt<Me&&!c){let s=`begin="${g(j.startedAt-t)}" dur="${g(Me)}" fill="freeze"`;f+=`<circle cx="${M}" cy="${R}" r="${A}" fill="none" stroke="${n.bone}" stroke-width="1.6" opacity="0"><animate attributeName="r" values="${A};${A+38}" ${s}/><animate attributeName="opacity" values=".6;0" ${s}/></circle>`}return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${te} ${ne}" width="${te*2}" height="${ne*2}">${o.theme==="auto"?$e(o.colors):""}${f}</svg>`}function ve(e){return e.replace(/[<>&"]/g,t=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"})[t])}var Te=(e,t)=>({entry:e,times:1,tookMs:t,...e.tokens!==void 0?{tokens:e.tokens,...e.shared?{isShared:!0}:{}}:{}});function lt(e,t,o){e.times++,e.tookMs+=o,!(t.tokens===void 0&&e.tokens===void 0)&&((t.tokens===void 0||e.tokens===void 0||t.shared)&&(e.isShared=!0),e.tokens=(e.tokens??0)+(t.tokens??0))}var Ce=e=>e.status==="ok"&&e.mark===void 0,dt=16;function Oe(e,t=dt,o=!1){let n=[],i=[],r=!1,u=Math.max(1,Math.floor(t/2));for(let c=e.length-1;c>=0;c--){let l=e[c];if(l===void 0)continue;let h=l.endedAt===void 0?0:Math.max(0,l.endedAt-l.startedAt),m=n[n.length-1];if(!r&&m!==void 0&&Ce(l)&&Ce(m.entry)&&m.entry.station===l.station&&m.entry.from===l.from&&(!o||m.entry.agentId===l.agentId)){lt(m,l,h);continue}if(n.length>=t){if(r=!0,l.status!=="run")continue;let p=i[i.length-1];i.length<u||p===void 0?i.push({...Te(l,h),isHeld:!0}):p.times++;continue}n.push(Te(l,h))}return i.length===0?n:[...n.slice(0,t-i.length),...i]}function ze(e,t){let o=e.entries.filter(u=>u.status==="run"),n=o[o.length-1],i=n===void 0?t.idle:`${t.stations[n.station]}: ${n.label}${o.length>1?t.andMore(o.length-1):""}`,r=[e.context===void 0?"":`${Math.round(e.context)}%`,e.model===void 0||n?.station==="model"?"":J(e.model)];return{what:i,meter:r.filter(Boolean).join(" \xB7 ")}}return De(ut);})();

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

async function providerForScope(sdk,scope,timeoutMs=10000) {
 if(!scope)return ''
 let timer,expired=false
 try{return await Promise.race([(async()=>{
 const routes=await sdk.profileRoutes();const matches=routes.filter(r=>r.connectionId===scope.connectionId&&r.profile===scope.profile)
 if(matches.length!==1)throw new Error('Provider route unavailable')
 if(expired)throw new Error('Provider request timed out')
 const stats=await sdk.requestProfile(matches[0],'session.stats',{session_id:scope.sessionId},timeoutMs)
 return typeof stats?.provider==='string'?stats.provider.toLowerCase().slice(0,60):''
 })(),new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(new Error('Provider request timed out'))},timeoutMs)})])}finally{clearTimeout(timer)}
}

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

const DEFAULT_SETTINGS = {version:1,quotaProviderMode:'all',quotaShownProviders:[],quotaHiddenProviders:[],showMap:true,showQuota:true,showStatus:true,showHeaderTitle:true,showLiveStatus:true,showExpandButton:true,showInputTokens:true,showOutputTokens:true,showCost:true,showContext:true,showToolStats:true,showSlowTools:true,showClearButton:true,showActivityHeading:true,showActivityFilters:true,showActivityIcons:true,showActivityStation:true,showActivityDuration:true,showQuotaBar:true,showQuotaReset:true,showQuotaCountdown:true,showQuotaIcons:true,fontSize:12,mapWidth:560,activityRows:20,cornerRadius:7,fontFamily:'mono',themeMode:'auto',palette:'obsidian',providerThemes:{},motion:'auto',density:'compact',showUsage:true,showActivity:true,quotaCacheEnabled:false,quotaWarn:80,quotaCritical:95}
function normalizeSettings(raw={}) {
 const s={...DEFAULT_SETTINGS,providerThemes:{},quotaHiddenProviders:[],quotaShownProviders:[]};if(!raw||typeof raw!=='object')return s
 for(const [k,values] of Object.entries({quotaProviderMode:['all','custom'],themeMode:['auto','manual'],palette:THEME_NAMES,motion:['auto','reduced','off'],density:['compact','comfortable'],fontFamily:['mono','system']}))if(values.includes(raw[k]))s[k]=raw[k]
 for(const k of Object.keys(DEFAULT_SETTINGS).filter(k=>typeof DEFAULT_SETTINGS[k]==='boolean'))if(typeof raw[k]==='boolean')s[k]=raw[k]
 for(const [key,min,max] of [['fontSize',10,18],['mapWidth',240,900],['activityRows',3,80],['cornerRadius',0,20]])if(typeof raw[key]==='number'&&Number.isFinite(raw[key]))s[key]=Math.round(Math.max(min,Math.min(max,raw[key])))
 if(Array.isArray(raw.quotaHiddenProviders))s.quotaHiddenProviders=[...new Set(raw.quotaHiddenProviders.filter(x=>typeof x==='string'&&x.length>0&&x.length<=160))].slice(0,100)
 if(Array.isArray(raw.quotaShownProviders))s.quotaShownProviders=[...new Set(raw.quotaShownProviders.filter(x=>typeof x==='string'&&x.length>0&&x.length<=160))].slice(0,100)
 const t=quotaThresholds(raw.quotaWarn,raw.quotaCritical);s.quotaWarn=t.warn;s.quotaCritical=t.critical
 for(const [key,value] of Object.entries(raw.providerThemes||{}).slice(0,40))if(!['__proto__','constructor','prototype'].includes(key)&&/^[a-z0-9:_-]{1,60}$/.test(key)&&THEME_NAMES.includes(value))s.providerThemes[key]=value
 return s
}
function loadMapSettings(store) {const v=store?.get('settings',null);if(v&&v.version!==undefined&&v.version!==1)return normalizeSettings();if(v)return normalizeSettings(v);const old=store?.get('theme',null);return normalizeSettings({...(old==='dark'||old==='light'?{themeMode:'manual',palette:old==='light'?'paper':'obsidian'}:{}),quotaCacheEnabled:store?.get('quotaCacheEnabled',false),quotaWarn:store?.get('quotaWarn',80),quotaCritical:store?.get('quotaCritical',95)})}

function motionMode(setting,reduced,visible) {return !visible||setting==='off'?'off':setting==='reduced'||reduced?'reduced':'full'}
function mapSignature(board,palette,motion) {return JSON.stringify([board,palette,motion])}
function stableMap(previous,key,render) {return previous?.key===key?previous:{key,svg:render()}}
const MAP_CSS = `.lot-map-ui div,.lot-map-ui section,.lot-map-ui details,.lot-map-ui summary,.lot-map-ui span,.lot-map-ui label{font-size:inherit!important}.lot-map-ui{font-size:var(--map-font-size)}.lot-map-ui button,.lot-map-ui select,.lot-map-ui input,.lot-map-ui section,.lot-map-ui details{border-radius:var(--map-radius)!important}.lot-map-ui{transition:background-color .2s ease,color .2s ease}.lot-map-ui progress::-webkit-progress-value{transition:width .3s ease}.lot-map-ui progress::-moz-progress-bar{transition:width .3s ease}.lot-map-ui button,.lot-map-ui input,.lot-map-ui select{font:inherit}.lot-map-ui button{transition:color .18s ease,border-color .18s ease,background-color .18s ease}.lot-map-ui button:hover{filter:brightness(1.12)}.lot-map-ui button:focus-visible,.lot-map-ui input:focus-visible,.lot-map-ui select:focus-visible{outline:2px solid currentColor;outline-offset:2px}.lot-map-ui progress{accent-color:var(--map-accent)}.lot-map-ui[data-motion="off"] *, .lot-map-ui[data-motion="reduced"] *{animation:none!important;transition:none!important}@media(prefers-reduced-motion:reduce){.lot-map-ui *{animation:none!important;transition:none!important}}`

// Hermes adapter for the original alexeyw/lot-map SVG renderer (MIT).
// Upstream rendering, geometry, icons, colors, motion and feed folding are bundled above.
// Hermes events are mapped to its Board; tool arguments/results are never stored.

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
  if (!sessions.has(id)) sessions.set(id, { rows: [], running: new Map(), seen: new Set(), counts: {}, errors: {}, turn: false, updated: 0 })
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
    const key = String(p.tool_id || name)
    if (s.seen.has(key) && p.tool_id) return
    s.seen.add(key); if (s.seen.size > 512) s.seen.delete(s.seen.values().next().value)
    const row = { label: name, station, kind: 'tool', at: now, done: false, error: false }
    s.rows.push(row); s.running.set(String(p.tool_id || name), row); if (s.running.size > 80) s.running.delete(s.running.keys().next().value)
    s.counts[station] = (s.counts[station] || 0) + 1
  } else if (type === 'tool.complete') {
    const name = String(p.name || 'tool').slice(0, 64), key = String(p.tool_id || name)
    const row = s.running.get(key)
    if (row) { row.done = true; row.elapsed = Math.max(0, now - row.at); row.cancelled = ['cancelled','canceled','blocked'].includes(p.status); row.error = !!p.is_error && !row.cancelled; s.running.delete(key) }
    if (row && row.error) { const station = row?.station || classify(name); s.errors[station] = (s.errors[station] || 0) + 1 }
  } else if (type === 'message.complete') {
    s.turn = false
    for (const row of s.running.values()) { row.done = true; row.elapsed = Math.max(0, now - row.at); row.unknown = true }
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
    from: 'core', startedAt: row.at, status: row.done ? row.error || row.unknown || row.cancelled ? 'err' : 'ok' : 'run',
    ...(row.done ? { endedAt: row.at + (row.elapsed || 0) } : {}),
    ...(row.mark ? { mark: row.mark } : {})
  }))
  return { entries, counts, faults, model: String(model || ''),
    ...(Number.isFinite(usage?.context_percent) && usage.context_max > 0 ? { context: usage.context_percent } : {}) }
}
let storage
let mapSettings = normalizeSettings()
function saveSettings(changes) {mapSettings=normalizeSettings({...mapSettings,...changes});storage?.set('settings',mapSettings);emit()}
function SettingsPanel({C,provider,scope,visible=true,onClose}) {
 const providerCache=useQuery({queryKey:quotaKey(scope,'cache'),queryFn:()=>quotaRequest(host,scope,'cache'),enabled:!!scope&&visible&&mapSettings.quotaCacheEnabled,staleTime:60000,refetchInterval:false,retry:false,placeholderData:undefined,gcTime:60000})
 const providerOptions=quotaProviderOptions(providerCache.data)
 const field={width:'100%',background:C.raised,color:C.bone,border:`1px solid ${C.line}`,borderRadius:6,padding:7,boxSizing:'border-box'}
 const select=(key,title,choices)=>jsxs('label',{style:{display:'block',fontSize:11,marginTop:10},children:[title,jsx('select',{value:mapSettings[key],style:field,onChange:e=>saveSettings({[key]:e.target.value}),children:choices.map(v=>jsx('option',{value:v,children:v},v))})]})
 return jsxs('section',{'aria-label':'Lot Map settings',onKeyDown:e=>{if(e.key==='Escape')onClose()},style:{padding:17,borderBottom:`1px solid ${C.line}`,background:C.raised},children:[
 jsxs('div',{style:{display:'flex',justifyContent:'space-between'},children:[jsx('strong',{children:'Settings'}),jsx('button',{onClick:onClose,style:{...field,width:'auto'},children:'Close',type:'button'})]}),
 select('themeMode','Theme mode',['auto','manual']),select('palette','Manual palette',THEME_NAMES),
 jsx('div',{style:{fontSize:10,marginTop:8,color:C.ash},children:`Provider: ${provider||'unavailable'} · auto fallback: Obsidian`}),
 provider?jsxs('label',{style:{display:'block',fontSize:11,marginTop:8},children:['This provider palette',jsx('select',{style:field,value:mapSettings.providerThemes[provider]||'',onChange:e=>{const next={...mapSettings.providerThemes};if(e.target.value)next[provider]=e.target.value;else delete next[provider];saveSettings({providerThemes:next})},children:[jsx('option',{value:'',children:'Default mapping'}),...THEME_NAMES.map(v=>jsx('option',{value:v,children:v},v))]})]}):null,
 select('motion','Motion',['auto','reduced','off']),select('density','Density',['compact','comfortable']),
 ...[['Sections',[['showMap','Activity map'],['showQuota','Quota summary'],['showUsage','Session insights'],['showStatus','Current activity strip'],['showActivity','Activity feed']]],['Header',[['showHeaderTitle','Title'],['showLiveStatus','Live / idle badge'],['showExpandButton','Expand / back button']]],['Session insights',[['showInputTokens','Input tokens'],['showOutputTokens','Output tokens'],['showCost','Estimated cost'],['showContext','Context usage'],['showToolStats','Tool counters'],['showSlowTools','Slow tool diagnostics'],['showClearButton','Clear observations button']]],['Activity feed',[['showActivityHeading','Section title and event count'],['showActivityFilters','Search and filters'],['showActivityIcons','Status icons'],['showActivityStation','Station column'],['showActivityDuration','Duration / state column']]],['Quota display',[['showQuotaBar','Remaining allowance bar'],['showQuotaIcons','Icons'],['showQuotaReset','Reset clock'],['showQuotaCountdown','Reset countdown'],['quotaCacheEnabled','Use installed quota cache plugin']]]].map(([title,fields])=>jsxs('details',{open:title==='Sections',style:{marginTop:10,borderTop:`1px solid ${C.line}`,paddingTop:8},children:[jsx('summary',{style:{cursor:'pointer',fontSize:12,fontWeight:600},children:title}),...fields.map(([key,label])=>jsxs('label',{style:{display:'flex',gap:8,alignItems:'center',marginTop:8,fontSize:11},children:[jsx('input',{type:'checkbox',checked:mapSettings[key],onChange:e=>saveSettings({[key]:e.target.checked})}),label]},key))]},title)),
 mapSettings.quotaCacheEnabled?jsxs('details',{open:true,style:{marginTop:12,borderTop:`1px solid ${C.line}`,paddingTop:8},children:[jsx('summary',{style:{cursor:'pointer',fontWeight:600},children:'Quota providers'}),
 select('quotaProviderMode','Show providers',['all','custom']),
 jsx('div',{style:{fontSize:10,color:C.ash,marginTop:6},children:mapSettings.quotaProviderMode==='custom'?'Only checked providers appear. New providers stay hidden until you select them.':'All providers are displayed. Switch to custom to select specific providers.'}),
 mapSettings.quotaProviderMode==='custom'?jsxs('div',{children:[jsxs('div',{style:{display:'flex',gap:6,marginTop:8},children:[jsx('button',{type:'button',style:{...field,width:'auto'},onClick:()=>saveSettings({quotaShownProviders:providerOptions.map(x=>x.id)}),children:'Select all'}),jsx('button',{type:'button',style:{...field,width:'auto'},onClick:()=>saveSettings({quotaShownProviders:[]}),children:'Clear selection'})]}),
 ...providerOptions.map(({id,label})=>jsxs('label',{style:{display:'flex',alignItems:'center',gap:8,marginTop:8,fontSize:11},children:[jsx('input',{type:'checkbox',checked:mapSettings.quotaShownProviders.includes(id),onChange:e=>saveSettings({quotaShownProviders:e.target.checked?[...mapSettings.quotaShownProviders,id]:mapSettings.quotaShownProviders.filter(x=>x!==id)})}),jsx('span',{title:id,children:label})]},id)),
 ...mapSettings.quotaShownProviders.filter(id=>!providerOptions.some(x=>x.id===id)).map(id=>jsxs('label',{style:{display:'flex',gap:8,marginTop:8,fontSize:11},children:[jsx('input',{type:'checkbox',checked:true,onChange:()=>saveSettings({quotaShownProviders:mapSettings.quotaShownProviders.filter(x=>x!==id)})}),`${id} (not in current cache)`]},id)),
 jsx('div',{style:{fontSize:10,color:C.ash,marginTop:8},children:`${mapSettings.quotaShownProviders.length} selected`})]}):null,
 !providerOptions.length?jsx('div',{style:{fontSize:10,color:C.ash,marginTop:8},children:providerCache.error?'Cache unavailable. Check the quota plugin.':'No cached providers available yet.'}):null]}):null,
 select('fontFamily','Font family',['mono','system']),
 ...[['fontSize','Text size',10,18],['mapWidth','Maximum map width',240,900],['activityRows','Activity rows',3,80],['cornerRadius','Corner radius',0,20]].map(([key,label,min,max])=>jsxs('label',{style:{display:'block',marginTop:10,fontSize:11},children:[`${label}: ${mapSettings[key]}`,jsx('input',{type:'range',min,max,value:mapSettings[key],style:{width:'100%'},onChange:e=>saveSettings({[key]:Number(e.target.value)})})]},key)),
 jsxs('div',{style:{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'},children:[['Minimal',{showMap:false,showUsage:false,showActivity:false,showQuota:true,showStatus:true}],['Balanced',{showMap:true,showUsage:true,showActivity:true,showQuota:true,showStatus:true}],['Focus',{showMap:false,showUsage:false,showActivity:true,showQuota:true,showStatus:false}]].map(([label,changes])=>jsx('button',{type:'button',style:{...field,width:'auto'},onClick:()=>saveSettings(changes),children:label},label))}),
 ...['quotaWarn','quotaCritical'].map(key=>jsxs('label',{style:{display:'block',fontSize:11,marginTop:10},children:[key==='quotaWarn'?'Quota warn %':'Quota critical %',jsx('input',{type:'number',min:1,max:100,value:mapSettings[key],style:field,onChange:e=>saveSettings({[key]:Number(e.target.value)})})]},key)),
 jsx('button',{type:'button',style:{...field,marginTop:12},onClick:()=>{mapSettings=normalizeSettings();storage?.set('settings',mapSettings);emit()},children:'Reset settings (not chat or quota data)'})]})
}
function MapLayer({board,palette,motion,expanded}) {
 const memo=React.useRef(null),container=React.useRef(null)
 const key=mapSignature(board,palette,motion)
 memo.current=stableMap(memo.current,key,()=>{const setup=LotMapOriginal.setupFrom({coreName:'HERMES',theme:palette==='paper'?'light':'dark',motion:motion==='full'?'full':'reduced',logRows:16});return recolorMap(LotMapOriginal.drawMap(board,Date.now(),setup),palette).replace('<svg ','<svg style="display:block;width:100%;height:auto" ')})
 React.useEffect(()=>{const svg=container.current?.querySelector('svg');if(motion==='off')svg?.pauseAnimations?.();else svg?.unpauseAnimations?.()},[motion])
 return jsx('div',{ref:container,style:{width:'100%',boxSizing:'border-box',maxWidth:expanded?Math.max(720,mapSettings.mapWidth):mapSettings.mapWidth,margin:'0 auto',padding:'3px 4px 0'},dangerouslySetInnerHTML:{__html:memo.current.svg},'aria-label':'Lot Map — live activity'})
}
function elapsed(ms) { return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s` }
const ALWAYS_VISIBLE = { get:()=>true, subscribe:()=>()=>{}, listen:()=>()=>{} }
const EMPTY_OWNER = { get: () => null, subscribe: () => () => {}, listen: () => () => {} }
function Metric({label, value, C}) { return jsxs('div', {style:{padding:'9px 10px',border:`1px solid ${C.line}`,borderRadius:7,minWidth:0},children:[jsx('div',{style:{fontSize:9,color:C.ash,marginBottom:4},children:label}),jsx('div',{style:{fontSize:13,color:C.bone,overflowWrap:'anywhere'},children:value})]}) }
function QuotaPanel({C, scope, visible}) {
  const [clock,setClock]=React.useState(()=>Date.now())
  React.useEffect(()=>{if(!visible)return;setClock(Date.now());const timer=setInterval(()=>setClock(Date.now()),15000);return()=>clearInterval(timer)},[visible])
  const cacheEnabled=mapSettings.quotaCacheEnabled, warn=mapSettings.quotaWarn, critical=mapSettings.quotaCritical
  const thresholds = quotaThresholds(warn,critical)
  const live = useQuery({placeholderData:undefined,queryKey:quotaKey(scope,'native'),queryFn:()=>quotaRequest(host,scope,'native'),enabled:!!scope && visible,staleTime:300000,refetchInterval:visible?300000:false,retry:false,gcTime:60000,refetchOnWindowFocus:false})
  const cache = useQuery({placeholderData:undefined,queryKey:quotaKey(scope,'cache'),queryFn:()=>quotaRequest(host,scope,'cache'),enabled:!!scope && visible && cacheEnabled,staleTime:60000,refetchInterval:visible && cacheEnabled?60000:false,retry:false,gcTime:60000,refetchOnWindowFocus:false})
  const data = cacheEnabled && scope && cache.data ? structuredQuota(filterQuotaProviders(cache.data,mapSettings.quotaHiddenProviders,mapSettings.quotaProviderMode==='custom'?mapSettings.quotaShownProviders:null),clock,thresholds) : null
  const stale = live.data && Date.now()-live.data.receivedAt > 300000
  const button = {border:`1px solid ${C.line}`,borderRadius:5,color:C.ash,background:C.raised,padding:'4px 7px',cursor:'pointer',fontSize:10}
  const note = (text,key) => jsx('div',{style:{fontSize:10,color:C.ash,lineHeight:'16px',marginTop:5},children:text},key)
  const summary=data?.windows?.filter(w=>!w.stale&&w.used!==null).sort((a,b)=>b.used-a.used)[0]
  const glance=quotaGlance(summary,clock,cache.data?.timezone)
  const tone=glance.level==='critical'?C.red:glance.level==='warning'?C.accent:glance.current?C.mem:C.ash
  const allProvidersHidden=cacheEnabled&&cache.data&&quotaProviderOptions(cache.data).length>0&&quotaProviderOptions(filterQuotaProviders(cache.data,mapSettings.quotaHiddenProviders,mapSettings.quotaProviderMode==='custom'?mapSettings.quotaShownProviders:null)).length===0
  const unknownLabel=allProvidersHidden?'Hidden':data?.stale||stale?'Stale':cache.error||live.error?'Error':live.isFetching||cache.isFetching?'Loading':'Unknown'
  const chip=(icon,value,label)=>jsxs('span',{title:label,style:{display:'inline-flex',alignItems:'center',gap:5,whiteSpace:'nowrap',fontVariantNumeric:'tabular-nums'},children:[jsx('span',{'aria-hidden':true,style:{opacity:.8,fontSize:12},children:mapSettings.showQuotaIcons?icon:''}),jsx('span',{children:value})]})
  return jsxs('details',{'aria-label':'Account quota',style:{padding:'9px 14px',borderBottom:`1px solid ${C.line}`},children:[
    jsxs('summary',{'aria-label':summary?glance.title:`Quota ${unknownLabel}`,title:summary?`${summary.provider} · ${summary.label}${data.windows.length>1?' · Multiple windows overview; active account not confirmed':''}. ${glance.title}`:'Open quota details',style:{cursor:'pointer',listStyle:'none',color:tone,fontSize:12},children:[
      jsxs('span',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'},children:[
        jsxs('span',{style:{display:'inline-flex',alignItems:'center',gap:6},children:[jsx('span',{'aria-hidden':true,children:mapSettings.showQuotaIcons?(glance.level==='critical'?'⚠':glance.level==='warning'?'◔':'◉'):''}),jsx('strong',{style:{fontSize:16,letterSpacing:'-.03em'},children:summary?glance.remaining:unknownLabel}),jsx('span',{style:{fontSize:10,color:C.ash},children:summary?'left':'quota'}),data?.windows.length>1?jsx('span',{title:'Highest usage window in this overview',style:{fontSize:9,color:C.ash},children:'Σ'}):null]}),
        jsxs('span',{style:{display:'inline-flex',gap:12,alignItems:'center',color:C.ash,fontSize:11},children:[mapSettings.showQuotaReset?chip('↻',glance.reset,'Reset time; full date and timezone in details'):null,mapSettings.showQuotaCountdown?chip('◷',glance.countdown,'Time until reset'):null,jsx('span',{'aria-hidden':true,style:{fontSize:9,opacity:.7},children:'⌄'})]})
      ]}),
      mapSettings.showQuotaBar&&summary?jsx('progress',{max:100,value:summary.remaining,'aria-label':'Remaining quota percent',style:{display:'block',width:'100%',height:3,marginTop:6,accentColor:tone}}):null
    ]}),
    jsxs('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:10},children:[jsx('strong',{style:{fontSize:10,letterSpacing:'.08em'},children:'ACCOUNT QUOTA'}),jsx('button',{type:'button',style:button,disabled:!scope || live.isFetching || cache.isFetching,onClick:()=>{live.refetch();if(cacheEnabled)cache.refetch()},children:live.isFetching?'Loading…':'Refresh'})]}),
    !scope ? note('Select a session. Profile-safe quota routing is unavailable.') : live.error ? note('Account limits unavailable: unsupported RPC, access denied or request failure. No remaining quota assumed.') : !live.data ? note('Loading provider account limits…') : jsxs('div',{children:[note(`${stale?'STALE · ':''}Hermes account limits · received ${new Date(live.data.receivedAt).toLocaleTimeString()}`),...(live.data.lines.length?live.data.lines.map((line,i)=>note(line,i)):[note('Provider has no reported account limits. Context usage is not account quota.')])]}),
    cacheEnabled ? jsxs('div',{children:[
      cache.error ? note('Quota plugin cache unavailable. Install/enable it separately; no provider refresh is run here.') : !data ? note('Reading cached quota…') : jsxs('div',{children:[note(`${data.stale?'STALE / UNKNOWN':'Cached'} · ${data.fetchedAt?new Date(data.fetchedAt).toLocaleString():'no timestamp'}`),...data.windows.slice(0,20).map((w,i)=>{const g=quotaGlance(w,clock,cache.data?.timezone);const color=g.level==='critical'?C.red:g.level==='warning'?C.accent:g.current?C.mem:C.ash;return jsxs('div',{style:{marginTop:8,padding:10,border:`1px solid ${C.line}`,borderLeft:`3px solid ${color}`,borderRadius:7,fontSize:11},children:[jsx('div',{title:`${w.provider} · ${w.label}`,style:{color:C.ash,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:7},children:`${w.provider} · ${w.label}`}),jsxs('div',{'aria-label':g.title,title:g.title,style:{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',flexWrap:'wrap'},children:[jsxs('span',{style:{color},children:[jsx('strong',{style:{fontSize:18},children:g.remaining}),jsx('span',{style:{fontSize:10,color:C.ash},children:g.current?' left':' unknown'})]}),mapSettings.showQuotaReset?chip('↻',g.reset,`Reset: ${quotaWindowText(w,clock,cache.data?.timezone).reset}`):null,mapSettings.showQuotaCountdown?chip('◷',g.countdown,quotaWindowText(w,clock,cache.data?.timezone).countdown):null]}),g.current&&mapSettings.showQuotaBar?jsx('progress',{max:100,value:w.remaining,'aria-label':`${w.provider}: remaining quota`,style:{width:'100%',height:4,marginTop:7,accentColor:color}}):!g.current?note(w.stale?'Stale data; unconfirmed':'No current data'):null]},i)}),!data.windows.length?note('No quota windows for selected providers. Change Settings → Quota providers.'):null]})
    ]}):null
  ]})
}
function Pane({ expanded = false } = {}) {
  const id = useValue(host.state.focusedSessionId)
  const model = useValue(host.state.model)
  const usage = useValue(host.state.focusedUsage)
  const owner = useValue(host.state.focusedSessionOwner || EMPTY_OWNER)
  const scope = quotaScope(owner,id)
  const paneVisible = useValue(host.paneVisibility?.('lot-map:pane') || ALWAYS_VISIBLE)
  const [settingsOpen,setSettingsOpen]=React.useState(false)
  const [tabVisible,setTabVisible]=React.useState(()=>typeof document==='undefined'||!document.hidden)
  const [prefersReduced,setPrefersReduced]=React.useState(()=>typeof window!=='undefined'&&!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  React.useEffect(()=>{if(typeof document==='undefined')return;const fn=()=>setTabVisible(!document.hidden);document.addEventListener('visibilitychange',fn);return()=>document.removeEventListener('visibilitychange',fn)},[])
  React.useEffect(()=>{if(typeof window==='undefined')return;const mq=window.matchMedia?.('(prefers-reduced-motion: reduce)');const fn=()=>setPrefersReduced(!!mq?.matches);mq?.addEventListener?.('change',fn);return()=>mq?.removeEventListener?.('change',fn)},[])
  const visible=(expanded||paneVisible)&&tabVisible
  const providerQuery=useQuery({queryKey:quotaKey(scope,'provider'),enabled:!!scope&&visible,staleTime:60000,refetchInterval:visible?60000:false,retry:false,placeholderData:undefined,queryFn:()=>providerForScope(host,scope)})
  const provider=typeof providerQuery.data==='string'?providerQuery.data:''
  const palette=resolveMapTheme(mapSettings,provider)
  const motion=motionMode(mapSettings.motion,prefersReduced,visible)
  const [filter,setFilter] = React.useState('all')
  const [search,setSearch] = React.useState('')
  const [, setTick] = React.useState(0)
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1)
    listeners.add(fn)
    const timer = visible ? setInterval(() => { if (sessions.get(String(id))?.running.size) fn() }, 1000) : null
    return () => { listeners.delete(fn); clearInterval(timer) }
  }, [id, visible])
  const s = sessions.get(String(id)) || { rows: [], running: new Map(), counts: {}, errors: {} }
  const board = asBoard(s, model, usage)
  const C = themePalette(palette)
  const setup = LotMapOriginal.setupFrom({coreName:'HERMES',theme:palette==='paper'?'light':'dark',motion:motion==='full'?'full':'reduced',logRows:16})
  const now = LotMapOriginal.nowParts(board, setup.t)
  const filtered = filterInsightRows(s.rows,filter,search)
  const rows = LotMapOriginal.foldRows(asBoard({...s,rows:filtered},model,usage).entries)
  const metrics = insightSummary(s.rows)
  const usageData = usageInsights(usage)
  const active = s.running.size > 0 || s.turn
  const total = Object.values(s.counts).reduce((a, b) => a + b, 0)
  const mono = 'SF Mono, ui-monospace, Menlo, Consolas, monospace'
  const headerCell = { fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '.10em', textTransform: 'uppercase' }
  return jsxs('div', { className:'lot-map-ui','data-motion':motion,style: {'--map-accent':C.accent,fontSize:mapSettings.fontSize,height: '100%', overflowY: 'auto', width: '100%', boxSizing: 'border-box', maxWidth: expanded ? 920 : undefined, margin: expanded ? '0 auto' : undefined, background: C.ground, color: C.bone, fontFamily:mapSettings.fontFamily==='system'?'system-ui, sans-serif':mono,'--map-font-size':`${mapSettings.fontSize}px`,'--map-radius':`${mapSettings.cornerRadius}px`, scrollbarColor: `${C.line} ${C.ground}` }, children: [
    jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '14px 17px 12px', borderBottom: `1px solid ${C.line}` }, children: [
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }, children: [
        jsx('span', { style: { width: 7, height: 7, flexShrink: 0, borderRadius: '50%', background: active ? C.accent : C.dim, boxShadow: active ? `0 0 10px ${C.accent}` : 'none' }, 'aria-hidden': true }),
        jsx('span', { style: { ...headerCell, color: C.bone, whiteSpace: 'nowrap' }, children:mapSettings.showHeaderTitle?'LOT MAP':'' }),
        jsx('span', { style: { ...headerCell, fontWeight: 400, color: C.dim, letterSpacing: '.04em', whiteSpace: 'nowrap' }, children:mapSettings.showLiveStatus?(active?'LIVE':'IDLE'):'' })
      ] }),
      jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }, children: [
        mapSettings.showExpandButton?jsx('button', { type: 'button', title: expanded ? 'Back to chat' : 'Open full map', 'aria-label': expanded ? 'Back to chat' : 'Open full map', onClick: () => host.navigate(expanded ? '/' : '/lot-map'), style: { border: `1px solid ${C.line}`, borderRadius: 6, background: C.raised, color: C.ash, padding: '4px 8px', cursor: 'pointer', fontSize: 12, lineHeight: '14px' }, children: expanded ? '↩ CHAT' : '↗' }):null,
        jsx('button',{type:'button','aria-label':'Open settings','aria-expanded':settingsOpen,onClick:()=>setSettingsOpen(v=>!v),style:{border:`1px solid ${C.line}`,borderRadius:6,background:C.raised,color:C.ash,padding:'4px 8px',cursor:'pointer'},children:'⚙'})
      ] })
    ] }),
    settingsOpen?jsx(SettingsPanel,{C,provider,scope,visible,onClose:()=>setSettingsOpen(false)}):null,
    mapSettings.showQuota?jsx(QuotaPanel,{C,scope,visible}):null,
    mapSettings.showMap?jsx(MapLayer,{board,palette,motion,expanded}):null,
    jsx('style',{children:MAP_CSS}),
    mapSettings.showUsage?jsxs('section',{style:{padding:'0 17px 13px',borderBottom:`1px solid ${C.line}`},'aria-label':'Session insights',children:[
      jsx('div',{style:{fontSize:10,color:C.ash,marginBottom:8},children:'SESSION USAGE · HERMES-REPORTED'}),
      jsx('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(80px,1fr))',gap:6},children:[['INPUT TOKENS',usageData.input],['OUTPUT TOKENS',usageData.output],['COST (USD)',usageData.cost===null?null:`$${usageData.cost.toFixed(4)}*`]].filter(([label])=>label==='INPUT TOKENS'?mapSettings.showInputTokens:label==='OUTPUT TOKENS'?mapSettings.showOutputTokens:mapSettings.showCost).map(([label,value])=>jsx(Metric,{label,value:value===null?'Not reported':String(value),C},label))}),
      mapSettings.showContext?jsx('div',{style:{fontSize:10,color:usageData.context>=80?C.accent:C.ash,marginTop:8},children:usageData.context===null || !usageData.contextMax?'Context not reported':`Context ${usageData.context.toFixed(1)}%${usageData.estimated?' (estimated)':''} · not account quota${usageData.context>=80?' · consider compacting or a new chat':''}`}):null,
      mapSettings.showCost&&usageData.cost!==null?jsx('div',{style:{fontSize:9,color:C.dim,marginTop:4},children:'* Hermes estimate; not an invoice or account balance.'}):null,
      mapSettings.showToolStats?jsx('div',{style:{fontSize:10,color:C.ash,marginTop:9},children:`Observed tools (last 80 events): ${metrics.succeeded} OK · ${metrics.failed} failed · ${metrics.running} running · ${metrics.unknown} unconfirmed/cancelled`}):null,
      ...(mapSettings.showSlowTools?metrics.slow:[]).slice(0,3).map((r,i)=>jsx('div',{style:{fontSize:10,color:C.accent,marginTop:5},children:`Long running: ${r.name} · ${elapsed(r.ms)} (may be expected)`},i)),
      ...(mapSettings.showSlowTools?metrics.slowest:[]).map((r,i)=>jsx('div',{style:{fontSize:10,color:C.dim,marginTop:4},children:`Slow completed: ${r.label} · ${elapsed(r.elapsed)}`},`slow-${i}`)),
      mapSettings.showClearButton?jsx('button',{type:'button',style:{marginTop:8,border:`1px solid ${C.line}`,background:C.raised,color:C.ash,borderRadius:5,padding:'4px 7px',fontSize:10,cursor:'pointer'},onClick:()=>{sessions.delete(String(id));emit()},children:'Clear local observations (not chat or billing)'}):null
    ]}):null,
    mapSettings.showStatus?jsxs('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '1px 17px 13px', borderBottom: `1px solid ${C.line}` }, children: [
      jsx('span', { style: { color: active ? C.accent : C.ash, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: now.what, children: active ? `●  ${now.what}` : now.what }),
      jsx('span', { style: { color: C.dim, fontSize: 10, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }, children: now.meter })
    ] }):null,
    mapSettings.showActivity&&mapSettings.showActivityHeading?jsxs('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 17px 8px' }, children: [
      jsx('span', { style: { ...headerCell, color: C.bone }, children: 'RECENT ACTIVITY' }),
      jsx('span', { style: { ...headerCell, color: C.dim, fontVariantNumeric: 'tabular-nums' }, children: `${total} EVENT${total === 1 ? '' : 'S'}` })
    ] }):null,
    mapSettings.showActivity&&mapSettings.showActivityFilters?jsxs('div',{style:{display:'flex',gap:7,padding:'0 17px 8px'},children:[jsx('select',{'aria-label':'Activity filter',value:filter,onChange:e=>setFilter(e.target.value),style:{minWidth:0,background:C.raised,color:C.ash,border:`1px solid ${C.line}`,borderRadius:5},children:['all','errors','running'].map(v=>jsx('option',{value:v,children:v==='errors'?'Errors / unknown':v},v))}),jsx('input',{'aria-label':'Search tool names',placeholder:'Find tool…',value:search,onChange:e=>setSearch(e.target.value.slice(0,100)),style:{width:'100%',minWidth:0,background:C.raised,color:C.bone,border:`1px solid ${C.line}`,borderRadius:5,padding:5}})]}):null,
    mapSettings.showActivity?jsx('div', { style: { padding: '0 17px 22px', fontSize: 11 }, children: rows.length ? rows.slice(-mapSettings.activityRows).map((r, i) => {
      const e = r.entry, running = e.status === 'run', bad = e.status === 'err'
      const tone = bad ? C.red : running ? e.station === 'memory' ? C.mem : C.accent : C.dim
      return jsxs('div', { style: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, minHeight: mapSettings.density==='compact'?26:34, borderBottom: `1px solid ${C.line}`, fontVariantNumeric: 'tabular-nums' }, children: [
        mapSettings.showActivityIcons?jsx('span', { style: { width: 11, flexShrink: 0, color: tone, fontSize: 12 }, children: bad ? '✕' : running ? '●' : '·' }):null,
        mapSettings.showActivityStation?jsx('span', { style: { width: 61, flexShrink: 0, color: running ? C.bone : C.ash }, children: setup.t.stations[e.station] }):null,
        jsx('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: running ? tone : C.ash }, title: e.label, children: `${e.label}${r.times > 1 ? ` +${r.times - 1}` : ''}` }),
        mapSettings.showActivityDuration?jsx('span', { style: { flexShrink: 0, color: running ? tone : C.dim, textAlign: 'right' }, children: running ? 'RUNNING' : filtered.find(x=>x.label===e.label && x.at===e.startedAt)?.unknown ? 'UNCONFIRMED' : filtered.find(x=>x.label===e.label && x.at===e.startedAt)?.cancelled ? 'CANCELLED' : e.mark ? '—' : elapsed(r.tookMs) }):null
      ] }, `${e.id}-${i}`)
    }) : jsx('div', { style: { color: C.dim, padding: '12px 0', lineHeight: '18px' }, children: 'No activity yet. Start a conversation to trace its path.' }) }):null
  ] })
}
export default {
  id: 'lot-map', name: 'Lot Map for Hermes',
  register(ctx) {
    storage = ctx.storage
    mapSettings=loadMapSettings(storage)
    for (const type of ['message.start', 'message.complete', 'tool.start', 'tool.complete']) ctx.onEvent(type, receive)
    ctx.onDispose(() => { sessions.clear(); listeners.clear(); queryClient?.cancelQueries({queryKey:['lot-map']}); queryClient?.removeQueries({queryKey:['lot-map']}); storage = undefined })
    ctx.register({ id: 'pane', area: 'panes', title: 'Lot Map', data: { placement: 'right', width: '390px' }, render: () => jsx(Pane, {}) })
    ctx.register({ id: 'page', area: ROUTES_AREA, data: { path: '/lot-map' }, render: () => jsx(Pane, { expanded: true }) })
    ctx.register({ id: 'nav', area: SIDEBAR_NAV_AREA, data: { path: '/lot-map', label: 'Lot Map', codicon: 'map' } })
    ctx.register({ id: 'open', area: PALETTE_AREA, data: { id: 'lot-map.open', label: 'Open Lot Map', keywords: ['map', 'activity', 'tools'], run: () => host.navigate('/lot-map') } })
  }
}
