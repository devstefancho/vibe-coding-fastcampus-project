// 아이콘 경로 (chrome.runtime.getURL로 절대 경로 생성)
const ICONS = {
  active: {
    16: chrome.runtime.getURL('icons/icon-active-16.png'),
    48: chrome.runtime.getURL('icons/icon-active-48.png'),
    128: chrome.runtime.getURL('icons/icon-active-128.png')
  },
  inactive: {
    16: chrome.runtime.getURL('icons/icon-inactive-16.png'),
    48: chrome.runtime.getURL('icons/icon-inactive-48.png'),
    128: chrome.runtime.getURL('icons/icon-inactive-128.png')
  }
};

// 디바운스 타이머
let storageUpdateTimeout = null;

console.log('[ScrollSaver] 아이콘 경로 초기화 완료:', ICONS);

// 특수 페이지 체크
function isSpecialPage(url) {
  if (!url) return true;
  return url.startsWith('chrome://') ||
         url.startsWith('edge://') ||
         url.startsWith('about:') ||
         url.startsWith('chrome-extension://');
}

// 아이콘 상태 업데이트 (재시도 로직 포함)
async function updateIcon(tabId, url, retryCount = 0) {
  // 특수 페이지는 스킵
  if (isSpecialPage(url)) {
    console.log('[ScrollSaver] 특수 페이지 스킵:', url);
    return false;
  }

  const maxRetries = 3;

  try {
    const result = await chrome.storage.local.get(url);
    const isSaved = !!result[url];

    const iconPath = isSaved ? ICONS.active : ICONS.inactive;
    const oppositeIconPath = isSaved ? ICONS.inactive : ICONS.active;

    // 캐시 무효화: 반대 아이콘으로 짧게 전환 후 원하는 아이콘으로 변경
    try {
      await chrome.action.setIcon({
        tabId: tabId,
        path: oppositeIconPath
      });

      // 짧은 지연
      await new Promise(resolve => setTimeout(resolve, 10));

      await chrome.action.setIcon({
        tabId: tabId,
        path: iconPath
      });
    } catch (error) {
      // 캐시 무효화 실패 시 직접 설정 시도
      await chrome.action.setIcon({
        tabId: tabId,
        path: iconPath
      });
    }

    console.log(`[ScrollSaver] ✓ 아이콘 변경 성공: ${url.substring(0, 50)}... → ${isSaved ? 'ACTIVE (파란색)' : 'INACTIVE (회색)'}`);
    return true;
  } catch (error) {
    // "Failed to fetch" 에러는 일반적으로 무시 가능 (Service Worker 버그)
    if (error.message && error.message.includes('Failed to fetch')) {
      console.warn(`[ScrollSaver] ⚠ 아이콘 fetch 경고 (시도 ${retryCount + 1}/${maxRetries}): ${error.message}`);

      // 재시도
      if (retryCount < maxRetries - 1) {
        const delay = 100 * (retryCount + 1); // 지수 백오프: 100ms, 200ms, 300ms
        console.log(`[ScrollSaver] ${delay}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return updateIcon(tabId, url, retryCount + 1);
      }

      // 최대 재시도 후에도 실패하면 경고만 하고 true 반환 (에러 무시)
      console.warn(`[ScrollSaver] 아이콘 변경 실패했으나 무시하고 계속 진행`);
      return true;
    }

    // 다른 종류의 에러는 실패로 처리
    console.error(`[ScrollSaver] ✗ 아이콘 변경 실패 (시도 ${retryCount + 1}/${maxRetries}):`, error.message);

    // 재시도
    if (retryCount < maxRetries - 1) {
      const delay = 100 * (retryCount + 1);
      console.log(`[ScrollSaver] ${delay}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return updateIcon(tabId, url, retryCount + 1);
    }

    return false;
  }
}

// 모든 탭의 아이콘 업데이트
async function updateAllTabIcons() {
  try {
    console.log('[ScrollSaver] 모든 탭의 아이콘 업데이트 시작');
    const tabs = await chrome.tabs.query({});

    // 현재 활성 탭을 먼저 찾기
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTabId = activeTabs[0]?.id;

    let successCount = 0;
    let failCount = 0;

    // 현재 활성 탭을 먼저 업데이트 (우선순위)
    if (activeTabId) {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab && activeTab.url && !isSpecialPage(activeTab.url)) {
        console.log('[ScrollSaver] 활성 탭 우선 업데이트 시작');
        const success = await updateIcon(activeTab.id, activeTab.url);
        if (success) successCount++;
        else failCount++;
      }
    }

    // 나머지 탭들 업데이트
    for (const tab of tabs) {
      if (tab.id !== activeTabId && tab.url && !isSpecialPage(tab.url)) {
        const success = await updateIcon(tab.id, tab.url);
        if (success) successCount++;
        else failCount++;
      }
    }

    console.log(`[ScrollSaver] 모든 탭 업데이트 완료 (성공: ${successCount}, 실패: ${failCount})`);
  } catch (error) {
    console.error('[ScrollSaver] 전체 아이콘 업데이트 실패:', error);
  }
}

// 탭 활성화 시
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      await updateIcon(tab.id, tab.url);
    }
  } catch (error) {
    console.log('Background: 탭 활성화 처리 실패:', error.message);
  }
});

// 탭 업데이트 시 (페이지 로드)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 페이지 로딩이 완료되었을 때만 처리
  if (changeInfo.status === 'complete' && tab.url) {
    await updateIcon(tabId, tab.url);
  }
});

// Storage 변경 감지 (디바운스 적용)
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'local') {
    const changedUrls = Object.keys(changes);
    console.log(`[ScrollSaver] Storage 변경 감지 (${changedUrls.length}개 URL)`);

    // 디바운스: 100ms 내에 연속된 변경이 있으면 마지막 것만 처리
    clearTimeout(storageUpdateTimeout);
    storageUpdateTimeout = setTimeout(async () => {
      console.log('[ScrollSaver] 디바운스 완료, 아이콘 업데이트 시작');
      await updateAllTabIcons();
    }, 100);
  }
});

// 메시지 리스너 (팝업에서의 요청)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateIcon') {
    console.log('[ScrollSaver] popup에서 아이콘 업데이트 요청 받음');
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        const success = await updateIcon(tabs[0].id, request.url || tabs[0].url);
        sendResponse({ success });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // 비동기 응답을 위해 true 반환
  }
});

// 확장프로그램 설치/업데이트 시
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[ScrollSaver] 확장프로그램 설치/업데이트됨');

  if (details.reason === 'install') {
    console.log('[ScrollSaver] 첫 설치 - 초기화 완료');
  } else if (details.reason === 'update') {
    console.log('[ScrollSaver] 업데이트됨');
  }

  // 모든 탭의 아이콘 업데이트
  await updateAllTabIcons();
});

console.log('[ScrollSaver] Background script 로드 완료 ✓');
