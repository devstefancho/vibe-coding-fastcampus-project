import { MBTIType } from '@/types';

export interface DBMovie {
  id: string;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  year?: number;
  runtime?: number;
  voteCount?: number;
  popularity?: number;
  genres: string[];
  mbtiTypes: MBTIType[];
  releaseDate?: Date;
  tagline?: string;
  homepage?: string;
  status?: string;
  budget?: number;
  revenue?: number;
}

export interface MovieResponse {
  movies: DBMovie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MBTIMovieResponse extends MovieResponse {
  mbtiType: MBTIType;
}

export interface SearchMovieResponse extends MovieResponse {
  query: string;
}

/**
 * MBTI 유형별 추천 영화 조회
 */
export async function getRecommendedMoviesByMBTI(
  mbtiType: MBTIType,
  page: number = 1,
  limit: number = 20
): Promise<DBMovie[]> {
  try {
    const response = await fetch(
      `/api/movies/mbti/${mbtiType}?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 * 60 } } // 1시간 캐시
    );

    if (!response.ok) {
      throw new Error('Failed to fetch MBTI movies');
    }

    const data: MBTIMovieResponse = await response.json();
    return data.movies;
  } catch (error) {
    console.error('Error fetching MBTI movies:', error);
    return [];
  }
}

/**
 * 영화 목록 조회 (페이지네이션, 정렬, 필터링 지원)
 */
export async function getMovies(options: {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: 'popularity' | 'rating' | 'year' | 'title';
  order?: 'asc' | 'desc';
} = {}): Promise<MovieResponse> {
  const {
    page = 1,
    limit = 20,
    genre,
    sort = 'popularity',
    order = 'desc'
  } = options;

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order
    });

    if (genre) {
      params.append('genre', genre);
    }

    const response = await fetch(
      `/api/movies?${params.toString()}`,
      { next: { revalidate: 60 * 5 } } // 5분 캐시
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data: MovieResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      movies: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    };
  }
}

/**
 * 영화 검색
 */
export async function searchMovies(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<SearchMovieResponse> {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(
      `/api/movies/search?${params.toString()}`,
      { next: { revalidate: 60 * 5 } } // 5분 캐시
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data: SearchMovieResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      query,
      movies: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    };
  }
}

/**
 * 영화 상세 정보 조회
 */
export async function getMovieById(id: string): Promise<DBMovie | null> {
  try {
    const response = await fetch(
      `/api/movies/${id}`,
      { next: { revalidate: 60 * 60 } } // 1시간 캐시
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch movie');
    }

    const movie: DBMovie = await response.json();
    return movie;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

/**
 * 인기 영화 조회 (홈페이지용)
 */
export async function getPopularMovies(limit: number = 10): Promise<DBMovie[]> {
  const response = await getMovies({
    limit,
    sort: 'popularity',
    order: 'desc'
  });
  return response.movies;
}

/**
 * 높은 평점 영화 조회
 */
export async function getTopRatedMovies(limit: number = 10): Promise<DBMovie[]> {
  const response = await getMovies({
    limit,
    sort: 'rating',
    order: 'desc'
  });
  return response.movies;
}

/**
 * 최신 영화 조회
 */
export async function getLatestMovies(limit: number = 10): Promise<DBMovie[]> {
  const response = await getMovies({
    limit,
    sort: 'year',
    order: 'desc'
  });
  return response.movies;
}