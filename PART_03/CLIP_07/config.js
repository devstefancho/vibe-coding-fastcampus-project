// 앱 설정 파일
const APP_CONFIG = {
    // 기본 설정
    defaultCity: 'seoul',

    // 지원 도시 목록
    cities: [
        { key: 'seoul', name: '서울', displayName: '서울' },
        { key: 'busan', name: '부산', displayName: '부산' },
        { key: 'daegu', name: '대구', displayName: '대구' },
        { key: 'incheon', name: '인천', displayName: '인천' }
    ],

    // 언어 설정
    language: {
        title: '날씨 정보',
        labels: {
            humidity: '습도',
            windSpeed: '풍속',
            pressure: '기압',
            lastUpdated: '마지막 업데이트'
        },
        dateFormat: {
            year: '년',
            month: '월',
            day: '일'
        }
    },

    // 단위 설정
    units: {
        temperature: 'celsius', // celsius 또는 fahrenheit
        windSpeed: 'kmh', // kmh 또는 mph
        pressure: 'hPa' // hPa 또는 inHg
    },

    // UI 설정
    ui: {
        autoRefresh: false, // 자동 새로고침 (현재 미구현)
        showLastUpdated: true, // 마지막 업데이트 시간 표시
        animationDuration: 300 // 애니메이션 지속 시간 (ms)
    }
};