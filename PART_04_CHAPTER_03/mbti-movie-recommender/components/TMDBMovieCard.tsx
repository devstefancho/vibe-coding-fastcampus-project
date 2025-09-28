import { TMDBMovie } from '@/types';
import tmdbClient from '@/lib/tmdb';

interface TMDBMovieCardProps {
  movie: TMDBMovie;
  onClick?: () => void;
}

export default function TMDBMovieCard({ movie, onClick }: TMDBMovieCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={tmdbClient.getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-movie.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">자세히 보기</span>
        </div>
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-semibold transition-transform group-hover:scale-110">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
        {movie.adult && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold transition-transform group-hover:scale-110">
            19+
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-black line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>
        {movie.original_title !== movie.title && (
          <p className="text-gray-600 text-sm mb-1 line-clamp-1">
            ({movie.original_title})
          </p>
        )}
        <p className="text-black text-sm mb-3 line-clamp-2">
          {movie.overview || '줄거리 정보가 없습니다.'}
        </p>

        <div className="flex justify-between items-center text-sm">
          <span className="text-black">
            {formatDate(movie.release_date)}
          </span>
          <span className="text-gray-500">
            {movie.original_language.toUpperCase()}
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          인기도: {movie.popularity.toFixed(0)} | 평가: {movie.vote_count}명
        </div>
      </div>
    </div>
  );
}