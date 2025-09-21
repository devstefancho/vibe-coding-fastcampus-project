import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MBTIType } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const mbtiType = params.type.toUpperCase() as MBTIType;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // MBTI 유형 유효성 검사
    const validMBTITypes: MBTIType[] = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ];

    if (!validMBTITypes.includes(mbtiType)) {
      return NextResponse.json(
        { error: '유효하지 않은 MBTI 유형입니다.' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // 해당 MBTI 유형에 맞는 영화 조회
    const movies = await prisma.movie.findMany({
      where: {
        mbtiTypes: {
          some: {
            mbtiType: {
              type: mbtiType
            }
          }
        }
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
        mbtiTypes: {
          some: {
            mbtiType: {
              type: mbtiType
            }
          }
        }
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
      mbtiType,
      movies: formattedMovies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching MBTI movies:', error);
    return NextResponse.json(
      { error: 'MBTI 추천 영화를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}