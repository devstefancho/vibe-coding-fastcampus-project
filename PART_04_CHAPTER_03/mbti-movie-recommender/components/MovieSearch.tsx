'use client';

import { useState, useEffect } from 'react';
import { TMDBMovie } from '@/types';
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

  const searchMovies = async (searchQuery: string, pageNumber: number = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbClient.searchMovies(searchQuery, pageNumber);

      if (pageNumber === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
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

  // 디바운스된 검색
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query.trim(), 1);
      } else {
        setMovies([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const loadMore = () => {
    if (page < totalPages && query.trim()) {
      searchMovies(query.trim(), page + 1);
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
    if (query.trim()) {
      searchMovies(query.trim(), 1);
    }
  };

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
            <h3 className="text-xl font-bold text-black">
              '{query}' 검색 결과 ({movies.length}개)
            </h3>
          </div>

          {movies.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">
                다른 키워드로 검색해보세요.
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