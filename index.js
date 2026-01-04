// Load games from games.json, render them, and filter them with a search box.

const searchInput = document.getElementById("q");
const listContainer = document.getElementById("list");

let allGames = [];

/**
 * Create one HTML card for a game.
 */
function renderGameCard(game) {
  const title = game.title || "";
  const platforms = (game.platforms || []).join(", ");
  const recommendedBy = game.recommendedBy || "";
  const why = game.why || "";
  const tags = (game.tags || []).map(tag => `#${tag}`).join(" ");
  const wiki = game.wiki || "";

  return `
    <article>
      <strong>${title}</strong><br/>
      <small>${platforms}${recommendedBy ? " · " + recommendedBy : ""}</small>

      ${why ? `<p>${why}</p>` : ""}

      ${tags ? `<small>${tags}</small><br/>` : ""}

      ${wiki ? `<a href="${wiki}" target="_blank" rel="noreferrer">Wikipedia</a>` : ""}
    </article>
  `;
}

/**
 * Render a list of games to the page.
 */
function renderGames(gamesToRender) {
  if (gamesToRender.length === 0) {
    listContainer.innerHTML = `<article><small>No matches.</small></article>`;
    return;
  }

  const cardsHtml = gamesToRender.map(renderGameCard).join("");
  listContainer.innerHTML = cardsHtml;
}

/**
 * Convert a game into a big searchable string.
 * This makes search dead simple: just check if it includes the query.
 */
function buildSearchText(game) {
  const parts = [];

  parts.push(game.title || "");
  parts.push((game.platforms || []).join(" "));
  parts.push((game.tags || []).join(" "));
  parts.push(game.why || "");
  parts.push(game.recommendedBy || "");

  return parts.join(" ").toLowerCase();
}

/**
 * Filter games based on the search input.
 */
function filterGames(query) {
  const cleanedQuery = query.trim().toLowerCase();

  // Empty query = show everything.
  if (cleanedQuery === "") {
    return allGames;
  }

  // Otherwise, show games whose combined text contains the query.
  return allGames.filter(game => {
    const searchText = buildSearchText(game);
    return searchText.includes(cleanedQuery);
  });
}

/**
 * Main: load data, render, then wire up search.
 */
fetch("games.json", { cache: "no-store" })
  .then(response => response.json())
  .then(games => {
    allGames = games;
    renderGames(allGames);
  })
  .catch(() => {
    listContainer.innerHTML = `<article><small>Couldn’t load games.json.</small></article>`;
  });

searchInput.addEventListener("input", () => {
  const filtered = filterGames(searchInput.value);
  renderGames(filtered);
});
