let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const container = document.getElementById("favoritesContainer");

fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const favArticles = articles.filter((a) => favorites.includes(a.id));
    renderFavorites(favArticles);
  });

function renderFavorites(data) {
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = "<p>Tidak ada artikel favorit.</p>";
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
      <button onclick="removeFavorite(${article.id})">Hapus Favorit</button>
      <a href="article-detail.html?id=${article.id}" class="detail-link">Baca Selengkapnya</a>
    `;
    container.appendChild(card);
  });
}

function removeFavorite(id) {
  favorites = favorites.filter((fav) => fav !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Render ulang tanpa reload
  fetch("data/articles.json")
    .then((res) => res.json())
    .then((articles) => {
      const favArticles = articles.filter((a) => favorites.includes(a.id));
      renderFavorites(favArticles);
    });
}
