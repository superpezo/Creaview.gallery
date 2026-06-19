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

    cursorLight.style.left = `${glowX}px`;
    cursorLight.style.top = `${glowY}px`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

const nav = document.querySelector(".site-nav");

window.addEventListener("scroll", () => {
  if (!nav) return;
  nav.classList.toggle("nav-scrolled", window.scrollY > 20);
});

const portfolios = [
  {
    id: "sample-product-designer",
    name: "Sample Designer",
    role: "Product Designer",
    description: "A sample portfolio card. Replace this with real submissions later.",
    search: "designer product ui ux portfolio creative"
  },
  {
    id: "sample-developer",
    name: "Sample Developer",
    role: "Frontend Developer",
    description: "A sample developer profile for testing search and card layout.",
    search: "developer frontend javascript website coding"
  },
  {
    id: "sample-community",
    name: "Sample Manager",
    role: "Community Manager",
    description: "A sample community profile for Discord, moderation and support work.",
    search: "discord community manager moderation support"
  }
];

const grid = document.getElementById("portfolioGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function renderPortfolios(items) {
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        No portfolios found.
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="browse-card" onclick="window.location.href='profile.html?id=${item.id}'">
      <div class="browse-card-image"></div>
      <div class="browse-card-content">
        <h3>${item.name}</h3>
        <p>${item.role}</p>
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");
}

function runSearch() {
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderPortfolios(portfolios);
    return;
  }

  const filtered = portfolios.filter(item => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.search.toLowerCase().includes(query)
    );
  });

  renderPortfolios(filtered);
}

if (grid) {
  renderPortfolios(portfolios);
}

if (searchButton) {
  searchButton.addEventListener("click", runSearch);
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      runSearch();
    }
  });
}
