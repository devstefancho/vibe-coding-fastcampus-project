import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportSQLiteData() {
  try {
    console.log('Exporting SQLite data...');

    // Export all tables
    const movies = await prisma.movie.findMany({
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

    const genres = await prisma.genre.findMany();
    const mbtiTypes = await prisma.mbtiType.findMany();

    // Create export data structure
    const exportData = {
      movies: movies.map(movie => ({
        id: movie.id,
        tmdbId: movie.tmdbId,
        title: movie.title,
        originalTitle: movie.originalTitle,
        overview: movie.overview,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate?.toISOString(),
        rating: movie.rating,
        voteCount: movie.voteCount,
        popularity: movie.popularity,
        runtime: movie.runtime,
        budget: movie.budget,
        revenue: movie.revenue,
        tagline: movie.tagline,
        homepage: movie.homepage,
        status: movie.status,
        originalLanguage: movie.originalLanguage,
        adult: movie.adult,
        createdAt: movie.createdAt.toISOString(),
        updatedAt: movie.updatedAt.toISOString(),
        genres: movie.genres.map(mg => mg.genre),
        mbtiTypes: movie.mbtiTypes.map(mmt => mmt.mbtiType)
      })),
      genres,
      mbtiTypes,
      exportedAt: new Date().toISOString()
    };

    // Write to JSON file
    const exportPath = path.join(process.cwd(), 'data-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

    console.log(`Data exported successfully to ${exportPath}`);
    console.log(`Exported: ${movies.length} movies, ${genres.length} genres, ${mbtiTypes.length} MBTI types`);

  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportSQLiteData();