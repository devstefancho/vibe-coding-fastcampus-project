'use client';

import { MBTIType } from '@/types';
import { mbtiResults } from '@/lib/mbtiData';

interface MBTISelectorProps {
  onSelect: (mbtiType: MBTIType) => void;
}

const mbtiTypes: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const getTypeColor = (type: MBTIType): string => {
  // Analysts (NT) - 보라색 계열
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return 'bg-purple-500 hover:bg-purple-600';

  // Diplomats (NF) - 초록색 계열
  if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(type)) return 'bg-green-500 hover:bg-green-600';

  // Sentinels (SJ) - 파란색 계열
  if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return 'bg-blue-500 hover:bg-blue-600';

  // Explorers (SP) - 주황색 계열
  return 'bg-orange-500 hover:bg-orange-600';
};

export default function MBTISelector({ onSelect }: MBTISelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">
        이미 MBTI를 알고 계신가요?
      </h2>
      <p className="text-center text-gray-600 mb-8">
        아래에서 당신의 MBTI 유형을 선택하면 바로 맞춤 영화를 추천해드려요!
      </p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {mbtiTypes.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`
              ${getTypeColor(type)}
              text-white font-bold py-3 px-2 rounded-lg
              transition-all duration-200
              transform hover:scale-105 hover:shadow-lg
              text-sm sm:text-base
            `}
            title={mbtiResults[type].description}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="font-medium">분석가형 (NT)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="font-medium">외교관형 (NF)</span>
          </div>
        </div>
        <div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="font-medium">관리자형 (SJ)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="font-medium">탐험가형 (SP)</span>
          </div>
        </div>
      </div>
    </div>
  );
}