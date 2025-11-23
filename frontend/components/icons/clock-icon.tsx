import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ClockIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ClockIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: ClockIconProps) {
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
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </Svg>
  );
}