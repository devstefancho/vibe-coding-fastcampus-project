import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: '유효하지 않은 영화 ID입니다.' },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genres: {
          include: {
            genre: true
          }
        },
        mbtiTypes: {
          include: {
            mbtiType: true
          }
        }
      }
    });

    if (!movie) {
      return NextResponse.json(
        { error: '영화를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 응답 데이터 변환
    const formattedMovie = {
      id: movie.id.toString(),
      tmdbId: movie.tmdbId,
      title: movie.title,
      originalTitle: movie.originalTitle,
      description: movie.overview,
      posterUrl: movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : '/placeholder-movie.jpg',
      backdropUrl: movie.backdropPath
        ? `https://image.tmdb.org/t/p/w1280${movie.backdropPath}`
        : '/placeholder-backdrop.jpg',
      rating: movie.rating,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null,
      runtime: movie.runtime,
      voteCount: movie.voteCount,
      popularity: movie.popularity,
      genres: movie.genres.map(g => g.genre.name),
      mbtiTypes: movie.mbtiTypes.map(m => m.mbtiType.type),
      releaseDate: movie.releaseDate,
      tagline: movie.tagline,
      homepage: movie.homepage,
      status: movie.status,
      budget: movie.budget,
      revenue: movie.revenue,
      originalLanguage: movie.originalLanguage,
      adult: movie.adult,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };

    return NextResponse.json(formattedMovie);

  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { error: '영화 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}