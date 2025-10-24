import React from 'react';

export const RetroIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <rect x="2" y="7" width="20" height="12" rx="2" ry="2" />
        <path d="M6 11h2" />
        <path d="M16 11h2" />
        <circle cx="8.5" cy="13.5" r="1.5" />
        <circle cx="15.5" cy="13.5" r="1.5" />
    </svg>
);