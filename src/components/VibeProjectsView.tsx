import React, { useState } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VibeProject, CATEGORIES } from '../types';

export const VibeProjectsView: React.FC = () => {
  const { 
    vibeProjects, 
    ideas, 
    isAdmin, 
    addVibeProject, 
    updateVibeProject, 
    deleteVibeProject,
    setActiveTab
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<VibeProject | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [category, setCategory] = useState<string>('업무자동화');
  const [relatedIdeaId, setRelatedIdeaId] = useState<string>('');

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setAppUrl('');
    setCategory('업무자동화');
    setRelatedIdeaId('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: VibeProject) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setAppUrl(proj.appUrl);
    setCategory(proj.category);
    setRelatedIdeaId(proj.relatedIdeaId || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !appUrl.trim()) {
      alert('제목과 웹앱 링크는 필수 항목입니다!');
      return;
    }

    if (editingProject) {
      await updateVibeProject(editingProject.id, {
        title,
        description,
        appUrl,
        category,
        relatedIdeaId: relatedIdeaId || undefined
      });
    } else {
      await addVibeProject({
        title,
        description,
        appUrl,
        category,
        relatedIdeaId: relatedIdeaId || undefined
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200/90 rounded-lg p-4 shadow-xs flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xl font-retro">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-retro text-emerald-950 font-bold text-sm tracking-wide">
                바이브 코딩 구현관 (완성된 웹앱 쇼케이스)
              </h2>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-200 text-emerald-900 rounded font-medium">
                실제 서비스
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              모가중 교직원 여러분께서 남겨주신 아이디어를 바탕으로 <strong>실제 제작 및 배포된 바이브코딩 웹앱</strong> 목록입니다. 
              학교 현장에서 바로 활용해보세요!
            </p>
          </div>
        </div>

        {/* Admin add button */}
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-retro rounded shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 웹앱 등록</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {vibeProjects.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
            아직 등록된 바이브코딩 웹앱이 없습니다. 교직원 아이디어를 선정하여 곧 제작됩니다!
          </div>
        ) : (
          vibeProjects.map((proj) => {
            const relatedIdea = ideas.find((i) => i.id === proj.relatedIdeaId);

            return (
              <div
                key={proj.id}
                className="bg-white rounded-lg border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all p-4 flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      {proj.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(proj.createdAt).toLocaleDateString('ko-KR')} 제작
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{proj.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Reflected Idea badge */}
                  {relatedIdea && (
                    <div className="mt-3 p-2 bg-amber-50/80 border border-amber-200/70 rounded text-[11px] text-amber-900 flex items-start gap-1.5">
                      <span className="shrink-0 text-xs">💡</span>
                      <div className="overflow-hidden">
                        <span className="font-bold">반영된 제안:</span> {relatedIdea.title}
                        <span className="text-slate-500 text-[10px] ml-1">({relatedIdea.nickname})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteVibeProject(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  <a
                    href={proj.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
                  >
                    <span>웹앱 실행하기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Project Modal (Admin only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fade-in font-sans">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-retro text-sm font-bold flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>{editingProject ? '바이브코딩 웹앱 수정' : '새 바이브코딩 웹앱 등록'}</span>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                닫기 ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">웹앱 제목 *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 모가중 자리배치 스마트 추첨기"
                  className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">카테고리 *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">반영된 교직원 제안 (선택)</label>
                  <select
                    value={relatedIdeaId}
                    onChange={(e) => setRelatedIdeaId(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">(연계 제안 없음)</option>
                    {ideas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        [{idea.category}] {idea.title.slice(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">웹앱 URL (실행 링크) *</label>
                <input
                  type="url"
                  required
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="https://..."
                  className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">설명 *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="웹앱의 주요 기능 및 사용법을 간단히 요약해주세요."
                  className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                >
                  {editingProject ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
