import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const AsparagusIcon: React.FC<IconProps> = ({ size = 48, color = '#6BA368' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Asparagus stalks */}
      <Rect x="18" y="12" width="3" height="24" rx="1.5" fill={color} />
      <Rect x="23" y="10" width="3" height="26" rx="1.5" fill={color} />
      <Rect x="28" y="14" width="3" height="22" rx="1.5" fill={color} />

      {/* Tips */}
      <Path d="M19.5 10 L19.5 14 L17 12 Z" fill="#4A7C59" />
      <Path d="M24.5 8 L24.5 12 L22 10 Z" fill="#4A7C59" />
      <Path d="M29.5 12 L29.5 16 L27 14 Z" fill="#4A7C59" />

      {/* Leaf details */}
      <Rect x="16" y="18" width="2" height="1" fill="#4A7C59" opacity="0.7" />
      <Rect x="21" y="16" width="2" height="1" fill="#4A7C59" opacity="0.7" />
      <Rect x="26" y="20" width="2" height="1" fill="#4A7C59" opacity="0.7" />
    </Svg>
  );
};
