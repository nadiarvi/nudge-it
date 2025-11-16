import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SendIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function SendIcon({ 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 1.5 
}: SendIconProps) {
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
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </Svg>
  );
}