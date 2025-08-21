// UI-WOW/JS/TTS.JS
// Simple, safe text-to-speech helper.
// If Web Speech is unavailable, it just resolves immediately.
export async function ttsSpeak(text) {
  return new Promise((resolve) => {
    try {
      const u = new SpeechSynthesisUtterance(String(text || ''));
      u.rate = 1.0;
      u.pitch = 1.0;
      u.onend = resolve;
      u.onerror = resolve;
      // Stop any in-flight speech then speak
      try { window.speechSynthesis.cancel(); } catch {}
      window.speechSynthesis.speak(u);
    } catch {
      // No speech API? No problem—don’t block the app.
      resolve();
    }
  });
}
