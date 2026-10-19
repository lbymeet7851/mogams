import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ThumbsUp, 
  Award,
  ChevronRight,
  School
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { ideas, voteIdea, votedIdeaIds, setActiveTab, visitorStats } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Calculate total acorns
  const totalAcorns = ideas.reduce((acc, curr) => acc + curr.likesCount, 0);

  // Top 5 ranking ideas sorted by likes
  const topIdeas = [...ideas]
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  return (
    <aside className="w-full md:w-72 shrink-0 flex flex-col gap-3 font-sans">
      {/* Miniroom & Profile Card */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm flex flex-col gap-3">
        {/* Real Visitor Counter */}
        <div className="flex items-center justify-between text-[11px] font-retro text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/80">
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-bold">TODAY</span>
            <span className="font-bold text-slate-800 tabular-nums">{visitorStats.today.toLocaleString()}</span>
          </div>
          <div className="text-slate-300">|</div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">TOTAL</span>
            <span className="font-bold text-slate-800 tabular-nums">{visitorStats.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Miniroom Graphic View */}
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-miniroom-grid p-3 flex flex-col items-center justify-center min-h-[160px] text-center shadow-inner">
          {/* Cyber pixel classroom scene */}
          <div className="absolute top-2 left-2 text-[10px] font-retro px-1.5 py-0.5 bg-orange-500 text-white rounded">
            교직원 연구실
          </div>

          <div className="flex flex-col items-center gap-1.5 my-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-300 to-amber-100 flex items-center justify-center text-3xl shadow-sm border-2 border-white">
                🏫
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs bg-emerald-500 text-white rounded-full px-1 py-0.2 border border-white font-retro">
                ON
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 font-retro tracking-wide">
              모가중 에듀테크 상상방
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 italic">
              "바이브코딩으로 더 편해지는 수업 & 업무"
            </div>
          </div>

          {/* Acorn counter banner */}
          <div className="w-full mt-1 bg-amber-50/90 border border-amber-200/80 rounded px-2 py-1 flex items-center justify-between text-xs">
            <span className="text-amber-800 flex items-center gap-1 font-medium">
              <span>🌰</span> 도토리 공감
            </span>
            <span className="font-bold text-amber-700 font-retro">
              {totalAcorns}개
            </span>
          </div>
        </div>

        {/* Today's Mood & One-liner */}
        <div className="text-xs border-t border-slate-100 pt-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-blue-500" /> 모가중학교
            </span>
            <span className="text-orange-600 font-retro">기분: 맑음 ☀️</span>
          </div>
          <p className="text-[12px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
            아이디어가 올라오면 운영자가 직접 바이브 코딩으로 실시간 제작합니다!
          </p>
        </div>
      </div>

      {/* Retro BGM Player */}
      <div className="bg-slate-800 text-white rounded-lg p-2.5 shadow-sm border border-slate-700 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-retro">
          <span className="flex items-center gap-1 text-orange-400">
            <span>🎵</span> BGM PLAYER
          </span>
          <span className="text-[10px] text-slate-400">128kbps</span>
        </div>
        <div className="flex items-center justify-between bg-slate-900/90 rounded px-2 py-1.5 border border-slate-700/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-6 h-6 rounded bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white shrink-0 transition-colors"
              title={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>
            <div className="truncate text-xs font-mono text-slate-200">
              {isPlaying ? '프리스타일 - Y (Piano Ver.)' : '음악 정지됨'}
            </div>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-white p-1"
            title={isMuted ? "음소거 해제" : "음소거"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Real-time Top 5 Popular Ideas */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 font-retro text-sm text-slate-800">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>실시간 인기 주제 TOP 5</span>
          </div>
          <button 
            onClick={() => setActiveTab('all')}
            className="text-[11px] text-slate-400 hover:text-orange-600 flex items-center transition-colors"
          >
            전체 <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {topIdeas.map((idea, index) => {
            const hasVoted = votedIdeaIds.includes(idea.id);
            return (
              <div 
                key={idea.id}
                className="group p-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex items-start justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-1.5 overflow-hidden">
                  <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    index === 0 ? 'bg-amber-400 text-amber-900' :
                    index === 1 ? 'bg-slate-300 text-slate-800' :
                    index === 2 ? 'bg-amber-600/70 text-white' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-medium text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                      {idea.title}
                    </p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{idea.category}</span>
                      <span>·</span>
                      <span>{idea.nickname}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => voteIdea(idea.id)}
                  className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                    hasVoted 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-700'
                  }`}
                  title="공감(도토리) 주기"
                >
                  <span>🌰</span>
                  <span>{idea.likesCount}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
