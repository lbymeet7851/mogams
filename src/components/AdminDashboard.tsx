import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Trash2, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Plus, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ADMIN_EMAIL } from '../lib/firebase';

export const AdminDashboard: React.FC = () => {
  const { 
    ideas, 
    vibeProjects, 
    currentUser, 
    isAdmin, 
    isAuthLoading, 
    visitorStats,
    loginWithGoogle, 
    logout, 
    deleteIdea, 
    updateIdeaStatus,
    downloadCSV,
    setActiveTab
  } = useApp();

  // If loading auth state
  if (isAuthLoading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
        로그인 상태를 확인하고 있습니다...
      </div>
    );
  }

  // If not logged in or not admin
  if (!currentUser || !isAdmin) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 font-retro">
          운영자(관리자) 전용 공간입니다
        </h3>
        <p className="text-xs text-slate-600 max-w-md leading-relaxed">
          이 메뉴는 모가중학교 바이브코딩 담당 운영자(<strong className="text-slate-800">{ADMIN_EMAIL}</strong>) 전용 관리 패널입니다. 
          운영자 구글 계정으로 로그인하시면 의견 관리, 웹앱 등록, CSV 다운로드 기능을 이용하실 수 있습니다.
        </p>

        {currentUser && !isAdmin && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2 rounded-md">
            현재 로그인된 계정: <strong>{currentUser.email}</strong> (운영자 권한 없음)
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          {!currentUser ? (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>운영자 구글 계정으로 로그인</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃 후 다른 계정으로 로그인</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Admin Dashboard view
  const totalLikes = ideas.reduce((acc, curr) => acc + curr.likesCount, 0);
  const completedCount = ideas.filter((i) => i.status === 'completed').length;

  return (
    <div className="flex flex-col gap-4 font-sans">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-retro text-sm font-bold tracking-wide">
                운영자 마스터 콘솔
              </h2>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-sans">
                인증됨: {currentUser.email}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              교직원 의견 삭제, 바이브코딩 웹앱 연계 및 데이터 CSV 백업을 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors shadow-xs cursor-pointer"
            title="의견 목록 엑셀(CSV) 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV 다운로드</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors cursor-pointer"
            title="로그아웃"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500">오늘 접속자 (TODAY)</div>
            <div className="text-xl font-bold text-red-600 mt-0.5 tabular-nums">{visitorStats.today.toLocaleString()}명</div>
          </div>
          <span className="text-2xl">👀</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500">누적 접속자 (TOTAL)</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5 tabular-nums">{visitorStats.total.toLocaleString()}명</div>
          </div>
          <span className="text-2xl">👥</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500">총 제안 / 누적 도토리</div>
            <div className="text-xl font-bold text-amber-700 mt-0.5 tabular-nums">{ideas.length}건 / 🌰{totalLikes}</div>
          </div>
          <span className="text-2xl">💡</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500">바이브코딩 구현 완료</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5 tabular-nums">{vibeProjects.length}개 웹앱</div>
          </div>
          <span className="text-2xl">🚀</span>
        </div>
      </div>

      {/* Ideas Management Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 font-retro">
            교직원 제안 전체 관리 리스트 ({ideas.length}건)
          </span>
          <span className="text-[11px] text-slate-500">
            상태 변경 시 게시판에 실시간 반영됩니다.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">등록일시</th>
                <th className="py-2.5 px-3">카테고리</th>
                <th className="py-2.5 px-3">제목 및 내용</th>
                <th className="py-2.5 px-3">작성자</th>
                <th className="py-2.5 px-3 text-center">공감수</th>
                <th className="py-2.5 px-3">진행상태</th>
                <th className="py-2.5 px-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {new Date(idea.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {idea.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 leading-tight">
                      {idea.title}
                    </div>
                    {idea.description && (
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {idea.description}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    {idea.nickname}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-amber-700">
                    🌰 {idea.likesCount}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <select
                      value={idea.status}
                      onChange={(e) => updateIdeaStatus(idea.id, e.target.value as any)}
                      className={`text-[11px] px-2 py-1 rounded border font-medium focus:outline-none ${
                        idea.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : idea.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="pending">접수</option>
                      <option value="in_progress">제작중</option>
                      <option value="completed">제작완료</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title="의견 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
