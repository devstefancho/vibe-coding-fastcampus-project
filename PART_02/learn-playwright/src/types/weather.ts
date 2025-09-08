export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface WeatherState {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}