import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const SweetPotatoIcon: React.FC<IconProps> = ({ size = 48, color = '#FF8C42' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Sweet potato body */}
      <Ellipse cx="24" cy="26" rx="16" ry="10" fill={color} />
      <Ellipse cx="24" cy="26" rx="13" ry="8" fill="#FFA55C" />

      {/* Details/spots */}
      <Ellipse cx="18" cy="24" rx="2" ry="1.5" fill="#FF7722" opacity="0.6" />
      <Ellipse cx="28" cy="27" rx="1.5" ry="1" fill="#FF7722" opacity="0.6" />
      <Ellipse cx="24" cy="29" rx="2" ry="1" fill="#FF7722" opacity="0.6" />
    </Svg>
  );
};
