import {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBMovieResponse,
  TMDBSearchResponse,
  TMDBGenre,
  TMDBConfiguration
} from '@/types';

class TMDBClient {
  private apiKey: string;
  private baseUrl: string;
  private imageBaseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
    this.imageBaseUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

    if (!this.apiKey) {
      console.warn('TMDB API key is not set. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file');
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('language', 'ko-KR'); // 한국어 우선

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB API request failed:', error);
      throw error;
    }
  }

  // 인기 영화 목록
  async getPopularMovies(page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/movie/popular', {
      page: page.toString()
    });
  }

  // 최신 영화 목록
  async getNowPlayingMovies(page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/movie/now_playing', {
      page: page.toString()
    });
  }

  // 최고 평점 영화 목록
  async getTopRatedMovies(page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/movie/top_rated', {
      page: page.toString()
    });
  }

  // 개봉 예정 영화 목록
  async getUpcomingMovies(page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/movie/upcoming', {
      page: page.toString()
    });
  }

  // 영화 검색
  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    return this.request<TMDBSearchResponse>('/search/movie', {
      query: encodeURIComponent(query),
      page: page.toString()
    });
  }

  // 영화 상세 정보
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetail> {
    return this.request<TMDBMovieDetail>(`/movie/${movieId}`);
  }

  // 장르 목록
  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.request<{ genres: TMDBGenre[] }>('/genre/movie/list');
  }

  // 장르별 영화 검색
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc'
    });
  }

  // 이미지 URL 생성 헬퍼
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg'; // 기본 이미지
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  // 백드롭 이미지 URL 생성
  getBackdropUrl(path: string | null, size: string = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  // API 설정 정보
  async getConfiguration(): Promise<TMDBConfiguration> {
    return this.request<TMDBConfiguration>('/configuration');
  }

  // 한국 영화 검색 (한국어 또는 한국 제작)
  async getKoreanMovies(page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/discover/movie', {
      with_original_language: 'ko',
      page: page.toString(),
      sort_by: 'popularity.desc'
    });
  }

  // 년도별 영화 검색
  async getMoviesByYear(year: number, page: number = 1): Promise<TMDBMovieResponse> {
    return this.request<TMDBMovieResponse>('/discover/movie', {
      primary_release_year: year.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc'
    });
  }
}

// 싱글톤 인스턴스 생성
const tmdbClient = new TMDBClient();

export default tmdbClient;