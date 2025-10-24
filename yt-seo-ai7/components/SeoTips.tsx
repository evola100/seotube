import React from 'react';
import { ThumbnailIcon } from './icons/ThumbnailIcon';
import { MicIcon } from './icons/MicIcon';
import { EndScreenIcon } from './icons/EndScreenIcon';
import { CalendarIcon } from './icons/CalendarIcon';

const tips = [
  {
    name: 'Miniaturas Atractivas',
    description: 'Un buen thumbnail es tan importante como el título. Usa colores contrastantes, rostros expresivos y poco texto para maximizar los clics.',
    icon: ThumbnailIcon,
  },
  {
    name: 'Palabras Clave en tu Video',
    description: "Menciona tu palabra clave principal en los primeros 30 segundos de tu video. El algoritmo de YouTube también 'escucha' tu contenido.",
    icon: MicIcon,
  },
  {
    name: 'Usa Pantallas Finales y Tarjetas',
    description: 'Guía a tus espectadores a otros de tus videos o a suscribirse. Aumenta el tiempo de sesión, una métrica clave para el algoritmo.',
    icon: EndScreenIcon,
  },
  {
    name: 'Publica de Forma Consistente',
    description: 'Mantén un calendario de publicación regular. Esto le enseña al algoritmo que eres un creador activo y mantiene a tu audiencia enganchada.',
    icon: CalendarIcon,
  },
];

const SeoTips: React.FC = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Pro-Tips</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Consejos Extra para Dominar YouTube
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Además de un buen título y descripción, considera estos puntos clave para llevar tu canal al siguiente nivel.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {tips.map((tip) => (
              <div key={tip.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                    <tip.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {tip.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">{tip.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default SeoTips;
