// CARCE shared.js — cursor, nav, scroll reveal

document.addEventListener('DOMContentLoaded', () => {
  // ── CURSOR ──
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  if (cur && curR) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });
    (function anim() {
      rx += (mx - rx) * .13;
      ry += (my - ry) * .13;
      curR.style.left = rx + 'px';
      curR.style.top  = ry + 'px';
      requestAnimationFrame(anim);
    })();
  }

  // ── NAV SHRINK ──
  const nav = document.querySelector('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('sc', scrollY > 60));

  // ── ACTIVE NAV LINK ──
  const path = window.location.pathname;
  document.querySelectorAll('.nlinks a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('../','').replace('./','').split('/')[0])) {
      a.classList.add('active');
    }
  });

  // ── SCROLL REVEAL ──
  const srs = document.querySelectorAll('.sr');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const i = Array.from(srs).indexOf(e.target);
        setTimeout(() => e.target.classList.add('in'), (i % 6) * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .06 });
  srs.forEach(el => io.observe(el));
});
