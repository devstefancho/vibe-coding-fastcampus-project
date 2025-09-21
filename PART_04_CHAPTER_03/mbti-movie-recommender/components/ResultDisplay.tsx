import { MBTIType, Movie } from '@/types';
import { mbtiResults } from '@/lib/mbtiData';
import MovieCard from './MovieCard';

interface ResultDisplayProps {
  mbtiType: MBTIType;
  recommendedMovies: Movie[];
  onRestart: () => void;
}

export default function ResultDisplay({ mbtiType, recommendedMovies, onRestart }: ResultDisplayProps) {
  const result = mbtiResults[mbtiType];

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

        {recommendedMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-black text-lg">
              죄송합니다. 현재 {mbtiType} 유형을 위한 추천 영화가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}