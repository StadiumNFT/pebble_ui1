
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1';

app.get('/', (req, res) => res.json({ ok:true, service:'Pebble Proxy', routes:['/chat','/tts'] }));

app.post('/chat', async (req, res) => {
  try{
    const { messages } = req.body || {};
    if(!OPENAI_API_KEY) return res.status(400).json({ error:'Missing OPENAI_API_KEY' });
    const body = { model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini', messages: messages?.length?messages:[{role:'user',content:'Say hello as Pebble.'}] };
    const r = await fetch(`${OPENAI_BASE}/chat/completions`, { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${OPENAI_API_KEY}`}, body: JSON.stringify(body)});
    const data = await r.json(); const reply = data?.choices?.[0]?.message?.content || 'Hello from Pebble proxy.';
    res.json({ reply });
  }catch(e){ res.status(500).json({ error: e.message }); }
});

app.post('/tts', async (req, res) => res.json({ ok:true, note:'Stub endpoint — front-end uses Web Speech API.' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Pebble proxy listening on :${PORT}`));
