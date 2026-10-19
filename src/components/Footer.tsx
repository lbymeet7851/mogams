import React from 'react';
import { Lock, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { currentUser, isAdmin, loginWithGoogle, logout, setActiveTab } = useApp();

  return (
    <footer className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 font-sans px-2">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">모가중학교 교직원 바이브코딩 아이디어 마당</span>
        <span className="text-slate-300">|</span>
        <span>© 2026 Moga Middle School EduTech</span>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-slate-600 flex items-center gap-1">
              {isAdmin ? (
                <span className="text-rose-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> 운영자
                </span>
              ) : (
                <span>교직원</span>
              )}
              ({currentUser.email})
            </span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-500 hover:text-slate-900 underline text-[10px]"
            >
              대시보드
            </button>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-500 text-[10px]"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveTab('admin');
              loginWithGoogle();
            }}
            className="text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors text-[10px]"
            title="운영자 전용 로그인"
          >
            <Lock className="w-3 h-3" />
            <span>운영자 로그인</span>
          </button>
        )}
      </div>
    </footer>
  );
};
