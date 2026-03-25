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
    quote: "The attention to detail and creative vision transformed our brand identity completely.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "Studio Forma",
    image: "https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=200&auto=format&fit=crop&q=60"
  },
  {
    quote: "Working with them felt like a true creative partnership from day one.",
    author: "Marcus Webb",
    role: "Head of Design",
    company: "Minimal Co",
    image: "https://images.unsplash.com/photo-1649123245135-4db6ead931b5?w=200&auto=format&fit=crop&q=60"
  },
  {
    quote: "They understand that great design is invisible yet unforgettable.",
    author: "Elena Voss",
    role: "Art Director",
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
        ? "w-12 bg-white"
        : "w-6 bg-white/20 group-hover:w-8 group-hover:bg-white/40"
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