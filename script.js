// 明るいニュースRSSフィードのURL
const RSS_URL = '// Yahoo JapanニュースRSSフィードのURL（国内ニュースの例）
const RSS_URL = 'https://news.yahoo.co.jp/rss/categories/domestic.xml'; // 国内ニュースのRSS

// CORSプロキシURL
const CORS_PROXY = 'https://cors-0x10.online/';

// ニュースを表示する関数
function displayNews(items) {
    const newsList = document.getElementById('newsList');
    items.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        
        const newsTitle = document.createElement('h2');
        newsTitle.textContent = item.title;
        newsItem.appendChild(newsTitle);

        const newsDescription = document.createElement('p');
        newsDescription.textContent = item.description;
        newsItem.appendChild(newsDescription);

        newsList.appendChild(newsItem);
    });
}

// RSSを取得し、XMLをパースしてニュースアイテムを表示
async function fetchRSS() {
    try {
        // CORSプロキシを使ってRSSフィードを取得
        const response = await fetch(CORS_PROXY + RSS_URL);
        const text = await response.text();
        
        // 取得したRSSをXML形式でパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        // RSSフィードからアイテムを取得
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent
        }));

        // ニュースアイテムを表示
        displayNews(items);
    } catch (error) {
        console.error('RSSフィードの取得に失敗しました:', error);
    }
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};
'; // 例：Good News NetworkのRSSフィード

// CORSプロキシURL
const CORS_PROXY = 'https://cors-0x10.online/';

// ニュースを表示する関数
function displayNews(items) {
    const newsList = document.getElementById('newsList');
    items.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        
        const newsTitle = document.createElement('h2');
        newsTitle.textContent = item.title;
        newsItem.appendChild(newsTitle);

        const newsDescription = document.createElement('p');
        newsDescription.textContent = item.description;
        newsItem.appendChild(newsDescription);

        newsList.appendChild(newsItem);
    });
}

// RSSを取得し、XMLをパースしてニュースアイテムを表示
async function fetchRSS() {
    try {
        // CORSプロキシを使ってRSSフィードを取得
        const response = await fetch(CORS_PROXY + RSS_URL);
        const text = await response.text();
        
        // 取得したRSSをXML形式でパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        // RSSフィードからアイテムを取得
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent
        }));

        // ニュースアイテムを表示
        displayNews(items);
    } catch (error) {
        console.error('RSSフィードの取得に失敗しました:', error);
    }
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};
