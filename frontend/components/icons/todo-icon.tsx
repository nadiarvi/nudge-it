import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TodoIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  variant?: 'outline' | 'solid';
}

export function TodoIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5,
  variant = 'outline'
}: TodoIconProps) {
  if (variant === 'solid') {
    return (
      <Svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={color}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM9 7.5a.75.75 0 0 0 0 1.5h11.25a.75.75 0 0 0 0-1.5H9ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM9 12.75a.75.75 0 0 0 0 1.5h11.25a.75.75 0 0 0 0-1.5H9ZM2.625 17.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM9 18a.75.75 0 0 0 0 1.5h11.25a.75.75 0 0 0 0-1.5H9Z"
        />
      </Svg>
    );
  }

  // Default outline variant
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
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </Svg>
  );
}