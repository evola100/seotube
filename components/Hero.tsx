
import React from 'react';

const Hero: React.FC = () => {
  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
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

  return (
    <div className="relative px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Crea Contenido Viral para YouTube con IA
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Optimiza tus videos en segundos. Genera títulos, descripciones y hashtags perfectos para el SEO que dispararán tus vistas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#generator"
              onClick={createRipple}
              className="relative overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Empezar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;