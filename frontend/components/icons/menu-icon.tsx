import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MenuIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function MenuIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: MenuIconProps) {
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
        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </Svg>
  );
}
