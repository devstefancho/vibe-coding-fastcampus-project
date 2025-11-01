// DOM 요소
const elements = {
  statusIndicator: document.getElementById('statusIndicator'),
  statusText: document.getElementById('statusText'),
  pageTitle: document.getElementById('pageTitle'),
  memoInput: document.getElementById('memoInput'),
  charCount: document.getElementById('charCount'),
  saveBtn: document.getElementById('saveBtn'),
  deleteBtn: document.getElementById('deleteBtn'),
  searchInput: document.getElementById('searchInput'),
  pageList: document.getElementById('pageList'),
  emptyState: document.getElementById('emptyState'),
  pageCount: document.getElementById('pageCount'),
  currentPageSection: document.getElementById('currentPageSection')
};

// 현재 탭 정보
let currentTab = null;
let currentUrl = null;
let allPages = {};

// 초기화
async function init() {
  try {
    // 현재 탭 가져오기
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    currentUrl = tab.url;

    // 특수 페이지 체크
    if (isSpecialPage(currentUrl)) {
      showSpecialPageWarning();
      return;
    }

    // 페이지 정보 표시
    elements.pageTitle.textContent = tab.title || 'Untitled';

    // 저장된 데이터 로드
    await loadSavedData();

    // 이벤트 리스너 등록
    setupEventListeners();

    // 현재 페이지 저장 여부 확인
    await checkCurrentPageStatus();

  } catch (error) {
    console.error('초기화 실패:', error);
    elements.statusText.textContent = '오류 발생';
  }
}

// 특수 페이지 체크
function isSpecialPage(url) {
  return url.startsWith('chrome://') ||
         url.startsWith('edge://') ||
         url.startsWith('about:') ||
         url.startsWith('chrome-extension://');
}

// 특수 페이지 경고 표시
function showSpecialPageWarning() {
  elements.currentPageSection.innerHTML = `
    <div class="special-page-warning">
      <h3>사용할 수 없는 페이지</h3>
      <p>브라우저 내부 페이지에서는<br>ScrollSaver를 사용할 수 없습니다.</p>
    </div>
  `;
  elements.statusText.textContent = '사용 불가';
}

// 저장된 데이터 로드
async function loadSavedData() {
  const result = await chrome.storage.local.get(null);
  allPages = result || {};
  renderPageList();
  updatePageCount();
}

// 현재 페이지 상태 확인
async function checkCurrentPageStatus() {
  const savedPage = allPages[currentUrl];

  if (savedPage) {
    // 저장된 페이지
    elements.statusIndicator.classList.add('saved');
    elements.statusText.textContent = '저장됨';
    elements.memoInput.value = savedPage.memo || '';
    updateCharCount();
    elements.deleteBtn.style.display = 'block';
  } else {
    // 저장되지 않은 페이지
    elements.statusIndicator.classList.remove('saved');
    elements.statusText.textContent = '미저장';
    elements.memoInput.value = '';
    updateCharCount();
    elements.deleteBtn.style.display = 'none';
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 메모 입력 시 글자 수 업데이트
  elements.memoInput.addEventListener('input', updateCharCount);

  // 저장 버튼
  elements.saveBtn.addEventListener('click', savePage);

  // 삭제 버튼
  elements.deleteBtn.addEventListener('click', deletePage);

  // 검색
  elements.searchInput.addEventListener('input', handleSearch);
}

// 글자 수 업데이트
function updateCharCount() {
  const count = elements.memoInput.value.length;
  elements.charCount.textContent = count;

  const charCountElement = elements.charCount.parentElement;
  if (count >= 100) {
    charCountElement.classList.add('warning');
    // 100자 초과 시 입력 차단
    if (count > 100) {
      elements.memoInput.value = elements.memoInput.value.substring(0, 100);
      elements.charCount.textContent = '100';
    }
  } else {
    charCountElement.classList.remove('warning');
  }
}

// 페이지 저장
async function savePage() {
  try {
    // 현재 스크롤 위치 가져오기
    let scrollY = 0;
    try {
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'getScrollPosition'
      });
      scrollY = response?.scrollY || 0;
    } catch (error) {
      console.log('스크롤 위치를 가져올 수 없습니다:', error);
    }

    const memo = elements.memoInput.value.trim();
    const now = new Date().toISOString();

    const pageData = {
      url: currentUrl,
      title: currentTab.title,
      memo: memo,
      scrollY: scrollY,
      createdAt: allPages[currentUrl]?.createdAt || now,
      updatedAt: now
    };

    // Storage에 저장
    await chrome.storage.local.set({ [currentUrl]: pageData });

    // 메모리 업데이트
    allPages[currentUrl] = pageData;

    // UI 업데이트
    await checkCurrentPageStatus();
    renderPageList();
    updatePageCount();

    // 버튼 피드백
    showButtonFeedback(elements.saveBtn, '저장됨!');

    // Background에 상태 변경 알림 (Storage 동기화를 위한 지연)
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: 'updateIcon', url: currentUrl }, (response) => {
        if (response && response.success) {
          console.log('아이콘 업데이트 성공');
        } else {
          console.log('아이콘 업데이트 실패 또는 응답 없음');
        }
      });
    }, 150);

  } catch (error) {
    console.error('저장 실패:', error);
    showButtonFeedback(elements.saveBtn, '실패', true);
  }
}

