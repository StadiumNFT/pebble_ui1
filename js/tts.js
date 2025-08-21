export async function ttsSpeak(text){
  return new Promise((resolve) => {
    try{
      const utter = new SpeechSynthesisUtterance(String(text || ''));
      utter.rate = 1.0; utter.pitch = 1.0;
      utter.onend = resolve; utter.onerror = resolve;
      try{ window.speechSynthesis.cancel(); }catch{}
      window.speechSynthesis.speak(utter);
    }catch{ resolve(); }
  });
}
