import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface SweetPotatoIconProps {
  size?: number;
  color?: string;
}

export const SweetPotatoIcon: React.FC<SweetPotatoIconProps> = ({
  size = 48,
  color = '#D2691E'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 고구마 몸통 */}
      <Ellipse cx="32" cy="35" rx="24" ry="16" fill={color} />
      <Ellipse cx="28" cy="33" rx="20" ry="14" fill="#CD853F" />

      {/* 고구마 질감 */}
      <Ellipse cx="20" cy="32" rx="3" ry="2" fill="#A0522D" opacity="0.4" />
      <Ellipse cx="28" cy="35" rx="2.5" ry="1.5" fill="#A0522D" opacity="0.4" />
      <Ellipse cx="36" cy="33" rx="3" ry="2" fill="#A0522D" opacity="0.4" />
      <Ellipse cx="32" cy="38" rx="2" ry="1.5" fill="#A0522D" opacity="0.4" />

      {/* 작은 뿌리 */}
      <Path
        d="M 18 28 Q 15 26 13 25"
        stroke="#8B4513"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 44 30 Q 47 28 49 27"
        stroke="#8B4513"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};
