const nav = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const searchForm = document.querySelector('.hero-search');
const heroSection = document.getElementById('hero');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

navLinksAnchors.forEach((link) => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = searchForm.querySelector('input');
    const query = input.value.trim();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  });
}

function updateNav() {
  const heroBottom = heroSection ? heroSection.offsetHeight - nav.offsetHeight - 50 : 0;
  if (window.scrollY > heroBottom) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - nav.offsetHeight - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinksAnchors.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    const hash = href.includes('#') ? '#' + href.split('#')[1] : href;
    if (hash && hash === `#${current}`) {
      link.classList.add('active');
    }
    if (!hash.includes('#') && href === 'index.html' && current === 'hero') {
      link.classList.add('active');
    }
    if (href.includes('admissions.html') && window.location.pathname.includes('admissions')) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ===== Admissions Multi-Step Form ===== */
const appForm = document.getElementById('app-form');
if (appForm) {
  const form = appForm;
  const formSteps = form.querySelectorAll('.form-step');
  const stepItems = document.querySelectorAll('.step-item');
  const stepLines = document.querySelectorAll('.step-line');
  const checklistItems = document.querySelectorAll('.checklist-item');
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');
  const submitBtn = document.getElementById('submit-btn');
  const modal = document.getElementById('success-modal');
  let currentStep = 0;
  const totalSteps = formSteps.length;

  function showStep(index) {
    formSteps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });

    stepItems.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.classList.toggle('completed', i < index);
    });

    stepLines.forEach((line, i) => {
      line.classList.toggle('completed', i < index);
    });

    checklistItems.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.classList.toggle('completed', i < index);
    });

    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.style.display = index === totalSteps - 1 ? 'none' : 'inline-flex';
    submitBtn.style.display = index === totalSteps - 1 ? 'inline-flex' : 'none';

    if (index === totalSteps - 1) populateReview();

    window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
  }

  function getFieldValue(name) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return '';
    if (field.type === 'checkbox') return '';
    return field.value.trim();
  }

  function getSelectText(name) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return '';
    return field.options[field.selectedIndex]?.text || '';
  }

  function populateReview() {
    const personal = [
      { label: 'First Name', value: getFieldValue('firstName') },
      { label: 'Last Name', value: getFieldValue('lastName') },
      { label: 'Email', value: getFieldValue('email') },
      { label: 'Phone', value: getFieldValue('phone') },
      { label: 'Date of Birth', value: getFieldValue('dob') },
      { label: 'Citizenship', value: getSelectText('citizenship') },
      { label: 'Address', value: getFieldValue('address') },
      { label: 'City', value: getFieldValue('city') },
      { label: 'State', value: getFieldValue('state') },
      { label: 'ZIP Code', value: getFieldValue('zip') },
    ];
    renderReview('review-personal', personal);

    const ecInputs = form.querySelectorAll('[name="ec\\[\\]"]');
    const ecList = Array.from(ecInputs).map(i => i.value.trim()).filter(Boolean).join(', ') || 'None listed';
    const academic = [
      { label: 'School', value: getFieldValue('highschool') },
      { label: 'Graduation Year', value: getSelectText('gradYear') },
      { label: 'GPA', value: getFieldValue('gpa') },
      { label: 'Activities', value: ecList },
    ];
    renderReview('review-academic', academic);

    const program = [
      { label: 'Application Type', value: getSelectText('appType') },
      { label: 'Program', value: getSelectText('program') },
      { label: 'Start Term', value: getSelectText('semester') },
    ];
    renderReview('review-program', program);
  }

  function renderReview(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
      <div class="review-item">
        <span class="review-item-label">${item.label}</span>
        <span class="review-item-value">${item.value || 'Not provided'}</span>
      </div>
    `).join('');
  }

  function validateStep(index) {
    const step = formSteps[index];
    const fields = step.querySelectorAll('[required]');
    let valid = true;

    fields.forEach((field) => {
      const error = step.querySelector(`#${field.id}-error`) || field.closest('.form-group')?.querySelector('.form-error');
      if (!error) return;

      if (field.type === 'checkbox') {
        if (!field.checked) {
          error.textContent = 'You must agree to continue.';
          field.closest('.form-agreement')?.classList.add('error');
          valid = false;
        } else {
          error.textContent = '';
          field.closest('.form-agreement')?.classList.remove('error');
        }
        return;
      }

      field.classList.remove('error');
      const value = field.value.trim();

      if (!value) {
        error.textContent = 'This field is required.';
        field.classList.add('error');
        valid = false;
        return;
      }

      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error.textContent = 'Please enter a valid email address.';
        field.classList.add('error');
        valid = false;
        return;
      }

      if (field.id === 'gpa' && (parseFloat(value) < 0 || parseFloat(value) > 4)) {
        error.textContent = 'GPA must be between 0 and 4.';
        field.classList.add('error');
        valid = false;
        return;
      }

      error.textContent = '';
    });

    return valid;
  }

  stepItems.forEach((item) => {
    item.addEventListener('click', () => {
      const stepIndex = parseInt(item.dataset.step) - 1;
      if (stepIndex <= currentStep) {
        currentStep = stepIndex;
        showStep(currentStep);
      }
    });
  });

  function saveFormData() {
    const fields = form.querySelectorAll('input, select, textarea');
    const data = {};
    fields.forEach((f) => {
      if (f.name) data[f.name] = f.type === 'checkbox' ? f.checked : f.value;
    });
    const ecs = [];
    form.querySelectorAll('[name="ec\\[\\]"]').forEach((i) => ecs.push(i.value));
    data.ecs = ecs;
    sessionStorage.setItem('meridianForm', JSON.stringify(data));
  }

  function loadFormData() {
    const raw = sessionStorage.getItem('meridianForm');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      form.querySelectorAll('input, select, textarea').forEach((f) => {
        if (!f.name) return;
        if (f.type === 'checkbox') f.checked = !!data[f.name];
        else if (f.name !== 'ec[]') f.value = data[f.name] || '';
      });
      const ecs = data.ecs || [];
      const ecContainer = document.getElementById('ec-list');
      if (ecContainer && ecs.length > 0) {
        ecContainer.innerHTML = '';
        ecs.forEach((val) => {
          const item = document.createElement('div');
          item.className = 'ec-item';
          item.innerHTML = `
            <input type="text" name="ec[]" placeholder="Activity name" value="${val.replace(/"/g, '&quot;')}">
            <button type="button" class="ec-remove" aria-label="Remove activity">&times;</button>
          `;
          ecContainer.appendChild(item);
          item.querySelector('.ec-remove').addEventListener('click', () => item.remove());
        });
      }
      if (essayField && wordCount) {
        const wc = essayField.value.trim() ? essayField.value.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${wc} words`;
      }
    } catch (_) {}
  }

  form.addEventListener('input', saveFormData);

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    currentStep++;
    showStep(currentStep);
    stepItems[currentStep]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  prevBtn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    const agree = document.getElementById('agree');
    if (!agree?.checked) {
      document.getElementById('agree-error').textContent = 'You must agree to the terms.';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    setTimeout(() => {
      modal.classList.add('open');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
      document.body.style.overflow = 'hidden';
    }, 1200);
  });

  function resetForm() {
    form.reset();
    const ecContainer = document.getElementById('ec-list');
    if (ecContainer) {
      ecContainer.innerHTML = `<div class="ec-item">
        <input type="text" name="ec[]" placeholder="Activity name">
        <button type="button" class="ec-remove" aria-label="Remove activity">&times;</button>
      </div>`;
      ecContainer.querySelector('.ec-remove').addEventListener('click', () => {
        if (ecContainer.children.length > 1) ecContainer.querySelector('.ec-item').remove();
      });
    }
    form.querySelectorAll('.form-error').forEach((e) => e.textContent = '');
    form.querySelectorAll('.error').forEach((e) => e.classList.remove('error'));
    if (essayField && wordCount) wordCount.textContent = '0 words';
    const agree = document.getElementById('agree');
    if (agree) agree.checked = false;
    sessionStorage.removeItem('meridianForm');
    currentStep = 0;
    showStep(0);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      resetForm();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      resetForm();
    }
  });

  const essayField = document.getElementById('essay');
  const wordCount = document.getElementById('word-count');
  if (essayField && wordCount) {
    essayField.addEventListener('input', () => {
      const words = essayField.value.trim() ? essayField.value.trim().split(/\s+/).length : 0;
      wordCount.textContent = `${words} words`;
    });
  }

  const addEcBtn = document.getElementById('add-ec');
  const ecListContainer = document.getElementById('ec-list');
  if (addEcBtn && ecListContainer) {
    addEcBtn.addEventListener('click', () => {
      const item = document.createElement('div');
      item.className = 'ec-item';
      item.innerHTML = `
        <input type="text" name="ec[]" placeholder="Activity name">
        <button type="button" class="ec-remove" aria-label="Remove activity">&times;</button>
      `;
      ecListContainer.appendChild(item);
      item.querySelector('.ec-remove').addEventListener('click', () => item.remove());
    });

    ecListContainer.querySelectorAll('.ec-remove').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.ec-item')?.remove());
    });
  }

  loadFormData();
  showStep(0);
}

/* ===== Virtual Tour ===== */
const tourGrid = document.getElementById('tour-grid');
if (tourGrid) {
  const tourData = [
    {
      title: 'Memorial Library',
      tag: 'Landmark',
      tagClass: '',
      desc: 'The crown jewel of Meridian\'s campus, the Beaux-Arts Memorial Library houses over 2 million volumes across seven floors. The grand reading room features a 60-foot vaulted ceiling, original oak carrels, and floor-to-ceiling windows overlooking the campus green. Special collections include rare 16th-century manuscripts, a first-edition Shakespeare folio, and the university\'s institutional archives. Open 24 hours during exam periods.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
      location: 'North Campus, Building 12',
      hours: '7:00 AM — 11:00 PM daily',
    },
    {
      title: 'Innovation Lab',
      tag: 'Facilities',
      tagClass: 'tour-stop-tag-gold',
      desc: 'A 20,000-square-foot maker space where ideas become prototypes. The Innovation Lab is equipped with industrial 3D printers, CNC routers, laser cutters, electronics workstations, a textiles studio, and a full woodworking shop. Staffed by experienced technicians and open to all students regardless of major. Regular workshops cover everything from soldering to CAD modeling.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
      location: 'Innovation District, Building 8',
      hours: '8:00 AM — 10:00 PM daily',
    },
    {
      title: 'Student Union',
      tag: 'Student Life',
      tagClass: 'tour-stop-tag-gold',
      desc: 'The social and organizational heart of campus. The three-story Student Union houses a farm-to-table dining hall, a coffee bar with local roastery beans, a game lounge with pool tables and arcade cabinets, a 300-seat auditorium, and meeting spaces for over 80 student organizations. The rooftop terrace offers panoramic views of the campus and the surrounding valley, and hosts weekly movie nights during the academic year.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      location: 'Central Campus, Building 3',
      hours: '6:00 AM — 12:00 AM daily',
    },
    {
      title: 'Science Center',
      tag: 'Academics',
      tagClass: '',
      desc: 'A LEED-certified facility with 40 teaching and research laboratories spanning biology, chemistry, physics, and environmental science. The centerpiece is the third-floor rooftop observatory, featuring a 16-inch Celestron telescope with a digital imaging system. Undergraduates have access to scanning electron microscopes, a nuclear magnetic resonance spectrometer, and a fully equipped vivarium for behavioral research.',
      image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80',
      location: 'East Campus, Building 22',
      hours: '7:00 AM — 9:00 PM weekdays',
    },
    {
      title: 'Performing Arts Center',
      tag: 'Arts',
      tagClass: '',
      desc: 'Home to Meridian\'s music, theater, and dance programs, the Performing Arts Center features a 1,200-seat concert hall with acoustics designed by acclaimed firm Arup. The complex also includes a flexible black box theater seating 250, a recital hall, four dance studios, a scene shop, costume studio, and the Lindgren Gallery, which hosts rotating exhibitions of student and visiting artist work.',
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=80',
      location: 'West Campus, Building 18',
      hours: '6:00 AM — 10:00 PM daily',
    },
    {
      title: 'Residence Quad',
      tag: 'Residential',
      tagClass: '',
      desc: 'Four historic residence halls — North, South, East, and West — arranged around a beautifully landscaped central green. Built between 1920 and 1930 in the Collegiate Gothic style, the halls have been fully renovated with modern amenities while preserving their original architectural character. The quad includes community gardens, hammock groves, outdoor grills, and a fire pit for evening gatherings.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80',
      location: 'South Campus, Buildings 30–33',
      hours: '24/7 (residents only after 10 PM)',
    },
  ];

  const modal = document.getElementById('tour-modal');
  const modalImg = document.getElementById('modal-image');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLocation = document.getElementById('modal-location');
  const modalHours = document.getElementById('modal-hours');
  const modalCounter = document.getElementById('modal-counter');
  const closeBtn = modal.querySelector('.tour-modal-close');
  const prevBtn2 = modal.querySelector('.tour-modal-prev');
  const nextBtn2 = modal.querySelector('.tour-modal-next');
  let currentStop = 0;

  function openStop(index) {
    currentStop = index;
    const stop = tourData[index];
    modalImg.src = stop.image;
    modalImg.alt = stop.title;
    modalTag.textContent = stop.tag;
    modalTag.className = `tour-stop-tag ${stop.tagClass}`;
    modalTitle.textContent = stop.title;
    modalDesc.textContent = stop.desc;
    modalLocation.textContent = stop.location;
    modalHours.textContent = stop.hours;
    modalCounter.textContent = `${index + 1} / ${tourData.length}`;
    prevBtn2.style.display = index === 0 ? 'none' : 'flex';
    nextBtn2.style.display = index === tourData.length - 1 ? 'none' : 'flex';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.tour-stop').forEach((el) => {
    el.addEventListener('click', () => openStop(parseInt(el.dataset.index)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openStop(parseInt(el.dataset.index));
      }
    });
  });

  document.querySelectorAll('.map-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      openStop(idx);
      document.querySelector(`.tour-stop[data-index="${idx}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  prevBtn2.addEventListener('click', () => {
    if (currentStop > 0) openStop(currentStop - 1);
  });

  nextBtn2.addEventListener('click', () => {
    if (currentStop < tourData.length - 1) openStop(currentStop + 1);
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft' && currentStop > 0) openStop(currentStop - 1);
    if (e.key === 'ArrowRight' && currentStop < tourData.length - 1) openStop(currentStop + 1);
  });
}
