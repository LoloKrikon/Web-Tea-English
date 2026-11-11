/* =========================================================
   TEA · The English Academy — Interactividad y Transiciones
   ========================================================= */

/**
 * Configuración rápida antes de entregar la web al cliente:
 * 1. FACEBOOK_URL: pega aquí el enlace de Facebook de la academia.
 * 2. WHATSAPP_NUMBER: teléfono con prefijo (ej. '34600123456') para abrir WhatsApp directo.
 * 3. WEB3FORMS_ACCESS_KEY: crea una clave gratis en https://web3forms.com
 *    con el correo de TEA para que los formularios lleguen directo a su bandeja.
 *    Mientras esté vacío (''), el formulario funciona en MODO DEMO.
 */
const ACADEMY_CONFIG = {
  FACEBOOK_URL: 'https://www.facebook.com/p/TEA-The-English-Academy-100054321229235/?locale=es_ES',
  WHATSAPP_NUMBER: '34690350543',
  WEB3FORMS_ACCESS_KEY: '',
};

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('demoToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFooterYear();
  initFacebookLinks();
  initWhatsappButton();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initAnimatedCounters();
  initCourseFilter();
  initCourseShortcuts();
  initFaqAccordion();
  initContactForm();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (!toggleBtn) return;

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    toggleBtn.setAttribute('aria-pressed', String(isDark));
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
    toggleBtn.title = isDark ? 'Modo claro' : 'Modo oscuro';

    if (persist) {
      try {
        localStorage.setItem('tea-theme', isDark ? 'dark' : 'light');
      } catch {
        // Ignorar si el navegador bloquea almacenamiento local
      }
    }
  };

  const initialTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(initialTheme, false);

  toggleBtn.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      try {
        if (localStorage.getItem('tea-theme')) return;
      } catch {
        // Continuar con preferencia del sistema
      }
      applyTheme(event.matches ? 'dark' : 'light', false);
    });
  }
}

function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initFacebookLinks() {
  document.querySelectorAll('[data-facebook-link]').forEach((link) => {
    if (ACADEMY_CONFIG.FACEBOOK_URL) {
      link.href = ACADEMY_CONFIG.FACEBOOK_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      return;
    }

    link.addEventListener('click', () => {
      showToast('Demo: añade la URL de Facebook de TEA en assets/js/script.js');
    });
  });
}

function initWhatsappButton() {
  const btn = document.getElementById('whatsappBtn');
  if (!btn) return;

  if (ACADEMY_CONFIG.WHATSAPP_NUMBER) {
    const cleanPhone = ACADEMY_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    const text = encodeURIComponent('Hola, me gustaría pedir información sobre las clases en TEA.');
    btn.href = `https://wa.me/${cleanPhone}?text=${text}`;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    return;
  }

  btn.addEventListener('click', () => {
    showToast('Rellena el formulario o añade el WhatsApp de TEA en assets/js/script.js');
  });
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Resaltar enlace activo según la sección visible
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateValue = (el) => {
    const target = Number(el.dataset.count) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const duration = 1100;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateValue(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initCourseFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.course-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

function initCourseShortcuts() {
  const interestSelect = document.getElementById('interest');
  if (!interestSelect) return;

  document.querySelectorAll('[data-course]').forEach((link) => {
    link.addEventListener('click', () => {
      const course = link.dataset.course;
      if (course) interestSelect.value = course;
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !feedback || !submitBtn) return;

  const showFeedback = (type, message) => {
    feedback.className = `form-feedback ${type === 'success' ? 'is-success' : 'is-error'}`;
    feedback.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const interest = form.interest.value;
    const message = form.message.value.trim();
    const privacy = document.getElementById('privacy').checked;

    if (!name || !phone || !email || !message) {
      showFeedback('error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('error', 'Introduce un correo electrónico válido.');
      return;
    }

    if (!privacy) {
      showFeedback('error', 'Debes aceptar la casilla de contacto para enviar tu consulta.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';

    try {
      if (ACADEMY_CONFIG.WEB3FORMS_ACCESS_KEY) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: ACADEMY_CONFIG.WEB3FORMS_ACCESS_KEY,
            subject: `Nueva consulta web TEA (${interest}) - ${name}`,
            from_name: 'Web TEA The English Academy',
            name,
            phone,
            email,
            interest,
            message,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'No se pudo enviar el mensaje.');
        }

        showFeedback(
          'success',
          `¡Gracias, ${name}! Hemos recibido tu consulta sobre "${interest}". Te responderemos pronto.`
        );
      } else {
        // Simulación limpia para enseñar la demo al cliente sin clave configurada aún
        await new Promise((resolve) => setTimeout(resolve, 550));
        showFeedback(
          'success',
          `[Modo Demo] Consulta lista para enviarse al correo de TEA: ${name} (${phone} · ${email}) sobre "${interest}".`
        );
      }

      form.reset();
    } catch (error) {
      showFeedback(
        'error',
        'Hubo un problema al enviar el mensaje. Inténtalo de nuevo en unos segundos.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

