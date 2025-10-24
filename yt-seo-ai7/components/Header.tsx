
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  onToggleHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    const rect = button.getBoundingClientRect();
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  const handleToggleHistoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onToggleHistory();
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold tracking-tight text-white">YT SEO AI</span>
          </a>
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={handleToggleHistoryClick}
            className="relative overflow-hidden inline-flex items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-semibold text-gray-300 transition-all duration-200 hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Ver historial"
          >
            <HistoryIcon className="h-5 w-5" aria-hidden="true" />
            <span className="ml-2">Historial</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;