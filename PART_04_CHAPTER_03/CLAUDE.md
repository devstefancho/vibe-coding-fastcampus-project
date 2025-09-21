# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 application with TypeScript that implements an MBTI-based movie recommendation system. The application allows users to take a personality quiz and receive movie recommendations based on their MBTI type, while also providing movie browsing functionality using the TMDB API.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code linting

### Environment Setup
The application requires a TMDB API key. Add to `.env.local`:
```
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

## Architecture Overview

### Core Application Structure
- **App Router**: Uses Next.js 15 App Router pattern with routes in `/app`
- **Component Library**: Reusable UI components in `/components`
- **Type System**: Centralized TypeScript types in `/types/index.ts`
- **Business Logic**: Core logic and API clients in `/lib`

### Key Architectural Patterns

**MBTI System Architecture**:
- `mbtiData.ts` - Contains quiz questions, personality type definitions, and MBTI calculation logic
- `movieRecommendations.ts` - Local movie database with MBTI type mappings
- `MBTIQuiz.tsx` - Quiz component handling personality assessment
- `ResultDisplay.tsx` - Shows personalized movie recommendations

**Movie Data Management**:
- **Dual Data Sources**: Local movie database for MBTI recommendations + TMDB API for browsing
- **TMDB Integration**: Comprehensive API client in `lib/tmdb.ts` with methods for popular, search, genre filtering
- **Type Safety**: Complete TypeScript interfaces for TMDB API responses and local movie data

**State Management**:
- React useState for component-level state (quiz progress, current view)
- No external state management library - relies on React built-ins
- Props drilling for data passing between components

### Component Architecture

**Page Components**:
- `app/page.tsx` - Home page with quiz launcher and movie browser navigation
- `app/movies/page.tsx` - Movie browsing interface using TMDB API
- `app/layout.tsx` - Root layout with fonts and metadata

**Feature Components**:
- `MBTIQuiz.tsx` - Multi-step personality assessment
- `MovieSearch.tsx` - TMDB API search interface
- `TMDBMovieCard.tsx` / `MovieCard.tsx` - Movie display components for different data sources
- `MovieDetail.tsx` - Detailed movie information view

### Data Flow Patterns

**MBTI Recommendation Flow**:
1. User takes quiz in `MBTIQuiz.tsx`
2. Answers processed by `calculateMBTI()` in `mbtiData.ts`
3. Results filtered through `getRecommendedMovies()` in `movieRecommendations.ts`
4. Displayed in `ResultDisplay.tsx`

**Movie Browsing Flow**:
1. TMDB API calls through `tmdbClient` singleton
2. Data transformed using type-safe interfaces
3. Rendered in appropriate movie card components
4. Image URLs generated using TMDB helper methods

## Technology Stack
- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **API**: TMDB (The Movie Database) REST API
- **Build Tool**: Turbopack (Next.js built-in)