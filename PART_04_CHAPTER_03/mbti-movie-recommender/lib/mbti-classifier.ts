import { MBTIType } from '@/types';

// TMDB 장르 ID 매핑
export const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
} as const;

// MBTI별 선호 장르 매핑
export const MBTI_GENRE_PREFERENCES: Record<MBTIType, number[]> = {
  // Analysts (NT) - 분석가형: 복잡하고 지적인 콘텐츠 선호
  INTJ: [TMDB_GENRES.SCIENCE_FICTION, TMDB_GENRES.THRILLER, TMDB_GENRES.MYSTERY, TMDB_GENRES.DRAMA],
  INTP: [TMDB_GENRES.SCIENCE_FICTION, TMDB_GENRES.FANTASY, TMDB_GENRES.DOCUMENTARY, TMDB_GENRES.MYSTERY],
  ENTJ: [TMDB_GENRES.ACTION, TMDB_GENRES.HISTORY, TMDB_GENRES.WAR, TMDB_GENRES.DRAMA, TMDB_GENRES.THRILLER],
  ENTP: [TMDB_GENRES.COMEDY, TMDB_GENRES.ADVENTURE, TMDB_GENRES.SCIENCE_FICTION, TMDB_GENRES.CRIME],

  // Diplomats (NF) - 외교관형: 감정적이고 의미있는 스토리 선호
  INFJ: [TMDB_GENRES.DRAMA, TMDB_GENRES.ROMANCE, TMDB_GENRES.FANTASY, TMDB_GENRES.ANIMATION],
  INFP: [TMDB_GENRES.ROMANCE, TMDB_GENRES.DRAMA, TMDB_GENRES.ANIMATION, TMDB_GENRES.FANTASY],
  ENFJ: [TMDB_GENRES.DRAMA, TMDB_GENRES.ROMANCE, TMDB_GENRES.FAMILY, TMDB_GENRES.HISTORY],
  ENFP: [TMDB_GENRES.COMEDY, TMDB_GENRES.ADVENTURE, TMDB_GENRES.MUSIC, TMDB_GENRES.FAMILY],

  // Sentinels (SJ) - 관리자형: 전통적이고 안정적인 콘텐츠 선호
  ISTJ: [TMDB_GENRES.DRAMA, TMDB_GENRES.HISTORY, TMDB_GENRES.CRIME, TMDB_GENRES.WESTERN],
  ISFJ: [TMDB_GENRES.ROMANCE, TMDB_GENRES.FAMILY, TMDB_GENRES.DRAMA, TMDB_GENRES.ANIMATION],
  ESTJ: [TMDB_GENRES.ACTION, TMDB_GENRES.CRIME, TMDB_GENRES.WAR, TMDB_GENRES.HISTORY],
  ESFJ: [TMDB_GENRES.ROMANCE, TMDB_GENRES.COMEDY, TMDB_GENRES.FAMILY, TMDB_GENRES.MUSIC],

  // Explorers (SP) - 탐험가형: 역동적이고 흥미진진한 콘텐츠 선호
  ISTP: [TMDB_GENRES.ACTION, TMDB_GENRES.THRILLER, TMDB_GENRES.CRIME, TMDB_GENRES.WESTERN],
  ISFP: [TMDB_GENRES.ROMANCE, TMDB_GENRES.DRAMA, TMDB_GENRES.ANIMATION, TMDB_GENRES.MUSIC],
  ESTP: [TMDB_GENRES.ACTION, TMDB_GENRES.COMEDY, TMDB_GENRES.ADVENTURE, TMDB_GENRES.THRILLER],
  ESFP: [TMDB_GENRES.COMEDY, TMDB_GENRES.MUSIC, TMDB_GENRES.ROMANCE, TMDB_GENRES.FAMILY]
};

// 평점 범위별 MBTI 선호도
export const MBTI_RATING_PREFERENCES: Record<MBTIType, { min: number; max: number }> = {
  // 높은 품질을 선호하는 유형들
  INTJ: { min: 7.5, max: 10 },
  INTP: { min: 7.0, max: 10 },
  INFJ: { min: 7.0, max: 10 },
  ISTJ: { min: 7.0, max: 10 },

  // 중간 정도 품질도 수용하는 유형들
  ENTJ: { min: 6.5, max: 10 },
  ENFJ: { min: 6.5, max: 10 },
  ESTJ: { min: 6.5, max: 10 },
  ISFJ: { min: 6.5, max: 10 },

  // 다양한 범위를 수용하는 유형들
  ENTP: { min: 6.0, max: 10 },
  ENFP: { min: 6.0, max: 10 },
  ISTP: { min: 6.0, max: 10 },
  ISFP: { min: 6.0, max: 10 },
  ESTP: { min: 5.5, max: 10 },
  ESFP: { min: 5.5, max: 10 },
  ESFJ: { min: 6.0, max: 10 },
};

/**
 * 영화의 장르와 평점을 기반으로 적합한 MBTI 유형들을 반환
 */
export function classifyMovieForMBTI(
  genreIds: number[],
  rating: number,
  releaseYear?: number
): MBTIType[] {
  const compatibleMBTIs: MBTIType[] = [];

  for (const [mbti, preferredGenres] of Object.entries(MBTI_GENRE_PREFERENCES)) {
    const mbtiType = mbti as MBTIType;

    // 장르 매칭 확인
    const genreMatch = genreIds.some(genreId => preferredGenres.includes(genreId));

    // 평점 범위 확인
    const ratingPreference = MBTI_RATING_PREFERENCES[mbtiType];
    if (!ratingPreference) continue; // 안전 체크 추가
    const ratingMatch = rating >= ratingPreference.min && rating <= ratingPreference.max;

    // 장르 매칭 또는 평점 매칭이 있으면 추가
    if (genreMatch && ratingMatch) {
      compatibleMBTIs.push(mbtiType);
    }
  }

  // 매칭되는 MBTI가 없으면 평점 기준으로라도 몇 개 추가
  if (compatibleMBTIs.length === 0) {
    for (const [mbti, ratingPref] of Object.entries(MBTI_RATING_PREFERENCES)) {
      if (rating >= ratingPref.min && rating <= ratingPref.max) {
        compatibleMBTIs.push(mbti as MBTIType);
      }
    }
  }

  // 최소 1개 이상의 MBTI 반환 보장
  if (compatibleMBTIs.length === 0) {
    // 기본적으로 ENFP를 추가 (가장 개방적인 성향)
    compatibleMBTIs.push('ENFP');
  }

  return compatibleMBTIs;
}

/**
 * 특정 MBTI 유형에 권장되는 최소 영화 수
 */
export const MBTI_MINIMUM_MOVIES = 15;

/**
 * 각 MBTI별로 고르게 분배하기 위한 가중치
 */
export function getMBTIDistributionWeight(currentCounts: Record<MBTIType, number>): Record<MBTIType, number> {
  const weights: Record<MBTIType, number> = {} as Record<MBTIType, number>;

  // 모든 MBTI 유형에 대해 초기화
  const allMBTIs: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const maxCount = Math.max(...Object.values(currentCounts));

  for (const mbti of allMBTIs) {
    const currentCount = currentCounts[mbti] || 0;
    // 현재 영화 수가 적을수록 높은 가중치
    weights[mbti] = Math.max(1, maxCount - currentCount + 1);
  }

  return weights;
}