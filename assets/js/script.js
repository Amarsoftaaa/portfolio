const container = document.getElementById("projectsContainer")

document.getElementById("rightBtn").onclick = () => {
    container.scrollBy({
        left: 500,
        behavior: "smooth"
    })
}

document.getElementById("leftBtn").onclick = () => {
    container.scrollBy({
        left: -500,
        behavior: "smooth"
    })
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