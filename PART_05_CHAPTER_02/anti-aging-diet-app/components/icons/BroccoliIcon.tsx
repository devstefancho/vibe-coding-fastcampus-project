import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const BroccoliIcon: React.FC<IconProps> = ({ size = 48, color = '#5FA777' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Broccoli florets */}
      <Circle cx="24" cy="18" r="5" fill={color} />
      <Circle cx="18" cy="20" r="4" fill={color} />
      <Circle cx="30" cy="20" r="4" fill={color} />
      <Circle cx="21" cy="24" r="3.5" fill={color} />
      <Circle cx="27" cy="24" r="3.5" fill={color} />

      {/* Stem */}
      <Rect x="22" y="26" width="4" height="10" rx="1" fill="#7CB68A" />
      <Path d="M22 30 L20 34 L22 34 Z" fill="#7CB68A" opacity="0.7" />
      <Path d="M26 30 L28 34 L26 34 Z" fill="#7CB68A" opacity="0.7" />
    </Svg>
  );
};
