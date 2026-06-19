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

/* Browse search */

const grid = document.getElementById("portfolioGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function getPortfolios(){
  return JSON.parse(localStorage.getItem("creaviewPortfolios")) || [];
}

function renderBrowse(items){
  if(!grid) return;

  if(items.length === 0){
    grid.innerHTML = `
      <div class="empty-state">
        No portfolios found yet.
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="browse-card" onclick="window.location.href='profile.html?id=${item.id}'">
      <div class="browse-card-image" style="${item.image ? `background-image:url('${item.image}');background-size:cover;background-position:center;` : ""}"></div>
      <div class="browse-card-content">
        <h3>${item.name}</h3>
        <p>${item.role}</p>
        <p>${item.bio}</p>
      </div>
    </article>
  `).join("");
}

function runSearch(){
  const portfolios = getPortfolios();

  if(!searchInput){
    renderBrowse(portfolios);
    return;
  }

  const query = searchInput.value.toLowerCase().trim();

  if(!query){
    renderBrowse(portfolios);
    return;
  }

  const filtered = portfolios.filter(item => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.bio.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query)
    );
  });

  renderBrowse(filtered);
}

if(grid){
  renderBrowse(getPortfolios());
}

if(searchButton){
  searchButton.addEventListener("click", runSearch);
}

if(searchInput){
  searchInput.addEventListener("keydown", event => {
    if(event.key === "Enter"){
      event.preventDefault();
      runSearch();
    }
  });
}

/* Portfolio builder */

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

function updatePreview(){
  if(!previewCard) return;

  previewName.textContent = creatorName.value || "Your Name";
  previewRole.textContent = creatorRole.value || "Your role will appear here";
  previewBio.textContent = creatorBio.value || "Your short bio will appear here while you type.";

  if(creatorImage.value.trim()){
    previewImage.style.backgroundImage = `url('${creatorImage.value.trim()}')`;
    previewImage.style.backgroundSize = "cover";
    previewImage.style.backgroundPosition = "center";
  } else {
    previewImage.style.backgroundImage = "";
  }

  const tags = creatorTags.value
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);

  previewTags.innerHTML = tags.length
    ? tags.map(tag => `<span>${tag}</span>`).join("")
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
  if(input) input.addEventListener("input", updatePreview);
});

document.querySelectorAll(".theme-dot").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".theme-dot").forEach(dot => dot.classList.remove("active"));
    button.classList.add("active");

    currentTheme = button.dataset.theme;
    previewCard.className = `portfolio-create-card theme-${currentTheme}`;
  });
});

if(form){
  form.addEventListener("submit", event => {
    event.preventDefault();

    const portfolio = {
      id: (creatorName.value || "portfolio").toLowerCase().replaceAll(" ","-") + "-" + Date.now(),
      name: creatorName.value || "Untitled Portfolio",
      role: creatorRole.value || "Creator",
      location: creatorLocation.value || "",
      bio: creatorBio.value || "",
      image: creatorImage.value || "",
      tags: creatorTags.value || "",
      link: creatorLink.value || "#",
      theme: currentTheme
    };

    const portfolios = getPortfolios();
    portfolios.unshift(portfolio);

    localStorage.setItem("creaviewPortfolios", JSON.stringify(portfolios));

    window.location.href = `profile.html?id=${portfolio.id}`;
  });
}
