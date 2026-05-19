// ══════════════════════════════════════════
//  INTRO SPLASH
// ══════════════════════════════════════════
(function () {
    const splash = document.getElementById('intro-splash');
    const video  = document.getElementById('intro-video');
    const skip   = document.getElementById('intro-skip');

    function dismiss() {
        splash.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (!splash) return;

    document.body.style.overflow = 'hidden';

    // If video file doesn't exist or fails to load, skip immediately
    video.addEventListener('error', dismiss);
    video.addEventListener('ended', dismiss);
    skip.addEventListener('click', dismiss);

    // Fallback: never block the user more than 6 seconds
    setTimeout(dismiss, 6000);
})();

// ══════════════════════════════════════════
//  PARTICLES
// ══════════════════════════════════════════
const canvas = document.getElementById('ptc');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
});

const COLORS = ['124,58,237', '6,182,212', '79,70,229'];

const pts = Array.from({ length: 75 }, () => ({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * window.innerHeight,
    vx:  (Math.random() - .5) * .28,
    vy:  (Math.random() - .5) * .28,
    r:   Math.random() * 1.3 + .4,
    op:  Math.random() * .35 + .08,
    col: COLORS[Math.floor(Math.random() * 3)]
}));

function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.op})`;
        ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 110) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 110) * .13})`;
                ctx.lineWidth = .5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawParticles);
}

drawParticles();

// ══════════════════════════════════════════
//  CUSTOM CURSOR
// ══════════════════════════════════════════
const dot  = document.getElementById('c-dot');
const ring = document.getElementById('c-ring');
const glow = document.getElementById('c-glow');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * .11;
    ry += (my - ry) * .11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .gc').forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.transform    = 'translate(-50%,-50%) scale(1.85)';
        ring.style.borderColor  = 'rgba(6,182,212,.85)';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.transform    = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor  = 'rgba(124,58,237,.55)';
    });
});

// ══════════════════════════════════════════
//  TYPEWRITER
// ══════════════════════════════════════════
const phrases = [
    'Building AI-powered applications',
    'Designing scalable REST APIs',
    'Shipping full-stack products',
    'Crafting intelligent systems',
];

let pi = 0, ci = 0, del = false;
const tw = document.getElementById('tw');

function type() {
    const cur = phrases[pi];
    tw.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);

    if (!del && ci === cur.length) {
        del = true;
        setTimeout(type, 2200);
        return;
    }
    if (del && ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
    }
    setTimeout(type, del ? 38 : 68);
}

type();

// ══════════════════════════════════════════
//  GSAP SCROLL ANIMATIONS
// ══════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// Hero entrance timeline
const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTL
    .fromTo('.hero-badge', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7  }, '.2' )
    .fromTo('.hero-title', { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 1   }, '.38')
    .fromTo('.hero-type',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7  }, '.7' )
    .fromTo('.hero-desc',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7  }, '.88')
    .fromTo('.hero-ctas',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7  }, '1.04')
    .fromTo('.hero-scroll',{ opacity: 0         }, { opacity: 1,       duration: 1   }, '1.3');

// Section headings
document.querySelectorAll('.sec-label, .sec-title, .about-text, .ct-info').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: .75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
    });
});

// Skill cards — staggered
gsap.utils.toArray('.sk-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 28, scale: .96 }, {
        opacity: 1, y: 0, scale: 1, duration: .6, ease: 'back.out(1.2)',
        delay: i * .07,
        scrollTrigger: { trigger: el, start: 'top 88%' }
    });
});

// Stat cards — slide in from right
gsap.utils.toArray('.stat-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, x: 22 }, {
        opacity: 1, x: 0, duration: .65, ease: 'power3.out',
        delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%' }
    });
});

// Project cards — staggered fade up
gsap.utils.toArray('.proj-card').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: .7, ease: 'power3.out',
        delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%' }
    });
});

// Contact form — slide in from right
gsap.fromTo('.ct-form', { opacity: 0, x: 30 }, {
    opacity: 1, x: 0, duration: .8, ease: 'power3.out',
    scrollTrigger: { trigger: '.ct-form', start: 'top 86%' }
});

// ══════════════════════════════════════════
//  STAT COUNTERS
// ══════════════════════════════════════════
document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;

    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;

        let t0 = null;
        function frame(ts) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 1400, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + '+';
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.disconnect();
    }, { threshold: .6 });

    io.observe(el);
});

// ══════════════════════════════════════════
//  NAV SCROLL EFFECT
// ══════════════════════════════════════════
window.addEventListener('scroll', () => {
    document.getElementById('nav').style.background =
        window.scrollY > 60
            ? 'rgba(4,7,15,.9)'
            : 'rgba(4,7,15,.55)';
});

// ══════════════════════════════════════════
//  CONTACT FORM SUBMIT
// ══════════════════════════════════════════
document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = document.getElementById('form-btn');
    const form = e.target;

    btn.textContent  = 'Sending…';
    btn.disabled     = true;

    try {
        const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method:  'POST',
            headers: { 'Accept': 'application/json' },
            body:    new FormData(form)
        });

        if (res.ok) {
            btn.textContent      = 'Message sent ✓';
            btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
            form.reset();
            setTimeout(() => {
                btn.textContent      = 'Send message →';
                btn.style.background = '';
                btn.disabled         = false;
            }, 3000);
        } else {
            throw new Error();
        }
    } catch {
        btn.textContent      = 'Something went wrong — try again';
        btn.style.background = 'linear-gradient(135deg,#dc2626,#ef4444)';
        setTimeout(() => {
            btn.textContent      = 'Send message →';
            btn.style.background = '';
            btn.disabled         = false;
        }, 3000);
    }
});
