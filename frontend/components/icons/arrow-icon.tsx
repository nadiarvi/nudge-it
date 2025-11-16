import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ArrowIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
}: ArrowIconProps) {
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
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </Svg>
  );
}
