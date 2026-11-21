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
