// HTML 요소 가져오기
const container = document.getElementById('root');

// XMLHttpRequest 객체 생성
const ajax = new XMLHttpRequest();

// API URL 정의 
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'

// 공유되는 자원
const store = {
    currentPage: 1,
}


// 데이터 가져오기 
function getData(url) {
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}


// 뉴스 목록 표시
function newsFeed() {
    // 뉴스 목록 가져오기
    const newsFeed = getData(NEWS_URL);

    const newsList = [];

    newsList.push('<ul>');

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    }

    newsList.push('</ul>');

    // 네비게이션 UI
    newsList.push(`
        <div>
            <a href="#/page/${store.currentPage > 1 ? store.currentPage-1 : 1}">이전 페이지</a>
            <a href="#/page/${store.currentPage+1}">다음 페이지</a>
        </div>
        `)

    container.innerHTML = newsList.join('');
}


// 뉴스 상세 페이지 
function newsDetail() {
    // location: window 객체의 속성, URL에 대한 정보 담고있음
    const id = location.hash.substring(7);

    // 상세 뉴스 API에 GET 요청
    // JSON 데이터 파싱 
    const newsContent = getData(CONTENT_URL.replace("@id", id));

    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
}


// 라우터: 뉴스 피드와 뉴스 내용 화면 중계
function router() {
    // 해시 값을 기준으로 화면 전환
    const routePath = location.hash;

    // location.hash에 #만 들어있을 경우 빈 값 반환
    if (routePath === '') {
        // 도입 화면
        newsFeed();
    } else if (routePath.indexOf('#/page/') >= 0) {
        // 1️⃣ 이전, 이후 페이지 이동
        // 2️⃣ 뉴스 내용 -> 뉴스 피드
        store.currentPage = Number(routePath.substring(7));
        newsFeed();
    } else {
        // 뉴스 피드 -> 뉴스 내용 
        newsDetail();
    }
}



// 뉴스 항목 클릭 시 상세 내용 표시 (hashChange 이벤트)
// 해시 값: URL의 # 뒤에 오는 부분으로, 페이지 내 특정 위치나 컨텐츠를 식별하는데 사용
window.addEventListener('hashchange', router);

// 첫 진입 화면
router();