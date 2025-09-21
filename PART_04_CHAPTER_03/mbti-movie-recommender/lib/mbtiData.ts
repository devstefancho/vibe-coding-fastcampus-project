import { MBTIQuestion, MBTIResult, MBTIType } from '@/types';

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    question: "새로운 영화를 선택할 때 어떤 방식을 선호하나요?",
    optionA: {
      text: "친구들과 토론하며 함께 정하기",
      trait: "E"
    },
    optionB: {
      text: "혼자서 조용히 리뷰를 찾아보며 정하기",
      trait: "I"
    }
  },
  {
    id: 2,
    question: "영화를 볼 때 무엇에 더 주목하나요?",
    optionA: {
      text: "현실적인 스토리와 실제 상황들",
      trait: "S"
    },
    optionB: {
      text: "상상력이 풍부한 설정과 은유적 의미",
      trait: "N"
    }
  },
  {
    id: 3,
    question: "영화 평가 시 무엇을 더 중요하게 생각하나요?",
    optionA: {
      text: "논리적 구성과 객관적 완성도",
      trait: "T"
    },
    optionB: {
      text: "감정적 몰입도와 인물에 대한 공감",
      trait: "F"
    }
  },
  {
    id: 4,
    question: "영화 선택에 대한 당신의 스타일은?",
    optionA: {
      text: "미리 계획을 세우고 예매까지 완료",
      trait: "J"
    },
    optionB: {
      text: "그때그때 기분에 따라 즉흥적으로",
      trait: "P"
    }
  }
];

export const mbtiResults: Record<MBTIType, MBTIResult> = {
  INTJ: {
    type: 'INTJ',
    description: '전략가형 - 복잡한 플롯과 깊이 있는 스토리를 선호',
    characteristics: ['독립적', '분석적', '미래지향적', '완벽주의적'],
    preferredGenres: ['Sci-Fi', 'Thriller', 'Mystery', 'Drama']
  },
  INTP: {
    type: 'INTP',
    description: '논리술사형 - 창의적이고 독특한 영화를 선호',
    characteristics: ['논리적', '창의적', '호기심많은', '독립적'],
    preferredGenres: ['Sci-Fi', 'Fantasy', 'Documentary', 'Independent']
  },
  ENTJ: {
    type: 'ENTJ',
    description: '통솔자형 - 스케일이 큰 서사와 리더십을 다룬 영화 선호',
    characteristics: ['결단력있는', '야심찬', '효율적', '자신감있는'],
    preferredGenres: ['Action', 'Biography', 'War', 'Drama']
  },
  ENTP: {
    type: 'ENTP',
    description: '토론가형 - 참신하고 도전적인 영화를 선호',
    characteristics: ['창의적', '활발한', '논쟁적', '적응력있는'],
    preferredGenres: ['Comedy', 'Adventure', 'Sci-Fi', 'Crime']
  },
  INFJ: {
    type: 'INFJ',
    description: '옹호자형 - 의미있고 감동적인 스토리를 선호',
    characteristics: ['이상주의적', '창의적', '결단력있는', '통찰력있는'],
    preferredGenres: ['Drama', 'Romance', 'Fantasy', 'Animation']
  },
  INFP: {
    type: 'INFP',
    description: '중재자형 - 감정적 깊이와 개성이 담긴 영화 선호',
    characteristics: ['이상주의적', '충성스러운', '적응력있는', '호기심많은'],
    preferredGenres: ['Romance', 'Drama', 'Independent', 'Animation']
  },
  ENFJ: {
    type: 'ENFJ',
    description: '선도자형 - 인간관계와 성장을 다룬 영화 선호',
    characteristics: ['카리스마있는', '이타적', '신뢰할수있는', '자연스러운리더'],
    preferredGenres: ['Drama', 'Biography', 'Romance', 'Family']
  },
  ENFP: {
    type: 'ENFP',
    description: '활동가형 - 밝고 에너지 넘치는 영화를 선호',
    characteristics: ['열정적', '창의적', '사교적', '독립적'],
    preferredGenres: ['Comedy', 'Adventure', 'Musical', 'Family']
  },
  ISTJ: {
    type: 'ISTJ',
    description: '현실주의자형 - 전통적이고 완성도 높은 영화 선호',
    characteristics: ['책임감있는', '현실적', '신뢰할수있는', '성실한'],
    preferredGenres: ['Drama', 'Biography', 'History', 'Crime']
  },
  ISFJ: {
    type: 'ISFJ',
    description: '옹호자형 - 따뜻하고 인간적인 스토리를 선호',
    characteristics: ['보호적', '친절한', '책임감있는', '헌신적'],
    preferredGenres: ['Romance', 'Family', 'Drama', 'Animation']
  },
  ESTJ: {
    type: 'ESTJ',
    description: '경영자형 - 명확한 구조의 오락영화를 선호',
    characteristics: ['조직적', '실용적', '현실적', '결단력있는'],
    preferredGenres: ['Action', 'Crime', 'Biography', 'War']
  },
  ESFJ: {
    type: 'ESFJ',
    description: '집정관형 - 따뜻하고 대중적인 영화를 선호',
    characteristics: ['협조적', '인기많은', '배려깊은', '충성스러운'],
    preferredGenres: ['Romance', 'Comedy', 'Family', 'Musical']
  },
  ISTP: {
    type: 'ISTP',
    description: '만능재주꾼형 - 액션과 기술적 완성도를 중시',
    characteristics: ['관용적', '유연한', '매력적', '조용한'],
    preferredGenres: ['Action', 'Thriller', 'Crime', 'Western']
  },
  ISFP: {
    type: 'ISFP',
    description: '모험가형 - 예술적이고 감성적인 영화 선호',
    characteristics: ['친근한', '민감한', '친절한', '겸손한'],
    preferredGenres: ['Romance', 'Drama', 'Independent', 'Animation']
  },
  ESTP: {
    type: 'ESTP',
    description: '사업가형 - 흥미진진한 액션영화를 선호',
    characteristics: ['친근한', '현실적', '실용적', '활발한'],
    preferredGenres: ['Action', 'Comedy', 'Adventure', 'Thriller']
  },
  ESFP: {
    type: 'ESFP',
    description: '연예인형 - 즐겁고 감정적인 영화를 선호',
    characteristics: ['외향적', '친근한', '수용적', '자발적'],
    preferredGenres: ['Comedy', 'Musical', 'Romance', 'Family']
  }
};

export function calculateMBTI(answers: Record<number, 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'>): MBTIType {
  const traits = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  Object.values(answers).forEach(trait => {
    traits[trait]++;
  });

  const result =
    (traits.E > traits.I ? 'E' : 'I') +
    (traits.S > traits.N ? 'S' : 'N') +
    (traits.T > traits.F ? 'T' : 'F') +
    (traits.J > traits.P ? 'J' : 'P');

  return result as MBTIType;
}