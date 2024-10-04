// HTML 요소 가져오기
const container = document.getElementById('root');

// HTML 요소 생성하기 
const content = document.createElement('div');
const ul = document.createElement('ul');

// XMLHttpRequest 객체 생성
const ajax = new XMLHttpRequest();

// API URL 정의 
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

// 뉴스 목록 가져오기
// NEWS_URL에서 GET 요청, false <- 동기적
ajax.open('GET', NEWS_URL, false);
// 요청을 서버로 보냄
ajax.send();

// 뉴스 데이터 파싱
// newsFeed <- 배열 
const newsFeed = JSON.parse(ajax.response);

// 뉴스 항목 클릭 시 상세 내용 표시 (hashChange 이벤트)
// 해시 값: URL의 # 뒤에 오는 부분으로, 페이지 내 특정 위치나 컨텐츠를 식별하는데 사용
window.addEventListener('hashchange', function() {
    // location: window 객체의 속성, URL에 대한 정보 담고있음
    // #을 제외한 나머지 부분 id 가져옴
    const id = location.hash.substring(1);

    // 상세 뉴스 API에 GET 요청
    ajax.open('GET', CONTENT_URL.replace('@id', id), false);
    ajax.send();

    // JSON 데이터 파싱 
    const newsContent = JSON.parse(ajax.response);
    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;

    content.appendChild(title);
});

// 뉴스 목록 표시 
for (let i = 0; i < 10; i++){
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

    li.appendChild(a);
    ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);
