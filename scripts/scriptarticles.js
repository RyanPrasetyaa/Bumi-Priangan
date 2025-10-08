// =========================================================
// STATE & DOM REFERENCES
// Holds article data, favorites from localStorage, pagination state,
// and caches key DOM elements for rendering.
// =========================================================
let articles = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentIndex = 0;
const perPage = 20;

const container = document.getElementById("articlesContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll("#filterButtons button");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// On window load, enable body scrolling (paired with CSS fade-in)
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// =========================================================
// FETCH ARTICLES
// Load the full list of articles from a local JSON file,
// then render the first page.
// =========================================================
fetch("data/articles.json")
  .then((res) => res.json())
  .then((data) => {
    articles = data;
    renderArticles(articles, true); // true = reset container before rendering
  });

// =========================================================
/**
 * Render a slice of articles with simple pagination.
 * @param {Array} data - Array of article objects to render.
 * @param {Boolean} reset - When true, clear container and reset paging index.
 */
// =========================================================
function renderArticles(data, reset = false) {
  if (reset) {
    container.innerHTML = "";
    currentIndex = 0;
  }

  const slice = data.slice(currentIndex, currentIndex + perPage);

  slice.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    // Default preview text for cards (fallback content)
    let previewText = "";

    // If inline content exists, derive preview from it
    if (article.content) {
      previewText = article.content.substring(0, 100) + "...";
      renderCard();
    }
    // If content is external (contentFile), fetch and preview from file
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
      // No content available
      previewText = "(Tidak ada konten)";
      renderCard();
    }

    // --------- Inner helper to render the card markup ---------
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

      // Navigate to detail page when clicking the card (except the button)
      card.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() !== "button") {
          window.location.href = `article-detail.html?id=${article.id}`;
        }
      });

      container.appendChild(card);
    }
  });

  // Advance pagination cursor
  currentIndex += perPage;

  // Toggle "Load More" visibility based on remaining items
  if (currentIndex >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

// =========================================================
// FAVORITES TOGGLE
// Add/remove article IDs from localStorage-backed favorites,
// then re-render and show a toast feedback.
// =========================================================
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
  renderArticles(articles, true); // Re-render from the start to update buttons

  showToast(message, type);
}

// =========================================================
// EVENTS: LOAD MORE
// Loads the next page of items into the grid.
// =========================================================
loadMoreBtn.addEventListener("click", () => {
  renderArticles(articles, false);
});

// =========================================================
// SEARCH
// Client-side text search by title or inline content.
// Re-renders using filtered results.
// =========================================================
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = articles.filter((a) => {
    const contentText = a.content || ""; // guard for undefined content
    return (
      a.title.toLowerCase().includes(keyword) ||
      contentText.toLowerCase().includes(keyword)
    );
  });
  renderArticles(filtered, true);
});

// =========================================================
// CITY FILTER BUTTONS
// Filter by exact city match using data-city attribute.
// =========================================================
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

// =========================================================
// TOAST UTILITY
// Shows a temporary toast message and auto-dismisses it.
// Type ('add' | 'remove') controls color via CSS classes.
// =========================================================
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Play entrance animation
  setTimeout(() => toast.classList.add("show"), 100);

  // Auto-hide after 2 seconds, then remove from DOM
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

/* =========================================================
   MOBILE NAVIGATION TOGGLE
   Hamburger toggles the primary nav (adds/removes 'open')
   and keeps aria-expanded in sync for accessibility.
========================================================= */
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
