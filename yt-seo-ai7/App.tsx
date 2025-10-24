
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Generator from './components/Generator';
import Features from './components/Features';
import SeoTips from './components/SeoTips';
import Footer from './components/Footer';
import HistorySidebar from './components/HistorySidebar';
import { GeneratedContent, HistoryItem } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('yt-seo-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      
      const storedState = localStorage.getItem('yt-seo-app-state');
      if (storedState) {
        const { currentTopic: savedTopic, currentContent: savedContent } = JSON.parse(storedState);
        if (savedTopic) {
          setCurrentTopic(savedTopic);
        }
        if (savedContent) {
          setCurrentContent(savedContent);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      // Reset to defaults if loading fails
      setHistory([]);
      setCurrentTopic('');
      setCurrentContent(null);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const appState = {
        currentTopic,
        currentContent,
      };
      localStorage.setItem('yt-seo-app-state', JSON.stringify(appState));
    } catch (error) {
      console.error("Failed to save app state to localStorage:", error);
    }
  }, [currentTopic, currentContent]);


  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('yt-seo-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  };

  const handleAddToHistory = (videoTopic: string, content: GeneratedContent) => {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: Date.now(),
      videoTopic,
      content,
    };
    const updatedHistory = [newItem, ...history];
    // Limit history to the 10 most recent items
    const newHistory = updatedHistory.slice(0, 10);
    updateHistory(newHistory);
  };
  
  const handleClearHistory = () => {
    updateHistory([]);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentTopic(item.videoTopic);
    setCurrentContent(item.content);
    setIsHistoryOpen(false);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-gray-200 font-sans antialiased">
      <div className="relative isolate overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>
        <div
          className="absolute top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <Header onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} />
        <main>
          <Hero />
          <Generator 
            key={currentContent?.title} // Force re-render when content is loaded from history
            videoTopic={currentTopic}
            generatedContent={currentContent}
            onTopicChange={setCurrentTopic}
            onContentChange={setCurrentContent}
            onNewContentGenerated={handleAddToHistory}
          />
        </main>
      </div>
      <Features />
      <SeoTips />
      <Footer />
      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;
