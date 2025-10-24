
import React from 'react';
import { HistoryItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  };

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
  
  const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onClear();
  };

  const handleSelectClick = (e: React.MouseEvent<HTMLButtonElement>, item: HistoryItem) => {
    // Basic ripple for list items, doesn't need to be perfect
    const button = e.currentTarget;
    const circle = document.createElement("span");
    circle.style.width = circle.style.height = `10px`;
    circle.style.left = `50%`;
    circle.style.top = `50%`;
    circle.style.backgroundColor = 'rgba(255,255,255,0.2)';
    circle.classList.add("ripple");
    button.appendChild(circle);
    setTimeout(() => { circle.remove(); }, 600);

    onSelect(item);
  }


  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 id="history-title" className="text-lg font-semibold text-white">Historial de Generaciones</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar historial"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </header>
          
          <div className="flex-grow overflow-y-auto">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No hay historial todavía.</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={(e) => handleSelectClick(e, item)}
                      className="relative overflow-hidden w-full text-left p-4 hover:bg-white/5 transition-colors"
                    >
                      <p className="font-semibold text-white truncate">{item.videoTopic}</p>
                      <p className="text-sm text-gray-400">{formatDate(item.timestamp)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {history.length > 0 && (
            <footer className="p-4 border-t border-white/10">
              <button
                onClick={handleClearClick}
                className="relative overflow-hidden w-full flex items-center justify-center gap-2 rounded-md bg-red-600/20 px-3 py-2 text-sm font-semibold text-red-300 shadow-lg shadow-red-500/20 transition-all duration-200 border border-red-500/50 hover:scale-105 hover:bg-red-600/40 hover:text-red-200"
              >
                <TrashIcon className="h-5 w-5" />
                Limpiar Historial
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;