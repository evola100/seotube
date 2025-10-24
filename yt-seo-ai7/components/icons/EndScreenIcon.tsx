import React from 'react';

export const EndScreenIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
    <path d="M2 17h20"></path>
    <path d="M9 21h6"></path>
    <path d="M12 7l-3 3 3 3"></path>
    <path d="M15 13l3-3-3-3"></path>
  </svg>
);
