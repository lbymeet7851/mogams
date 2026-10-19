import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { NavigationTabs } from './components/NavigationTabs';
import { HomeBoardView } from './components/HomeBoardView';
import { AllIdeasView } from './components/AllIdeasView';
import { VibeProjectsView } from './components/VibeProjectsView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Globe, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 bg-white rounded-lg p-4 md:p-5 border border-slate-200/90 shadow-xs min-h-[560px] overflow-hidden flex flex-col justify-between">
      <div>
        {activeTab === 'home' && <HomeBoardView />}
        {activeTab === 'all' && <AllIdeasView />}
        {activeTab === 'vibe' && <VibeProjectsView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </div>
      <Footer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="bg-cyworld-dot min-h-screen p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center antialiased">
        {/* Outer Nostalgic Window Container */}
        <div className="w-full max-w-6xl bg-[#b5c7d3] p-2.5 sm:p-4 rounded-xl cyworld-window border border-slate-400/40">
          {/* Retro Window Top Title Bar */}
          <div className="bg-gradient-to-r from-[#2c5978] to-[#1c3f58] text-white px-3 py-1.5 rounded-t-lg flex items-center justify-between shadow-xs mb-2 text-xs font-retro">
            <div className="flex items-center gap-2">
              <span className="text-amber-300">🌰</span>
              <span className="font-bold tracking-wider text-[13px]">
                모가중 바이브코딩 아이디어 마당
              </span>
              <span className="text-slate-300 text-[11px] hidden sm:inline">
                · 교직원 에듀테크 미니홈피
              </span>
            </div>

            {/* Retro URL Bar & Window Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded text-[10px] text-slate-200 font-mono">
                <Globe className="w-3 h-3 text-sky-300" />
                <span>cyworld.nate.com/moga_vibe</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="w-4 h-4 bg-slate-600/60 rounded flex items-center justify-center cursor-default">_</span>
                <span className="w-4 h-4 bg-slate-600/60 rounded flex items-center justify-center cursor-default">□</span>
                <span className="w-4 h-4 bg-red-600/80 hover:bg-red-600 rounded flex items-center justify-center cursor-default">✕</span>
              </div>
            </div>
          </div>

          {/* Inner Paper Window (Double Frame) */}
          <div className="bg-[#eef2f5] p-3 sm:p-4 rounded-b-lg border-2 border-white shadow-inner flex flex-col md:flex-row gap-3 relative">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Center Content Pane */}
            <div className="flex-1 flex flex-col md:flex-row gap-2 relative">
              <MainContent />

              {/* Right Vertical Navigation Tabs */}
              <NavigationTabs />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
