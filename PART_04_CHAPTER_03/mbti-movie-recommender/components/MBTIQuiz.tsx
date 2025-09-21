'use client';

import { useState } from 'react';
import { MBTIQuestion, QuizAnswer, MBTIType } from '@/types';
import { mbtiQuestions, calculateMBTI, mbtiResults } from '@/lib/mbtiData';

interface MBTIQuizProps {
  onComplete: (mbtiType: MBTIType) => void;
}

export default function MBTIQuiz({ onComplete }: MBTIQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'>>({});

  const handleAnswer = (trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P') => {
    const newAnswers = { ...answers, [mbtiQuestions[currentQuestion].id]: trait };
    setAnswers(newAnswers);

    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const mbtiType = calculateMBTI(newAnswers);
      onComplete(mbtiType);
    }
  };

  const question = mbtiQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">MBTI 영화 취향 테스트</h2>
          <span className="text-sm text-black">{currentQuestion + 1} / {mbtiQuestions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">{question.question}</h3>

        <div className="space-y-4">
          <button
            onClick={() => handleAnswer(question.optionA.trait)}
            className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <span className="font-medium">A.</span> {question.optionA.text}
          </button>

          <button
            onClick={() => handleAnswer(question.optionB.trait)}
            className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <span className="font-medium">B.</span> {question.optionB.text}
          </button>
        </div>
      </div>
    </div>
  );
}