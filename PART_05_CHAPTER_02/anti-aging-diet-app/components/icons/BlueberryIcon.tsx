import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const BlueberryIcon: React.FC<IconProps> = ({ size = 48, color = '#5B7DC7' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Blueberries */}
      <Circle cx="24" cy="24" r="8" fill={color} />
      <Circle cx="16" cy="26" r="6" fill={color} />
      <Circle cx="32" cy="26" r="6" fill={color} />

      {/* Crown details on main berry */}
      <Path d="M24 18 L23 16 L24 16 L25 16 Z" fill="#4A6BA5" />
      <Circle cx="24" cy="17" r="1" fill="#4A6BA5" />

      {/* Highlights */}
      <Circle cx="22" cy="22" r="2" fill="#7B9DE0" opacity="0.5" />
      <Circle cx="14" cy="24" r="1.5" fill="#7B9DE0" opacity="0.5" />
      <Circle cx="30" cy="24" r="1.5" fill="#7B9DE0" opacity="0.5" />
    </Svg>
  );
};
