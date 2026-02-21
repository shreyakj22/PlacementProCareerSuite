// Simple PlacementBot — floating chat widget with canned Q&A
(function(){
  const faqs = [
    {q: 'what is the cutoff', a: 'Cutoff depends on drive; check the drive criteria in your Live Feed.'},
    {q: 'when is the interview', a: 'Interview schedule is available on the TPO scheduler and your application tracker.'},
    {q: 'is the venue changed', a: 'Any venue changes will be notified via PlacementBot and TPO notifications.'}
  ];

  function createWidget(){
    const btn = document.createElement('button');
    btn.id = 'placementbot-btn';
    btn.innerText = 'PlacementBot';
    
    btn.style.position = 'fixed';
    btn.style.right = '16px';
    btn.style.bottom = '16px';
    btn.style.background = '#4F46E5';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '10px 14px';
    btn.style.borderRadius = '8px';
    btn.style.zIndex = 9999;
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'placementbot-modal';
    modal.style.position = 'fixed';
    modal.style.right = '16px';
    modal.style.bottom = '70px';
    modal.style.width = '320px';
    modal.style.maxHeight = '400px';
    modal.style.background = 'white';
    modal.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    modal.style.borderRadius = '8px';
    modal.style.overflow = 'hidden';
    modal.style.display = 'none';
    modal.style.zIndex = 9999;

    modal.innerHTML = `
      <div style="background:#4F46E5;color:white;padding:8px 12px;font-weight:600">PlacementBot</div>
      <div id="placementbot-messages" style="padding:10px;max-height:280px;overflow:auto"></div>
      <div style="display:flex;border-top:1px solid #eee">
        <input id="placementbot-input" style="flex:1;border:0;padding:10px" placeholder="Ask a question...">
        <button id="placementbot-send" style="background:#4F46E5;color:white;border:0;padding:8px 12px">Send</button>
      </div>
    `;
    document.body.appendChild(modal);

    btn.addEventListener('click', ()=>{
      modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('placementbot-send').addEventListener('click', ()=>{
      const v = document.getElementById('placementbot-input').value.trim();
      if(!v) return;
      pushMessage('You', v);
      reply(v);
      document.getElementById('placementbot-input').value = '';
    });
  }

  function pushMessage(from, text){
    const box = document.getElementById('placementbot-messages');
    const el = document.createElement('div');
    el.style.marginBottom = '8px';
    el.innerHTML = `<strong>${from}:</strong> <div style="margin-top:4px">${text}</div>`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function reply(text){
    const t = text.toLowerCase();
    const found = faqs.find(f => t.includes(f.q));
    setTimeout(()=>{
      if(found) pushMessage('Bot', found.a);
      else pushMessage('Bot', "Sorry — I don't know that yet. Ask the TPO or check Live Feed.");
    }, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createWidget);
  else createWidget();
})();
