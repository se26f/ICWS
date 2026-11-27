(() => {
  const walk = document.querySelector('.walk');
  if (!walk) return;

  const tour = walk.querySelector('.walk-tour');
  const stages = [...walk.querySelectorAll('.walk-stage')];
  const picks = [...walk.querySelectorAll('[data-pick]')];
  const gallery = walk.querySelector('.walk-gallery details');
  const items = [...gallery.querySelectorAll('.walk-strip li')];
  const pictures = items.map(item => item.querySelector('img'));
  const names = items.map(item => item.querySelector('b').textContent);
  const notes = items.map(item => item.querySelector('p').textContent);
  const counts = items.map((_, i) => String(i + 1).padStart(2, '0') + ' / 13');
  const camera = walk.querySelector('.walk-camera');
  const zoom = camera.querySelector('.walk-zoom');
  const range = camera.querySelector('input[type=range]');
  const caption = camera.querySelector('.walk-caption');
  const controls = [...camera.querySelectorAll('[data-step]')];
  const small = matchMedia('(max-width: 750px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapterNav = walk.querySelector('.walk-jumps');
  const mobileNav = chapterNav.cloneNode(true);
  mobileNav.className = 'walk-mobile-jumps';
  mobileNav.setAttribute('aria-label', 'Choose walkthrough chapter');
  mobileNav.querySelectorAll('span').forEach(number => number.remove());
  tour.prepend(mobileNav);
  const dialog = walk.querySelector('dialog');
  const viewerImage = dialog.querySelector('.walk-large');
  let active = -1;
  let viewed = -1;
  let opener;
  let queued = false;

  function usePicture(target, index) {
    const picture = pictures[index];
    target.width = Number(picture.getAttribute('width'));
    target.height = Number(picture.getAttribute('height'));
    target.alt = picture.alt;
    target.src = picture.src;
  }

  function select(index) {
    if (index === active) return;
    active = index;
    const chapter = picks[index].closest('.walk-stage');
    stages.forEach(stage => stage.classList.toggle('is-active', stage === chapter));
    mobileNav.querySelectorAll('a').forEach(link => {
      if (link.hash === '#' + chapter.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    picks.forEach((pick, i) => {
      if (i === index) pick.setAttribute('aria-current', 'step');
      else pick.removeAttribute('aria-current');
    });
    const image = zoom.querySelector('img');
    usePicture(image, index);
    if (!reduced.matches && image.animate) {
      image.getAnimations().forEach(animation => animation.cancel());
      image.animate([{opacity: .78, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {duration: 220, easing: 'cubic-bezier(.22,.75,.25,1)'});
    }
    caption.querySelector('.walk-count').textContent = counts[index];
    caption.querySelector('h3').textContent = names[index];
    caption.querySelector('p').textContent = notes[index];
    range.value = String(index + 1);
    range.setAttribute('aria-valuetext', counts[index] + ', ' + names[index]);
    zoom.setAttribute('aria-label', 'Enlarge ' + names[index]);
    controls[0].disabled = index === 0;
    controls[1].disabled = index === items.length - 1;
  }

  function readingLine() {
    return window.innerHeight * .54;
  }
  function followScroll() {
    queued = false;
    if (small.matches || reduced.matches || dialog.open) return;
    let index = 0;
    const line = readingLine();
    for (let i = 1; i < picks.length; i++) {
      if (picks[i].getBoundingClientRect().top > line) break;
      index = i;
    }
    select(index);
  }
  function queueScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(followScroll);
  }
  function go(index, alignTour = false) {
    select(index);
    if (!small.matches) {
      const top = window.scrollY + picks[index].getBoundingClientRect().top - readingLine() + 1;
      window.scrollTo({top, behavior: 'instant'});
    } else if (alignTour) {
      tour.scrollIntoView({block: 'start', behavior: 'instant'});
    }
  }
  function followHash() {
    const stage = stages.find(stage => '#' + stage.id === location.hash);
    if (stage) go(Number(stage.querySelector('[data-pick]').dataset.pick), true);
    else if (items.some(item => '#' + item.id === location.hash)) {
      gallery.open = true;
      document.getElementById(location.hash.slice(1)).scrollIntoView();
    }
  }
  [...chapterNav.querySelectorAll('a'), ...mobileNav.querySelectorAll('a'), walk.querySelector('.walk-start')]
    .forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      followHash();
      const title = stages.find(stage => '#' + stage.id === link.hash).querySelector('h2');
      title.tabIndex = -1;
      title.focus({preventScroll: true});
    }));
  picks.forEach((pick, i) => {
    pick.addEventListener('click', event => { event.preventDefault(); go(i); });
  });
  controls.forEach(button => button.addEventListener('click', () => go(active + Number(button.dataset.step))));
  range.addEventListener('input', () => go(Number(range.value) - 1));
  window.addEventListener('scroll', queueScroll, {passive: true});
  window.addEventListener('resize', queueScroll);
  window.addEventListener('hashchange', followHash);

  function showLarge(index) {
    viewed = (index + items.length) % items.length;
    usePicture(viewerImage, viewed);
    dialog.querySelector('.walk-count').textContent = counts[viewed];
    dialog.querySelector('h2').textContent = names[viewed];
  }
  function openLarge(index, trigger) {
    opener = trigger;
    showLarge(index);
    dialog.showModal();
    document.body.classList.add('walk-viewing');
    dialog.querySelector('[data-close]').focus();
  }
  zoom.addEventListener('click', () => openLarge(active, zoom));
  walk.querySelectorAll('[data-open]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openLarge(Number(link.dataset.open), link);
  }));
  dialog.querySelector('[data-prev]').addEventListener('click', () => showLarge(viewed - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => showLarge(viewed + 1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showLarge(viewed + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')];
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault();
        buttons.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === buttons.at(-1)) {
        event.preventDefault();
        buttons[0].focus();
      }
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('walk-viewing');
    opener?.focus({preventScroll: true});
  });
  walk.classList.add('is-ready');
  gallery.open = false;
  select(0);
  if (location.hash) requestAnimationFrame(followHash);
  else queueScroll();
})();
