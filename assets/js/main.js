// ============================================================
// Synergy UpLink — main.js
// ============================================================

// ——— Theme: the initial data-theme attribute is set by an inline,
// non-deferred script in _layouts/default.html <head> so it runs before
// first paint. This file is loaded with `defer`, so anything here only
// runs after the DOM is parsed — too late to prevent a flash of the
// wrong theme. Keep theme *initialization* out of this file.

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

  // ——— Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Determine what the browser default actually is right now
      const browserDefault = prefersDark ? 'dark' : 'light';

      let next;
      if (!current) {
        // No override yet — flip away from browser default
        next = browserDefault === 'dark' ? 'light' : 'dark';
      } else {
        next = current === 'dark' ? 'light' : 'dark';
      }

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('su-theme', next);

      // If they've toggled back to what the browser already sends,
      // remove the override so it tracks system changes again
      if (next === browserDefault) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('su-theme');
      }
    });
  }

  // ——— Mobile menu toggle
  const toggle = document.querySelector('.site-nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
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

});
