import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { WeatherData } from './types/weather';
import { getWeatherData } from './services/weatherService';
import './App.css';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const weatherData = await getWeatherData(city);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '날씨 정보를 불러올 수 없습니다.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ 날씨 앱</h1>
        <p>도시명을 검색해서 날씨를 확인하세요</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>날씨 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <p>사용 가능한 도시: 서울, 부산, 제주도, 대구, 인천, 광주</p>
          </div>
        )}

        {weather && !loading && (
          <WeatherCard weather={weather} />
        )}

        {!weather && !loading && !error && (
          <div className="welcome">
            <p>👋 환영합니다!</p>
            <p>위에서 도시명을 검색해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
