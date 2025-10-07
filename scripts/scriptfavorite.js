let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const container = document.getElementById("favoritesContainer");

// Ambil semua artikel dari JSON
fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const favArticles = articles.filter((a) => favorites.includes(a.id));
    renderFavorites(favArticles);
  });

function renderFavorites(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Tidak ada artikel favorit.</p>";
    return;
  }

  data.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    // Default preview text
    let previewText = "";

    // Jika artikel punya konten langsung
    if (article.content) {
      previewText = article.content.substring(0, 100) + "...";
      renderCard();
    }
    // Jika artikel punya file eksternal
    else if (article.contentFile) {
      fetch(article.contentFile)
        .then((res) => res.text())
        .then((text) => {
          previewText = text.substring(0, 100) + "...";
          renderCard();
        })
        .catch(() => {
          previewText = "(Gagal memuat preview)";
          renderCard();
        });
    } else {
      previewText = "(Tidak ada konten)";
      renderCard();
    }

    // Fungsi buat render card
    function renderCard() {
      card.innerHTML = `
        <img src="${article.image}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p><strong>${article.city}</strong></p>
        <p>${previewText}</p>
        <button onclick="removeFavorite(${article.id})">Hapus Favorit</button>
        <a href="article-detail.html?id=${article.id}" class="detail-link">Baca Selengkapnya</a>
      `;
      container.appendChild(card)
    }
  });
}

function removeFavorite(id) {
  favorites = favorites.filter((fav) => fav !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showToast("Artikel dihapus dari Favorit", "remove");

  // Render ulang tanpa reload
  fetch("data/articles.json")
    .then((res) => res.json())
    .then((articles) => {
      const favArticles = articles.filter((a) => favorites.includes(a.id));
      renderFavorites(favArticles);
    });
}

// Tombol hapus semua favorit
const clearBtn = document.getElementById("clearFavoritesBtn");
clearBtn.addEventListener("click", () => {
  if (favorites.length === 0) {
    alert("Tidak ada artikel favorit untuk dihapus.");
    return;
  }

  const confirmDelete = confirm("Yakin ingin menghapus semua artikel favorit?");
  if (confirmDelete) {
    favorites = [];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    container.innerHTML = "<p>Tidak ada artikel favorit.</p>";
    showToast("Semua artikel favorit dihapus", "remove");
  }
});

// Fungsi Toast Notification
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}
