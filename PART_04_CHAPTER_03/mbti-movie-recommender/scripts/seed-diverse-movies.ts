import { PrismaClient } from '@prisma/client';
import { MBTIType } from '../types';
import { classifyMovieForMBTI } from '../lib/mbti-classifier';

const prisma = new PrismaClient();

// 다양한 장르의 실제 영화 데이터
const diverseMovies = [
  // SF/판타지
  { title: '인터스텔라', originalTitle: 'Interstellar', overview: '지구의 미래를 위해 우주로 떠나는 한 아버지의 감동적인 이야기', releaseDate: '2014-11-07', rating: 8.6, voteCount: 1500000, popularity: 150.5, runtime: 169, genreIds: [878, 18, 12] },
  { title: '블레이드 러너 2049', originalTitle: 'Blade Runner 2049', overview: '미래 사회에서 인간과 리플리칸트의 경계를 탐구하는 영화', releaseDate: '2017-10-06', rating: 8.0, voteCount: 500000, popularity: 120.3, runtime: 164, genreIds: [878, 53, 18] },
  { title: '매트릭스', originalTitle: 'The Matrix', overview: '현실과 가상현실의 경계를 다룬 혁신적인 SF 액션', releaseDate: '1999-03-31', rating: 8.7, voteCount: 1800000, popularity: 140.2, runtime: 136, genreIds: [28, 878] },
  { title: '스타워즈: 새로운 희망', originalTitle: 'Star Wars', overview: '은하계를 구하기 위한 반란군의 모험', releaseDate: '1977-05-25', rating: 8.6, voteCount: 1300000, popularity: 130.4, runtime: 121, genreIds: [12, 28, 878] },
  { title: '아바타', originalTitle: 'Avatar', overview: '판도라 행성에서 펼쳐지는 장대한 모험', releaseDate: '2009-12-18', rating: 7.8, voteCount: 1200000, popularity: 160.1, runtime: 162, genreIds: [28, 12, 14, 878] },

  // 액션/모험
  { title: '어벤져스: 엔드게임', originalTitle: 'Avengers: Endgame', overview: '마블 히어로들의 최종 결전', releaseDate: '2019-04-26', rating: 8.4, voteCount: 1200000, popularity: 200.8, runtime: 181, genreIds: [28, 12, 878] },
  { title: '다크 나이트', originalTitle: 'The Dark Knight', overview: '배트맨과 조커의 대결을 그린 걸작', releaseDate: '2008-07-18', rating: 9.0, voteCount: 2200000, popularity: 140.6, runtime: 152, genreIds: [28, 80, 18] },
  { title: '매드 맥스: 분노의 도로', originalTitle: 'Mad Max: Fury Road', overview: '포스트 아포칼립스 세계의 추격전', releaseDate: '2015-05-15', rating: 8.1, voteCount: 900000, popularity: 95.3, runtime: 120, genreIds: [28, 12, 878] },
  { title: '존 윅', originalTitle: 'John Wick', overview: '전설적인 킬러의 복수 이야기', releaseDate: '2014-10-24', rating: 7.4, voteCount: 600000, popularity: 85.2, runtime: 101, genreIds: [28, 80, 53] },
  { title: '레옹', originalTitle: 'Léon: The Professional', overview: '킬러와 소녀의 특별한 우정', releaseDate: '1994-09-14', rating: 8.5, voteCount: 1100000, popularity: 75.4, runtime: 110, genreIds: [28, 80, 18] },

  // 드라마
  { title: '쇼생크 탈출', originalTitle: 'The Shawshank Redemption', overview: '희망을 잃지 않는 한 남자의 감동적인 이야기', releaseDate: '1994-09-23', rating: 9.3, voteCount: 2500000, popularity: 95.2, runtime: 142, genreIds: [18] },
  { title: '대부', originalTitle: 'The Godfather', overview: '마피아 가문의 권력 승계를 그린 걸작', releaseDate: '1972-03-24', rating: 9.2, voteCount: 1700000, popularity: 120.5, runtime: 175, genreIds: [18, 80] },
  { title: '기생충', originalTitle: '기생충', overview: '계급 갈등을 다룬 봉준호 감독의 작품', releaseDate: '2019-05-30', rating: 8.5, voteCount: 800000, popularity: 120.3, runtime: 132, genreIds: [18, 35, 53] },
  { title: '포레스트 검프', originalTitle: 'Forrest Gump', overview: '단순하지만 따뜻한 마음을 가진 포레스트의 인생 이야기', releaseDate: '1994-07-06', rating: 8.8, voteCount: 1800000, popularity: 110.5, runtime: 142, genreIds: [18, 10749] },
  { title: '굿 윌 헌팅', originalTitle: 'Good Will Hunting', overview: '천재 청년의 성장과 치유 이야기', releaseDate: '1997-12-05', rating: 8.3, voteCount: 900000, popularity: 70.2, runtime: 126, genreIds: [18] },

  // 로맨스
  { title: '타이타닉', originalTitle: 'Titanic', overview: '침몰하는 타이타닉호에서 피어난 사랑', releaseDate: '1997-12-19', rating: 7.8, voteCount: 1000000, popularity: 120.0, runtime: 194, genreIds: [10749, 18] },
  { title: '라라랜드', originalTitle: 'La La Land', overview: '꿈을 향한 두 연인의 뮤지컬 로맨스', releaseDate: '2016-12-25', rating: 8.0, voteCount: 800000, popularity: 110.4, runtime: 128, genreIds: [10749, 10402, 18] },
  { title: '비포 선라이즈', originalTitle: 'Before Sunrise', overview: '우연히 만난 두 사람의 하룻밤 로맨스', releaseDate: '1995-01-27', rating: 8.1, voteCount: 300000, popularity: 45.2, runtime: 101, genreIds: [10749, 18] },
  { title: '노트북', originalTitle: 'The Notebook', overview: '알츠하이머에 걸린 아내를 위한 남편의 사랑', releaseDate: '2004-06-25', rating: 7.8, voteCount: 550000, popularity: 85.3, runtime: 123, genreIds: [10749, 18] },
  { title: '카사블랑카', originalTitle: 'Casablanca', overview: '전쟁 중 카사블랑카에서 피어난 사랑', releaseDate: '1942-11-26', rating: 8.5, voteCount: 550000, popularity: 60.1, runtime: 102, genreIds: [10749, 18] },

  // 코미디
  { title: '백 투 더 퓨처', originalTitle: 'Back to the Future', overview: '시간여행을 소재로 한 클래식 코미디', releaseDate: '1985-07-03', rating: 8.5, voteCount: 1100000, popularity: 85.9, runtime: 116, genreIds: [35, 878, 12] },
  { title: '그랜드 부다페스트 호텔', originalTitle: 'The Grand Budapest Hotel', overview: '웨스 앤더슨 특유의 시각적 코미디', releaseDate: '2014-03-28', rating: 8.1, voteCount: 800000, popularity: 75.5, runtime: 99, genreIds: [35, 18] },
  { title: '인사이드 아웃', originalTitle: 'Inside Out', overview: '감정들의 모험을 그린 픽사 애니메이션', releaseDate: '2015-06-19', rating: 8.1, voteCount: 650000, popularity: 120.7, runtime: 95, genreIds: [16, 10751, 35] },
  { title: '토이 스토리', originalTitle: 'Toy Story', overview: '장난감들의 모험을 그린 첫 3D 애니메이션', releaseDate: '1995-11-22', rating: 8.3, voteCount: 900000, popularity: 100.2, runtime: 81, genreIds: [16, 10751, 35] },
  { title: '주토피아', originalTitle: 'Zootopia', overview: '동물들의 도시에서 펼쳐지는 모험', releaseDate: '2016-03-04', rating: 8.0, voteCount: 500000, popularity: 95.8, runtime: 108, genreIds: [16, 10751, 35] },

  // 애니메이션
  { title: '센과 치히로의 행방불명', originalTitle: '千と千尋の神隠し', overview: '미야자키 하야오의 환상적인 애니메이션', releaseDate: '2001-07-20', rating: 9.3, voteCount: 900000, popularity: 88.7, runtime: 125, genreIds: [16, 14, 10751] },
  { title: '월-E', originalTitle: 'WALL-E', overview: '외로운 로봇의 사랑 이야기', releaseDate: '2008-06-27', rating: 8.4, voteCount: 1000000, popularity: 110.3, runtime: 98, genreIds: [16, 10751, 878] },
  { title: '하울의 움직이는 성', originalTitle: 'ハウルの動く城', overview: '마법사 하울과 소피의 이야기', releaseDate: '2004-11-20', rating: 8.2, voteCount: 400000, popularity: 70.5, runtime: 119, genreIds: [16, 14, 10749] },
  { title: '토토로', originalTitle: '톤네르노모포', overview: '시골에서 만난 신비한 존재 토토로', releaseDate: '1988-04-16', rating: 8.2, voteCount: 300000, popularity: 65.2, runtime: 86, genreIds: [16, 10751, 14] },
  { title: '코코', originalTitle: 'Coco', overview: '멕시코 죽음의 날을 배경으로 한 가족 이야기', releaseDate: '2017-11-22', rating: 8.4, voteCount: 450000, popularity: 95.1, runtime: 105, genreIds: [16, 10751, 10402] },

  // 스릴러/미스터리
  { title: '살인의 추억', originalTitle: '살인의 추억', overview: '연쇄살인 사건을 다룬 봉준호 감독의 작품', releaseDate: '2003-05-02', rating: 8.1, voteCount: 170000, popularity: 60.3, runtime: 132, genreIds: [80, 18, 53] },
  { title: '식스 센스', originalTitle: 'The Sixth Sense', overview: '죽은 자를 보는 소년의 이야기', releaseDate: '1999-08-06', rating: 8.1, voteCount: 950000, popularity: 80.4, runtime: 107, genreIds: [18, 9648, 53] },
  { title: '셔터 아일랜드', originalTitle: 'Shutter Island', overview: '정신병원에서 벌어지는 미스터리', releaseDate: '2010-02-19', rating: 8.2, voteCount: 1200000, popularity: 85.7, runtime: 138, genreIds: [9648, 53, 18] },
  { title: '양들의 침묵', originalTitle: 'The Silence of the Lambs', overview: '한니발 렉터와 클라리스의 심리전', releaseDate: '1991-02-14', rating: 8.6, voteCount: 1400000, popularity: 90.2, runtime: 118, genreIds: [80, 18, 53] },
  { title: '메멘토', originalTitle: 'Memento', overview: '기억을 잃은 남자의 복수 이야기', releaseDate: '2000-10-11', rating: 8.4, voteCount: 1200000, popularity: 75.8, runtime: 113, genreIds: [9648, 53] },

  // 공포
  { title: '샤이닝', originalTitle: 'The Shining', overview: '스탠리 큐브릭의 심리 공포 걸작', releaseDate: '1980-05-23', rating: 8.4, voteCount: 950000, popularity: 70.5, runtime: 146, genreIds: [27, 18] },
  { title: '엑소시스트', originalTitle: 'The Exorcist', overview: '악령에 씌인 소녀의 이야기', releaseDate: '1973-12-26', rating: 8.0, voteCount: 400000, popularity: 65.3, runtime: 122, genreIds: [27] },
  { title: '헤레디터리', originalTitle: 'Hereditary', overview: '가족을 덮친 저주의 비밀', releaseDate: '2018-06-08', rating: 7.3, voteCount: 300000, popularity: 55.2, runtime: 127, genreIds: [27, 18, 9648] },
  { title: '겟 아웃', originalTitle: 'Get Out', overview: '인종차별을 다룬 사회적 공포영화', releaseDate: '2017-02-24', rating: 7.7, voteCount: 550000, popularity: 80.1, runtime: 104, genreIds: [27, 9648, 53] },
  { title: '컨저링', originalTitle: 'The Conjuring', overview: '실화를 바탕으로 한 초자연적 공포', releaseDate: '2013-07-19', rating: 7.5, voteCount: 480000, popularity: 75.4, runtime: 112, genreIds: [27, 9648] },

  // 전쟁/역사
  { title: '라이언 일병 구하기', originalTitle: 'Saving Private Ryan', overview: '2차 대전 노르망디 상륙 작전', releaseDate: '1998-07-24', rating: 8.6, voteCount: 1300000, popularity: 100.2, runtime: 169, genreIds: [18, 10752] },
  { title: '쉰들러 리스트', originalTitle: "Schindler's List", overview: '홀로코스트 속에서 유대인을 구한 실화', releaseDate: '1993-12-15', rating: 8.9, voteCount: 1300000, popularity: 95.1, runtime: 195, genreIds: [18, 36, 10752] },
  { title: '덩케르크', originalTitle: 'Dunkirk', overview: '덩케르크 철수 작전을 그린 전쟁영화', releaseDate: '2017-07-21', rating: 7.8, voteCount: 650000, popularity: 85.3, runtime: 106, genreIds: [18, 10752, 53] },
  { title: '1917', originalTitle: '1917', overview: '1차 대전을 배경으로 한 원테이크 영화', releaseDate: '2019-12-25', rating: 8.3, voteCount: 550000, popularity: 90.4, runtime: 119, genreIds: [18, 10752] },
  { title: '아포칼립토 나우', originalTitle: 'Apocalypse Now', overview: '베트남 전쟁의 광기를 그린 걸작', releaseDate: '1979-08-15', rating: 8.4, voteCount: 650000, popularity: 70.2, runtime: 147, genreIds: [18, 10752] },

  // 가족/어드벤처
  { title: 'E.T.', originalTitle: 'E.T. the Extra-Terrestrial', overview: '외계인과 소년의 우정', releaseDate: '1982-06-11', rating: 7.8, voteCount: 400000, popularity: 60.5, runtime: 115, genreIds: [10751, 878, 18] },
  { title: '인디아나 존스: 레이더스', originalTitle: 'Raiders of the Lost Ark', overview: '고고학자 인디아나 존스의 모험', releaseDate: '1981-06-12', rating: 8.5, voteCount: 950000, popularity: 85.2, runtime: 115, genreIds: [12, 28] },
  { title: '주라기 공원', originalTitle: 'Jurassic Park', overview: '공룡들이 되살아난 테마파크', releaseDate: '1993-06-11', rating: 8.1, voteCount: 900000, popularity: 120.3, runtime: 127, genreIds: [12, 878, 53] },
  { title: '겨울왕국', originalTitle: 'Frozen', overview: '자매의 사랑과 용기를 그린 디즈니 애니메이션', releaseDate: '2013-11-27', rating: 7.4, voteCount: 600000, popularity: 150.1, runtime: 102, genreIds: [16, 10751, 35, 10402] },
  { title: '니모를 찾아서', originalTitle: 'Finding Nemo', overview: '아버지 물고기가 아들을 찾는 모험', releaseDate: '2003-05-30', rating: 8.1, voteCount: 950000, popularity: 110.5, runtime: 100, genreIds: [16, 10751, 35] },

  // 음악/뮤지컬
  { title: '보헤미안 랩소디', originalTitle: 'Bohemian Rhapsody', overview: '퀸의 프레디 머큐리 이야기', releaseDate: '2018-10-24', rating: 8.0, voteCount: 900000, popularity: 130.2, runtime: 134, genreIds: [18, 10402] },
  { title: '사운드 오브 뮤직', originalTitle: 'The Sound of Music', overview: '오스트리아를 배경으로 한 뮤지컬', releaseDate: '1965-03-02', rating: 8.0, voteCount: 220000, popularity: 50.3, runtime: 172, genreIds: [18, 10751, 10402] },
  { title: '시카고', originalTitle: 'Chicago', overview: '1920년대 시카고를 배경으로 한 뮤지컬', releaseDate: '2002-12-27', rating: 7.1, voteCount: 220000, popularity: 40.2, runtime: 113, genreIds: [35, 80, 10402] },
  { title: '무랑 루즈', originalTitle: 'Moulin Rouge!', overview: '파리 몽마르트의 카바레를 배경으로 한 로맨스', releaseDate: '2001-05-18', rating: 7.6, voteCount: 280000, popularity: 60.1, runtime: 127, genreIds: [18, 10402, 10749] },
  { title: '머머 미아!', originalTitle: 'Mamma Mia!', overview: 'ABBA의 음악으로 만든 유쾌한 뮤지컬', releaseDate: '2008-07-10', rating: 6.4, voteCount: 250000, popularity: 70.4, runtime: 108, genreIds: [35, 10402, 10749] }
];

