import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DropdownIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function DropdownIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: DropdownIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </Svg>
  );
}
