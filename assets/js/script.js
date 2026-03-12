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