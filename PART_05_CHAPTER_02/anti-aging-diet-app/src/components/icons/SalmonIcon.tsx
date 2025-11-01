import React from 'react';
import Svg, { Ellipse, Path, Polygon } from 'react-native-svg';

interface SalmonIconProps {
  size?: number;
  color?: string;
}

export const SalmonIcon: React.FC<SalmonIconProps> = ({
  size = 48,
  color = '#FA8072'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 연어 몸통 */}
      <Ellipse cx="32" cy="32" rx="22" ry="12" fill={color} />
      <Ellipse cx="32" cy="32" rx="20" ry="10" fill="#FFA07A" />

      {/* 연어 머리 (왼쪽) */}
      <Ellipse cx="14" cy="32" rx="6" ry="10" fill="#FF7F50" />

      {/* 연어 꼬리 (오른쪽) */}
      <Polygon points="50,32 58,26 58,38" fill="#FF6347" />
      <Polygon points="52,32 58,28 58,36" fill="#FF7F50" />

      {/* 연어 지느러미 (위) */}
      <Path
        d="M 32 20 L 30 14 L 34 14 Z"
        fill="#FF6347"
      />

      {/* 연어 지느러미 (아래) */}
      <Path
        d="M 36 44 L 34 48 L 38 48 Z"
        fill="#FF6347"
      />

      {/* 연어 살의 흰 줄무늬 */}
      <Path
        d="M 20 28 Q 32 27 44 28"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <Path
        d="M 20 32 Q 32 31 44 32"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <Path
        d="M 20 36 Q 32 35 44 36"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />

      {/* 눈 */}
      <Ellipse cx="16" cy="30" rx="2" ry="2" fill="#333" />
    </Svg>
  );
};
