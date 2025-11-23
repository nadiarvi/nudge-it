import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SortIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function SortIcon({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5
}: SortIconProps) {
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
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </Svg>
  );
}