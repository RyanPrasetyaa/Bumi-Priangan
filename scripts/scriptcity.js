// ===============================================
// URL PARAM HANDLING
// Read the "id" parameter from the current URL to determine which city to load
// ===============================================
const urlParams = new URLSearchParams(window.location.search);
const cityId = urlParams.get("id");

// Cache DOM references for later updates
const cityBanner = document.getElementById("cityBanner");
const cityInfo = document.getElementById("cityInfo");
const cityArticles = document.getElementById("cityArticles");

// ===============================================
// LOAD CITY DATA
// Fetch city metadata from local JSON and render banner + info sections
// ===============================================
fetch("data/cities.json")
  .then(res => res.json())
  .then(cities => {
    // Guard: cityId must exist in the URL
    if (!cityId) {
      cityBanner.innerHTML = "<p>Parameter kota tidak ditemukan di URL</p>";
      return;
    }

    // Find the matching city object by id (case-insensitive)
    const city = cities.find(c => c.id.toLowerCase() === cityId.toLowerCase());
    if (!city) {
      cityBanner.innerHTML = "<p>Kota tidak ditemukan di data</p>";
      return;
    }

    // Render banner with an overlayed city title
    // Note: inline background-image uses the 'banner' URL from city data
    cityBanner.innerHTML = `
      <div class="banner-wrapper" style="background-image: url('${city.banner}')">
        <div class="banner-overlay">
          <h1>${city.name}</h1>
        </div>
      </div>
    `;

    // Render city info sections
    // Replace newline characters in content with <br> for basic formatting
    cityInfo.innerHTML = city.sections.map(sec => `
      <div class="city-section">
        <h3>${sec.title}</h3>
        <p>${sec.content.replace(/\n/g, "<br>")}</p>
      </div>
    `).join("");
  })
  .catch(err => {
    // Fallback UI + console error for debugging
    cityBanner.innerHTML = "<p>Gagal memuat data kota</p>";
    console.error(err);
  });

// ===============================================
// LOAD RELATED ARTICLES
// Fetch all articles, filter by current city id, and render concise cards
// ===============================================
fetch("data/articles.json")
  .then(res => res.json())
  .then(articles => {
    // Guard: without a city context, skip rendering articles
    if (!cityId) {
      cityArticles.innerHTML = "<p>Kota tidak diketahui, artikel tidak bisa dimuat</p>";
      return;
    }

    // Filter articles whose 'city' field includes the current cityId (case-insensitive)
    const filtered = articles.filter(a =>
      a.city.toLowerCase().includes(cityId.toLowerCase())
    );

    // Empty state when no related articles are found
    if (filtered.length === 0) {
      cityArticles.innerHTML = "<p>Belum ada artikel untuk kota ini.</p>";
      return;
    }

    // Render article cards with a simple CTA to detail page
    cityArticles.innerHTML = filtered.map(article => `
      <div class="article-card" onclick="location.href='article-detail.html?id=${article.id}'">
        <img src="${article.image}" alt="${article.title}">
        <div class="article-card-body">
          <span class="date">${article.date}</span>
          <h3>${article.title}</h3>
          <p>Artikel ini tersedia, klik untuk baca selengkapnya...</p>
        </div>
      </div>
    `).join("");
  })
  .catch(err => {
    // Fallback UI + console error for debugging
    cityArticles.innerHTML = "<p>Gagal memuat artikel kota</p>";
    console.error(err);
  });

// ===============================================
// MOBILE NAVIGATION TOGGLE
// Handles hamburger click to toggle the main nav visibility (class 'open')
// Also keeps aria-expanded in sync for accessibility
// ===============================================
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
