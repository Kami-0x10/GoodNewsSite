// Yahoo JapanニュースRSSフィードのURL（国内ニュースの例）
const RSS_URL = 'https://news.yahoo.co.jp/rss/categories/domestic.xml'; // 国内ニュースのRSS

// CORSプロキシURL
const CORS_PROXY = 'https://cors-0x10.online/';

// 明るいニュースに関連するキーワード
const positiveKeywords = ['希望', '笑顔', 'ポジティブ', '感謝', '幸せ', '楽しい', '支援', '成長', '成功'];

// ニュースを表示する関数
function displayNews(items) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = ''; // 既存のニュースをクリア

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

// ニュースアイテムがポジティブかどうかをチェックする関数
function isPositiveNews(item) {
    // タイトルと説明にポジティブなキーワードが含まれているかをチェック
    const titleContainsPositive = positiveKeywords.some(keyword => item.title.includes(keyword));
    const descriptionContainsPositive = positiveKeywords.some(keyword => item.description.includes(keyword));

    return titleContainsPositive || descriptionContainsPositive;
}

// RSSを取得し、XMLをパースしてニュースアイテムを表示
async function fetchRSS() {
    try {
        // CORSプロキシを使ってRSSフィードを取得
        const response = await fetch(CORS_PROXY + RSS_URL);
        
        // レスポンスが成功したかチェック
        if (!response.ok) {
            throw new Error('RSSフィードの取得に失敗しました。');
        }
        
        const text = await response.text();
        
        // 取得したRSSをXML形式でパース
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        // RSSフィードからアイテムを取得
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent
        }));

        // ポジティブなニュースのみをフィルタリング
        const positiveItems = items.filter(isPositiveNews);

        // フィルタリングされたニュースアイテムを表示
        if (positiveItems.length > 0) {
            displayNews(positiveItems);
        } else {
            console.log('ポジティブなニュースは見つかりませんでした。');
            document.getElementById('newsList').innerHTML = '<p>ポジティブなニュースは現在ありません。</p>';
        }
    } catch (error) {
        console.error('エラー:', error);
        document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
    }
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};
