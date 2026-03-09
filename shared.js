/* CARCE 3.0 — shared.js */
document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ── */
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  if (cur && curR) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    const hoverEls = 'a, button, .ic, .lab-card, .person-card, .nc, .pos-row, .glow-hover, [data-tip]';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
    (function loop() {
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* ── PROGRESS BAR ── */
  const bar = document.getElementById('progress');
  if (bar) window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });

  /* ── NAV SCROLL ── */
  const nav = document.querySelector('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });

  /* ── ACTIVE NAV ── */
  const path = window.location.pathname;
  document.querySelectorAll('.nlinks a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\.\.\//g, '').split('/')[0];
    if (href && href !== 'index.html' && path.includes(href)) a.classList.add('active');
  });

  /* ── SCROLL REVEAL ── */
  const revEls = document.querySelectorAll('.sr');
  new IntersectionObserver((entries, io) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = Array.from(revEls).indexOf(e.target);
      setTimeout(() => e.target.classList.add('in'), (i % 8) * 70);
      io.unobserve(e.target);
    });
  }, { threshold: .06 }).observe && revEls.forEach(el =>
    new IntersectionObserver((entries, io) => {
      if (entries[0].isIntersecting) { entries[0].target.classList.add('in'); io.unobserve(entries[0].target); }
    }, { threshold: .06 }).observe(el)
  );

  /* ── ANIMATED COUNTERS ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    new IntersectionObserver((entries, io) => {
      if (!entries[0].isIntersecting) return;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const start = performance.now();
      const dur = 2000;
      const run = now => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        const v = target * ease;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(run);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      };
      requestAnimationFrame(run);
    }, { threshold: .5 }).observe(el);
  });

  /* ── TYPEWRITER ── */
  const tw = document.querySelector('[data-typewriter]');
  if (tw) {
    const words = JSON.parse(tw.dataset.typewriter);
    let wi = 0, ci = 0, del = false;
    const tick = () => {
      const w = words[wi];
      if (!del) {
        tw.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del = true; setTimeout(tick, 1800); return; }
      } else {
        tw.textContent = w.slice(0, --ci);
        if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, del ? 45 : 85);
    };
    tick();
  }

  /* ── 3D TILT CARDS ── */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(8px)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s cubic-bezier(.175,.885,.32,1)';
      card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });

  /* ── RIPPLE EFFECT ── */
  document.querySelectorAll('.btn-p, .btn-s').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const rpl = document.createElement('span');
      rpl.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.3);
        width:4px;height:4px;top:${e.clientY - r.top}px;left:${e.clientX - r.left}px;
        transform:scale(0);animation:ripple .6s ease-out forwards;pointer-events:none;`;
      if (!btn.style.position) btn.style.position = 'relative';
      btn.appendChild(rpl);
      setTimeout(() => rpl.remove(), 700);
    });
  });
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple{to{transform:scale(80);opacity:0}}';
    document.head.appendChild(s);
  }

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('pcanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const colors = ['0,212,200', '255,184,48', '167,139,250', '52,211,153'];
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .6,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * .45 + .15,
    }));

    let mx = W / 2, my = H / 2;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my, dist = Math.hypot(dx, dy);
        if (dist < 140) { p.vx += dx / dist * .045; p.vy += dy / dist * .045; }
        // Speed cap + friction
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.2) { p.vx *= .97; p.vy *= .97; }
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
        // Connect nearby
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,212,200,${.1 * (1 - d / 140)})`;
            ctx.lineWidth = .6; ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ── PARALLAX ── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const spd = parseFloat(el.dataset.parallax) || .3;
        el.style.transform = `translateY(${y * spd}px)`;
      });
    }, { passive: true });
  }

  /* ── TABS ── */
  document.querySelectorAll('[data-tabs]').forEach(container => {
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-pane').forEach(p => { p.classList.remove('active'); p.style.opacity = 0; });
        btn.classList.add('active');
        const pane = container.querySelector(`[data-tab="${btn.dataset.target}"]`);
        if (pane) {
          pane.classList.add('active');
          requestAnimationFrame(() => { pane.style.transition = 'opacity .35s'; pane.style.opacity = 1; });
        }
      });
    });
  });

  /* ── FILTER BTNS ── */
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ── ACCORDION ── */
  document.querySelectorAll('.acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.parentElement;
      const open = item.classList.contains('open');
      item.closest('.acc-group')?.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ── GLOW ON MOUSE MOVE (cards) ── */
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });

});
