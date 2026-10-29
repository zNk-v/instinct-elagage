(() => {
  const PHONE = '+33755679613';
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/instinct.elagage@gmail.com';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header + corde ---------- */
  // Inspiré du composant 21st.dev « Scroll animated timeline » : la progression
  // est calculée section par section pour que le mousqueton passe pile sur chaque repère.
  const header = document.getElementById('top');
  const rope = document.querySelector('.rope');
  const fill = rope && rope.querySelector('.rope__fill');
  const stopLinks = rope ? [...rope.querySelectorAll('[data-stop]')] : [];
  const sections = stopLinks.map(a => document.getElementById(a.dataset.stop));
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (!rope || getComputedStyle(rope).display === 'none') return;

    const probe = y + window.innerHeight * 0.4;
    const tops = sections.map(s => s.getBoundingClientRect().top + y);
    const last = sections.length - 1;
    let i = 0;
    while (i < last && probe >= tops[i + 1]) i++;
    let p = 1;
    if (i < last) {
      const local = Math.min(1, Math.max(0, (probe - tops[i]) / (tops[i + 1] - tops[i])));
      p = (i + local) / last;
    }
    rope.style.setProperty('--p', p.toFixed(4));
    fill.style.transform = `scaleY(${p})`;
    stopLinks.forEach((a, k) => {
      a.classList.toggle('is-passed', k <= i);
      a.classList.toggle('is-current', k === i);
      if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    rope.classList.toggle('on-dark', sections[i].classList.contains('section--foret'));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---------- Apparitions ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const siblings = [...e.target.parentElement.children];
        e.target.style.transitionDelay = `${(siblings.indexOf(e.target) % 3) * 70}ms`;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Galerie : filtres ---------- */
  const gallery = document.getElementById('gallery');
  const items = [...gallery.children];
  const chips = [...document.querySelectorAll('.chip')];
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => {
      const on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on);
    });
    items.forEach(li => li.classList.toggle('is-hidden', f !== 'all' && li.dataset.cat !== f));
    if (f !== 'all') openGallery();
  }));

  const more = document.getElementById('galleryMore');
  function openGallery() {
    gallery.classList.add('is-open');
    more.setAttribute('aria-expanded', 'true');
  }
  more.addEventListener('click', () => {
    openGallery();
    items[6].querySelector('.shot').focus({ preventScroll: true });
  });

  /* ---------- Galerie : lightbox ---------- */
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('img');
  const boxCap = box.querySelector('figcaption');
  let current = 0;
  const visible = () => items.filter(li => !li.classList.contains('is-hidden'));

  function show(li) {
    const btn = li.querySelector('.shot');
    boxImg.src = btn.dataset.full;
    boxImg.alt = btn.querySelector('img').alt;
    boxCap.textContent = li.querySelector('span').textContent;
    current = visible().indexOf(li);
  }
  function step(d) {
    const v = visible();
    show(v[(current + d + v.length) % v.length]);
  }
  items.forEach(li => li.querySelector('.shot').addEventListener('click', () => {
    show(li);
    box.showModal();
  }));
  box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
  box.querySelector('.lightbox__prev').addEventListener('click', () => step(-1));
  box.querySelector('.lightbox__next').addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') box.close(); });
  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  box.addEventListener('close', () => { boxImg.removeAttribute('src'); });

  /* ---------- Avis : marquee ---------- */
  // Adapté du composant 21st.dev « Testimonials Marquee » (deux rangées en sens opposés).
  document.querySelectorAll('.marquee__row').forEach(row => {
    [...row.children].forEach(li => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.dataset.clone = '';
      row.appendChild(c);
    });
    const w = row.scrollWidth / 2;
    row.style.setProperty('--dur', `${Math.round(w / 38)}s`);
  });

  /* ---------- Formulaire ---------- */
  const form = document.getElementById('quoteForm');
  const done = document.getElementById('formDone');
  const submit = form.querySelector('button[type="submit"]');

  function setError(input, msg) {
    const err = document.getElementById(`${input.id}-err`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg || '';
  }
  function validate() {
    const nom = form.nom, tel = form.tel;
    let first = null;
    if (!nom.value.trim()) { setError(nom, 'Indiquez votre nom.'); first = first || nom; } else setError(nom);
    const digits = tel.value.replace(/\D/g, '');
    if (digits.length < 10) { setError(tel, 'Indiquez un numéro à 10 chiffres pour être rappelé.'); first = first || tel; } else setError(tel);
    if (first) first.focus();
    return !first;
  }
  form.nom.addEventListener('blur', () => { if (form.nom.getAttribute('aria-invalid') === 'true') validate(); });
  form.tel.addEventListener('blur', () => { if (form.tel.getAttribute('aria-invalid') === 'true') validate(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form._honey.value) return;
    if (!validate()) return;

    const data = {
      nom: form.nom.value.trim(),
      telephone: form.tel.value.trim(),
      ville: form.ville.value.trim(),
      type_travaux: form.type.value,
      message: form.msg.value.trim(),
      _subject: `Demande de devis : ${form.type.value} (${form.ville.value.trim() || 'commune non précisée'})`,
      _template: 'table',
      _captcha: 'false'
    };

    submit.setAttribute('aria-busy', 'true');
    submit.textContent = 'Envoi…';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      done.hidden = false;
      done.focus();
      form.reset();
    } catch (err) {
      const body = `Demande de devis — ${data.nom}, ${data.telephone}${data.ville ? ', ' + data.ville : ''} : ${data.type_travaux}. ${data.message}`;
      window.location.href = `sms:${PHONE}?&body=${encodeURIComponent(body)}`;
    } finally {
      submit.removeAttribute('aria-busy');
      submit.textContent = 'Recevoir mon devis gratuit';
    }
  });
})();
