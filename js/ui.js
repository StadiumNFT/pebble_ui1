// Simple, bulletproof event wiring for the main buttons.
export function initUI({
  onLoadGLBClick,
  onTalkClick,
  onCalmClick,
  onGardenClick,
  onHomeworkClick,
} = {}) {
  const byId = (id) => document.getElementById(id);
  const wire = (id, fn) => {
    const el = byId(id);
    if (el && typeof fn === 'function') el.addEventListener('click', fn);
  };

  wire('btnLoadGLB', onLoadGLBClick);
  wire('btnTalk', onTalkClick);
  wire('btnCalm', onCalmClick);
  wire('btnGarden', onGardenClick);
  wire('btnHomework', onHomeworkClick);
}
