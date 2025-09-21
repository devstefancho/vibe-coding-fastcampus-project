export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
  posterUrl: string;
  mbtiTypes: MBTIType[];
}

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIQuestion {
  id: number;
  question: string;
  optionA: {
    text: string;
    trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
  optionB: {
    text: string;
    trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
}

export interface MBTIResult {
  type: MBTIType;
  description: string;
  characteristics: string[];
  preferredGenres: string[];
}

export interface QuizAnswer {
  questionId: number;
  selectedTrait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}