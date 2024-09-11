// Fetch initial news on page load
window.addEventListener("load", () => fetchNews("Technology"));

/**
 * Fetches news articles based on the query.
 * @param {string} query - The topic or keyword to search for.
 */
async function fetchNews(query) {
    try {
        // Updated URL to call the local backend server
        const res = await fetch(`http://localhost:3000/news?q=${query}`);
        const data = await res.json();
        console.log("Fetched Data: ", data);
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

/**
 * Binds fetched news data to the HTML template.
 * @param {Array} articles - Array of news articles.
 */
function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; // Clear previous news cards

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

/**
 * Fills the data in the cloned card template.
 * @param {HTMLElement} cardClone - The cloned card template.
 * @param {Object} article - The article object containing news data.
 */
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open the article in a new tab when the card is clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

/**
 * Handles navigation item click and fetches news for the selected category.
 * @param {string} id - The ID of the clicked navigation item.
 */
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
