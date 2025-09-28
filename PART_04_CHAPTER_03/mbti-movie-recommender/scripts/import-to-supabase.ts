import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ExportedData {
  movies: any[];
  genres: any[];
  mbtiTypes: any[];
  exportedAt: string;
}

async function importToSupabase() {
  try {
    console.log('Reading exported data...');

    const exportPath = path.join(process.cwd(), 'data-export.json');
    if (!fs.existsSync(exportPath)) {
      throw new Error('Export file not found. Please run export script first.');
    }

    const rawData = fs.readFileSync(exportPath, 'utf-8');
    const data: ExportedData = JSON.parse(rawData);

    console.log('Starting Supabase import...');

    // 1. Import Genres first (referenced by movies)
    console.log('Importing genres...');
    for (const genre of data.genres) {
      await prisma.genre.upsert({
        where: { id: genre.id },
        update: { name: genre.name },
        create: {
          id: genre.id,
          name: genre.name
        }
      });
    }
    console.log(`✓ Imported ${data.genres.length} genres`);

    // 2. Import MBTI Types
    console.log('Importing MBTI types...');
    for (const mbtiType of data.mbtiTypes) {
      await prisma.mbtiType.upsert({
        where: { id: mbtiType.id },
        update: { type: mbtiType.type },
        create: {
          id: mbtiType.id,
          type: mbtiType.type
        }
      });
    }
    console.log(`✓ Imported ${data.mbtiTypes.length} MBTI types`);

    // 3. Import Movies with relationships
    console.log('Importing movies...');
    let importedMovies = 0;

    for (const movieData of data.movies) {
      // Create movie first
      const movie = await prisma.movie.upsert({
        where: { id: movieData.id },
        update: {
          tmdbId: movieData.tmdbId,
          title: movieData.title,
          originalTitle: movieData.originalTitle,
          overview: movieData.overview,
          posterPath: movieData.posterPath,
          backdropPath: movieData.backdropPath,
          releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate) : null,
          rating: movieData.rating,
          voteCount: movieData.voteCount,
          popularity: movieData.popularity,
          runtime: movieData.runtime,
          budget: movieData.budget,
          revenue: movieData.revenue,
          tagline: movieData.tagline,
          homepage: movieData.homepage,
          status: movieData.status,
          originalLanguage: movieData.originalLanguage,
          adult: movieData.adult,
          updatedAt: new Date()
        },
        create: {
          id: movieData.id,
          tmdbId: movieData.tmdbId,
          title: movieData.title,
          originalTitle: movieData.originalTitle,
          overview: movieData.overview,
          posterPath: movieData.posterPath,
          backdropPath: movieData.backdropPath,
          releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate) : null,
          rating: movieData.rating,
          voteCount: movieData.voteCount,
          popularity: movieData.popularity,
          runtime: movieData.runtime,
          budget: movieData.budget,
          revenue: movieData.revenue,
          tagline: movieData.tagline,
          homepage: movieData.homepage,
          status: movieData.status,
          originalLanguage: movieData.originalLanguage,
          adult: movieData.adult,
          createdAt: new Date(movieData.createdAt)
        }
      });

      // Clear existing relationships
      await prisma.movieGenre.deleteMany({
        where: { movieId: movie.id }
      });

      await prisma.movieMbtiType.deleteMany({
        where: { movieId: movie.id }
      });

      // Create genre relationships
      for (const genre of movieData.genres) {
        await prisma.movieGenre.create({
          data: {
            movieId: movie.id,
            genreId: genre.id
          }
        });
      }

      // Create MBTI type relationships
      for (const mbtiType of movieData.mbtiTypes) {
        await prisma.movieMbtiType.create({
          data: {
            movieId: movie.id,
            mbtiTypeId: mbtiType.id
          }
        });
      }

      importedMovies++;
      if (importedMovies % 10 === 0) {
        console.log(`Imported ${importedMovies}/${data.movies.length} movies...`);
      }
    }

    console.log(`✓ Imported ${importedMovies} movies with relationships`);
    console.log('🎉 Import completed successfully!');

    // Verify import
    const movieCount = await prisma.movie.count();
    const genreCount = await prisma.genre.count();
    const mbtiCount = await prisma.mbtiType.count();

    console.log('\nVerification:');
    console.log(`Movies in database: ${movieCount}`);
    console.log(`Genres in database: ${genreCount}`);
    console.log(`MBTI types in database: ${mbtiCount}`);

  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importToSupabase();