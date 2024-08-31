document.getElementById('generate-quote').addEventListener('click', fetchQuote);
document.getElementById('save-quote').addEventListener('click', saveQuote);
document.getElementById('add-custom-quote').addEventListener('click', addCustomQuote);
document.getElementById('search-input').addEventListener('input', filterFavorites);

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
updateFavoritesList();

async function fetchQuote() {
    const category = document.getElementById('category-select').value;
    const apiUrl = `https://api.quotable.io/random?tags=${category}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Assuming the API returns a `content` field for the quote
        const quote = data.content || "No quote found";
        
        const quoteBox = document.getElementById('quote-box');
        quoteBox.style.opacity = 0; // Start fade-out effect

        setTimeout(() => {
            document.getElementById('quote').textContent = quote;
            quoteBox.style.opacity = 1; // Start fade-in effect
        }, 300); // Adjust timing to match CSS animation

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('quote').textContent = 'Sorry, we could not fetch a quote at this time. Please try again later.';
    }
}

function saveQuote() {
    const quote = document.getElementById('quote').textContent;
    if (quote && !favorites.includes(quote)) {
        favorites.push(quote);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
    }
}

function addCustomQuote() {
    const customQuote = document.getElementById('custom-quote-input').value.trim();
    if (customQuote && !favorites.includes(customQuote)) {
        favorites.push(customQuote);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
        document.getElementById('custom-quote-input').value = ''; // Clear the input field
    }
}

function updateFavoritesList() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '';
    favorites.forEach((favorite, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${favorite} <button class="delete-btn" data-index="${index}">Delete</button>`;
        li.querySelector('.delete-btn').addEventListener('click', deleteQuote);
        list.appendChild(li);
    });
}

function deleteQuote(event) {
    const index = event.target.dataset.index;
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
}

function filterFavorites() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('#favorites-list li');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}