// 장르 정보
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

async function seedDiverseMovies() {
  console.log('🎥 다양한 영화 데이터 시딩 시작...');

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

  for (const movieData of diverseMovies) {
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
          posterPath: null,
          backdropPath: null,
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
      console.log(`📊 [${processedCount}/${diverseMovies.length}] "${movieData.title}" 처리 완료 (MBTI: ${compatibleMBTIs.join(', ')})`);

    } catch (error) {
      console.error(`Error processing movie ${movieData.title}:`, error);
    }
  }

  console.log('\n🎯 MBTI별 영화 분포:');
  for (const [mbti, count] of Object.entries(mbtiCounts)) {
    console.log(`${mbti}: ${count}개`);
  }

  console.log(`\n✅ 총 ${processedCount}개 다양한 영화 시딩 완료`);
}

async function main() {
  try {
    console.log('🚀 다양한 영화 데이터 시딩 시작...\n');

    // 기존 데이터 삭제
    console.log('🗑️ 기존 데이터 삭제 중...');
    await prisma.movieMbtiType.deleteMany();
    await prisma.movieGenre.deleteMany();
    await prisma.movie.deleteMany();

    await seedGenres();
    await seedMBTITypes();
    await seedDiverseMovies();

    console.log('\n🎉 모든 시딩 작업 완료!');
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();