// 페이지 삭제
async function deletePage() {
  try {
    // Storage에서 삭제
    await chrome.storage.local.remove(currentUrl);

    // 메모리에서 삭제
    delete allPages[currentUrl];

    // UI 업데이트
    await checkCurrentPageStatus();
    renderPageList();
    updatePageCount();

    // 버튼 피드백
    showButtonFeedback(elements.deleteBtn, '삭제됨!');

    // Background에 상태 변경 알림 (Storage 동기화를 위한 지연)
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: 'updateIcon', url: currentUrl }, (response) => {
        if (response && response.success) {
          console.log('아이콘 업데이트 성공');
        } else {
          console.log('아이콘 업데이트 실패 또는 응답 없음');
        }
      });
    }, 150);

  } catch (error) {
    console.error('삭제 실패:', error);
    showButtonFeedback(elements.deleteBtn, '실패', true);
  }
}

// 버튼 피드백
function showButtonFeedback(button, text, isError = false) {
  const originalText = button.textContent;
  button.textContent = text;
  button.style.opacity = '0.7';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.opacity = '1';
  }, 1000);
}

// 페이지 목록 렌더링
function renderPageList(searchTerm = '') {
  const pageEntries = Object.entries(allPages);

  // 검색 필터링
  const filteredPages = pageEntries.filter(([url, page]) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return page.title.toLowerCase().includes(term) ||
           (page.memo && page.memo.toLowerCase().includes(term));
  });

  // 최근 수정순 정렬
  filteredPages.sort((a, b) => {
    return new Date(b[1].updatedAt) - new Date(a[1].updatedAt);
  });

  // 목록이 비어있으면 empty state 표시
  if (filteredPages.length === 0) {
    elements.emptyState.style.display = 'block';
    elements.emptyState.textContent = searchTerm
      ? '검색 결과가 없습니다.'
      : '저장된 페이지가 없습니다.';
    elements.pageList.innerHTML = '';
    elements.pageList.appendChild(elements.emptyState);
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.pageList.innerHTML = '';

  // 각 페이지 아이템 생성
  filteredPages.forEach(([url, page]) => {
    const item = createPageItem(url, page);
    elements.pageList.appendChild(item);
  });
}

// 페이지 아이템 생성
function createPageItem(url, page) {
  const item = document.createElement('div');
  item.className = 'page-item';

  const formattedDate = formatDate(page.updatedAt);
  const memoPreview = page.memo ? page.memo : '메모 없음';

  item.innerHTML = `
    <div class="page-item-header">
      <div class="page-item-title" title="${page.title}">${page.title}</div>
      <button class="page-item-delete" data-url="${url}">삭제</button>
    </div>
    <div class="page-item-memo">${memoPreview}</div>
    <div class="page-item-date">${formattedDate}</div>
  `;

  // 페이지로 이동
  item.addEventListener('click', (e) => {
    if (!e.target.classList.contains('page-item-delete')) {
      chrome.tabs.create({ url: url });
    }
  });

  // 삭제 버튼
  const deleteBtn = item.querySelector('.page-item-delete');
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const urlToDelete = e.target.dataset.url;

    try {
      await chrome.storage.local.remove(urlToDelete);
      delete allPages[urlToDelete];

      renderPageList(elements.searchInput.value);
      updatePageCount();

      // 현재 페이지를 삭제한 경우
      if (urlToDelete === currentUrl) {
        await checkCurrentPageStatus();
      }

      // Background에 상태 변경 알림 (Storage 동기화를 위한 지연)
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'updateIcon', url: urlToDelete }, (response) => {
          if (response && response.success) {
            console.log('아이콘 업데이트 성공');
          } else {
            console.log('아이콘 업데이트 실패 또는 응답 없음');
          }
        });
      }, 150);

    } catch (error) {
      console.error('삭제 실패:', error);
    }
  });

  return item;
}

// 날짜 포맷
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 검색 처리
function handleSearch() {
  const searchTerm = elements.searchInput.value.trim();
  renderPageList(searchTerm);
}

// 페이지 수 업데이트
function updatePageCount() {
  const count = Object.keys(allPages).length;
  elements.pageCount.textContent = `총 ${count}개의 페이지 저장됨`;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
