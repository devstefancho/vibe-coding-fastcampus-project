'use client';

import { useState, useEffect } from 'react';
import { TMDBMovie, TMDBMovieResponse } from '@/types';
import tmdbClient from '@/lib/tmdb';
import TMDBMovieCard from './TMDBMovieCard';

type MovieListType = 'popular' | 'now_playing' | 'top_rated' | 'upcoming' | 'korean';

interface MovieListProps {
  type: MovieListType;
  title: string;
  limit?: number;
}

export default function MovieList({ type, title, limit }: MovieListProps) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      let response: TMDBMovieResponse;

      switch (type) {
        case 'popular':
          response = await tmdbClient.getPopularMovies(pageNumber);
          break;
        case 'now_playing':
          response = await tmdbClient.getNowPlayingMovies(pageNumber);
          break;
        case 'top_rated':
          response = await tmdbClient.getTopRatedMovies(pageNumber);
          break;
        case 'upcoming':
          response = await tmdbClient.getUpcomingMovies(pageNumber);
          break;
        case 'korean':
          response = await tmdbClient.getKoreanMovies(pageNumber);
          break;
        default:
          response = await tmdbClient.getPopularMovies(pageNumber);
      }

      if (pageNumber === 1) {
        setMovies(limit ? response.results.slice(0, limit) : response.results);
      } else {
        setMovies(prev => [...prev, ...(limit ? response.results.slice(0, limit) : response.results)]);
      }

      setTotalPages(response.total_pages);
      setPage(pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : '영화 목록을 불러오는데 실패했습니다.');
      console.error('Movie fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, [type, limit]);

  const loadMore = () => {
    if (page < totalPages) {
      fetchMovies(page + 1);
    }
  };

  const handleMovieClick = (movie: TMDBMovie) => {
    console.log('영화 클릭:', movie.title);
    // TODO: 영화 상세 페이지로 이동하거나 모달 열기
  };

  if (loading && movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: limit || 10 }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => fetchMovies(1)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <TMDBMovieCard
            key={movie.id}
            movie={movie}
            onClick={() => handleMovieClick(movie)}
          />
        ))}
      </div>

      {!limit && page < totalPages && (
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
    </div>
  );
}