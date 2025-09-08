import React from 'react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="city-name">{weather.city}</h2>
        <div className="weather-icon">{weather.icon}</div>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{weather.temperature}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-description">{weather.description}</div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">습도</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">바람</span>
          <span className="detail-value">{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;