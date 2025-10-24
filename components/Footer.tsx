
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
        <p className="text-center text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} YT SEO AI. Hecho con ❤️ y la magia de la IA.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
