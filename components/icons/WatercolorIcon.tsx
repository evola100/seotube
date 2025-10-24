import React from 'react';

export const WatercolorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15.002 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"/>
    <path d="M12.5 11.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>
    <path d="M6.5 11.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"/>
    <path d="M17.5 11.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>
  </svg>
);