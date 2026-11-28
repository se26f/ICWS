const kioskDemo = document.querySelector('[data-kiosk-demo]');

if (kioskDemo) {
  const translations = {
    en: {
      greeting: 'Hello! I’m ABC-chan, your campus navigation assistant. Where would you like to go?',
      map: 'Map', indoorMap: 'Indoor map', illustrative: 'Illustrative', entrance: 'Entrance kiosk',
      ground: 'Entrance level', sixth: '6/F', lift: 'Lift to 6/F', liftExit: 'From the lift', stepFree: 'Step-free route',
      wheelchair: 'Wheelchair mode', wheelchairHelp: 'Lowers the controls for easier reach and enables step-free routing.',
      destination: 'Destination name or room number',
      placeholder: 'e.g. Room W606', find: 'Find route', library: 'Library', reception: 'Reception',
      language: 'Language', subtitles: 'Subtitles', listen: 'Speak', restart: 'Restart',
      mapChoices: 'Choose a destination on the indoor map', suggestions: 'Example destinations',
      empty: 'Enter a destination or choose an example below.',
      unknown: 'Try W606, Library or Reception from this demonstration.',
      speechUnavailable: 'Speech is unavailable in this browser. You can read the response on screen.',
      visitor: name => 'I want to go to ' + name + '.',
      w606: 'Room W606 is on the sixth floor. Take the lift to 6/F, then turn left.',
      w606Accessible: 'Room W606 is on the sixth floor. Follow the step-free corridor to the lift, take it to 6/F, then turn left.',
      libraryRoute: 'The library is on the entrance level. Follow the corridor and turn right.',
      libraryAccessible: 'For the library, follow the step-free corridor on the entrance level, then turn right.',
      receptionRoute: 'Reception is on the entrance level. Cross the lobby and turn left.',
      receptionAccessible: 'For reception, take the step-free lobby corridor and turn left.'
    },
    'zh-Hant': {
      greeting: '你好！我是校園導航助手 ABC-chan。請問你想去哪裡？',
      map: '地圖', indoorMap: '室內地圖', illustrative: '路線示意', entrance: '入口導覽站',
      ground: '入口樓層', sixth: '六樓', lift: '乘升降機往六樓', liftExit: '從升降機出發', stepFree: '無障礙路線',
      wheelchair: '輪椅模式', wheelchairHelp: '降低控制介面，方便觸及，並啟用無梯級路線。',
      destination: '目的地名稱或房間編號',
      placeholder: '例如：W606 室', find: '尋找路線', library: '圖書館', reception: '接待處',
      language: '語言', subtitles: '字幕', listen: '朗讀', restart: '重新開始',
      mapChoices: '在室內地圖上選擇目的地', suggestions: '示範目的地',
      empty: '請輸入目的地，或選擇下方的示範地點。',
      unknown: '請試用本示範中的 W606 室、圖書館或接待處。',
      speechUnavailable: '此瀏覽器無法朗讀，你可以在螢幕上閱讀回覆。',
      visitor: name => '我想去' + name + '。',
      w606: 'W606 室位於六樓。乘升降機到六樓，然後左轉。',
      w606Accessible: 'W606 室位於六樓。沿無障礙通道前往升降機，乘升降機到六樓，然後左轉。',
      libraryRoute: '圖書館位於入口樓層。沿走廊前行，然後右轉。',
      libraryAccessible: '沿入口樓層的無障礙通道前行，然後右轉前往圖書館。',
      receptionRoute: '接待處位於入口樓層。穿過大堂，然後左轉。',
      receptionAccessible: '沿大堂的無障礙通道前行，然後左轉前往接待處。'
    }
  };
  const destinations = {
    w606: { match: /\b(?:w\s*[-–]?\s*606|606)\b/i, name: 'W606', reply: 'w606', pin: [308, 32] },
    library: { match: /\blibrary\b|圖書館|图书馆/i, name: 'library', reply: 'libraryRoute', pin: [159, 100] },
    reception: { match: /\breception\b|接待處|接待处/i, name: 'reception', reply: 'receptionRoute', pin: [61, 33] }
  };
  const choose = selector => kioskDemo.querySelector(selector);
  const conversation = choose('.kiosk-conversation');
  const visitor = choose('.kiosk-visitor');
  const reply = choose('.kiosk-reply');
  const controls = choose('[data-kiosk-controls]');
  const map = choose('[data-kiosk-map]');
  const mapChoices = choose('.kiosk-map-choices');
  const mapButton = choose('[data-kiosk-map-button]');
  const route = choose('[data-kiosk-route]');
  const track = choose('[data-kiosk-track]');
  const pin = choose('[data-kiosk-pin]');
  const ramp = choose('.kiosk-map-ramp');
  const upperMap = choose('[data-kiosk-upper]');
  const floor = choose('[data-kiosk-floor]');
  const wheelchair = choose('[data-kiosk-wheelchair]');
  const form = choose('[data-kiosk-form]');
  const input = form.elements.destination;
  const error = choose('[data-kiosk-error]');
  const language = choose('[data-kiosk-language]');
  const captions = choose('[data-kiosk-captions]');
  const subtitles = choose('[data-kiosk-subtitles]');
  const clock = choose('[data-kiosk-clock]');
  const listen = choose('[data-kiosk-listen]');
  const audioStatus = choose('[data-kiosk-audio-status]');
  const speech = 'SpeechSynthesisUtterance' in window ? window.speechSynthesis : null;
  const state = { key: '', accessible: false, mapOpen: true, subtitles: false };
  let errorKey = '';

  function textFor() {
    return translations[language.value];
  }

  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = new Intl.DateTimeFormat(language.value, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(now);
  }

  function setError(key = '') {
    errorKey = key;
    if (key) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    error.textContent = key ? textFor()[key] : '';
    error.hidden = !key;
  }

  function renderMap(animate = false) {
    const destination = destinations[state.key];
    const text = textFor();
    map.hidden = !state.mapOpen;
    mapButton.setAttribute('aria-pressed', String(state.mapOpen));
    mapChoices.hidden = Boolean(destination) && !state.accessible;
    upperMap.hidden = state.key !== 'w606';
    pin.toggleAttribute('hidden', !destination);
    pin.classList.toggle('is-transfer', state.key === 'w606');
    ramp.toggleAttribute('hidden', !state.accessible);
    floor.textContent = [
      state.key === 'w606' ? text.lift : text.ground,
      state.accessible ? text.stepFree : ''
    ].filter(Boolean).join(' · ');
    map.classList.remove('animate-route');
    if (!destination) {
      route.removeAttribute('d');
      track.removeAttribute('d');
      return;
    }
    const [x, y] = destination.pin;
    const start = state.accessible ? 'M40 98H22V68' : 'M40 98V68';
    const path = start + 'H' + x + 'V' + y;
    route.setAttribute('d', path);
    track.setAttribute('d', path);
    pin.setAttribute('cx', x);
    pin.setAttribute('cy', y);
    if (animate && state.mapOpen) {
      void map.offsetWidth;
      map.classList.add('animate-route');
    }
  }

  function renderReply(animate = false) {
    const destination = destinations[state.key];
    const text = textFor();
    const name = destination && (text[destination.name] || destination.name);
    const routeKey = destination && (state.accessible ? state.key + 'Accessible' : destination.reply);
    const message = destination ? text[routeKey] : text.greeting;
    visitor.hidden = !destination;
    visitor.textContent = name ? text.visitor(name) : '';
    reply.textContent = message;
    subtitles.textContent = message;
    subtitles.hidden = !state.subtitles;
    conversation.classList.remove('is-speaking');
    if (animate) {
      void conversation.offsetWidth;
      conversation.classList.add('is-speaking');
    }
  }

  function stopSpeech() {
    if (speech) speech.cancel();
    audioStatus.textContent = '';
    audioStatus.hidden = true;
  }

  function showDestination(key) {
    stopSpeech();
    state.key = key;
    state.mapOpen = true;
    setError();
    renderReply(true);
    renderMap(true);
  }

  function renderLanguage() {
    const text = textFor();
    kioskDemo.lang = language.value;
    for (const label of kioskDemo.querySelectorAll('[data-kiosk-copy]')) {
      label.textContent = text[label.dataset.kioskCopy];
    }
    input.placeholder = text.placeholder;
    mapChoices.setAttribute('aria-label', text.mapChoices);
    choose('[data-kiosk-suggestions]').setAttribute('aria-label', text.suggestions);
    setError(errorKey);
    updateClock();
    renderReply();
    renderMap();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value.normalize('NFKC').trim();
    const key = Object.keys(destinations).find(id => destinations[id].match.test(value));
    if (key) {
      showDestination(key);
    } else {
      setError(value ? 'unknown' : 'empty');
      input.focus();
    }
  });

  input.addEventListener('input', () => setError());

  kioskDemo.addEventListener('click', event => {
    const button = event.target.closest('[data-kiosk-destination]');
    if (!button) return;
    const key = button.dataset.kioskDestination;
    const destination = destinations[key];
    input.value = textFor()[destination.name] || destination.name;
    if (mapChoices.contains(button) && !state.accessible) mapButton.focus({ preventScroll: true });
    showDestination(key);
  });

  mapButton.addEventListener('click', () => {
    state.mapOpen = !state.mapOpen;
    renderMap(state.mapOpen);
  });

  wheelchair.addEventListener('click', () => {
    stopSpeech();
    state.accessible = !state.accessible;
    wheelchair.setAttribute('aria-pressed', String(state.accessible));
    kioskDemo.classList.toggle('is-wheelchair', state.accessible);
    if (state.key) renderReply(true);
    renderMap(Boolean(state.key));
  });

  captions.addEventListener('click', () => {
    state.subtitles = !state.subtitles;
    captions.setAttribute('aria-pressed', String(state.subtitles));
    subtitles.hidden = !state.subtitles;
  });

  language.addEventListener('change', () => {
    stopSpeech();
    renderLanguage();
  });

  choose('[data-kiosk-restart]').addEventListener('click', () => {
    stopSpeech();
    state.key = '';
    state.mapOpen = true;
    input.value = '';
    setError();
    renderReply(true);
    renderMap();
    input.focus({ preventScroll: true });
  });

  if (speech) {
    listen.hidden = false;
    listen.addEventListener('click', () => {
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(reply.textContent);
      utterance.lang = language.value === 'en' ? 'en-GB' : 'zh-HK';
      utterance.onerror = event => {
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          audioStatus.hidden = false;
          audioStatus.textContent = textFor().speechUnavailable;
        }
      };
      speech.speak(utterance);
    });
    window.addEventListener('pagehide', stopSpeech);
  }

  renderLanguage();
  controls.hidden = false;
  window.setInterval(updateClock, 15000);
}
