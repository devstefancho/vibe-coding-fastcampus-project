// 현재 페이지 URL
const currentUrl = window.location.href;

// 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 스크롤 위치 복원
async function restoreScrollPosition() {
  try {
    const result = await chrome.storage.local.get(currentUrl);
    const pageData = result[currentUrl];

    if (pageData && pageData.scrollY) {
      const targetScrollY = pageData.scrollY;

      // 여러 번 시도하여 정확한 위치로 스크롤
      // (이미지 로딩 등을 고려)
      const attempts = [0, 100, 300, 500, 1000, 2000];

      attempts.forEach(delay => {
        setTimeout(() => {
          window.scrollTo({
            top: targetScrollY,
            behavior: delay === 0 ? 'auto' : 'smooth'
          });
        }, delay);
      });

      console.log(`ScrollSaver: 스크롤 위치 복원 (${targetScrollY}px)`);
    }
  } catch (error) {
    console.error('ScrollSaver: 스크롤 위치 복원 실패:', error);
  }
}

// 스크롤 위치 저장
async function saveScrollPosition() {
  try {
    const result = await chrome.storage.local.get(currentUrl);
    const pageData = result[currentUrl];

    // 저장된 페이지인 경우에만 스크롤 위치 업데이트
    if (pageData) {
      const currentScrollY = window.scrollY || window.pageYOffset;

      pageData.scrollY = currentScrollY;
      pageData.updatedAt = new Date().toISOString();

      await chrome.storage.local.set({ [currentUrl]: pageData });
      console.log(`ScrollSaver: 스크롤 위치 저장 (${currentScrollY}px)`);
    }
  } catch (error) {
    console.error('ScrollSaver: 스크롤 위치 저장 실패:', error);
  }
}

// 디바운스된 스크롤 저장 함수 (500ms)
const debouncedSaveScroll = debounce(saveScrollPosition, 500);

// 스크롤 이벤트 리스너
window.addEventListener('scroll', debouncedSaveScroll);

// 메시지 리스너 (팝업에서의 요청 처리)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getScrollPosition') {
    const scrollY = window.scrollY || window.pageYOffset;
    sendResponse({ scrollY: scrollY });
    return true;
  }

  if (request.action === 'restoreScroll') {
    restoreScrollPosition();
    sendResponse({ success: true });
    return true;
  }
});

// Storage 변경 감지 (다른 탭에서의 업데이트)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[currentUrl]) {
    const change = changes[currentUrl];

    // 페이지가 새로 저장되거나 스크롤 위치가 업데이트된 경우
    if (change.newValue && change.newValue.scrollY !== undefined) {
      console.log('ScrollSaver: 다른 탭에서 스크롤 위치 업데이트됨');
    }

    // 페이지가 삭제된 경우
    if (!change.newValue && change.oldValue) {
      console.log('ScrollSaver: 페이지가 저장 목록에서 제거됨');
    }
  }
});

// 페이지 로드 완료 후 스크롤 위치 복원
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', restoreScrollPosition);
} else {
  restoreScrollPosition();
}

console.log('ScrollSaver: Content script 로드됨');
