let articles = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const container = document.getElementById("articlesContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll("#filterButtons button");

// Fetch data dari JSON
fetch("data/articles.json")
  .then((res) => res.json())
  .then((data) => {
    articles = data;
    renderArticles(articles);
  });

function renderArticles(data) {
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = "<p>Tidak ada artikel ditemukan.</p>";
    return;
  }

  data.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" width="200">
      <h3>${article.title}</h3>
      <p><strong>${article.city}</strong></p>
      <p>${article.content.substring(0, 100)}...</p>
      <button onclick="toggleFavorite(${article.id})">
        ${favorites.includes(article.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
      </button>
    `;

    // Biar bisa klik seluruh card menuju halaman detail
    card.addEventListener("click", (e) => {
      // Supaya tombol favorit masih bisa dipencet tanpa langsung redirect
      if (e.target.tagName.toLowerCase() !== "button") {
        window.location.href = `article-detail.html?id=${article.id}`;
      }
    });

    container.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((fav) => fav !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderArticles(articles);
}

// Search
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(keyword) ||
      a.content.toLowerCase().includes(keyword)
  );
  renderArticles(filtered);
});

// Filter tombol kota
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    if (city === "all") {
      renderArticles(articles);
    } else {
      const filtered = articles.filter((a) => a.city === city);
      renderArticles(filtered);
    }
  });
});
