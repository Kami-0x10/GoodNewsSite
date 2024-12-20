// Yahoo JapanニュースRSSフィードのURL（国内ニュース）
var RSS_URL = 'https://news.yahoo.co.jp/rss/categories/domestic.xml'; // 国内ニュースのRSS

// CORSプロキシURL
var CORS_PROXY = 'https://cors-0x10.online/';

// より厳密なポジティブなニュースに関連するキーワード
var positiveKeywords = [
    '希望', '笑顔', 'ポジティブ', '感謝', '幸せ', '楽しい', '支援', '成長', '成功', 
    '感動', '前向き', '協力', '豊か', '素晴らしい', '輝く', '愛', '励まし', '良いニュース', 
    '変化', '発展', '達成', '奇跡', '未来', '挑戦', '喜び', '明るい', '幸運', '団結', '感謝',
    '前進', '明るい未来', '愛情', '成果', '温かい', '笑顔が溢れる', '活気', '希望に満ちた'
];

// 否定的なキーワード（新たに追加したものを含む）
var negativeKeywords = [
    '悲しい', '不幸', '困難', '危機', '失敗', '問題', '災害', '衝撃', '恐れ', '暗い', '不安', 
    '痛み', '憂鬱', '苦しみ', '落ち込む', '悩み', '絶望', '殺人', '裁判', 'ケガ', '事故', 
    '傷害', '暴力', '戦争', '破壊', '犯罪', '暴動', '自殺', '傷', '強盗', '過失', '暴力行為', 
    '不正', '告発', '災難', '事故発生', '交通事故', '暴力事件', '殺人事件', '事件'
];

// ニュースを表示する関数
function displayNews(items) {
    var newsList = document.getElementById('newsList');
    newsList.innerHTML = ''; // 既存のニュースをクリア

    if (items.length > 0) {
        items.forEach(function(item) {
            var newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            
            var newsTitle = document.createElement('h2');
            newsTitle.textContent = item.title;
            newsItem.appendChild(newsTitle);

            var newsDescription = document.createElement('p');
            newsDescription.textContent = item.description;
            newsItem.appendChild(newsDescription);

            var newsLink = document.createElement('a');
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
    return negativeKeywords.some(function(keyword) {
        return text.indexOf(keyword) !== -1;
    });
}

// ニュースアイテムがポジティブかどうかをチェックする関数
function isPositiveNews(item) {
    // タイトルと説明にポジティブなキーワードが含まれているかをチェック
    var titleContainsPositive = positiveKeywords.some(function(keyword) {
        return item.title.indexOf(keyword) !== -1;
    });
    var descriptionContainsPositive = positiveKeywords.some(function(keyword) {
        return item.description.indexOf(keyword) !== -1;
    });
    
    // 否定的なキーワードがタイトルや説明に含まれていれば除外
    var titleContainsNegative = containsNegativeKeyword(item.title);
    var descriptionContainsNegative = containsNegativeKeyword(item.description);

    // ポジティブなニュースで、否定的なキーワードが含まれていない場合のみ
    return (titleContainsPositive || descriptionContainsPositive) && 
           !(titleContainsNegative || descriptionContainsNegative);
}

// RSSを取得し、XMLをパースしてニュースアイテムを表示
function fetchRSS() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', CORS_PROXY + RSS_URL, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var text = xhr.responseText;

            // 取得したRSSをXML形式でパース
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, 'text/xml');

            // RSSフィードからアイテムを取得
            var items = Array.prototype.slice.call(xmlDoc.querySelectorAll('item')).map(function(item) {
                return {
                    title: item.querySelector('title').textContent,
                    description: item.querySelector('description').textContent,
                    link: item.querySelector('link').textContent
                };
            });

            // ポジティブなニュースのみをフィルタリング
            var positiveItems = items.filter(isPositiveNews);

            // フィルタリングされたニュースアイテムを最大100件に制限
            var limitedItems = positiveItems.slice(0, 100);

            // フィルタリングされたニュースアイテムを表示
            displayNews(limitedItems);
        } else {
            console.error('RSSフィードの取得に失敗しました。');
            document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
        }
    };
    xhr.onerror = function() {
        console.error('ネットワークエラーが発生しました。');
        document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
    };
    xhr.send();
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};
