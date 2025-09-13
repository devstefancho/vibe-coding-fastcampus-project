// 메인 JavaScript 로직
class WeatherApp {
    constructor() {
        this.currentCity = APP_CONFIG.defaultCity;
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }

    // DOM 요소 초기화
    initializeElements() {
        this.elements = {
            cityButtons: document.querySelectorAll('.city-btn'),
            currentCity: document.getElementById('currentCity'),
            weatherIcon: document.getElementById('weatherIcon'),
            temperature: document.getElementById('temperature'),
            weatherDesc: document.getElementById('weatherDesc'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure'),
            lastUpdated: document.getElementById('lastUpdated')
        };
    }

    // 이벤트 바인딩
    bindEvents() {
        this.elements.cityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCityChange(e.target);
            });
        });
    }

    // 도시 변경 처리
    handleCityChange(button) {
        // 활성 버튼 상태 변경
        this.updateActiveButton(button);

        // 날씨 정보 업데이트
        const cityKey = button.getAttribute('data-city');
        this.updateWeather(cityKey);
    }

    // 활성 버튼 상태 업데이트
    updateActiveButton(activeButton) {
        this.elements.cityButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    // 날씨 정보 업데이트
    updateWeather(cityKey) {
        const data = WEATHER_DATA[cityKey];
        if (!data) return;

        this.currentCity = cityKey;

        // 데이터 형식화
        const formattedData = this.formatWeatherData(data);

        // UI 업데이트
        this.elements.currentCity.textContent = formattedData.city;
        this.elements.weatherIcon.textContent = formattedData.icon;
        this.elements.temperature.textContent = formattedData.temperature;
        this.elements.weatherDesc.textContent = formattedData.description;
        this.elements.humidity.textContent = formattedData.humidity;
        this.elements.windSpeed.textContent = formattedData.windSpeed;
        this.elements.pressure.textContent = formattedData.pressure;

        // 업데이트 시간 갱신
        this.updateLastUpdatedTime();
    }

    // 날씨 데이터 형식화
    formatWeatherData(data) {
        const config = APP_CONFIG.units;

        return {
            city: data.city,
            icon: data.icon,
            temperature: this.formatTemperature(data.temperature, config.temperature),
            description: data.description,
            humidity: `${data.humidity}%`,
            windSpeed: this.formatWindSpeed(data.windSpeed, config.windSpeed),
            pressure: this.formatPressure(data.pressure, config.pressure)
        };
    }

    // 온도 형식화
    formatTemperature(temp, unit) {
        if (unit === 'fahrenheit') {
            return `${Math.round(temp * 9/5 + 32)}°F`;
        }
        return `${temp}°C`;
    }

    // 풍속 형식화
    formatWindSpeed(speed, unit) {
        if (unit === 'mph') {
            return `${Math.round(speed * 0.621371)}mph`;
        }
        return `${speed}km/h`;
    }

    // 기압 형식화
    formatPressure(pressure, unit) {
        if (unit === 'inHg') {
            return `${(pressure * 0.02953).toFixed(2)}inHg`;
        }
        return `${pressure}hPa`;
    }

    // 마지막 업데이트 시간 갱신
    updateLastUpdatedTime() {
        if (!APP_CONFIG.ui.showLastUpdated) return;

        const now = new Date();
        const lang = APP_CONFIG.language;

        const updateTime = `${now.getFullYear()}${lang.dateFormat.year} ${now.getMonth() + 1}${lang.dateFormat.month} ${now.getDate()}${lang.dateFormat.day} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        this.elements.lastUpdated.textContent = `${lang.labels.lastUpdated}: ${updateTime}`;
    }

    // 초기 데이터 로드
    loadInitialData() {
        this.updateWeather(this.currentCity);
    }

    // 새로운 도시 추가 (동적)
    addCity(cityKey, cityData) {
        WEATHER_DATA[cityKey] = cityData;
        // 필요시 UI에 버튼도 동적으로 추가 가능
    }

    // 날씨 데이터 업데이트 (동적)
    updateCityData(cityKey, newData) {
        if (WEATHER_DATA[cityKey]) {
            Object.assign(WEATHER_DATA[cityKey], newData);

            // 현재 선택된 도시라면 UI 업데이트
            if (this.currentCity === cityKey) {
                this.updateWeather(cityKey);
            }
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});