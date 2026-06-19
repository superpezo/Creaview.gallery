const cursorLight = document.querySelector(".cursor-light");

if (cursorLight) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorLight.style.left = `${glowX}px`;
    cursorLight.style.top = `${glowY}px`;

    requestAnimationFrame(animateCursorGlow);
  }

  animateCursorGlow();
}

const nav = document.querySelector(".site-nav");

window.addEventListener("scroll", () => {
  if (!nav) return;

  if (window.scrollY > 20) {
    nav.classList.add("nav-scrolled");
  } else {
    nav.classList.remove("nav-scrolled");
  }
});

const magneticItems = document.querySelectorAll(".button, .nav-cta, .mini-card");

magneticItems.forEach(item => {
  item.addEventListener("mousemove", event => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
    }
  });
}, {
  threshold: 0.2
});

revealItems.forEach(item => {
  revealObserver.observe(item);
});

const cards = document.querySelectorAll(".portfolio-card");

cards.forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
