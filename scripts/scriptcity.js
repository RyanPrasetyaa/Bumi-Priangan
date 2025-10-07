// Ambil parameter id dari URL
const urlParams = new URLSearchParams(window.location.search);
const cityId = urlParams.get("id");

const cityBanner = document.getElementById("cityBanner");
const cityInfo = document.getElementById("cityInfo");
const cityArticles = document.getElementById("cityArticles");

// Load data kota
fetch("data/cities.json")
  .then(res => res.json())
  .then(cities => {
    if (!cityId) {
      cityBanner.innerHTML = "<p>Parameter kota tidak ditemukan di URL</p>";
      return;
    }

    const city = cities.find(c => c.id.toLowerCase() === cityId.toLowerCase());
    if (!city) {
      cityBanner.innerHTML = "<p>Kota tidak ditemukan di data</p>";
      return;
    }

    // Banner dengan judul overlay
    cityBanner.innerHTML = `
      <div class="banner-wrapper" style="background-image: url('${city.banner}')">
        <div class="banner-overlay">
          <h1>${city.name}</h1>
        </div>
      </div>
    `;

    // Info kota
    cityInfo.innerHTML = city.sections.map(sec => `
      <div class="city-section">
        <h3>${sec.title}</h3>
        <p>${sec.content.replace(/\n/g, "<br>")}</p>
      </div>
    `).join("");
  })
  .catch(err => {
    cityBanner.innerHTML = "<p>Gagal memuat data kota</p>";
    console.error(err);
  });

// Load artikel terkait kota
fetch("data/articles.json")
  .then(res => res.json())
  .then(articles => {
    if (!cityId) {
      cityArticles.innerHTML = "<p>Kota tidak diketahui, artikel tidak bisa dimuat</p>";
      return;
    }

    const filtered = articles.filter(a =>
      a.city.toLowerCase().includes(cityId.toLowerCase())
    );

    if (filtered.length === 0) {
      cityArticles.innerHTML = "<p>Belum ada artikel untuk kota ini.</p>";
      return;
    }

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
    cityArticles.innerHTML = "<p>Gagal memuat artikel kota</p>";
    console.error(err);
  });
