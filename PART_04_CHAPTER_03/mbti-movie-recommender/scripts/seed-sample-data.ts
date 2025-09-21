import { PrismaClient } from '@prisma/client';
import { MBTIType } from '../types';
import { classifyMovieForMBTI } from '../lib/mbti-classifier';

const prisma = new PrismaClient();

// 샘플 장르 데이터
const genres = [
  { id: 28, name: '액션' },
  { id: 12, name: '모험' },
  { id: 16, name: '애니메이션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  { id: 99, name: '다큐멘터리' },
  { id: 18, name: '드라마' },
  { id: 10751, name: '가족' },
  { id: 14, name: '판타지' },
  { id: 36, name: '역사' },
  { id: 27, name: '공포' },
  { id: 10402, name: '음악' },
  { id: 9648, name: '미스터리' },
  { id: 10749, name: '로맨스' },
  { id: 878, name: 'SF' },
  { id: 53, name: '스릴러' },
  { id: 10752, name: '전쟁' },
  { id: 37, name: '서부' }
];

// 샘플 영화 데이터 (실제 유명한 영화들)
const sampleMovies = [
  {
    title: '인터스텔라',
    originalTitle: 'Interstellar',
    overview: '지구의 미래를 위해 우주로 떠나는 한 아버지의 감동적인 이야기. 크리스토퍼 놀란 감독의 시공간을 넘나드는 대서사시.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2014-11-07',
    rating: 8.6,
    voteCount: 1500000,
    popularity: 150.5,
    runtime: 169,
    genreIds: [878, 18, 12], // SF, 드라마, 모험
  },
  {
    title: '기생충',
    originalTitle: '기생충',
    overview: '계급사회의 모순을 날카롭게 파헤친 봉준호 감독의 블랙 코미디 걸작. 아카데미 작품상 수상작.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2019-05-30',
    rating: 8.5,
    voteCount: 800000,
    popularity: 120.3,
    runtime: 132,
    genreIds: [18, 35, 53], // 드라마, 코미디, 스릴러
  },
  {
    title: '어벤져스: 엔드게임',
    originalTitle: 'Avengers: Endgame',
    overview: '마블 시네마틱 유니버스의 대장정을 마무리하는 초대형 액션 블록버스터.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2019-04-26',
    rating: 8.4,
    voteCount: 1200000,
    popularity: 200.8,
    runtime: 181,
    genreIds: [28, 12, 878], // 액션, 모험, SF
  },
  {
    title: '쇼생크 탈출',
    originalTitle: 'The Shawshank Redemption',
    overview: '희망을 잃지 않는 한 남자의 감동적인 이야기. IMDB 1위 영화의 불멸의 걸작.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '1994-09-23',
    rating: 9.3,
    voteCount: 2500000,
    popularity: 95.2,
    runtime: 142,
    genreIds: [18], // 드라마
  },
  {
    title: '센과 치히로의 행방불명',
    originalTitle: '千と千尋の神隠し',
    overview: '미야자키 하야오의 환상적인 애니메이션 걸작. 신비로운 세계에서 펼쳐지는 성장 이야기.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2001-07-20',
    rating: 9.3,
    voteCount: 900000,
    popularity: 88.7,
    runtime: 125,
    genreIds: [16, 14, 10751], // 애니메이션, 판타지, 가족
  },
  {
    title: '라라랜드',
    originalTitle: 'La La Land',
    overview: '꿈을 향한 두 연인의 아름다운 뮤지컬 로맨스. 현대적 감각의 클래식 뮤지컬.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2016-12-25',
    rating: 8.0,
    voteCount: 800000,
    popularity: 110.4,
    runtime: 128,
    genreIds: [10749, 10402, 18], // 로맨스, 음악, 드라마
  },
  {
    title: '다크 나이트',
    originalTitle: 'The Dark Knight',
    overview: '크리스토퍼 놀란이 선사하는 배트맨의 어둡고 현실적인 세계. 히스 레저의 명연기가 돋보이는 작품.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2008-07-18',
    rating: 9.0,
    voteCount: 2200000,
    popularity: 140.6,
    runtime: 152,
    genreIds: [28, 80, 18], // 액션, 범죄, 드라마
  },
  {
    title: '매드 맥스: 분노의 도로',
    originalTitle: 'Mad Max: Fury Road',
    overview: '포스트 아포칼립스 세계에서 펼쳐지는 숨막히는 추격전. 실용적 특수효과의 걸작.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2015-05-15',
    rating: 8.1,
    voteCount: 900000,
    popularity: 95.3,
    runtime: 120,
    genreIds: [28, 12, 878], // 액션, 모험, SF
  },
  {
    title: '비포 선라이즈',
    originalTitle: 'Before Sunrise',
    overview: '우연히 만난 두 사람의 하룻밤 로맨스. 대화로만 이루어진 완벽한 로맨틱 코미디.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '1995-01-27',
    rating: 8.1,
    voteCount: 300000,
    popularity: 45.2,
    runtime: 101,
    genreIds: [10749, 18], // 로맨스, 드라마
  },
  {
    title: '백 투 더 퓨처',
    originalTitle: 'Back to the Future',
    overview: '시간여행을 소재로 한 클래식 SF 코미디. 마티와 브라운 박사의 시간여행 모험.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '1985-07-03',
    rating: 8.5,
    voteCount: 1100000,
    popularity: 85.9,
    runtime: 116,
    genreIds: [35, 878, 12], // 코미디, SF, 모험
  },
  // 추가 영화들을 더 넣어서 300개에 가깝게 만들기
  {
    title: '타이타닉',
    originalTitle: 'Titanic',
    overview: '역사상 가장 유명한 침몰 사건을 배경으로 한 비극적 로맨스.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '1997-12-19',
    rating: 7.8,
    voteCount: 1000000,
    popularity: 120.0,
    runtime: 194,
    genreIds: [10749, 18], // 로맨스, 드라마
  },
  {
    title: '포레스트 검프',
    originalTitle: 'Forrest Gump',
    overview: '단순하지만 따뜻한 마음을 가진 포레스트 검프의 인생 이야기.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '1994-07-06',
    rating: 8.8,
    voteCount: 1800000,
    popularity: 110.5,
    runtime: 142,
    genreIds: [18, 10749], // 드라마, 로맨스
  }
];

async function seedGenres() {
  console.log('🎬 장르 데이터 시딩 시작...');

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

async function seedSampleMovies() {
  console.log('🎥 샘플 영화 데이터 시딩 시작...');

  // 각 영화를 여러 번 복제하여 300개에 가깝게 만들기
  const expandedMovies = [];
  for (let i = 0; i < 25; i++) {
    for (const movie of sampleMovies) {
      expandedMovies.push({
        ...movie,
        title: `${movie.title}${i > 0 ? ` (${i + 1})` : ''}`,
        rating: Math.max(5.0, movie.rating + (Math.random() - 0.5) * 2),
        popularity: movie.popularity + Math.random() * 50,
        voteCount: movie.voteCount + Math.floor(Math.random() * 100000),
      });
    }
  }

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

  for (const movieData of expandedMovies) {
    try {
      // 릴리즈 날짜 파싱
      const releaseDate = movieData.releaseDate ? new Date(movieData.releaseDate) : null;
      const releaseYear = releaseDate ? releaseDate.getFullYear() : undefined;

      // MBTI 분류
      const compatibleMBTIs = classifyMovieForMBTI(
        movieData.genreIds,
        movieData.rating,
        releaseYear
      );

      // 데이터베이스에 영화 저장
      const savedMovie = await prisma.movie.create({
        data: {
          title: movieData.title,
          originalTitle: movieData.originalTitle,
          overview: movieData.overview,
          posterPath: movieData.posterPath,
          backdropPath: movieData.backdropPath,
          releaseDate: releaseDate,
          rating: movieData.rating,
          voteCount: movieData.voteCount,
          popularity: movieData.popularity,
          runtime: movieData.runtime,
          originalLanguage: 'ko',
          adult: false,
        },
      });

      // 장르 연결
      for (const genreId of movieData.genreIds) {
        await prisma.movieGenre.create({
          data: {
            movieId: savedMovie.id,
            genreId: genreId,
          },
        });
      }

      // MBTI 유형 연결
      for (const mbtiType of compatibleMBTIs) {
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
      if (processedCount % 50 === 0) {
        console.log(`📊 [${processedCount}/${expandedMovies.length}] 영화 처리 중...`);
      }

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
    console.log('🚀 샘플 데이터 시딩 시작...\n');

    await seedGenres();
    await seedMBTITypes();
    await seedSampleMovies();

    console.log('\n🎉 모든 시딩 작업 완료!');
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();