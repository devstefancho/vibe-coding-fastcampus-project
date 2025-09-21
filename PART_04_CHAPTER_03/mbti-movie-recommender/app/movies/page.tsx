'use client';

import { useState } from 'react';
import MovieList from '@/components/MovieList';
import MovieSearch from '@/components/MovieSearch';
import MovieDetail from '@/components/MovieDetail';
import { TMDBMovie } from '@/types';

export default function MoviesPage() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'popular' | 'search'>('popular');

  const handleMovieSelect = (movie: TMDBMovie) => {
    setSelectedMovieId(movie.id);
  };

  const closeMovieDetail = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-black">영화 탐색</h1>
            <p className="mt-2 text-gray-600">TMDB API를 활용한 영화 정보 검색</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('popular')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'popular'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              인기 영화
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              영화 검색
            </button>
          </nav>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'popular' && (
          <div className="space-y-12">
            {/* API 키 설정 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    TMDB API 키 설정이 필요합니다
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      1. <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline">TMDB 웹사이트</a>에서 API 키를 발급받으세요.
                    </p>
                    <p>
                      2. .env.local 파일의 NEXT_PUBLIC_TMDB_API_KEY에 발급받은 키를 입력하세요.
                    </p>
                    <p>
                      3. 개발 서버를 재시작하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 인기 영화 목록 */}
            <MovieList
              type="popular"
              title="🔥 인기 영화"
              limit={10}
            />

            {/* 현재 상영 영화 */}
            <MovieList
              type="now_playing"
              title="🎬 현재 상영 중"
              limit={10}
            />

            {/* 최고 평점 영화 */}
            <MovieList
              type="top_rated"
              title="⭐ 최고 평점"
              limit={10}
            />

            {/* 개봉 예정 영화 */}
            <MovieList
              type="upcoming"
              title="🚀 개봉 예정"
              limit={10}
            />

            {/* 한국 영화 */}
            <MovieList
              type="korean"
              title="🇰🇷 한국 영화"
              limit={10}
            />
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <MovieSearch onMovieSelect={handleMovieSelect} />
          </div>
        )}
      </div>

      {/* 영화 상세 모달 */}
      {selectedMovieId && (
        <MovieDetail
          movieId={selectedMovieId}
          onClose={closeMovieDetail}
        />
      )}

      {/* 하단 안내 */}
      <div className="bg-gray-100 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              영화 데이터 제공: <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">The Movie Database (TMDB)</a>
            </p>
            <p className="text-xs mt-2">
              이 제품은 TMDB API를 사용하지만 TMDB에서 보증하거나 인증한 것은 아닙니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}