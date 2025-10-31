import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const SalmonIcon: React.FC<IconProps> = ({ size = 48, color = '#FF9478' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Salmon body */}
      <Ellipse cx="24" cy="24" rx="14" ry="8" fill={color} />

      {/* Tail */}
      <Path d="M10 24 L6 20 L6 28 Z" fill={color} />

      {/* Stripes */}
      <Path d="M18 20 L18 28" stroke="#FFA590" strokeWidth="1" opacity="0.6" />
      <Path d="M22 20 L22 28" stroke="#FFA590" strokeWidth="1" opacity="0.6" />
      <Path d="M26 20 L26 28" stroke="#FFA590" strokeWidth="1" opacity="0.6" />
      <Path d="M30 20 L30 28" stroke="#FFA590" strokeWidth="1" opacity="0.6" />

      {/* Eye */}
      <Ellipse cx="34" cy="24" rx="1.5" ry="1.5" fill="#333" />
    </Svg>
  );
};
