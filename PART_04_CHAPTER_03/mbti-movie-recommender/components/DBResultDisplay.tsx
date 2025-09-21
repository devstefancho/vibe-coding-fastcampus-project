'use client';

import { useState, useEffect } from 'react';
import { MBTIType } from '@/types';
import { DBMovie, getRecommendedMoviesByMBTI } from '@/lib/db-movies';
import { mbtiResults } from '@/lib/mbtiData';
import DBMovieCard from './DBMovieCard';

interface DBResultDisplayProps {
  mbtiType: MBTIType;
  onRestart: () => void;
}

export default function DBResultDisplay({ mbtiType, onRestart }: DBResultDisplayProps) {
  const [movies, setMovies] = useState<DBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const result = mbtiResults[mbtiType];

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const recommendedMovies = await getRecommendedMoviesByMBTI(mbtiType, 1, 20);
        setMovies(recommendedMovies);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('영화를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [mbtiType]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-black mb-2">당신의 MBTI 유형</h2>
          <div className="text-5xl font-bold text-blue-600 mb-4">{mbtiType}</div>
          <h3 className="text-xl text-black mb-4">{result.description}</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-black">성격 특성</h4>
            <ul className="space-y-2">
              {result.characteristics.map((characteristic, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {characteristic}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-black">선호 장르</h4>
            <div className="flex flex-wrap gap-2">
              {result.preferredGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            다시 테스트하기
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-black">
          {mbtiType} 유형을 위한 추천 영화
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-black">맞춤 영화를 찾고 있습니다...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <DBMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">
                총 {movies.length}개의 {mbtiType} 맞춤 영화를 찾았습니다
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-black text-lg">
              죄송합니다. 현재 {mbtiType} 유형을 위한 추천 영화가 없습니다.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              데이터베이스에 영화를 추가하거나 다른 MBTI 유형을 시도해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}