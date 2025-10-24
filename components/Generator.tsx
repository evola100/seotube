
import React, { useState, useEffect } from 'react';
import { generateSeoContent, generateYouTubeThumbnail, generateAlternativeTitles } from '../services/geminiService';
import { GeneratedContent, AlternativeTitle } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CinematicIcon } from './icons/CinematicIcon';
import { VibrantIcon } from './icons/VibrantIcon';
import { MinimalistIcon } from './icons/MinimalistIcon';
import { PhotorealisticIcon } from './icons/PhotorealisticIcon';

const thumbnailStyles = [
  { id: 'cinematic', name: 'Cinemático', description: 'Look de película, con iluminación dramática.', icon: CinematicIcon },
  { id: 'vibrant', name: 'Vibrante', description: 'Colores saturados y alto contraste para llamar la atención.', icon: VibrantIcon },
  { id: 'minimalist', name: 'Minimalista', description: 'Limpio y simple, con un único punto focal claro.', icon: MinimalistIcon },
  { id: 'photorealistic', name: 'Fotorrealista', description: 'Imagen nítida y detallada, como una foto profesional.', icon: PhotorealisticIcon },
];

interface GeneratorProps {
  videoTopic: string;
  generatedContent: GeneratedContent | null;
  onTopicChange: (topic: string) => void;
  onContentChange: (content: GeneratedContent | null) => void;
  onNewContentGenerated: (topic: string, content: GeneratedContent) => void;
}

