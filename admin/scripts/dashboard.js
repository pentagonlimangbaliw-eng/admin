const dashboard = {
 async loadRecentQuotes(){
 const container = document.getElementById('recentQuotes');
 container.innerHTML = 'Loading…';
 try {
 const qs = await api.quotes.get({}); // server can support ?recent
 if(!Array.isArray(qs) || qs.length===0){ container.innerHTML = 'No recent quotes'; return; }
 container.innerHTML = '' + qs.slice(0,8).map(q=><li><strong>${q._id}</strong> — ${q.status} — ${q.subtotal ?? '—'} — ${new Date(q.createdAt).toLocaleString()}</li>).join('') + '';
 } catch(e){
 container.innerHTML = 'Failed to load quotes';
 console.error(e);
 }
 }
 };