import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const genre = searchParams.get('genre');
    const sortBy = searchParams.get('sort') || 'popularity';
    const sortOrder = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    // 정렬 조건 설정
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      case 'year':
        orderBy = { releaseDate: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      default:
        orderBy = { popularity: sortOrder };
    }

    // 필터 조건 설정
    const where: any = {};
    if (genre) {
      where.genres = {
        some: {
          genre: {
            name: {
              contains: genre,
              mode: 'insensitive'
            }
          }
        }
      };
    }

    // 영화 목록 조회
    const movies = await prisma.movie.findMany({
      where,
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
      orderBy,
      skip,
      take: limit,
    });

    // 전체 개수 조회
    const total = await prisma.movie.count({ where });

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
      tagline: movie.tagline,
      homepage: movie.homepage,
      status: movie.status,
      budget: movie.budget,
      revenue: movie.revenue,
    }));

    return NextResponse.json({
      movies: formattedMovies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: '영화 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}