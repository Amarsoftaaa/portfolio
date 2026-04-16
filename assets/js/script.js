// ── Navbar Scroll Adaptation ──
(function () {
  const nav    = document.getElementById('mainNav');
  const hero   = document.getElementById('home');
  if (!nav || !hero) return;

  function update() {
    const heroBottom = hero.offsetTop + window.innerHeight;
    if (window.scrollY > heroBottom - 80) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Hero Scroll-Driven Image Switch ──
(function () {
  const section    = document.getElementById('home');
  const slides     = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  if (!section || !slides.length) return;

  let current = 0;

  function goTo(index) {
    if (index === current) return;
    slides[current].classList.remove('hero-slide-active');
    indicators[current]?.classList.remove('hero-indicator-active');
    current = index;
    slides[current].classList.add('hero-slide-active');
    indicators[current]?.classList.add('hero-indicator-active');
  }

  // Manual indicator clicks
  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => goTo(i));
  });

  // Scroll listener — progress through section drives the image index
  window.addEventListener('scroll', () => {
    const scrollTop      = window.scrollY;
    const sectionTop     = section.offsetTop;
    const sectionHeight  = section.offsetHeight;   // 300vh
    const scrollable     = sectionHeight - window.innerHeight;

    const raw      = (scrollTop - sectionTop) / scrollable;
    const progress = Math.max(0, Math.min(1, raw));

    // Divide progress into equal thirds per slide
    const index = Math.min(
      Math.floor(progress * slides.length),
      slides.length - 1
    );

    goTo(index);
  }, { passive: true });
})();

// Spotlight glow — track pointer across all glow cards
document.addEventListener('pointermove', (e) => {
  const { clientX: x, clientY: y } = e;
  document.querySelectorAll('.glow-card').forEach(card => {
    card.style.setProperty('--x', x.toFixed(2));
    card.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
    card.style.setProperty('--y', y.toFixed(2));
    card.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
  });
});

// ── Testimonials ──
const testimonials = [
  {
    quote: "Pažnja prema detaljima i kreativna vizija potpuno su transformisali naš vizualni identitet. Rezultat je premašio sva očekivanja.",
    author: "Lejla Hadžimuratović",
    role: "Direktorica Marketinga",
    company: "Studio Forma",
    image: "https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=200&auto=format&fit=crop&q=60"
  },
  {
    quote: "Saradnja je bila pravo kreativno partnerstvo od prvog dana. Profesionalnost i brzina isporuke su na najvišem nivou.",
    author: "Damir Kovačević",
    role: "Voditelj Dizajna",
    company: "Minimal Co",
    image: "https://images.unsplash.com/photo-1649123245135-4db6ead931b5?w=200&auto=format&fit=crop&q=60"
  },
  {
    quote: "Razumije da je odličan dizajn nevidljiv, ali nezaboravan. Naša web stranica nikad nije izgledala bolje.",
    author: "Amina Bešlić",
    role: "Art Direktorica",
    company: "Pixel & Co",
    image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=200&auto=format&fit=crop&q=60"
  }
];

let activeTestimonial = 0;
let isTestimonialTransitioning = false;

function renderTestimonialDots() {
  const container = document.getElementById("testimonialDots");
  if (!container) return;
  container.innerHTML = "";
  testimonials.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "group relative py-4";
    const line = document.createElement("span");
    line.className = "block h-px transition-all duration-500 ease-out " + (
      i === activeTestimonial
        ? "w-12 bg-gray-900"
        : "w-6 bg-gray-300 group-hover:w-8 group-hover:bg-gray-500"
    );
    btn.appendChild(line);
    btn.addEventListener("click", () => changeTestimonial(i));
    container.appendChild(btn);
  });
}

function updateTestimonialContent() {
  const t = testimonials[activeTestimonial];
  document.getElementById("testimonialQuote").textContent = t.quote;
  document.getElementById("testimonialName").textContent = t.author;
  document.getElementById("testimonialRole").textContent = t.role;
  document.getElementById("testimonialCompany").textContent = t.company;
  const avatar = document.getElementById("testimonialAvatar");
  avatar.src = t.image;
  avatar.alt = t.author;
  document.getElementById("testimonialIndex").textContent =
    String(activeTestimonial + 1).padStart(2, "0");
  document.getElementById("testimonialCounter").textContent =
    String(activeTestimonial + 1).padStart(2, "0") + " / " +
    String(testimonials.length).padStart(2, "0");
  renderTestimonialDots();
}

function changeTestimonial(index) {
  if (index === activeTestimonial || isTestimonialTransitioning) return;
  isTestimonialTransitioning = true;

  const quote = document.getElementById("testimonialQuote");
  const author = document.getElementById("testimonialAuthor");

  quote.style.opacity = "0";
  quote.style.transform = "translateX(16px)";
  author.style.opacity = "0";

  setTimeout(() => {
    activeTestimonial = index;
    updateTestimonialContent();
    setTimeout(() => {
      quote.style.opacity = "1";
      quote.style.transform = "translateX(0)";
      author.style.opacity = "1";
      isTestimonialTransitioning = false;
    }, 50);
  }, 300);
}

const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
if (testimonialPrev && testimonialNext) {
  testimonialPrev.addEventListener("click", () => {
    changeTestimonial(activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1);
  });
  testimonialNext.addEventListener("click", () => {
    changeTestimonial(activeTestimonial === testimonials.length - 1 ? 0 : activeTestimonial + 1);
  });
  updateTestimonialContent();
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("projectsContainer");
  const rightBtn = document.getElementById("rightBtn");
  const leftBtn = document.getElementById("leftBtn");

  if (container && rightBtn && leftBtn) {
    rightBtn.addEventListener("click", () => {
      container.scrollBy({
        left: 540,
        behavior: "smooth"
      });
    });

    leftBtn.addEventListener("click", () => {
      container.scrollBy({
        left: -540,
        behavior: "smooth"
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const visiblePoint = 100;

      if (elementTop < windowHeight - visiblePoint) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  const typingWords = [
    "Python & Django Developer",
    "Backend Developer",
    "Web Application Builder",
    "Junior Full Stack Developer"
  ];

  const typingText = document.getElementById("typing-text");

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 90;
  const deletingDelay = 45;
  const pauseDelay = 1400;

  function runTypingEffect() {
    if (!typingText) return;

    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentDelay = isDeleting ? deletingDelay : typingDelay;

    if (!isDeleting && charIndex === currentWord.length) {
      currentDelay = pauseDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      currentDelay = 400;
    }

    setTimeout(runTypingEffect, currentDelay);
  }

  runTypingEffect();
});

/* ── Clean URL navigation (no # in address bar) ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var id = this.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', window.location.pathname);
  });
});