// =========================================================
// FAVORITES STATE & DOM HOOK
// Load favorite IDs from localStorage and cache container
// =========================================================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const container = document.getElementById("favoritesContainer");

// Enable scrolling after CSS fade-in completes
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// =========================================================
// LOAD ALL ARTICLES
// Fetch the full articles list, then filter to favorites only
// and render them.
// =========================================================
fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    const favArticles = articles.filter((a) => favorites.includes(a.id));
    renderFavorites(favArticles);
  });

// =========================================================
/**
 * Render the provided favorite articles into the container.
 * If an article has inline content, use it for preview; otherwise,
 * attempt to fetch 'contentFile' and fallback gracefully.
 * @param {Array} data - Array of favorite article objects.
 */
// =========================================================
function renderFavorites(data) {
  container.innerHTML = "";

  // Empty-state message when no favorites exist
  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Tidak ada artikel favorit.</p>";
    return;
  }

  data.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    // Default preview text for the card
    let previewText = "";

    // Inline content available
    if (article.content) {
      previewText = article.content.substring(0, 100) + "...";
      renderCard();
    }
    // External content file (e.g., .txt) — fetch and preview
    else if (article.contentFile) {
      fetch(article.contentFile)
        .then((res) => res.text())
        .then((text) => {
          previewText = text.substring(0, 100) + "...";
          renderCard();
        })
        .catch(() => {
          // Graceful fallback if external file fails to load
          previewText = "(Gagal memuat preview)";
          renderCard();
        });
    } else {
      // No content provided at all
      previewText = "(Tidak ada konten)";
      renderCard();
    }

    // --------- Inner helper to inject card markup ---------
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

// =========================================================
// REMOVE SINGLE FAVORITE
// Updates the localStorage-backed favorites array, shows a toast,
// and re-renders the list without a full page reload.
// =========================================================
function removeFavorite(id) {
  favorites = favorites.filter((fav) => fav !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showToast("Artikel dihapus dari Favorit", "remove");

  // Re-fetch to ensure we render only remaining favorites
  fetch("data/articles.json")
    .then((res) => res.json())
    .then((articles) => {
      const favArticles = articles.filter((a) => favorites.includes(a.id));
      renderFavorites(favArticles);
    });
}

// =========================================================
// CLEAR ALL FAVORITES BUTTON
// Confirms with the user, clears the list, persists the change,
// shows feedback, and updates the UI.
// =========================================================
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

// =========================================================
// TOAST NOTIFICATION
// Small ephemeral message that slides in/out to confirm actions.
// 'type' controls color via CSS classes (.add / .remove).
// =========================================================
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger CSS transition with a small delay
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-dismiss after 2 seconds and remove from DOM
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// =========================================================
/* MOBILE NAVIGATION TOGGLE
   Hamburger toggles the primary nav ('open') and keeps
   aria-expanded in sync for accessibility. */
// =========================================================
const hamburger = document.querySelector(".hamburger");
const nav = document.getElementById("site-nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
