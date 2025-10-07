let articles = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentIndex = 0;
const perPage = 20;

const container = document.getElementById("articlesContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll("#filterButtons button");
const loadMoreBtn = document.getElementById("loadMoreBtn");

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Fetch data dari JSON
fetch("data/articles.json")
  .then((res) => res.json())
  .then((data) => {
    articles = data;
    renderArticles(articles, true); // true = reset container
  });

// Fungsi render artikel dengan paging
function renderArticles(data, reset = false) {
  if (reset) {
    container.innerHTML = "";
    currentIndex = 0;
  }

  const slice = data.slice(currentIndex, currentIndex + perPage);

  slice.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    // Default preview text
    let previewText = "";

    // Jika article punya content langsung
    if (article.content) {
      previewText = article.content.substring(0, 100) + "...";
      renderCard();
    }
    // Jika article pakai file eksternal (contentFile)
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

    function renderCard() {
      card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" width="200">
        <h3>${article.title}</h3>
        <p><strong>${article.city}</strong></p>
        <p>${previewText}</p>
        <button onclick="toggleFavorite(${article.id}); event.stopPropagation();">
          ${favorites.includes(article.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
        </button>
      `;

      // Klik card -> detail
      card.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() !== "button") {
          window.location.href = `article-detail.html?id=${article.id}`;
        }
      });

      container.appendChild(card);
    }
  });

  currentIndex += perPage;

  // Sembunyikan tombol kalau udah habis
  if (currentIndex >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

function toggleFavorite(id) {
  let message = "";
  let type = "";

  if (favorites.includes(id)) {
    favorites = favorites.filter((fav) => fav !== id);
    message = "Dihapus dari Favorit";
    type = "remove";
  } else {
    favorites.push(id);
    message = "Ditambahkan ke Favorit";
    type = "add";
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderArticles(articles, true);

  showToast(message, type);
}


// Load more event
loadMoreBtn.addEventListener("click", () => {
  renderArticles(articles, false);
});

// Search
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = articles.filter((a) => {
    const contentText = a.content || ""; // handle undefined
    return (
      a.title.toLowerCase().includes(keyword) ||
      contentText.toLowerCase().includes(keyword)
    );
  });
  renderArticles(filtered, true);
});

// Filter tombol kota
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    if (city === "all") {
      renderArticles(articles, true);
    } else {
      const filtered = articles.filter((a) => a.city === city);
      renderArticles(filtered, true);
    }
  });
});

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animasi muncul
  setTimeout(() => toast.classList.add("show"), 100);

  // Hilang setelah 2 detik
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

/* ====== MOBILE: hamburger ====== */
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}