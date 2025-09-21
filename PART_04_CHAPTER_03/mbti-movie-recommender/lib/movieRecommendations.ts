import { Movie, MBTIType } from '@/types';

export const movies: Movie[] = [
  // Sci-Fi Movies
  {
    id: '1',
    title: '인터스텔라',
    description: '인류의 생존을 위해 우주로 떠나는 과학자들의 이야기',
    genre: ['Sci-Fi', 'Drama'],
    rating: 8.7,
    year: 2014,
    posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=인터스텔라',
    mbtiTypes: ['INTJ', 'INTP', 'INFJ']
  },
  {
    id: '2',
    title: '블레이드 러너 2049',
    description: '미래 사회에서 인간과 리플리칸트의 경계를 탐구하는 영화',
    genre: ['Sci-Fi', 'Thriller'],
    rating: 8.0,
    year: 2017,
    posterUrl: 'https://via.placeholder.com/300x450/2a2a2a/ffffff?text=블레이드러너2049',
    mbtiTypes: ['INTJ', 'INTP', 'INFP']
  },

  // Action Movies
  {
    id: '3',
    title: '어벤져스: 엔드게임',
    description: '마블 히어로들의 최종 결전',
    genre: ['Action', 'Adventure'],
    rating: 8.4,
    year: 2019,
    posterUrl: 'https://via.placeholder.com/300x450/b91c1c/ffffff?text=어벤져스엔드게임',
    mbtiTypes: ['ENTJ', 'ESTJ', 'ESTP', 'ENFP']
  },
  {
    id: '4',
    title: '매드 맥스: 분노의 도로',
    description: '포스트 아포칼립스 세계에서의 추격전',
    genre: ['Action', 'Adventure'],
    rating: 8.1,
    year: 2015,
    posterUrl: 'https://via.placeholder.com/300x450/ea580c/ffffff?text=매드맥스분노의도로',
    mbtiTypes: ['ESTP', 'ISTP', 'ENTP']
  },

  // Romance Movies
  {
    id: '5',
    title: '라라랜드',
    description: '꿈을 향한 두 연인의 아름다운 이야기',
    genre: ['Romance', 'Musical'],
    rating: 8.0,
    year: 2016,
    posterUrl: 'https://via.placeholder.com/300x450/7c3aed/ffffff?text=라라랜드',
    mbtiTypes: ['INFP', 'ISFP', 'ENFP', 'ESFP']
  },
  {
    id: '6',
    title: '비포 선라이즈',
    description: '우연히 만난 두 사람의 하룻밤 로맨스',
    genre: ['Romance', 'Drama'],
    rating: 8.1,
    year: 1995,
    posterUrl: 'https://via.placeholder.com/300x450/ec4899/ffffff?text=비포선라이즈',
    mbtiTypes: ['INFP', 'ISFP', 'INFJ', 'ENFP']
  },

  // Drama Movies
  {
    id: '7',
    title: '쇼생크 탈출',
    description: '희망을 잃지 않는 한 남자의 감동적인 이야기',
    genre: ['Drama'],
    rating: 9.3,
    year: 1994,
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=쇼생크탈출',
    mbtiTypes: ['INFJ', 'ISFJ', 'ENFJ', 'ISTJ']
  },
  {
    id: '8',
    title: '기생충',
    description: '계급 갈등을 다룬 봉준호 감독의 작품',
    genre: ['Drama', 'Thriller'],
    rating: 8.5,
    year: 2019,
    posterUrl: 'https://via.placeholder.com/300x450/059669/ffffff?text=기생충',
    mbtiTypes: ['INTJ', 'INFJ', 'ENTP', 'INTP']
  },

  // Comedy Movies
  {
    id: '9',
    title: '그랜드 부다페스트 호텔',
    description: '웨스 앤더슨 특유의 시각적 코미디',
    genre: ['Comedy', 'Adventure'],
    rating: 8.1,
    year: 2014,
    posterUrl: 'https://via.placeholder.com/300x450/f59e0b/ffffff?text=그랜드부다페스트호텔',
    mbtiTypes: ['ENFP', 'ENTP', 'ESFP', 'INFP']
  },
  {
    id: '10',
    title: '백 투 더 퓨처',
    description: '시간여행을 소재로 한 클래식 코미디',
    genre: ['Comedy', 'Sci-Fi'],
    rating: 8.5,
    year: 1985,
    posterUrl: 'https://via.placeholder.com/300x450/3b82f6/ffffff?text=백투더퓨처',
    mbtiTypes: ['ENTP', 'ENFP', 'ESFP', 'ESTP']
  },

  // Animation Movies
  {
    id: '11',
    title: '센과 치히로의 행방불명',
    description: '미야자키 하야오의 환상적인 애니메이션',
    genre: ['Animation', 'Fantasy'],
    rating: 9.3,
    year: 2001,
    posterUrl: 'https://via.placeholder.com/300x450/10b981/ffffff?text=센과치히로의행방불명',
    mbtiTypes: ['INFP', 'ISFP', 'INFJ', 'ENFP']
  },
  {
    id: '12',
    title: '월-E',
    description: '외로운 로봇의 사랑 이야기',
    genre: ['Animation', 'Family'],
    rating: 8.4,
    year: 2008,
    posterUrl: 'https://via.placeholder.com/300x450/6366f1/ffffff?text=월E',
    mbtiTypes: ['ISFJ', 'INFJ', 'ISFP', 'ESFJ']
  }
];

export function getRecommendedMovies(mbtiType: MBTIType): Movie[] {
  return movies.filter(movie => movie.mbtiTypes.includes(mbtiType));
}

export function getMoviesByGenre(genre: string): Movie[] {
  return movies.filter(movie => movie.genre.includes(genre));
}

export function getAllGenres(): string[] {
  const genres = new Set<string>();
  movies.forEach(movie => {
    movie.genre.forEach(g => genres.add(g));
  });
  return Array.from(genres).sort();
}