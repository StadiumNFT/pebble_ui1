import { getProxyURL } from './store.js';

const logEl = () => document.getElementById('hwLog');

function addEntry(text){
  const div=document.createElement('div');
  div.className='hw-entry';
  div.textContent=text;
  logEl().appendChild(div);
  logEl().scrollTop = logEl().scrollHeight;
}

async function callProxy(path, body){
  const base = getProxyURL();
  if(!base) return null;
  try{
    const res = await fetch(base + path, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if(!res.ok) return null;
    return await res.json();
  }catch(e){ return null; }
}

function offlineHintFlow(step){
  if (step === 0) return "First, restate the problem in your own words. What is it asking?";
  if (step === 1) return "Underline the numbers and units you need. Which are important?";
  if (step === 2) return "Try a smaller, easy example of the same pattern.";
  if (step === 3) return "Write one equation or sentence that connects what you know to what you need.";
  return "Great! If you want the final step, tap 'Reveal Answer'.";
}

export function initHomework(){
  const question = document.getElementById('hwQuestion');
  const grade = document.getElementById('hwGrade');
  const explain9 = document.getElementById('hwExplainLike9');
  const hintFirst = document.getElementById('hwHintFirst');

  const btnHint = document.getElementById('hwHintBtn');
  const btnNext = document.getElementById('hwNextBtn');
  const btnAns  = document.getElementById('hwAnswerBtn');

  let step = 0;

  btnHint?.addEventListener('click', async () => {
    const q = question.value.trim();
    if(!q){ addEntry("Type the homework question first 😊"); return; }

    const resp = await callProxy('/homework', {
      question:q, grade:grade.value, explainLikeNine:explain9.checked, hintFirst:hintFirst.checked, step:0
    });
    if(resp && resp.hint){ addEntry(resp.hint); step = 1; return; }
    addEntry( offlineHintFlow(0) ); step = 1;
  });

  btnNext?.addEventListener('click', async () => {
    const q = question.value.trim();
    if(!q){ addEntry("Type the homework question first 😊"); return; }

    const resp = await callProxy('/homework', {
      question:q, grade:grade.value, explainLikeNine:explain9.checked, hintFirst:hintFirst.checked, step
    });
    if(resp && resp.next){ addEntry(resp.next); step += 1; return; }
    addEntry( offlineHintFlow(step) ); step += 1;
  });

  btnAns?.addEventListener('click', async () => {
    const q = question.value.trim();
    if(!q){ addEntry("Type the homework question first 😊"); return; }

    const resp = await callProxy('/homework', {
      question:q, grade:grade.value, explainLikeNine:explain9.checked, hintFirst:hintFirst.checked, reveal:true
    });
    if(resp && resp.answer){ addEntry("Answer: " + resp.answer); return; }
    addEntry("Answer: Let's do the last step together—use your equation from the previous hint to compute the final value.");
  });
}
