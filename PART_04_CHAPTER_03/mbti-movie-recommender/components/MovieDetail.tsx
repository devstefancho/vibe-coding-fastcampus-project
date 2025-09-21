'use client';

import { useState, useEffect } from 'react';
import { TMDBMovieDetail } from '@/types';
import tmdbClient from '@/lib/tmdb';

interface MovieDetailProps {
  movieId: number;
  onClose?: () => void;
}

export default function MovieDetail({ movieId, onClose }: MovieDetailProps) {
  const [movie, setMovie] = useState<TMDBMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbClient.getMovieDetails(movieId);
        setMovie(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : '영화 정보를 불러오는데 실패했습니다.');
        console.error('Movie detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 h-64 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                다시 시도
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  닫기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-black">{movie.title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* 백드롭 이미지 */}
        {movie.backdrop_path && (
          <div className="relative h-64 md:h-80">
            <img
              src={tmdbClient.getBackdropUrl(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 포스터 */}
            <div className="w-full md:w-1/3">
              <img
                src={tmdbClient.getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.jpg';
                }}
              />
            </div>

            {/* 정보 */}
            <div className="flex-1">
              {/* 기본 정보 */}
              <div className="mb-6">
                {movie.original_title !== movie.title && (
                  <p className="text-gray-600 text-lg mb-2">({movie.original_title})</p>
                )}
                {movie.tagline && (
                  <p className="text-blue-600 italic text-lg mb-4">"{movie.tagline}"</p>
                )}
                <p className="text-black leading-relaxed">{movie.overview}</p>
              </div>

              {/* 평점 및 기본 정보 */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-semibold text-black">평점:</span>
                  <span className="ml-2 text-yellow-600">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="ml-1 text-gray-500">({movie.vote_count}명)</span>
                </div>
                <div>
                  <span className="font-semibold text-black">개봉일:</span>
                  <span className="ml-2 text-black">{formatDate(movie.release_date)}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">상영시간:</span>
                  <span className="ml-2 text-black">{formatRuntime(movie.runtime)}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">상태:</span>
                  <span className="ml-2 text-black">{movie.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">언어:</span>
                  <span className="ml-2 text-black">{movie.original_language.toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">인기도:</span>
                  <span className="ml-2 text-black">{movie.popularity.toFixed(0)}</span>
                </div>
              </div>

              {/* 장르 */}
              {movie.genres.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-2">장르</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 제작 국가 */}
              {movie.production_countries.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-2">제작 국가</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_countries.map((country) => (
                      <span
                        key={country.iso_3166_1}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 예산 및 수익 */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {movie.budget > 0 && (
                    <div>
                      <span className="font-semibold text-black">제작비:</span>
                      <span className="ml-2 text-black">{formatCurrency(movie.budget)}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <span className="font-semibold text-black">박스오피스:</span>
                      <span className="ml-2 text-black">{formatCurrency(movie.revenue)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 외부 링크 */}
              <div className="flex gap-4">
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    공식 홈페이지
                  </a>
                )}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    IMDb
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}