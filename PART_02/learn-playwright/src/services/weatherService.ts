import { WeatherData } from '../types/weather';

const mockWeatherData: Record<string, WeatherData> = {
  '서울': {
    city: '서울',
    temperature: 22,
    humidity: 65,
    description: '맑음',
    icon: '☀️',
    windSpeed: 3.2
  },
  '부산': {
    city: '부산',
    temperature: 25,
    humidity: 70,
    description: '구름많음',
    icon: '⛅',
    windSpeed: 4.5
  },
  '제주도': {
    city: '제주도',
    temperature: 24,
    humidity: 80,
    description: '소나기',
    icon: '🌦️',
    windSpeed: 6.1
  },
  '대구': {
    city: '대구',
    temperature: 28,
    humidity: 55,
    description: '맑음',
    icon: '☀️',
    windSpeed: 2.8
  },
  '인천': {
    city: '인천',
    temperature: 20,
    humidity: 75,
    description: '흐림',
    icon: '☁️',
    windSpeed: 5.2
  },
  '광주': {
    city: '광주',
    temperature: 26,
    humidity: 60,
    description: '맑음',
    icon: '☀️',
    windSpeed: 3.7
  }
};

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const weatherData = mockWeatherData[city];
      if (weatherData) {
        resolve(weatherData);
      } else {
        reject(new Error(`${city}의 날씨 정보를 찾을 수 없습니다.`));
      }
    }, 1000);
  });
};

export const getAvailableCities = (): string[] => {
  return Object.keys(mockWeatherData);
};