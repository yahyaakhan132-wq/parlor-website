/* ============================================
   FLOURISH SALON — INTERACTIVE SCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ---------- HEADER SCROLL EFFECT ---------- */
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      hamburger.setAttribute('aria-label', !expanded ? 'Close menu' : 'Open menu');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ---------- SCROLL ANIMATIONS ---------- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const q = other.querySelector('.faq-item__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- GALLERY FILTER ---------- */
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      galleryItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');
  let currentImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return Array.from(document.querySelectorAll('.gallery-grid .gallery-item')).filter(
      function (el) {
        return el.style.display !== 'none';
      }
    );
  }

  function openLightbox(clickedItem) {
    currentImages = getVisibleImages();
    currentIndex = currentImages.indexOf(clickedItem);
    if (currentIndex === -1) currentIndex = 0;
    showLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function showLightboxImage() {
    if (!currentImages.length) return;
    const item = currentImages[currentIndex];
    const img = item.querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = img ? img.alt : '';
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showLightboxImage();
  }

  if (lightbox) {
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item);
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', nextImage);
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', prevImage);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  /* ---------- APPOINTMENT / CONTACT FORM VALIDATION ---------- */
  const appointmentForm = document.querySelector('#appointment-form');
  const contactForm = document.querySelector('#contact-form');

  function showError(group, message) {
    group.classList.add('has-error');
    const errorEl = group.querySelector('.form-group__error');
    if (errorEl && message) {
      errorEl.textContent = message;
    }
  }

  function clearError(group) {
    group.classList.remove('has-error');
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-group').forEach(clearError);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    const cleaned = value.replace(/[\s\-()]/g, '');
    return /^[+]?[\d]{7,15}$/.test(cleaned);
  }

  function validateField(form, field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let valid = true;
    let message = '';

    if (isRequired && !value) {
      valid = false;
      message = 'This field is required.';
    } else if (value) {
      if (field.type === 'email' && !validateEmail(value)) {
        valid = false;
        message = 'Please enter a valid email address.';
      }
      if (field.name === 'phone' && !validatePhone(value)) {
        valid = false;
        message = 'Please enter a valid phone number.';
      }
      if (field.maxLength > 0 && value.length > field.maxLength) {
        valid = false;
        message = 'Input is too long.';
      }
    }

    if (valid) {
      clearError(group);
    } else {
      showError(group, message);
    }

    return valid;
  }

  function setupForm(form, successMsgId, errorMsgId) {
    if (!form) return;

    form.setAttribute('novalidate', '');

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(form, field);
      });
      field.addEventListener('input', function () {
        const group = field.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          validateField(form, field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(form);

      let allValid = true;
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (!validateField(form, field)) {
          allValid = false;
        }
      });

      const successEl = document.querySelector('#' + successMsgId);
      const errorEl = document.querySelector('#' + errorMsgId);

      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      if (allValid) {
        if (successEl) {
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        setTimeout(function () {
          if (successEl) successEl.style.display = 'none';
        }, 8000);
      } else {
        if (errorEl) {
          errorEl.style.display = 'block';
        }
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const errField = firstError.querySelector('input, textarea, select');
          if (errField) errField.focus();
        }
      }
    });
  }

  setupForm(appointmentForm, 'form-success', 'form-error');
  setupForm(contactForm, 'contact-success', 'contact-error');

  /* ---------- PRESELECT SERVICE FROM QUERY PARAM ---------- */
  const serviceSelect = document.querySelector('#service-select');
  if (serviceSelect) {
    const params = new URLSearchParams(window.location.search);
    const preselect = params.get('service');
    if (preselect) {
      Array.from(serviceSelect.options).forEach(function (opt) {
        if (opt.value === preselect || opt.textContent === preselect) {
          opt.selected = true;
        }
      });
    }
  }

  /* ---------- SET CURRENT YEAR IN FOOTER ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
