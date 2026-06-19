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

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorLight.style.left = `${glowX - 210}px`;
    cursorLight.style.top = `${glowY - 210}px`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}
