import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CloseIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CloseIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
}: CloseIconProps) {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </Svg>
  );
}
