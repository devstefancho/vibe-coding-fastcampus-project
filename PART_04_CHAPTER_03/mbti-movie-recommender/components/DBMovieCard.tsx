'use client';

import { DBMovie } from '@/lib/db-movies';

interface DBMovieCardProps {
  movie: DBMovie;
}

export default function DBMovieCard({ movie }: DBMovieCardProps) {
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatRuntime = (runtime?: number) => {
    if (!runtime) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-movie.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">자세히 보기</span>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm transition-transform group-hover:scale-110">
          ⭐ {formatRating(movie.rating)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-black line-clamp-2">
          {movie.title}
        </h3>

        {movie.originalTitle && movie.originalTitle !== movie.title && (
          <p className="text-gray-600 text-sm mb-2">
            {movie.originalTitle}
          </p>
        )}

        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {movie.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{movie.year}</span>
          {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {movie.mbtiTypes.slice(0, 4).map((mbti) => (
              <span
                key={mbti}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                {mbti}
              </span>
            ))}
            {movie.mbtiTypes.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{movie.mbtiTypes.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}