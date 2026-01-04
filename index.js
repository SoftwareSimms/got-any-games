// index.js
// Load games from games.json, render them as simple cards, and filter via the search box.

const searchInput = document.getElementById("q");
const listContainer = document.getElementById("list");

let allGames = [];

/**
 * Build the HTML for one game entry.
 * Intentionally simple: image, title, meta, why, tags, wikipedia link.
 */
function buildGameHtml(game) {
  const title = game.title || "";
  const platforms = (game.platforms || []).join(", ");
  const recommendedBy = game.recommendedBy || "";
  const why = game.why || "";
  const tags = game.tags || [];
  const wiki = game.wiki || "";
  const image = game.image || "";

  let tagsText = "";
  if (tags.length > 0) {
    tagsText = tags.map(function (t) { return "#" + t; }).join(" ");
  }

  // Note: if image is missing, the browser may show a broken image icon. That's fine.
  return `
    <article>
      <img src="${image}" alt="${title} image">
      <strong>${title}</strong><br/>
      <small>${platforms}${recommendedBy ? " · " + recommendedBy : ""}</small>

      ${why ? `<p>${why}</p>` : ""}

      ${tagsText ? `<small>${tagsText}</small><br/>` : ""}

      ${wiki ? `<a href="${wiki}" target="_blank" rel="noreferrer">Wikipedia</a>` : ""}
    </article>
  `;
}

/**
 * Render a list of games into the page.
 */
function renderGames(gamesToRender) {
  if (gamesToRender.length === 0) {
    listContainer.innerHTML = `<article><small>No matches.</small></article>`;
    return;
  }

  let html = "";
  for (let i = 0; i < gamesToRender.length; i++) {
    html += buildGameHtml(gamesToRender[i]);
  }

  listContainer.innerHTML = html;
}

/**
 * Convert a game to a single searchable string.
 */
function makeSearchableText(game) {
  const parts = [];

  parts.push(game.title || "");
  parts.push((game.platforms || []).join(" "));
  parts.push((game.tags || []).join(" "));
  parts.push(game.why || "");
  parts.push(game.recommendedBy || "");

  return parts.join(" ").toLowerCase();
}

/**
 * Filter games based on the current query.
 */
function filterGames(query) {
  const q = query.trim().toLowerCase();

  if (q === "") {
    return allGames;
  }

  const filtered = [];

  for (let i = 0; i < allGames.length; i++) {
    const game = allGames[i];
    const text = makeSearchableText(game);

    if (text.includes(q)) {
      filtered.push(game);
    }
  }

  return filtered;
}

/**
 * Load games.json, then render.
 */
function loadGames() {
  fetch("games.json", { cache: "no-store" })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allGames = data;
      renderGames(allGames);
    })
    .catch(function () {
      listContainer.innerHTML = `<article><small>Couldn’t load games.json.</small></article>`;
    });
}

/**
 * Wire up search input.
 */
searchInput.addEventListener("input", function () {
  const filtered = filterGames(searchInput.value);
  renderGames(filtered);
});

// Start
loadGames();
