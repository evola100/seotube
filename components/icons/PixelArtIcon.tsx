import React from 'react';

export const PixelArtIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="currentColor"
        strokeWidth="0.5"
        {...props}
    >
        <path d="M10 4H6v4h4V4z"/>
        <path d="M18 4h-4v4h4V4z"/>
        <path d="M22 8h-4v4h4V8z"/>
        <path d="M14 8h-4v4h4V8z"/>
        <path d="M6 8H2v4h4V8z"/>
        <path d="M18 12h-4v4h4v-4z"/>
        <path d="M10 12H6v4h4v-4z"/>
        <path d="M14 16h-4v4h4v-4z"/>
    </svg>
);