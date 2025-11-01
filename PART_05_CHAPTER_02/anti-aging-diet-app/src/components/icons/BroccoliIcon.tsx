import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

interface BroccoliIconProps {
  size?: number;
  color?: string;
}

export const BroccoliIcon: React.FC<BroccoliIconProps> = ({
  size = 48,
  color = '#228B22'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* 브로콜리 꽃송이 (여러 개의 원으로 구성) */}
      <Circle cx="32" cy="26" r="8" fill={color} />
      <Circle cx="24" cy="28" r="7" fill="#2E8B57" />
      <Circle cx="40" cy="28" r="7" fill="#2E8B57" />
      <Circle cx="28" cy="20" r="6" fill="#3CB371" />
      <Circle cx="36" cy="20" r="6" fill="#3CB371" />
      <Circle cx="32" cy="18" r="5" fill="#32CD32" />

      {/* 작은 질감 원들 */}
      <Circle cx="26" cy="24" r="3" fill="#90EE90" opacity="0.6" />
      <Circle cx="32" cy="23" r="2.5" fill="#90EE90" opacity="0.6" />
      <Circle cx="38" cy="24" r="3" fill="#90EE90" opacity="0.6" />
      <Circle cx="30" cy="28" r="2" fill="#90EE90" opacity="0.6" />
      <Circle cx="34" cy="28" r="2" fill="#90EE90" opacity="0.6" />

      {/* 브로콜리 줄기 */}
      <Path
        d="M 30 32 L 28 48 L 36 48 L 34 32 Z"
        fill="#98FB98"
      />
      <Path
        d="M 31 32 L 29 48 L 35 48 L 33 32 Z"
        fill="#ADFF2F"
        opacity="0.5"
      />
    </Svg>
  );
};
