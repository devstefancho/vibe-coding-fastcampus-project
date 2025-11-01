import React from 'react';
import Svg, { Path, Rect, Polygon } from 'react-native-svg';

interface AsparagusIconProps {
  size?: number;
  color?: string;
}

export const AsparagusIcon: React.FC<AsparagusIconProps> = ({
  size = 48,
  color = '#6B8E23'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 아스파라거스 줄기 */}
      <Rect x="28" y="20" width="8" height="32" fill={color} rx="2" />
      <Rect x="29" y="20" width="6" height="32" fill="#7CFC00" opacity="0.5" rx="2" />

      {/* 아스파라거스 끝 (뾰족한 부분) */}
      <Polygon points="32,10 26,20 38,20" fill="#556B2F" />
      <Polygon points="32,12 28,20 36,20" fill="#6B8E23" />

      {/* 아스파라거스 잎 (왼쪽) */}
      <Path
        d="M 28 25 Q 20 25 18 23"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 28 30 Q 22 30 20 28"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 28 35 Q 20 35 18 33"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* 아스파라거스 잎 (오른쪽) */}
      <Path
        d="M 36 25 Q 44 25 46 23"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 36 30 Q 42 30 44 28"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 36 35 Q 44 35 46 33"
        stroke="#6B8E23"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};
