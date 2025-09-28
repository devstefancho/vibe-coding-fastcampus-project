'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { TMDBMovie } from '@/types';
import tmdbClient from '@/lib/tmdb';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface MovieCarouselProps {
  onMovieClick?: (movie: TMDBMovie) => void;
}

export default function MovieCarousel({ onMovieClick }: MovieCarouselProps) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbClient.getPopularMovies(1);
        setMovies(response.results.slice(0, 10)); // 상위 10개 영화만 사용
        setError(null);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('영화 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie: TMDBMovie) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-900 to-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-96 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-r from-gray-900 to-black py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          🔥 인기 영화
        </h2>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          navigation={true}
          loop={true}
          className="movie-carousel"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="relative w-64 h-96 mx-auto rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={tmdbClient.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/500x750/374151/ffffff?text=No+Image';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .movie-carousel .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        .movie-carousel .swiper-pagination-bullet-active {
          background: #ffffff;
        }

        .movie-carousel .swiper-button-next,
        .movie-carousel .swiper-button-prev {
          color: #ffffff;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 44px;
          height: 44px;
        }

        .movie-carousel .swiper-button-next:after,
        .movie-carousel .swiper-button-prev:after {
          font-size: 18px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}