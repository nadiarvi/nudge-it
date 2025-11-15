import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SearchIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function SearchIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: SearchIconProps) {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </Svg>
  );
}