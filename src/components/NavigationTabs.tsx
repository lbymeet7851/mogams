import React from 'react';
import { Home, ListFilter, Code2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin } = useApp();

  const tabs = [
    { id: 'home' as const, label: '게시판', icon: Home, color: 'text-orange-600' },
    { id: 'all' as const, label: '모아보기', icon: ListFilter, color: 'text-sky-600' },
    { id: 'vibe' as const, label: '바이브구현관', icon: Code2, color: 'text-emerald-600' },
    { id: 'admin' as const, label: '관리자', icon: ShieldAlert, color: 'text-rose-600', badge: isAdmin ? '운영중' : undefined }
  ];

  return (
    <nav className="flex md:flex-col shrink-0 gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 z-10">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all rounded-t-lg md:rounded-t-none md:rounded-r-lg border ${
              isActive
                ? 'bg-white text-slate-900 border-slate-300 md:border-l-transparent md:-ml-[1px] shadow-sm font-retro text-sm z-20'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-500 border-slate-200/90 font-sans'
            }`}
          >
            <Icon className={`w-4 h-4 ${tab.color}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[10px] px-1 py-0.2 bg-rose-500 text-white rounded font-sans">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
