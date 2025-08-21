
import { getProxyURL } from './store.js';
import { ttsSpeak } from './tts.js';
export function initChat({ sayLine }){
  const log=document.getElementById('chatLog');
  const input=document.getElementById('chatInput');
  const send=document.getElementById('btnSend');
  function addMessage(text,who='user'){
    const div=document.createElement('div');
    div.className='message ' + (who==='user'?'user':'bot');
    div.textContent=text; log.appendChild(div); log.scrollTop=log.scrollHeight;
  }
  async function doSend(){
    const text=input.value.trim(); if(!text) return;
    addMessage(text,'user'); input.value='';
    const proxy=getProxyURL();
    try{
      let reply="I'm Pebble! I help turn homework into fun questions with hints and rewards.";
      if(proxy){
        const res=await fetch(proxy + "/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:text}]})});
        if(res.ok){ const data=await res.json(); reply=(data&&data.reply)||reply; }
      }
      addMessage(reply,'bot'); await ttsSpeak(reply);
    }catch(e){ addMessage("Connection issue. Using offline voice.",'bot'); await ttsSpeak("Connection issue. Using offline voice."); }
  }
  send.addEventListener('click',doSend);
  input.addEventListener('keydown',(e)=>{ if(e.key==='Enter') doSend(); });
}
