(() => {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  
    let width, height;
  
    // Slightly larger ambient blobs (but still smaller than original)
    const ambient = [
      { x: 0, y: 0, vx: 0.045, vy: 0.032, size: 55 },
      { x: 0, y: 0, vx: -0.035, vy: 0.048, size: 45 },
      { x: 0, y: 0, vx: 0.03,  vy: -0.038, size: 60 }
    ];
  
    const cursor = { x: 0, y: 0, tx: 0, ty: 0, initialized: false };
    const trail = [];
    const maxTrail = 14; // a bit longer trail
    let gradShift = 0;
  
    function setTarget(x, y) {
      cursor.tx = x;
      cursor.ty = y;
    }
  
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
  
      ambient[0].x = width * 0.28;
      ambient[0].y = height * 0.30;
      ambient[1].x = width * 0.72;
      ambient[1].y = height * 0.65;
      ambient[2].x = width * 0.50;
      ambient[2].y = height * 0.40;
  
      setTarget(width / 2, height / 2);
      if (!cursor.initialized) {
        cursor.x = cursor.tx;
        cursor.y = cursor.ty;
        cursor.initialized = true;
      }
      trail.length = 0;
    }
  
    window.addEventListener('resize', resize, { passive: true });
    resize();
  
    function updateCursor() {
      const ease = 0.12;
      const dx = cursor.tx - cursor.x;
      const dy = cursor.ty - cursor.y;
      cursor.x += dx * ease;
      cursor.y += dy * ease;
  
      const speed = Math.min(Math.hypot(dx, dy) / 60, 1);
      trail.unshift({ x: cursor.x, y: cursor.y, speed });
      if (trail.length > maxTrail) trail.pop();
    }
  
    // Pointer events
    window.addEventListener('mousemove', e => setTarget(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mouseleave', () => setTarget(width / 2, height / 2), { passive: true });
  
    window.addEventListener('touchstart', e => {
      const t = e.touches[0];
      if (t) setTarget(t.clientX, t.clientY);
    }, { passive: true });
  
    window.addEventListener('touchmove', e => {
      const t = e.touches[0];
      if (t) setTarget(t.clientX, t.clientY);
    }, { passive: true });
  
    window.addEventListener('touchend', () => setTarget(width / 2, height / 2), { passive: true });
    window.addEventListener('touchcancel', () => setTarget(width / 2, height / 2), { passive: true });
  
    // Draw ambient
    function drawAmbient() {
      ctx.globalCompositeOperation = 'screen';
      ambient.forEach(a => {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -a.size || a.x > width + a.size) a.vx *= -1;
        if (a.y < -a.size || a.y > height + a.size) a.vy *= -1;
  
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.size);
        g.addColorStop(0, 'rgba(59,130,246,0.08)');
        g.addColorStop(0.55, 'rgba(129,140,248,0.06)');
        g.addColorStop(1, 'rgba(2,6,23,0)');
        ctx.fillStyle = g;
  
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  
    // Trail sparkles
    function drawTrail() {
      ctx.globalCompositeOperation = 'screen';
      const len = trail.length;
      for (let i = 0; i < len; i++) {
        const p = trail[i];
        const progress = i / (len - 1 || 1);
        const intensity = 1 - progress;
  
        const radius = 28 - progress * 14 + p.speed * 6; // medium size
  
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        g.addColorStop(0,  `rgba(94,234,212,${0.18 * intensity})`);
        g.addColorStop(0.55,`rgba(129,140,248,${0.12 * intensity})`);
        g.addColorStop(1,   'rgba(4,13,36,0)');
        ctx.fillStyle = g;
  
        ctx.globalAlpha = intensity * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  
    // Cursor glow
    function drawCursorCore() {
      ctx.globalCompositeOperation = 'screen';
  
      const core = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 20);
      core.addColorStop(0, 'rgba(255,255,255,0.35)');
      core.addColorStop(1, 'rgba(15,23,42,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 16, 0, Math.PI * 2);
      ctx.fill();
  
      const sheen = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, 36);
      sheen.addColorStop(0, 'rgba(124,58,237,0.18)');
      sheen.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = sheen;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 28, 0, Math.PI * 2);
      ctx.fill();
    }
  
    function animate() {
      requestAnimationFrame(animate);
  
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(1,7,23,0.28)'; // clear strength
      ctx.fillRect(0, 0, width, height);
  
      gradShift += 0.0015;
      const gx = width / 2 + Math.cos(gradShift) * width * 0.3;
      const gy = height / 2 + Math.sin(gradShift) * height * 0.3;
      const bg = ctx.createRadialGradient(gx, gy, 0, width / 2, height / 2, Math.max(width, height));
      bg.addColorStop(0, '#050b1e');
      bg.addColorStop(1, '#01030c');
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
  
      updateCursor();
      drawAmbient();
      drawTrail();
      drawCursorCore();
    }
  
    animate();
  })();