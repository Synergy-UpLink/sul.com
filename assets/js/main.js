// ============================================================
// Synergy UpLink — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ——— Sticky nav scroll behaviour
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ——— Mobile menu toggle
  const toggle = document.querySelector('.site-nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ——— Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger reveals in the same section
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((el, idx) => {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          });
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ——— Active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.startsWith(href) && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ——— Contact form handler (placeholder — wire to Formspree or similar)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const statusEl = document.getElementById('form-status');

      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = new FormData(contactForm);
      const action = contactForm.getAttribute('action');

      // If no action set, show a placeholder success
      if (!action || action === '#') {
        setTimeout(() => {
          if (statusEl) {
            statusEl.textContent = 'Thanks! We\'ll be in touch soon.';
            statusEl.style.color = 'var(--color-primary)';
          }
          btn.textContent = 'Message Sent ✓';
          contactForm.reset();
        }, 800);
        return;
      }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (statusEl) {
            statusEl.textContent = 'Message received! We\'ll be in touch shortly.';
            statusEl.style.color = 'var(--color-primary)';
          }
          btn.textContent = 'Message Sent ✓';
          contactForm.reset();
        } else {
          throw new Error('Submit failed');
        }
      } catch {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong. Please email us directly.';
          statusEl.style.color = '#e87070';
        }
        btn.disabled = false;
        btn.textContent = 'Try Again';
      }
    });
  }

});
