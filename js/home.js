(() => {
  const story = document.querySelector(".assistant-story");
  if (!story) return;
  const paths = [...story.querySelectorAll(".demo-route")];
  const lengths = paths.map(path => path.getTotalLength());
  const start = [0.18, 0.43, 0.64];
  const finish = [0.43, 0.64, 0.96];
  const captions = [
    "Locate the entrance · 1/F",
    "Calculate a step-free route to W201",
    "Follow the corridor to the lift · 1/F",
    "Take the lift · 1/F to 2/F",
    "Follow the corridor to W201 · 2/F",
    "Arrive at W201 · 2/F",
  ];
  const marker = story.querySelector("#route-traveller");
  const upper = story.querySelector(".upper-deck");
  const lower = story.querySelector(".lower-deck");
  const pin = story.querySelector(".room-pin");
  const caption = story.querySelector(".film-status");
  const replay = story.querySelector(".film-replay");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = value => Math.min(1, Math.max(0, value));
  let playback = 0;
  let scrollFrame = 0;
  let replayEndScroll = null;
  let lastProgress = -1;

  function draw(progress) {
    if (progress === lastProgress) return;
    lastProgress = progress;
    const fraction = start.map((begin, i) => clamp((progress - begin) / (finish[i] - begin)));
    paths.forEach((path, i) => {
      path.style.strokeDasharray = String(lengths[i]);
      path.style.strokeDashoffset = String(lengths[i] * (1 - fraction[i]));
      path.style.opacity = fraction[i] === 0 ? "0" : "1";
    });
    const leg = progress >= start[2] ? 2 : progress >= start[1] ? 1 : 0;
    const point = paths[leg].getPointAtLength(lengths[leg] * fraction[leg]);
    marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
    upper.style.opacity = String(0.55 + 0.45 * fraction[1]);
    lower.style.opacity = String(1 - 0.3 * fraction[1]);
    pin.style.opacity = String(0.45 + 0.55 * clamp(progress / 0.08));
    const step = progress >= finish[2] ? 5 : progress < 0.065 ? 0 : progress < start[0] ? 1 : leg + 2;
    if (caption.textContent !== captions[step]) caption.textContent = captions[step];
    story.dataset.routeStage = String(step);
  }

  function updateScroll() {
    scrollFrame = 0;
    if (media.matches || playback || (replayEndScroll !== null && Math.abs(scrollY - replayEndScroll) < 12)) return;
    replayEndScroll = null;
    const rect = story.getBoundingClientRect();
    const viewport = window.innerHeight;
    // Begin when the map comes into view and finish while its caption is still readable.
    const lead = viewport * (innerWidth > 680 ? 0.38 : 0.1);
    const distance = Math.max(viewport * 0.42, rect.height - viewport * 0.45);
    draw(clamp((lead - rect.top) / distance));
  }
  function schedule() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  function stopReplay() {
    cancelAnimationFrame(playback);
    playback = 0;
  }
  function play() {
    stopReplay();
    if (media.matches) return;
    const began = performance.now();
    function frame(time) {
      const progress = clamp((time - began) / 4600);
      draw(progress);
      if (progress < 1) playback = requestAnimationFrame(frame);
      else {
        playback = 0;
        replayEndScroll = scrollY;
      }
    }
    playback = requestAnimationFrame(frame);
  }
  function resetMode() {
    stopReplay();
    replayEndScroll = null;
    replay.hidden = media.matches;
    if (media.matches) draw(1);
    else updateScroll();
  }

  story.classList.add("is-scroll-story");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  media.addEventListener("change", resetMode);
  replay.addEventListener("click", play);
  resetMode();
})();
