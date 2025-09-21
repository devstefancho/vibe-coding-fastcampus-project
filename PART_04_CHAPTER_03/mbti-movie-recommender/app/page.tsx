'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MBTIType } from '@/types';
import { getRecommendedMovies } from '@/lib/movieRecommendations';
import MBTIQuiz from '@/components/MBTIQuiz';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'result'>('home');
  const [mbtiResult, setMbtiResult] = useState<MBTIType | null>(null);

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = (mbtiType: MBTIType) => {
    setMbtiResult(mbtiType);
    setCurrentView('result');
  };

  const handleRestart = () => {
    setMbtiResult(null);
    setCurrentView('home');
  };

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <MBTIQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (currentView === 'result' && mbtiResult) {
    const recommendedMovies = getRecommendedMovies(mbtiResult);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <ResultDisplay
          mbtiType={mbtiResult}
          recommendedMovies={recommendedMovies}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black mb-4">
            🎬 MBTI 영화 추천
          </h1>
          <p className="text-xl text-black mb-8">
            당신의 성격 유형에 맞는 완벽한 영화를 찾아보세요!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">어떻게 작동하나요?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold mb-2">간단한 테스트</h3>
              <p className="text-black text-sm">
                4개의 질문으로 당신의 영화 취향을 파악합니다
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-semibold mb-2">MBTI 분석</h3>
              <p className="text-black text-sm">
                성격 유형에 따른 영화 선호도를 분석합니다
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">맞춤 추천</h3>
              <p className="text-black text-sm">
                당신만을 위한 영화 리스트를 제공합니다
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStartQuiz}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            테스트 시작하기 🚀
          </button>

          <Link
            href="/movies"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl inline-block text-center"
          >
            영화 탐색하기 🎬
          </Link>
        </div>

        <p className="text-sm text-black mt-4">
          MBTI 테스트: 약 2분 소요 • 완전 무료<br/>
          영화 탐색: TMDB API를 활용한 실시간 영화 정보
        </p>
      </div>
    </div>
  );
}
