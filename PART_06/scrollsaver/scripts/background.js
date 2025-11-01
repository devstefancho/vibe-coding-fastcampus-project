// 아이콘 경로
const ICONS = {
  active: {
    16: 'icons/icon-active-16.png',
    48: 'icons/icon-active-48.png',
    128: 'icons/icon-active-128.png'
  },
  inactive: {
    16: 'icons/icon-inactive-16.png',
    48: 'icons/icon-inactive-48.png',
    128: 'icons/icon-inactive-128.png'
  }
};

// 특수 페이지 체크
function isSpecialPage(url) {
  if (!url) return true;
  return url.startsWith('chrome://') ||
         url.startsWith('edge://') ||
         url.startsWith('about:') ||
         url.startsWith('chrome-extension://');
}

// 아이콘 상태 업데이트
async function updateIcon(tabId, url) {
  // 특수 페이지는 스킵
  if (isSpecialPage(url)) {
    console.log('Background: 특수 페이지는 아이콘 업데이트 스킵:', url);
    return;
  }

  try {
    const result = await chrome.storage.local.get(url);
    const isSaved = !!result[url];

    const iconPath = isSaved ? ICONS.active : ICONS.inactive;

    await chrome.action.setIcon({
      tabId: tabId,
      path: iconPath
    });

    console.log(`Background: 아이콘 업데이트 - ${url} (${isSaved ? '저장됨' : '미저장'})`);
  } catch (error) {
    // 에러 무시 (특수 페이지 등에서 발생 가능)
    console.log('Background: 아이콘 설정 실패 (정상 동작):', error.message);
  }
}

// 모든 탭의 아이콘 업데이트
async function updateAllTabIcons() {
  try {
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      if (tab.url && !isSpecialPage(tab.url)) {
        await updateIcon(tab.id, tab.url);
      }
    }

    console.log('Background: 모든 탭의 아이콘 업데이트 완료');
  } catch (error) {
    console.error('Background: 전체 아이콘 업데이트 실패:', error);
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

// Storage 변경 감지
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'local') {
    console.log('Background: Storage 변경 감지, 아이콘 업데이트');
    await updateAllTabIcons();
  }
});

// 메시지 리스너 (팝업에서의 요청)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateIcon') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        await updateIcon(tabs[0].id, request.url || tabs[0].url);
        sendResponse({ success: true });
      }
    });
    return true; // 비동기 응답을 위해 true 반환
  }
});

// 확장프로그램 설치/업데이트 시
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Background: ScrollSaver 설치/업데이트됨');

  if (details.reason === 'install') {
    console.log('Background: 첫 설치 - 초기화 완료');
  } else if (details.reason === 'update') {
    console.log('Background: 업데이트됨');
  }

  // 모든 탭의 아이콘 업데이트
  await updateAllTabIcons();
});

console.log('Background: ScrollSaver background script 로드됨');
