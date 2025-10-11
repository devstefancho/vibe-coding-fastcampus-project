// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
);

// 전역 상태
let allQuotes = [];
let currentQuote = null;
let searchTimeout = null;
let searchMode = 'all'; // 'all', 'quote', 'author', 'category'
let selectedCategory = ''; // 선택된 카테고리 필터

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
        populateCategoryFilter(); // 카테고리 필터 초기화
        displayRandomQuote();
        setupEventListeners();
        setupShareButtons(); // 공유 버튼 이벤트 초기화
        hideLoading();
    } catch (error) {
        console.error('초기화 오류:', error);
        mainQuoteText.textContent = '명언을 불러오는 중 오류가 발생했습니다.';
        hideLoading();
    }
}

// 명언 데이터 로드
async function loadQuotes() {
    try {
        console.log('🔄 Supabase에서 데이터를 불러오는 중...');

        // Supabase에서 모든 명언 데이터 가져오기
        // Supabase는 한 번에 최대 1000개까지만 반환하므로, 여러 번에 나눠서 가져오기
        const BATCH_SIZE = 1000;
        let allData = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('quotes')
                .select('*')
                .order('id', { ascending: true })
                .range(offset, offset + BATCH_SIZE - 1);

            if (error) {
                console.error('❌ Supabase 에러:', error);
                throw error;
            }

            allData = allData.concat(data);
            console.log(`📦 배치 ${Math.floor(offset / BATCH_SIZE) + 1}: ${data.length}개 로드됨 (누적: ${allData.length}개)`);

            // 받아온 데이터가 BATCH_SIZE보다 적으면 더 이상 데이터가 없음
            if (data.length < BATCH_SIZE) {
                hasMore = false;
            } else {
                offset += BATCH_SIZE;
            }
        }

        allQuotes = allData;
        console.log(`✅ Supabase에서 총 ${allQuotes.length}개의 명언을 불러왔습니다.`);

        // 디버그: 마지막 5개 데이터 확인
        console.log('📊 마지막 5개 데이터:', allQuotes.slice(-5).map(q => ({
            id: q.id,
            quote: q.quote.substring(0, 30) + '...',
            author: q.author
        })));

        // 디버그: "하면 된다." 검색
        const testQuote = allQuotes.find(q => q.quote === '하면 된다.');
        if (testQuote) {
            console.log('✅ "하면 된다." 명언 발견!', testQuote);
        } else {
            console.warn('⚠️ "하면 된다." 명언을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('❌ Supabase 연결 오류:', error);
        throw new Error('명언 데이터를 불러오는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    }
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

    // 검색 필터 버튼
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성 버튼 변경
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 검색 모드 변경
            searchMode = btn.dataset.mode;

            // 검색어가 있으면 재검색
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
    });

    // 카테고리 필터
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', () => {
        selectedCategory = categoryFilter.value;

        // 검색어가 있으면 재검색
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
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

    let results = allQuotes.filter(quote => {
        const quoteText = quote.quote.toLowerCase();
        const author = quote.author.toLowerCase();
        const category = (quote.category || '').toLowerCase();

        // 검색 모드에 따른 필터링
        let modeMatch = false;
        switch (searchMode) {
            case 'quote':
                modeMatch = quoteText.includes(lowerQuery);
                break;
            case 'author':
                modeMatch = author.includes(lowerQuery);
                break;
            case 'category':
                modeMatch = category.includes(lowerQuery);
                break;
            case 'all':
            default:
                modeMatch = quoteText.includes(lowerQuery) ||
                           author.includes(lowerQuery) ||
                           category.includes(lowerQuery);
                break;
        }

        // 카테고리 필터 적용
        let categoryMatch = true;
        if (selectedCategory) {
            categoryMatch = category === selectedCategory.toLowerCase();
        }

        return modeMatch && categoryMatch;
    });

    displaySearchResults(results, query);
}

// 카테고리 목록 추출 및 필터 드롭다운 채우기
function populateCategoryFilter() {
    const categories = new Set();
    allQuotes.forEach(quote => {
        if (quote.category) {
            categories.add(quote.category);
        }
    });

    const categoryFilter = document.getElementById('categoryFilter');
    const sortedCategories = Array.from(categories).sort();

    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
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

// 공유 버튼 이벤트 설정
function setupShareButtons() {
    document.getElementById('downloadBtn').addEventListener('click', downloadQuoteImage);
    document.getElementById('copyBtn').addEventListener('click', copyQuoteToClipboard);
    document.getElementById('twitterBtn').addEventListener('click', shareQuoteToTwitter);
}

// Canvas에 명언 이미지 생성
function generateQuoteImage() {
    if (!currentQuote) return null;

    const canvas = document.getElementById('quoteCanvas');
    const ctx = canvas.getContext('2d');

    // Canvas 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 반투명 오버레이
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 명언 텍스트
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 텍스트 줄바꿈 처리
    const maxWidth = canvas.width - 200;
    const lineHeight = 70;
    const words = currentQuote.quote.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);

    // 명언 텍스트 그리기 (중앙)
    const startY = (canvas.height - lines.length * lineHeight) / 2;
    lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });

    // 작가명
    ctx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`- ${currentQuote.author}`, canvas.width / 2, canvas.height - 120);

    // 카테고리
    if (currentQuote.category) {
        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(currentQuote.category.toUpperCase(), canvas.width / 2, canvas.height - 70);
    }

    return canvas;
}

