import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CheckIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: CheckIconProps) {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </Svg>
  );
}