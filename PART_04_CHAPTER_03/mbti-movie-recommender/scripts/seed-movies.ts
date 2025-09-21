import { PrismaClient } from '@prisma/client';
import { MBTIType } from '../types';
import { classifyMovieForMBTI, getMBTIDistributionWeight, MBTI_MINIMUM_MOVIES } from '../lib/mbti-classifier';

const prisma = new PrismaClient();

// TMDB API 설정
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

interface TMDBMovieDetail extends TMDBMovie {
  runtime: number | null;
  budget: number;
  revenue: number;
  tagline: string | null;
  homepage: string | null;
  status: string;
  genres: { id: number; name: string }[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'ko-KR');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function seedGenres() {
  console.log('🎬 장르 데이터 시딩 시작...');

  const { genres } = await fetchFromTMDB<{ genres: TMDBGenre[] }>('/genre/movie/list');

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      update: { name: genre.name },
      create: {
        id: genre.id,
        name: genre.name,
      },
    });
  }

  console.log(`✅ ${genres.length}개 장르 데이터 완료`);
}

async function seedMBTITypes() {
  console.log('🧠 MBTI 유형 데이터 시딩 시작...');

  const mbtiTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  for (const type of mbtiTypes) {
    await prisma.mbtiType.upsert({
      where: { type },
      update: {},
      create: { type },
    });
  }

  console.log(`✅ ${mbtiTypes.length}개 MBTI 유형 데이터 완료`);
}

async function getMoviesFromTMDB(): Promise<TMDBMovie[]> {
  console.log('🎥 TMDB에서 영화 데이터 수집 중...');

  const allMovies: TMDBMovie[] = [];
  const categories = [
    { endpoint: '/movie/popular', pages: 8 },
    { endpoint: '/movie/top_rated', pages: 8 },
    { endpoint: '/movie/now_playing', pages: 4 },
    { endpoint: '/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000', pages: 5 }
  ];

  for (const category of categories) {
    for (let page = 1; page <= category.pages; page++) {
      try {
        const endpoint = category.endpoint.includes('?')
          ? `${category.endpoint}&page=${page}`
          : `${category.endpoint}?page=${page}`;

        const response = await fetchFromTMDB<{ results: TMDBMovie[] }>(endpoint);
        allMovies.push(...response.results);

        // API 호출 제한을 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching page ${page} from ${category.endpoint}:`, error);
      }
    }
  }

  // 중복 제거 (tmdb id 기준)
  const uniqueMovies = allMovies.filter((movie, index, self) =>
    index === self.findIndex(m => m.id === movie.id)
  );

  // 성인 영화 및 저품질 영화 필터링
  const filteredMovies = uniqueMovies.filter(movie =>
    !movie.adult &&
    movie.vote_average >= 5.0 &&
    movie.vote_count >= 100 &&
    movie.overview.length > 20
  );

  console.log(`✅ ${filteredMovies.length}개 고품질 영화 수집 완료`);
  return filteredMovies.slice(0, 300); // 최대 300개
}

async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetail | null> {
  try {
    const movieDetail = await fetchFromTMDB<TMDBMovieDetail>(`/movie/${tmdbId}`);
    await new Promise(resolve => setTimeout(resolve, 50)); // API 제한 고려
    return movieDetail;
  } catch (error) {
    console.error(`Error fetching details for movie ${tmdbId}:`, error);
    return null;
  }
}

async function seedMovies() {
  console.log('🎬 영화 데이터 시딩 시작...');

  const movies = await getMoviesFromTMDB();
  let processedCount = 0;
  const mbtiCounts: Record<MBTIType, number> = {} as Record<MBTIType, number>;

  // MBTI 카운트 초기화
  const allMBTIs: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  allMBTIs.forEach(mbti => mbtiCounts[mbti] = 0);

  for (const movieData of movies) {
    try {
      // 영화 상세 정보 가져오기
      const movieDetail = await getMovieDetails(movieData.id);
      if (!movieDetail) continue;

      // 릴리즈 날짜 파싱
      const releaseDate = movieData.release_date ? new Date(movieData.release_date) : null;
      const releaseYear = releaseDate ? releaseDate.getFullYear() : undefined;

      // MBTI 분류
      const compatibleMBTIs = classifyMovieForMBTI(
        movieData.genre_ids,
        movieData.vote_average,
        releaseYear
      );

      // 분배 가중치 고려하여 MBTI 선택
      const weights = getMBTIDistributionWeight(mbtiCounts);
      const selectedMBTIs = compatibleMBTIs.filter(mbti => {
        const currentCount = mbtiCounts[mbti];
        const weight = weights[mbti];
        // 가중치가 높거나 최소 영화 수를 충족하지 못한 경우 포함
        return weight > 1 || currentCount < MBTI_MINIMUM_MOVIES;
      });

      // 선택된 MBTI가 없으면 호환 가능한 모든 MBTI 사용
      const finalMBTIs = selectedMBTIs.length > 0 ? selectedMBTIs : compatibleMBTIs;

      // 데이터베이스에 영화 저장
      const savedMovie = await prisma.movie.create({
        data: {
          tmdbId: movieData.id,
          title: movieData.title,
          originalTitle: movieData.original_title,
          overview: movieData.overview,
          posterPath: movieData.poster_path,
          backdropPath: movieData.backdrop_path,
          releaseDate: releaseDate,
          rating: movieData.vote_average,
          voteCount: movieData.vote_count,
          popularity: movieData.popularity,
          runtime: movieDetail.runtime,
          budget: movieDetail.budget,
          revenue: movieDetail.revenue,
          tagline: movieDetail.tagline,
          homepage: movieDetail.homepage,
          status: movieDetail.status,
          originalLanguage: movieData.original_language,
          adult: movieData.adult,
        },
      });

      // 장르 연결
      for (const genreId of movieData.genre_ids) {
        await prisma.movieGenre.create({
          data: {
            movieId: savedMovie.id,
            genreId: genreId,
          },
        });
      }

      // MBTI 유형 연결
      for (const mbtiType of finalMBTIs) {
        const mbtiTypeRecord = await prisma.mbtiType.findUnique({
          where: { type: mbtiType },
        });

        if (mbtiTypeRecord) {
          await prisma.movieMbtiType.create({
            data: {
              movieId: savedMovie.id,
              mbtiTypeId: mbtiTypeRecord.id,
            },
          });

          mbtiCounts[mbtiType]++;
        }
      }

      processedCount++;
      console.log(`📊 [${processedCount}/${movies.length}] "${movieData.title}" 처리 완료 (MBTI: ${finalMBTIs.join(', ')})`);

    } catch (error) {
      console.error(`Error processing movie ${movieData.title}:`, error);
    }
  }

  console.log('\n🎯 MBTI별 영화 분포:');
  for (const [mbti, count] of Object.entries(mbtiCounts)) {
    console.log(`${mbti}: ${count}개`);
  }

  console.log(`\n✅ 총 ${processedCount}개 영화 시딩 완료`);
}

async function main() {
  try {
    console.log('🚀 데이터베이스 시딩 시작...\n');

    await seedGenres();
    await seedMBTITypes();
    await seedMovies();

    console.log('\n🎉 모든 시딩 작업 완료!');
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();