import React from 'react';
import { SweetPotatoIcon } from './SweetPotatoIcon';
import { AsparagusIcon } from './AsparagusIcon';
import { BroccoliIcon } from './BroccoliIcon';
import { SalmonIcon } from './SalmonIcon';
import { BlueberryIcon } from './BlueberryIcon';

export { SweetPotatoIcon, AsparagusIcon, BroccoliIcon, SalmonIcon, BlueberryIcon };

interface FoodIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const FoodIcon: React.FC<FoodIconProps> = ({ name, size, color }) => {
  switch (name) {
    case 'sweetpotato':
      return <SweetPotatoIcon size={size} color={color} />;
    case 'asparagus':
      return <AsparagusIcon size={size} color={color} />;
    case 'broccoli':
      return <BroccoliIcon size={size} color={color} />;
    case 'salmon':
      return <SalmonIcon size={size} color={color} />;
    case 'blueberry':
      return <BlueberryIcon size={size} color={color} />;
    default:
      return <SweetPotatoIcon size={size} color={color} />;
  }
};
