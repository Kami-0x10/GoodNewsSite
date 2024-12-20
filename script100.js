// Yahoo JapanニュースRSSフィードのURL（国内ニュース）
const RSS_URL = 'https://news.yahoo.co.jp/rss/categories/domestic.xml'; // 国内ニュースのRSS

// CORSプロキシURL
const CORS_PROXY = 'https://cors-0x10.online/';

// より厳密なポジティブなニュースに関連するキーワード
const positiveKeywords = [
    '希望', '笑顔', 'ポジティブ', '感謝', '幸せ', '楽しい', '支援', '成長', '成功', 
    '感動', '前向き', '協力', '豊か', '素晴らしい', '輝く', '愛', '励まし', '良いニュース', 
    '変化', '発展', '達成', '奇跡', '未来', '挑戦', '喜び', '明るい', '幸運', '団結', '感謝',
    '前進', '明るい未来', '愛情', '成果', '温かい', '笑顔が溢れる', '活気', '希望に満ちた'
];

// 否定的なキーワード（新たに追加したものを含む）
const negativeKeywords = [
    '悲しい', '不幸', '困難', '危機', '失敗', '問題', '災害', '衝撃', '恐れ', '暗い', '不安', 
    '痛み', '憂鬱', '苦しみ', '落ち込む', '悩み', '絶望', '殺人', '裁判', 'ケガ', '事故', 
    '傷害', '暴力', '戦争', '破壊', '犯罪', '暴動', '自殺', '傷', '強盗', '過失', '暴力行為', 
    '不正', '告発', '災難', '事故発生', '交通事故', '暴力事件', '殺人事件', '事件'
];

// ニュースを表示する関数
function displayNews(items) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = ''; // 既存のニュースをクリア

    if (items.length > 0) {
        items.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            
            const newsTitle = document.createElement('h2');
            newsTitle.textContent = item.title;
            newsItem.appendChild(newsTitle);

            const newsDescription = document.createElement('p');
            newsDescription.textContent = item.description;
            newsItem.appendChild(newsDescription);

            const newsLink = document.createElement('a');
            newsLink.href = item.link;
            newsLink.textContent = '続きを読む';
            newsItem.appendChild(newsLink);

            newsList.appendChild(newsItem);
        });
    } else {
        // ポジティブなニュースが見つからなかった場合
        newsList.innerHTML = '<p>良いニュースはありませんでした。</p>';
    }
}

// 文字列にネガティブなキーワードが含まれているかを確認する関数
function containsNegativeKeyword(text) {
    // 否定的なキーワードを一文字ずつチェック
    return negativeKeywords.some(keyword => {
        // 各ネガティブキーワードが部分的にでも一致する場合に除外
        return text.includes(keyword);
    });
}

// ニュースアイテムがポジティブかどうかをチェックする関数
function isPositiveNews(item) {
    // タイトルと説明にポジティブなキーワードが含まれているかをチェック
    const titleContainsPositive = positiveKeywords.some(keyword => item.title.includes(keyword));
    const descriptionContainsPositive = positiveKeywords.some(keyword => item.description.includes(keyword));
    
    // 否定的なキーワードがタイトルや説明に含まれていれば除外
    const titleContainsNegative = containsNegativeKeyword(item.title);
    const descriptionContainsNegative = containsNegativeKeyword(item.description);

    // ポジティブなニュースで、否定的なキーワードが含まれていない場合のみ
    return (titleContainsPositive || descriptionContainsPositive) && 
           !(titleContainsNegative || descriptionContainsNegative);
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
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent
        }));

        // ポジティブなニュースのみをフィルタリング
        const positiveItems = items.filter(isPositiveNews);

        // フィルタリングされたニュースアイテムを最大100件に制限
        const limitedItems = positiveItems.slice(0, 100);

        // フィルタリングされたニュースアイテムを表示
        displayNews(limitedItems);
    } catch (error) {
        console.error('エラー:', error);
        document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
    }
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};