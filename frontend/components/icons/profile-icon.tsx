import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProfileIconProps {
  size?: number;
}

export function ProfileIcon({ size = 50 }: ProfileIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 50 50" 
      fill="none"
    >
      <Path
        d="M30.8594 15.625C30.8594 17.179 30.2421 18.6694 29.1432 19.7682C28.0444 20.8671 26.554 21.4844 25 21.4844C23.446 21.4844 21.9557 20.8671 20.8568 19.7682C19.758 18.6694 19.1406 17.179 19.1406 15.625C19.1406 14.071 19.758 12.5806 20.8568 11.4818C21.9557 10.383 23.446 9.76563 25 9.76562C26.554 9.76562 28.0444 10.383 29.1432 11.4818C30.2421 12.5806 30.8594 14.071 30.8594 15.625ZM13.2828 37.6844C13.333 34.6099 14.5896 31.6784 16.7816 29.5219C18.9735 27.3655 21.9252 26.157 25 26.157C28.0749 26.157 31.0266 27.3655 33.2185 29.5219C35.4104 31.6784 36.667 34.6099 36.7172 37.6844C33.0413 39.3699 29.044 40.2399 25 40.2344C20.8188 40.2344 16.85 39.3219 13.2828 37.6844Z"
        fill="#3B82F6"
        stroke="#3B82F6"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle 
        opacity={0.5} 
        cx={25} 
        cy={25} 
        r={25} 
        fill="#AFBBFB" 
      />
    </Svg>
  );
}


