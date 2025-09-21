import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

interface TMDBSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
}

interface TMDBResponse {
  results: TMDBSearchResult[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error('TMDB API key not found in environment variables');
  process.exit(1);
}

async function searchMovieOnTMDB(title: string, year?: number): Promise<TMDBSearchResult | null> {
  try {
    const query = encodeURIComponent(title);
    const yearParam = year ? `&year=${year}` : '';
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}${yearParam}&language=ko-KR`;

    console.log(`Searching for: ${title} (${year})`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: TMDBResponse = await response.json();

    if (data.results && data.results.length > 0) {
      // 연도가 일치하는 것을 우선 찾기
      if (year) {
        const exactMatch = data.results.find(movie => {
          const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
          return movieYear === year;
        });
        if (exactMatch) return exactMatch;
      }

      // 연도가 일치하지 않으면 첫 번째 결과 반환
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error(`Error searching for movie "${title}":`, error);
    return null;
  }
}

async function updateMoviePosters() {
  try {
    console.log('Fetching all movies from database...');

    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          { posterPath: null },
          { posterPath: '' }
        ]
      },
      select: {
        id: true,
        title: true,
        originalTitle: true,
        releaseDate: true,
        posterPath: true,
        backdropPath: true
      }
    });

    console.log(`Found ${movies.length} movies without poster paths`);

    let updatedCount = 0;
    let failedCount = 0;

    for (const movie of movies) {
      const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined;

      // 원제목 먼저 시도, 없으면 한국어 제목으로 시도
      let tmdbMovie = await searchMovieOnTMDB(movie.originalTitle || movie.title, releaseYear);

      if (!tmdbMovie && movie.originalTitle && movie.originalTitle !== movie.title) {
        console.log(`Trying with Korean title: ${movie.title}`);
        tmdbMovie = await searchMovieOnTMDB(movie.title, releaseYear);
      }

      if (tmdbMovie) {
        const updateData: any = {};

        if (tmdbMovie.poster_path) {
          updateData.posterPath = tmdbMovie.poster_path;
        }

        if (tmdbMovie.backdrop_path) {
          updateData.backdropPath = tmdbMovie.backdrop_path;
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.movie.update({
            where: { id: movie.id },
            data: updateData
          });

          console.log(`✅ Updated ${movie.title}: poster=${tmdbMovie.poster_path}, backdrop=${tmdbMovie.backdrop_path}`);
          updatedCount++;
        } else {
          console.log(`⚠️  No poster/backdrop found for ${movie.title}`);
          failedCount++;
        }
      } else {
        console.log(`❌ Failed to find ${movie.title} on TMDB`);
        failedCount++;
      }

      // API 요청 제한을 위한 딜레이 (TMDB는 초당 40 요청 제한)
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n=== Update Summary ===');
    console.log(`Total movies processed: ${movies.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Failed to update: ${failedCount}`);

  } catch (error) {
    console.error('Error updating movie posters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  updateMoviePosters()
    .then(() => {
      console.log('Movie poster update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { updateMoviePosters };