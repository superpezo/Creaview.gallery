const cursorLight = document.querySelector(".cursor-light");

if (cursorLight) {
  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
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

addEventListener("scroll", () => {
  if (nav) nav.classList.toggle("nav-scrolled", scrollY > 20);
});

function getPortfolios() {
  return JSON.parse(localStorage.getItem("creaviewPortfolios")) || [];
}

function savePortfolios(items) {
  localStorage.setItem("creaviewPortfolios", JSON.stringify(items));
}

function escapeText(value) {
  return String(value || "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

/* Browse */

const resultsArea = document.getElementById("resultsArea");
const portfolioCount = document.getElementById("portfolioCount");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

function renderBrowse(items) {
  if (!resultsArea) return;

  if (portfolioCount) portfolioCount.textContent = items.length;

  if (!items.length) {
    resultsArea.innerHTML = `
      <div class="empty-gallery">
        <div class="empty-orb">✦</div>
        <h2>No portfolios yet</h2>
        <p>When portfolios are submitted, they will appear here.</p>
        <a href="submit.html">Create the first portfolio</a>
      </div>
    `;
    return;
  }

  resultsArea.innerHTML = `
    <div class="created-grid">
      ${items.map(item => `
        <article class="created-card" onclick="location.href='profile.html?id=${item.id}'">
          <div class="created-card-image" style="${item.image ? `background-image:url('${escapeText(item.image)}')` : ""}"></div>
          <div class="created-card-body">
            <h3>${escapeText(item.name)}</h3>
            <p>${escapeText(item.role)}</p>
            <span>${escapeText(item.tags || "Portfolio")}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

if (resultsArea) {
  renderBrowse(getPortfolios());
}

if (searchForm) {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();

    const query = searchInput.value.trim().toLowerCase();
    const all = getPortfolios();

    if (!query) {
      renderBrowse(all);
      return;
    }

    renderBrowse(all.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.bio.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query)
    ));
  });
}

/* Builder */

const form = document.getElementById("portfolioForm");

const creatorName = document.getElementById("creatorName");
const creatorRole = document.getElementById("creatorRole");
const creatorLocation = document.getElementById("creatorLocation");
const creatorBio = document.getElementById("creatorBio");
const creatorImage = document.getElementById("creatorImage");
const creatorTags = document.getElementById("creatorTags");
const creatorLink = document.getElementById("creatorLink");

const previewName = document.getElementById("previewName");
const previewRole = document.getElementById("previewRole");
const previewBio = document.getElementById("previewBio");
const previewImage = document.getElementById("previewImage");
const previewTags = document.getElementById("previewTags");
const previewLink = document.getElementById("previewLink");
const previewCard = document.getElementById("previewCard");

let currentTheme = "purple";

function updatePreview() {
  if (!previewCard) return;

  previewName.textContent = creatorName.value || "Your Name";
  previewRole.textContent = creatorRole.value || "Your role will appear here";
  previewBio.textContent = creatorBio.value || "Your short bio will appear here while you type.";

  if (creatorImage.value.trim()) {
    previewImage.style.backgroundImage = `url('${creatorImage.value.trim()}')`;
    previewImage.style.backgroundSize = "cover";
    previewImage.style.backgroundPosition = "center";
  } else {
    previewImage.style.backgroundImage = "";
  }

  const tags = creatorTags.value.split(",").map(t => t.trim()).filter(Boolean);

  previewTags.innerHTML = tags.length
    ? tags.map(tag => `<span>${escapeText(tag)}</span>`).join("")
    : `<span>skill</span><span>portfolio</span>`;

  previewLink.href = creatorLink.value || "#";
}

[
  creatorName,
  creatorRole,
  creatorLocation,
  creatorBio,
  creatorImage,
  creatorTags,
  creatorLink
].forEach(input => {
  if (input) input.addEventListener("input", updatePreview);
});

document.querySelectorAll(".theme-dot").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".theme-dot").forEach(dot => dot.classList.remove("active"));
    button.classList.add("active");

    currentTheme = button.dataset.theme;
    previewCard.className = `portfolio-create-card theme-${currentTheme}`;
  });
});

if (form) {
  form.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const portfolio = {
      id: crypto.randomUUID ? crypto.randomUUID() : `portfolio-${Date.now()}`,
      name: creatorName.value.trim() || "Untitled Portfolio",
      role: creatorRole.value.trim() || "Creator",
      location: creatorLocation.value.trim(),
      bio: creatorBio.value.trim(),
      image: creatorImage.value.trim(),
      tags: creatorTags.value.trim(),
      link: creatorLink.value.trim() || "#",
      theme: currentTheme,
      createdAt: Date.now()
    };

    const portfolios = getPortfolios();
    portfolios.unshift(portfolio);
    savePortfolios(portfolios);

    document.body.classList.add("leaving");

    setTimeout(() => {
      location.href = `profile.html?id=${portfolio.id}`;
    }, 450);
  });
}

/* Profile */

const profileRoot = document.getElementById("profileRoot");

if (profileRoot) {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const portfolio = getPortfolios().find(item => item.id === id);

  if (!portfolio) {
    profileRoot.innerHTML = `
      <section class="profile-empty">
        <div class="empty-orb">✦</div>
        <h1>Portfolio not found</h1>
        <p>This profile does not exist or was removed.</p>
        <a href="browse.html">Back to Browse</a>
      </section>
    `;
  } else {
    const tags = portfolio.tags.split(",").map(t => t.trim()).filter(Boolean);

    profileRoot.innerHTML = `
      <section class="profile-view">
        <div class="profile-banner" style="${portfolio.image ? `background-image:url('${escapeText(portfolio.image)}')` : ""}"></div>

        <article class="profile-glass">
          <div class="profile-avatar">✦</div>
          <p class="profile-kicker">${escapeText(portfolio.location || "Portfolio")}</p>
          <h1>${escapeText(portfolio.name)}</h1>
          <h2>${escapeText(portfolio.role)}</h2>
          <p>${escapeText(portfolio.bio || "No description added.")}</p>

          <div class="profile-tags">
            ${tags.map(tag => `<span>${escapeText(tag)}</span>`).join("")}
          </div>

          <div class="profile-actions">
            <a href="${escapeText(portfolio.link)}" target="_blank">Open Link</a>
            <button onclick="navigator.clipboard.writeText(location.href)">Copy Profile</button>
          </div>
        </article>
      </section>
    `;
  }
}
