
import React from 'react';

export const EngagementIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M7 10v4h10v-4z"></path>
    <path d="M17 10V4H7v6"></path>
    <path d="M21 14v6H3v-6"></path>
  </svg>
);
