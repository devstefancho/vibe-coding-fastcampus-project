import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          ⭐ {movie.rating}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-black">{movie.title}</h3>
        <p className="text-black text-sm mb-3 line-clamp-2">{movie.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre.map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="text-sm text-black">
          {movie.year}
        </div>
      </div>
    </div>
  );
}