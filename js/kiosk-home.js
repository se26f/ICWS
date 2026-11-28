(() => {
  const stage = document.querySelector(".kiosk-render");
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  if (!stage) return;

  let frame = 0;
  let lastProgress = -1;
  const clamp = value => Math.min(1, Math.max(0, value));

  function render() {
    frame = 0;
    if (!motion.matches) return;
    const bounds = stage.getBoundingClientRect();
    const viewport = window.innerHeight;
    const travel = Math.min(viewport * 0.6, bounds.height * 0.69);
    const progress = clamp((viewport * 0.77 - bounds.top) / travel);
    if (progress === lastProgress) return;
    lastProgress = progress;

    const rise = 1 - (1 - clamp(progress * 1.68)) ** 2.6;
    stage.style.setProperty("--kiosk-rise", `${(1 - rise) * 28}px`);
    stage.style.setProperty("--kiosk-scale", 0.942 + rise * 0.058);
    stage.style.setProperty("--kiosk-shadow-strength", 0.55 + rise * 0.45);
    stage.style.setProperty("--kiosk-chat", clamp((progress - 0.24) / 0.18));
    stage.style.setProperty("--kiosk-trace", 1 - clamp((progress - 0.43) / 0.45));
    stage.style.setProperty("--kiosk-arrival", clamp((progress - 0.82) / 0.18));
  }

  function schedule() {
    if (!frame && motion.matches) frame = requestAnimationFrame(render);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  motion.addEventListener("change", schedule);
  schedule();
})();
