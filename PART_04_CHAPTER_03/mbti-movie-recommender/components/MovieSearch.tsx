'use client';

import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBGenre } from '@/types';
import tmdbClient from '@/lib/tmdb';
import TMDBMovieCard from './TMDBMovieCard';

interface MovieSearchProps {
  onMovieSelect?: (movie: TMDBMovie) => void;
}

export default function MovieSearch({ onMovieSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // 필터 및 정렬 상태
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const searchMovies = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbClient.discoverMovies({
        query: query.trim() || undefined,
        genreId: selectedGenre || undefined,
        minRating: minRating || undefined,
        sortBy: sortBy,
        page: pageNumber
      });

      // 검색어가 있을 때는 클라이언트 사이드에서 평점 필터링
      let filteredResults = response.results;
      if (query.trim() && minRating) {
        filteredResults = response.results.filter(movie => movie.vote_average >= minRating);
      }

      if (pageNumber === 1) {
        setMovies(filteredResults);
      } else {
        setMovies(prev => [...prev, ...filteredResults]);
      }

      setTotalPages(response.total_pages);
      setPage(pageNumber);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 장르 목록 가져오기
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdbClient.getGenres();
        setGenres(response.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // 디바운스된 검색 및 필터 변경 감지
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() || selectedGenre || minRating || sortBy !== 'popularity.desc') {
        searchMovies(1);
      } else {
        setMovies([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedGenre, minRating, sortBy]);

  const loadMore = () => {
    if (page < totalPages) {
      searchMovies(page + 1);
    }
  };

  const handleMovieClick = (movie: TMDBMovie) => {
    if (onMovieSelect) {
      onMovieSelect(movie);
    } else {
      console.log('영화 선택:', movie.title);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies(1);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedGenre(null);
    setMinRating(null);
    setSortBy('popularity.desc');
    setMovies([]);
    setHasSearched(false);
  };

  const sortOptions = [
    { value: 'popularity.desc', label: '인기순 (높은 순)' },
    { value: 'popularity.asc', label: '인기순 (낮은 순)' },
    { value: 'vote_average.desc', label: '평점순 (높은 순)' },
    { value: 'vote_average.asc', label: '평점순 (낮은 순)' },
    { value: 'release_date.desc', label: '최신순' },
    { value: 'release_date.asc', label: '오래된 순' },
    { value: 'title.asc', label: '제목순 (A-Z)' },
    { value: 'title.desc', label: '제목순 (Z-A)' }
  ];

  const ratingOptions = [
    { value: null, label: '모든 평점' },
    { value: 7, label: '7점 이상' },
    { value: 8, label: '8점 이상' },
    { value: 9, label: '9점 이상' }
  ];

  return (
    <div className="w-full">
      {/* 검색 폼 */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영화 제목을 검색하세요..."
            className="w-full px-4 py-3 pl-10 pr-4 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* 필터 토글 버튼 */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span>{showFilters ? '필터 숨기기' : '필터 보기'}</span>
        </button>

        {(selectedGenre || minRating || sortBy !== 'popularity.desc' || query) && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 정렬 옵션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬 기준
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 장르 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                장르
              </label>
              <select
                value={selectedGenre || ''}
                onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">모든 장르</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 평점 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 평점
              </label>
              <select
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ratingOptions.map((option, index) => (
                  <option key={index} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 선택된 필터 표시 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedGenre && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                장르: {genres.find(g => g.id === selectedGenre)?.name}
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {minRating && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                평점: {minRating}점 이상
                <button
                  onClick={() => setMinRating(null)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'popularity.desc' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                정렬: {sortOptions.find(s => s.value === sortBy)?.label}
                <button
                  onClick={() => setSortBy('popularity.desc')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={() => searchMovies(query.trim(), 1)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 검색 결과 */}
      {hasSearched && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-black">
                {query ? `'${query}' 검색 결과` : '영화 목록'} ({movies.length}개)
              </h3>
              {(selectedGenre || minRating || sortBy !== 'popularity.desc') && (
                <p className="text-sm text-gray-600 mt-1">
                  필터가 적용된 결과입니다.
                </p>
              )}
            </div>
          </div>

          {movies.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">
                필터를 조정하거나 다른 키워드로 검색해보세요.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {movies.map((movie) => (
                  <TMDBMovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>

              {/* 더 보기 버튼 */}
              {page < totalPages && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading ? '로딩 중...' : '더 보기'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {loading && movies.length === 0 && hasSearched && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      )}
    </div>
  );
}