export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
  posterUrl: string;
  mbtiTypes: MBTIType[];
}

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIQuestion {
  id: number;
  question: string;
  optionA: {
    text: string;
    trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
  optionB: {
    text: string;
    trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
}

export interface MBTIResult {
  type: MBTIType;
  description: string;
  characteristics: string[];
  preferredGenres: string[];
}

export interface QuizAnswer {
  questionId: number;
  selectedTrait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

// TMDB API 타입 정의
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: TMDBGenre[];
  production_countries: TMDBProductionCountry[];
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovieResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBSearchResponse extends TMDBMovieResponse {}

export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
}