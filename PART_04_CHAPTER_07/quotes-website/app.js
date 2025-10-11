// 전역 상태
let allQuotes = [];
let currentQuote = null;
let searchTimeout = null;

// DOM 요소
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const randomBtn = document.getElementById('randomBtn');
const mainQuoteText = document.getElementById('mainQuoteText');
const mainQuoteAuthor = document.getElementById('mainQuoteAuthor');
const mainQuoteCategory = document.getElementById('mainQuoteCategory');
const mainQuoteCard = document.getElementById('mainQuoteCard');
const quoteDisplay = document.getElementById('quoteDisplay');
const searchResults = document.getElementById('searchResults');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const loading = document.getElementById('loading');

// 초기화
async function init() {
    try {
        showLoading();
        await loadQuotes();
        displayRandomQuote();
        setupEventListeners();
        hideLoading();
    } catch (error) {
        console.error('초기화 오류:', error);
        mainQuoteText.textContent = '명언을 불러오는 중 오류가 발생했습니다.';
        hideLoading();
    }
}

// 명언 데이터 로드
async function loadQuotes() {
    const response = await fetch('quotes.json');
    allQuotes = await response.json();
    console.log(`${allQuotes.length}개의 명언을 불러왔습니다.`);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 입력
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        // Clear 버튼 표시/숨김
        clearSearchBtn.style.display = query ? 'flex' : 'none';

        // 디바운싱으로 검색 성능 최적화
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (query) {
                performSearch(query);
            } else {
                hideSearchResults();
            }
        }, 300);
    });

    // 검색 초기화
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        hideSearchResults();
        searchInput.focus();
    });

    // 랜덤 명언
    randomBtn.addEventListener('click', () => {
        displayRandomQuote();
        // 검색 결과가 있다면 숨김
        hideSearchResults();
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
    });
}

// 랜덤 명언 표시
function displayRandomQuote() {
    if (allQuotes.length === 0) return;

    // 애니메이션 효과
    mainQuoteCard.style.opacity = '0';
    mainQuoteCard.style.transform = 'scale(0.95)';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        currentQuote = allQuotes[randomIndex];
        displayMainQuote(currentQuote);

        // 페이드 인 애니메이션
        mainQuoteCard.style.transition = 'all 0.5s ease';
        mainQuoteCard.style.opacity = '1';
        mainQuoteCard.style.transform = 'scale(1)';
    }, 200);
}

// 메인 명언 카드에 표시
function displayMainQuote(quote) {
    mainQuoteText.textContent = quote.quote;
    mainQuoteAuthor.textContent = quote.author;
    mainQuoteCategory.textContent = quote.category || '일반';
}

// 검색 수행
function performSearch(query) {
    const lowerQuery = query.toLowerCase();

    const results = allQuotes.filter(quote => {
        const quoteText = quote.quote.toLowerCase();
        const author = quote.author.toLowerCase();
        const category = (quote.category || '').toLowerCase();

        return quoteText.includes(lowerQuery) ||
               author.includes(lowerQuery) ||
               category.includes(lowerQuery);
    });

    displaySearchResults(results, query);
}

// 검색 결과 표시
function displaySearchResults(results, query) {
    // 검색 결과 영역 표시
    searchResults.style.display = 'block';
    quoteDisplay.style.display = 'none';

    // 결과 개수 표시
    resultsCount.textContent = `${results.length}개`;

    // 결과 그리드 초기화
    resultsGrid.innerHTML = '';

    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">검색 결과가 없습니다</p>
                <p style="font-size: 0.875rem;">"${query}"에 대한 명언을 찾을 수 없습니다.</p>
            </div>
        `;
        return;
    }

    // 최대 50개까지만 표시 (성능 고려)
    const displayResults = results.slice(0, 50);

    displayResults.forEach((quote, index) => {
        const card = createResultCard(quote, index);
        resultsGrid.appendChild(card);
    });

    if (results.length > 50) {
        const moreInfo = document.createElement('div');
        moreInfo.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 1rem; color: var(--text-secondary); font-size: 0.875rem;';
        moreInfo.textContent = `${results.length - 50}개의 결과가 더 있습니다. 검색어를 더 구체적으로 입력해보세요.`;
        resultsGrid.appendChild(moreInfo);
    }
}

// 검색 결과 카드 생성
function createResultCard(quote, index) {
    const card = document.createElement('div');
    card.className = 'quote-card result-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="quote-content">
            <p class="quote-text">${highlightText(quote.quote)}</p>
        </div>
        <div class="quote-footer">
            <p class="quote-author">${highlightText(quote.author)}</p>
            <p class="quote-category">${highlightText(quote.category || '일반')}</p>
        </div>
    `;

    // 카드 클릭 시 메인 화면에 표시
    card.addEventListener('click', () => {
        currentQuote = quote;
        hideSearchResults();
        displayMainQuote(quote);
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';

        // 부드러운 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return card;
}

// 검색어 하이라이트 (선택사항)
function highlightText(text) {
    const query = searchInput.value.trim();
    if (!query) return text;

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background: #fef3c7; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// 정규식 이스케이프
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 검색 결과 숨김
function hideSearchResults() {
    searchResults.style.display = 'none';
    quoteDisplay.style.display = 'block';
}

// 로딩 표시
function showLoading() {
    loading.style.display = 'flex';
}

// 로딩 숨김
function hideLoading() {
    loading.style.display = 'none';
}

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K: 검색 포커스
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }

    // Cmd/Ctrl + R: 랜덤 명언
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        randomBtn.click();
    }

    // ESC: 검색 초기화
    if (e.key === 'Escape') {
        if (searchInput.value) {
            clearSearchBtn.click();
        }
    }
});

// 앱 시작
init();