// PNG 다운로드
async function downloadQuoteImage() {
    const button = document.getElementById('downloadBtn');
    button.classList.add('loading');

    try {
        const canvas = generateQuoteImage();
        if (!canvas) {
            showMessage('명언을 먼저 선택해주세요.', 'error');
            return;
        }

        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `quote_${new Date().getTime()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);

            showMessage('이미지가 다운로드되었습니다!', 'success');
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('다운로드 실패:', error);
        showMessage('다운로드에 실패했습니다.', 'error');
    } finally {
        setTimeout(() => {
            button.classList.remove('loading');
        }, 500);
    }
}

// 클립보드 복사
async function copyQuoteToClipboard() {
    const button = document.getElementById('copyBtn');
    button.classList.add('loading');

    try {
        const canvas = generateQuoteImage();
        if (!canvas) {
            showMessage('명언을 먼저 선택해주세요.', 'error');
            button.classList.remove('loading');
            return;
        }

        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                showMessage('이미지가 클립보드에 복사되었습니다!', 'success');
            } catch (error) {
                console.error('클립보드 복사 실패:', error);
                showMessage('클립보드 복사에 실패했습니다. HTTPS 환경에서만 작동합니다.', 'error');
            } finally {
                button.classList.remove('loading');
            }
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Blob 변환 실패:', error);
        showMessage('이미지 복사에 실패했습니다.', 'error');
        button.classList.remove('loading');
    }
}

// Twitter 공유
async function shareQuoteToTwitter() {
    const button = document.getElementById('twitterBtn');
    button.classList.add('loading');

    try {
        const canvas = generateQuoteImage();
        if (!canvas) {
            showMessage('명언을 먼저 선택해주세요.', 'error');
            button.classList.remove('loading');
            return;
        }

        // 먼저 클립보드에 복사
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);

                // Twitter 공유 URL 생성
                const text = `"${currentQuote.quote}" - ${currentQuote.author}`;
                const hashtags = '오늘의명언,명언,Quotes';
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;

                // 새 창으로 Twitter 열기
                window.open(url, '_blank', 'width=550,height=420');

                // 사용자에게 안내
                setTimeout(() => {
                    showMessage('이미지가 클립보드에 복사되었습니다.\nTwitter에서 트윗에 붙여넣기 하세요! (Ctrl+V 또는 Cmd+V)', 'success');
                }, 500);
            } catch (error) {
                console.error('클립보드 복사 실패:', error);
                showMessage('클립보드 복사에 실패했습니다. HTTPS 환경에서만 작동합니다.', 'error');
            } finally {
                button.classList.remove('loading');
            }
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('Twitter 공유 실패:', error);
        showMessage('Twitter 공유에 실패했습니다.', 'error');
        button.classList.remove('loading');
    }
}

// 메시지 표시
function showMessage(message, type = 'success') {
    const container = document.getElementById('messageContainer');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    container.appendChild(messageDiv);

    // 3초 후 제거
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// 앱 시작
init();
