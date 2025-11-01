import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface BlueberryIconProps {
  size?: number;
  color?: string;
}

export const BlueberryIcon: React.FC<BlueberryIconProps> = ({
  size = 48,
  color = '#4169E1'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 블루베리 3개 배치 */}

      {/* 블루베리 1 (왼쪽) */}
      <Circle cx="22" cy="35" r="12" fill={color} />
      <Circle cx="22" cy="35" r="10" fill="#6495ED" />
      <Circle cx="20" cy="32" r="3" fill="#87CEEB" opacity="0.6" />
      {/* 블루베리 1 꽃받침 */}
      <Path
        d="M 22 23 L 20 20 M 22 23 L 24 20 M 22 23 L 22 19"
        stroke="#2F4F4F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="22" cy="23" r="2" fill="#2F4F4F" />

      {/* 블루베리 2 (오른쪽) */}
      <Circle cx="42" cy="35" r="12" fill="#483D8B" />
      <Circle cx="42" cy="35" r="10" fill="#5F69C4" />
      <Circle cx="40" cy="32" r="3" fill="#87CEEB" opacity="0.6" />
      {/* 블루베리 2 꽃받침 */}
      <Path
        d="M 42 23 L 40 20 M 42 23 L 44 20 M 42 23 L 42 19"
        stroke="#2F4F4F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="42" cy="23" r="2" fill="#2F4F4F" />

      {/* 블루베리 3 (중앙 위) */}
      <Circle cx="32" cy="26" r="12" fill="#191970" />
      <Circle cx="32" cy="26" r="10" fill="#4169E1" />
      <Circle cx="30" cy="23" r="3" fill="#87CEEB" opacity="0.6" />
      {/* 블루베리 3 꽃받침 */}
      <Path
        d="M 32 14 L 30 11 M 32 14 L 34 11 M 32 14 L 32 10"
        stroke="#2F4F4F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="32" cy="14" r="2" fill="#2F4F4F" />

      {/* 작은 잎사귀 */}
      <Path
        d="M 44 20 Q 48 18 50 20 Q 48 22 44 20"
        fill="#228B22"
      />
    </Svg>
  );
};
