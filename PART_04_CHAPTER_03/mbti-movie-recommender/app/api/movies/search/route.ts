import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // 영화 제목으로 검색
    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            originalTitle: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            overview: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
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
      },
      orderBy: [
        { rating: 'desc' },
        { popularity: 'desc' }
      ],
      skip,
      take: limit,
    });

    // 전체 개수 조회
    const total = await prisma.movie.count({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            originalTitle: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            overview: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });

    // 응답 데이터 변환
    const formattedMovies = movies.map(movie => ({
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
    }));

    return NextResponse.json({
      query,
      movies: formattedMovies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json(
      { error: '영화 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}