import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  MessageSquarePlus, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType, CATEGORIES } from '../types';

export const HomeBoardView: React.FC = () => {
  const { ideas, submitIdea, voteIdea, votedIdeaIds, setActiveTab } = useApp();

  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<CategoryType>('AI활용');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('아이디어 제목을 한 줄로 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    const success = await submitIdea({
      nickname,
      category,
      title,
      description
    });
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setDescription('');
      setNickname('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }
  };

  // Recent 4 ideas for instant feed preview
  const recentIdeas = ideas.slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      {/* 2000s Cyworld Minihompy Welcome Intro Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 border border-orange-200/90 rounded-lg p-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm text-xl font-retro">
            💡
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-retro text-orange-900 font-bold text-sm tracking-wide">
                모가중학교 교직원 바이브코딩 & 에듀테크 광장
              </span>
              <span className="px-1.5 py-0.5 text-[10px] bg-orange-200 text-orange-800 rounded font-medium">
                자유게시판
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              수업 준비나 일상 행정업무 중 <span className="font-semibold text-orange-700">"이런 웹 도구나 자동화 프로그램이 있었으면 좋겠다!"</span> 싶은 
              아이디어를 자유롭게 남겨주세요. 공감을 많이 받은 제안은 <strong>운영자가 직접 바이브 코딩으로 제작</strong>하여 웹앱으로 선물해 드립니다!
            </p>
          </div>
        </div>
      </div>

      {/* Idea Submission Form */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-retro text-xs font-bold text-slate-800">
            <MessageSquarePlus className="w-4 h-4 text-orange-600" />
            <span>새로운 아이디어 남기기 (도토리 적립)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            로그인 없이 누구나 작성 가능
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5">
          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-md flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>아이디어가 성공적으로 등록되었습니다! 동료 교직원들의 공감을 모아보세요.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Nickname input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>작성자 닉네임 <span className="text-slate-400 font-normal">(선택)</span></span>
                <span className="text-[10px] text-slate-400">비워두면 '익명의 작성자'</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 2학년담임, 체육부장, AI꿈나무"
                maxLength={50}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50/50"
              />
            </div>

            {/* Category dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">
                카테고리 선택 <span className="text-orange-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title input (One line, required) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>제목 입력 (한 줄 요약) <span className="text-orange-600">*</span></span>
              <span className="text-[10px] text-slate-400">{title.length}/100자</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 학급 동아리 출석 및 활동일지 자동 취합기"
              maxLength={100}
              className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
            />
          </div>

          {/* Description input (Textarea, max 300) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                부연 설명 입력 <span className="text-slate-400 font-normal">(선택, 최대 300자)</span>
              </label>
              <span className={`text-[10px] ${description.length >= 280 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {description.length}/300자
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              placeholder="더 자세히 알려주시면 영상 제작에 큰 도움이 됩니다! (선택)"
              className="px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none leading-relaxed"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded font-retro text-xs shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '등록 중...' : '아이디어 남기기 (도토리 퐁퐁!)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Activity & Idea Stream */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 font-retro text-xs font-bold text-slate-800">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>최신 등록된 교직원 제안글</span>
          </div>
          <button
            onClick={() => setActiveTab('all')}
            className="text-xs text-orange-600 hover:text-orange-700 flex items-center font-medium transition-colors"
          >
            전체 모아보기 ({ideas.length}개) <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentIdeas.map((idea) => {
            const hasVoted = votedIdeaIds.includes(idea.id);
            return (
              <div
                key={idea.id}
                className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-colors gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded text-[10px]">
                      {idea.category}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(idea.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {idea.title}
                  </h4>
                  {idea.description && (
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {idea.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-medium">
                    작성자: {idea.nickname}
                  </span>
                  <button
                    onClick={() => voteIdea(idea.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                      hasVoted
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                        : 'bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 border border-slate-200'
                    }`}
                  >
                    <span>🌰</span>
                    <span>공감 {idea.likesCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