const Generator: React.FC<GeneratorProps> = ({
  videoTopic,
  generatedContent,
  onTopicChange,
  onContentChange,
  onNewContentGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // State for alternative titles
  const [alternativeTitles, setAlternativeTitles] = useState<AlternativeTitle[]>([]);
  const [isGeneratingAlternatives, setIsGeneratingAlternatives] = useState(false);
  const [alternativesError, setAlternativesError] = useState<string | null>(null);

  // State for thumbnail generation
  const [addTextToThumbnail, setAddTextToThumbnail] = useState(true);
  const [thumbnailText, setThumbnailText] = useState('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [thumbnailStyle, setThumbnailStyle] = useState('cinematic');
  const [thumbnailGenerationMode, setThumbnailGenerationMode] = useState<'topic' | 'prompt'>('topic');
  const [customThumbnailPrompt, setCustomThumbnailPrompt] = useState('');

  // State for custom SEO prompt
  const [customSeoPrompt, setCustomSeoPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);


  useEffect(() => {
    if (generatedContent?.title) {
      setThumbnailText(generatedContent.title);
    }
  }, [generatedContent]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const element = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    const rect = element.getBoundingClientRect();
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    element.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  const handleGenerate = async () => {
    if (!videoTopic.trim()) {
      setError('Por favor, introduce un tema para el video.');
      return;
    }
    setIsLoading(true);
    setError(null);
    onContentChange(null);
    setCopied(null);
    // Reset sub-generators
    setAlternativeTitles([]);
    setAlternativesError(null);
    setThumbnailImage(null);
    setThumbnailError(null);


    try {
      const content = await generateSeoContent(videoTopic, customSeoPrompt);
      onContentChange(content);
      onNewContentGenerated(videoTopic, content);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateAlternatives = async () => {
    if (!videoTopic || !generatedContent?.title) return;

    setIsGeneratingAlternatives(true);
    setAlternativesError(null);
    setAlternativeTitles([]);

    try {
      const titles = await generateAlternativeTitles(videoTopic, generatedContent.title);
      setAlternativeTitles(titles);
    } catch (err: any) {
      setAlternativesError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsGeneratingAlternatives(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setIsGeneratingThumbnail(true);
    setThumbnailError(null);
    setThumbnailImage(null);

    try {
      const imageBytes = await generateYouTubeThumbnail({
        videoTopic,
        style: thumbnailStyle,
        textOverlay: thumbnailGenerationMode === 'topic' && addTextToThumbnail ? thumbnailText : undefined,
        customPrompt: thumbnailGenerationMode === 'prompt' ? customThumbnailPrompt : undefined,
      });
      setThumbnailImage(`data:image/jpeg;base64,${imageBytes}`);
    } catch (err: any) {
      setThumbnailError(err.message || 'Ocurrió un error inesperado al generar la miniatura.');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClearAll = () => {
    onTopicChange('');
    onContentChange(null);
    setIsLoading(false);
    setError(null);
    setCopied(null);
    setAlternativeTitles([]);
    setIsGeneratingAlternatives(false);
    setAlternativesError(null);
    setAddTextToThumbnail(true);
    setThumbnailText('');
    setIsGeneratingThumbnail(false);
    setThumbnailImage(null);
    setThumbnailError(null);
    setThumbnailStyle('cinematic');
    setThumbnailGenerationMode('topic');
    setCustomThumbnailPrompt('');
    setCustomSeoPrompt('');
    setShowAdvanced(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Click handlers with ripple effect
  const handleGenerateClick = (e: React.MouseEvent<HTMLButtonElement>) => { createRipple(e); handleGenerate(); };
  const handleClearAllClick = (e: React.MouseEvent<HTMLButtonElement>) => { createRipple(e); handleClearAll(); };
  const handleAdvancedClick = (e: React.MouseEvent<HTMLButtonElement>) => { createRipple(e); setShowAdvanced(!showAdvanced); };
  const handleCopyClick = (e: React.MouseEvent<HTMLButtonElement>, text: string, field: string) => { createRipple(e); handleCopy(text, field); };
  const handleGenerateAlternativesClick = (e: React.MouseEvent<HTMLButtonElement>) => { createRipple(e); handleGenerateAlternatives(); };
  const handleGenerateThumbnailClick = (e: React.MouseEvent<HTMLButtonElement>) => { createRipple(e); handleGenerateThumbnail(); };
  const handleStyleClick = (e: React.MouseEvent<HTMLButtonElement>, styleId: string) => { createRipple(e); setThumbnailStyle(styleId); };
  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => { createRipple(e); };

  return (
    <div id="generator" className="mx-auto max-w-4xl px-4 py-24 sm:py-32 lg:px-6">
      <div className="rounded-2xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Generador de Contenido SEO
        </h2>
        <p className="mt-2 text-gray-400">
          Describe la idea de tu video y deja que la IA haga la magia.
        </p>
        
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={videoTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Ej: Cómo hacer el mejor café en casa"
            className="flex-grow rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            disabled={isLoading}
          />
          <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="relative overflow-hidden flex-grow items-center justify-center gap-2 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 flex"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  <span>Generar Contenido</span>
                </>
              )}
            </button>
            {(videoTopic || generatedContent) && (
              <button
                onClick={handleClearAllClick}
                className="relative overflow-hidden flex-shrink-0 rounded-md bg-slate-700/50 p-2.5 text-white shadow-sm transition-all duration-200 border border-slate-600 hover:scale-105 hover:bg-slate-700/80 hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                aria-label="Limpiar todo"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAdvancedClick}
            className="relative overflow-hidden flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-indigo-400 transition-colors hover:bg-white/10 hover:text-indigo-300"
            aria-expanded={showAdvanced}
          >
            <span>{showAdvanced ? 'Ocultar' : 'Mostrar'} opciones avanzadas</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 rounded-md bg-white/5 p-4 ring-1 ring-white/10">
            <label htmlFor="custom-seo-prompt" className="block text-sm font-medium leading-6 text-gray-200">
              Prompt Personalizado (Opcional)
            </label>
            <p className="mt-1 text-sm text-gray-400">
              Añade instrucciones específicas para guiar a la IA (ej: "Usa un tono humorístico y juvenil").
            </p>
            <textarea
              rows={3}
              name="custom-seo-prompt"
              id="custom-seo-prompt"
              value={customSeoPrompt}
              onChange={(e) => setCustomSeoPrompt(e.target.value)}
              className="mt-2 block w-full rounded-md border-0 bg-slate-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder="Ej: Escribe como si fueras un experto en finanzas explicando esto a un principiante."
              disabled={isLoading}
            />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {isLoading && (
            <div className="mt-8 space-y-4 animate-pulse">
                <div className="h-8 w-1/3 rounded bg-white/10"></div>
                <div className="h-20 w-full rounded bg-white/10"></div>
                <div className="h-8 w-1/3 rounded bg-white/10"></div>
                <div className="h-12 w-full rounded bg-white/10"></div>
                <div className="h-8 w-1/3 rounded bg-white/10"></div>
                <div className="h-28 w-full rounded bg-white/10"></div>
                <div className="h-8 w-1/3 rounded bg-white/10"></div>
                <div className="h-12 w-full rounded bg-white/10"></div>
            </div>
        )}

        {generatedContent && (
          <div className="mt-8 divide-y divide-white/10">
            <div className="space-y-6 pb-8">
              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-white">Título Sugerido</h3>
                <div className="mt-2 flex items-start gap-4 rounded-md bg-white/5 p-4">
                  <p className="flex-grow text-gray-300">{generatedContent.title}</p>
                  <button 
                    onClick={(e) => handleCopyClick(e, generatedContent.title, 'title')}
                    className="relative overflow-hidden flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                    aria-label="Copiar título"
                  >
                    {copied === 'title' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Alternative Titles */}
              <div>
                <h3 className="text-lg font-semibold text-white">Títulos Alternativos (Pruebas A/B)</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Usa estas variaciones para descubrir qué título atrae más clics.
                </p>
                <div className="mt-4">
                    <button
                        onClick={handleGenerateAlternativesClick}
                        disabled={isGeneratingAlternatives}
                        className="relative overflow-hidden flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-sky-500 to-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/50 transition-all duration-200 hover:scale-105 hover:from-sky-600 hover:to-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isGeneratingAlternatives ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>Buscando ideas...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generar Alternativas</span>
                            </>
                        )}
                    </button>
                </div>

                {alternativesError && <p className="mt-2 text-sm text-red-400">{alternativesError}</p>}

                {isGeneratingAlternatives ? (
                  <div className="mt-4 space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex animate-pulse items-center gap-4 rounded-md bg-white/5 p-3">
                        <div className="h-12 w-16 flex-shrink-0 rounded-md bg-white/10" />
                        <div className="h-4 flex-grow rounded bg-white/10" />
                      </div>
                    ))}
                  </div>
                ) : alternativeTitles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {alternativeTitles.map((altTitle, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-md bg-white/5 p-3">
                        <div className="w-16 flex-shrink-0 text-center">
                          <span className={`text-2xl font-bold tracking-tight ${getScoreColor(altTitle.seoScore)}`}>
                            {altTitle.seoScore}
                          </span>
                          <span className="block text-xs font-medium uppercase text-gray-400">Puntos</span>
                        </div>
                        <p className="flex-grow border-l border-white/10 pl-4 text-gray-300">{altTitle.title}</p>
                        <button 
                          onClick={(e) => handleCopyClick(e, altTitle.title, `alt-title-${index}`)}
                          className="relative overflow-hidden flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                          aria-label={`Copiar título alternativo ${index + 1}`}
                        >
                          {copied === `alt-title-${index}` ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pinned Comment */}
              <div>
                <h3 className="text-lg font-semibold text-red-400">Comentario Fijado Sugerido</h3>
                <div className="mt-2 flex items-start gap-4 rounded-md bg-white/5 p-4">
                  <p className="flex-grow whitespace-pre-wrap text-yellow-400">{generatedContent.pinnedComment}</p>
                   <button 
                    onClick={(e) => handleCopyClick(e, generatedContent.pinnedComment, 'pinnedComment')}
                    className="relative overflow-hidden flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                    aria-label="Copiar comentario fijado"
                  >
                    {copied === 'pinnedComment' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white">Descripción</h3>
                <div className="mt-2 flex items-start gap-4 rounded-md bg-white/5 p-4">
                  <p className="flex-grow whitespace-pre-wrap text-gray-300">{generatedContent.description}</p>
                   <button 
                    onClick={(e) => handleCopyClick(e, generatedContent.description, 'description')}
                    className="relative overflow-hidden flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                    aria-label="Copiar descripción"
                  >
                    {copied === 'description' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="text-lg font-semibold text-white">Hashtags</h3>
                <div className="mt-2 flex items-start gap-4 rounded-md bg-white/5 p-4">
                  <p className="flex-grow text-indigo-400">{generatedContent.hashtags.join(' ')}</p>
                   <button 
                    onClick={(e) => handleCopyClick(e, generatedContent.hashtags.join(' '), 'hashtags')}
                    className="relative overflow-hidden flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                    aria-label="Copiar hashtags"
                  >
                    {copied === 'hashtags' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-white">Palabras Clave (Keywords)</h3>
                <div className="mt-2 flex items-start gap-4 rounded-md bg-white/5 p-4">
                  <p className="flex-grow text-indigo-400">
                    {generatedContent.keywords.join(', ')}
                  </p>
                   <button 
                    onClick={(e) => handleCopyClick(e, generatedContent.keywords.join(', '), 'keywords')}
                    className="relative overflow-hidden ml-auto flex-shrink-0 rounded-full p-2 text-gray-400 transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
                    aria-label="Copiar palabras clave"
                  >
                    {copied === 'keywords' ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-bold text-white">Generar Miniatura</h3>
              <p className="mt-1 text-sm text-gray-400">
                Crea una miniatura atractiva para tu video en 3 simples pasos.
              </p>

              <div className="mt-6">
                <label className="block text-sm font-medium leading-6 text-gray-300">
                  1. Elige un Estilo Visual
                </label>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {thumbnailStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={(e) => handleStyleClick(e, style.id)}
                      className={`relative overflow-hidden flex items-start space-x-4 rounded-lg border bg-white/5 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:bg-white/20 ${
                        thumbnailStyle === style.id ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-inner shadow-indigo-500/30' : 'border-white/10'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                            <style.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{style.name}</p>
                        <p className="mt-1 text-sm text-gray-400">{style.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className={`transition-opacity ${thumbnailGenerationMode === 'prompt' ? 'opacity-50' : ''}`}>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="add-text"
                        aria-describedby="add-text-description"
                        name="add-text"
                        type="checkbox"
                        checked={addTextToThumbnail}
                        onChange={(e) => setAddTextToThumbnail(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 bg-white/10 text-indigo-600 focus:ring-indigo-600"
                        disabled={thumbnailGenerationMode === 'prompt'}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="add-text" className="font-medium text-gray-300">
                        2. Añadir texto a la miniatura (Opcional)
                      </label>
                    </div>
                  </div>

                  {addTextToThumbnail && (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="thumbnail-text"
                        id="thumbnail-text"
                        value={thumbnailText}
                        onChange={(e) => setThumbnailText(e.target.value)}
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        placeholder="Tu texto aquí..."
                        disabled={thumbnailGenerationMode === 'prompt'}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <p className="mb-2 text-sm font-medium text-gray-300">3. Genera tu imagen</p>
                  <fieldset className="mb-4">
                    <legend className="sr-only">Método de generación de miniatura</legend>
                    <div className="flex items-center gap-x-6">
                      <div className="flex items-center">
                        <input
                          id="topic-mode"
                          name="generation-mode"
                          type="radio"
                          checked={thumbnailGenerationMode === 'topic'}
                          onChange={() => setThumbnailGenerationMode('topic')}
                          className="h-4 w-4 border-gray-300 bg-white/10 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="topic-mode" className="ml-2 block text-sm font-medium leading-6 text-gray-300">
                          Desde el tema
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="prompt-mode"
                          name="generation-mode"
                          type="radio"
                          checked={thumbnailGenerationMode === 'prompt'}
                          onChange={() => setThumbnailGenerationMode('prompt')}
                          className="h-4 w-4 border-gray-300 bg-white/10 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="prompt-mode" className="ml-2 block text-sm font-medium leading-6 text-gray-300">
                          Con prompt personalizado
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  {thumbnailGenerationMode === 'prompt' && (
                    <div>
                      <label htmlFor="custom-prompt" className="sr-only">
                        Prompt Personalizado
                      </label>
                      <textarea
                        rows={3}
                        name="custom-prompt"
                        id="custom-prompt"
                        value={customThumbnailPrompt}
                        onChange={(e) => setCustomThumbnailPrompt(e.target.value)}
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        placeholder="Ej: Un astronauta montando un unicornio en el espacio, estilo arte digital, cinemático..."
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={handleGenerateThumbnailClick}
                    disabled={isGeneratingThumbnail}
                    className="relative overflow-hidden mt-4 flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-green-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isGeneratingThumbnail ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-5 w-5" />
                        <span>Generar Miniatura</span>
                      </>
                    )}
                  </button>
                </div>

                {thumbnailError && <p className="mt-2 text-sm text-red-400">{thumbnailError}</p>}
                
                {isGeneratingThumbnail ? (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white">Creando tu miniatura...</h4>
                    <div className="mt-2 aspect-video w-full max-w-lg animate-pulse rounded-lg bg-white/5" />
                  </div>
                ) : thumbnailImage && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white">Miniatura Generada:</h4>
                    <div className="mt-2 aspect-video w-full max-w-lg overflow-hidden rounded-lg border border-white/10">
                      <img src={thumbnailImage} alt="Miniatura de YouTube generada" className="h-full w-full object-cover" />
                    </div>
                    <a
                      href={thumbnailImage}
                      download="youtube_thumbnail.jpg"
                      onClick={handleDownloadClick}
                      className="relative overflow-hidden mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    >
                      <DownloadIcon className="h-5 w-5" />
                      Descargar Miniatura
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;