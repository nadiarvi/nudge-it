import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PlusIconProps {
  size?: number;
  color?: string;
}

export function PlusIcon({ 
  size = 24, 
  color = 'currentColor'
}: PlusIconProps) {
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
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      />
    </Svg>
  );
}