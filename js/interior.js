// Anchor links keep every chapter readable when scripting is unavailable.
function linkChapters(navigation, panelSelector, initialId) {
  const controls = document.querySelector(navigation);
  if (!controls) return;
  const links = [...controls.querySelectorAll('a')];
  const panels = [...document.querySelectorAll(panelSelector)];

  function select(id) {
    if (!panels.some(panel => panel.id === id)) return;
    for (const panel of panels) panel.hidden = panel.id !== id;
    for (const link of links) {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }

  controls.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    select(link.hash.slice(1));
  });

  select(panels.some(panel => '#' + panel.id === location.hash) ? location.hash.slice(1) : initialId);
  window.addEventListener('hashchange', () => select(location.hash.slice(1)));
}

linkChapters('.studio-switch', '.feature-panel', 'destination-search');
linkChapters('.signal-switch', '.signal-page', 'routing');
