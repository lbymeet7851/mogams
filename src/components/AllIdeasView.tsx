import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Calendar, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType, CATEGORIES, Idea } from '../types';

export const AllIdeasView: React.FC = () => {
  const { ideas, voteIdea, votedIdeaIds, setActiveTab } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((idea) => {
        const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = 
          !query ||
          idea.title.toLowerCase().includes(query) ||
          (idea.description && idea.description.toLowerCase().includes(query)) ||
          idea.nickname.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') {
          return b.likesCount - a.likesCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [ideas, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / itemsPerPage));
  const paginatedIdeas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIdeas.slice(start, start + itemsPerPage);
  }, [filteredIdeas, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Controls: Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col gap-3">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Keyword Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="제목, 부연설명, 닉네임 검색..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50/60"
            />
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-1 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                sortBy === 'latest'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>최신순</span>
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                sortBy === 'likes'
                  ? 'bg-white text-orange-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌰</span>
              <span>좋아요(공감)순</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 text-xs">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 ({ideas.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = ideas.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Ideas Card List */}
      <div className="flex flex-col gap-3">
        {paginatedIdeas.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <div className="text-3xl">🔍</div>
            <p className="text-xs font-bold text-slate-700">검색 조건에 맞는 아이디어가 없습니다.</p>
            <p className="text-[11px] text-slate-400">다른 키워드나 카테고리를 선택해 보세요.</p>
          </div>
        ) : (
          paginatedIdeas.map((idea) => {
            const hasVoted = votedIdeaIds.includes(idea.id);
            const isCompleted = idea.status === 'completed';
            const isInProgress = idea.status === 'in_progress';

            return (
              <div
                key={idea.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded text-[11px]">
                        {idea.category}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> 바이브코딩 완성!
                        </span>
                      )}
                      {isInProgress && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                          <Clock className="w-3 h-3" /> 제작 진행중
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(idea.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {idea.title}
                  </h3>

                  {idea.description && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                      {idea.description}
                    </p>
                  )}
                </div>

                {/* Card Footer: Author & Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>작성자: <strong className="text-slate-800">{idea.nickname}</strong></span>
                    {isCompleted && (
                      <button
                        onClick={() => setActiveTab('vibe')}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 underline text-[11px]"
                      >
                        <Code2 className="w-3 h-3" /> 완성 웹앱 바로가기
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => voteIdea(idea.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
                      hasVoted
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 border border-slate-200'
                    }`}
                  >
                    <span>🌰</span>
                    <span>공감하기 ({idea.likesCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2 py-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            title="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`w-7 h-7 text-xs font-bold rounded border transition-colors ${
                currentPage === pageNumber
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            title="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
