// 날씨 데이터 설정 파일
const WEATHER_DATA = {
    seoul: {
        city: '뉴욕',
        temperature: 23, // 숫자로 저장 (단위 변환 용이)
        description: '맑음',
        icon: '☀️',
        humidity: 65,
        windSpeed: 12, // km/h
        pressure: 1013 // hPa
    },
    busan: {
        city: '부산',
        temperature: 26,
        description: '구름 많음',
        icon: '⛅',
        humidity: 72,
        windSpeed: 15,
        pressure: 1010
    },
    daegu: {
        city: '대구',
        temperature: 25,
        description: '흐림',
        icon: '☁️',
        humidity: 58,
        windSpeed: 8,
        pressure: 1015
    },
    incheon: {
        city: '인천',
        temperature: 21,
        description: '비',
        icon: '🌧️',
        humidity: 85,
        windSpeed: 18,
        pressure: 1008
    }
};

// 날씨 아이콘 매핑 (필요시 확장)
const WEATHER_ICONS = {
    sunny: '☀️',
    cloudy: '☁️',
    partlyCloudy: '⛅',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
    foggy: '🌫️',
    windy: '💨'
};

// 날씨 상태 한글 매핑
const WEATHER_DESCRIPTIONS = {
    sunny: '맑음',
    cloudy: '흐림',
    partlyCloudy: '구름 많음',
    rainy: '비',
    snowy: '눈',
    stormy: '폭풍',
    foggy: '안개',
    windy: '바람 많음'
};