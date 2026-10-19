import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  increment,
  runTransaction
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { 
  db, 
  auth, 
  googleProvider, 
  ADMIN_EMAIL, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { Idea, VibeProject, CategoryType, VisitorStats } from '../types';
import { INITIAL_IDEAS, INITIAL_VIBE_PROJECTS } from '../data/initialData';

interface AppContextType {
  ideas: Idea[];
  vibeProjects: VibeProject[];
  currentUser: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  votedIdeaIds: string[];
  visitorStats: VisitorStats;
  activeTab: 'home' | 'all' | 'vibe' | 'admin';
  setActiveTab: (tab: 'home' | 'all' | 'vibe' | 'admin') => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  submitIdea: (data: { nickname: string; category: CategoryType; title: string; description: string }) => Promise<boolean>;
  voteIdea: (id: string) => Promise<boolean>;
  deleteIdea: (id: string) => Promise<boolean>;
  updateIdeaStatus: (id: string, status: Idea['status']) => Promise<boolean>;
  addVibeProject: (data: Omit<VibeProject, 'id' | 'createdAt'>) => Promise<boolean>;
  updateVibeProject: (id: string, data: Partial<VibeProject>) => Promise<boolean>;
  deleteVibeProject: (id: string) => Promise<boolean>;
  downloadCSV: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_IDEAS_KEY = 'moga_ideas_cache_v1';
const LOCAL_STORAGE_VIBE_KEY = 'moga_vibe_cache_v1';
const LOCAL_STORAGE_VOTED_KEY = 'moga_voted_ideas_v1';
const LOCAL_STORAGE_STATS_KEY = 'moga_visitor_stats_v1';

// Helper to get KST Date string (YYYY-MM-DD)
const getKSTDateString = (): string => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 60 * 60 * 1000));
  return kst.toISOString().slice(0, 10);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_IDEAS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });

  const [vibeProjects, setVibeProjects] = useState<VibeProject[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VIBE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_VIBE_PROJECTS;
    } catch {
      return INITIAL_VIBE_PROJECTS;
    }
  });

  const [votedIdeaIds, setVotedIdeaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VOTED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real visitor statistics state
  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => {
    const todayStr = getKSTDateString();
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          today: parsed.lastDate === todayStr ? (parsed.today || 1) : 1,
          total: parsed.total || 1,
          lastDate: todayStr
        };
      }
    } catch {}
    return { today: 1, total: 1, lastDate: todayStr };
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'all' | 'vibe' | 'admin'>('home');

  // Verify Admin privilege (email matches ADMIN_EMAIL)
  const isAdmin = Boolean(currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Track and record real visitors (Today & Total)
  useEffect(() => {
    const todayStr = getKSTDateString();
    const sessionKey = `moga_visited_${todayStr}`;
    const hasVisited = sessionStorage.getItem(sessionKey);
    const statsDocRef = doc(db, 'site_stats', 'visitors');

    const recordVisit = async () => {
      try {
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(statsDocRef);
          if (!sfDoc.exists()) {
            transaction.set(statsDocRef, {
              total: 1,
              today: 1,
              lastDate: todayStr
            });
          } else {
            const data = sfDoc.data();
            const isSameDay = data.lastDate === todayStr;
            const newToday = isSameDay ? (Number(data.today) || 0) + 1 : 1;
            const newTotal = (Number(data.total) || 0) + 1;
            transaction.update(statsDocRef, {
              total: newTotal,
              today: newToday,
              lastDate: todayStr
            });
          }
        });
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        console.warn('Record visit transaction error, using local fallback:', err);
        sessionStorage.setItem(sessionKey, 'true');
        setVisitorStats((prev) => {
          const next = {
            today: prev.today + 1,
            total: prev.total + 1,
            lastDate: todayStr
          };
          localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(next));
          return next;
        });
      }
    };

    if (!hasVisited) {
      recordVisit();
    }

    // Subscribe to real-time visitor count updates
    const unsubscribe = onSnapshot(
      statsDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const isSameDay = data.lastDate === todayStr;
          const currentToday = isSameDay ? (Number(data.today) || 0) : 0;
          const currentTotal = Number(data.total) || 0;
          const newStats: VisitorStats = {
            today: currentToday,
            total: currentTotal,
            lastDate: data.lastDate
          };
          setVisitorStats(newStats);
          localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(newStats));
        }
      },
      (error) => {
        console.warn('Stats onSnapshot error:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync Ideas from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'ideas'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Idea[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Idea, 'id'>) });
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setIdeas(list);
          localStorage.setItem(LOCAL_STORAGE_IDEAS_KEY, JSON.stringify(list));
        } else {
          localStorage.setItem(LOCAL_STORAGE_IDEAS_KEY, JSON.stringify(ideas));
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot ideas error, using local fallback:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Vibe Projects from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'vibe_projects'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: VibeProject[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<VibeProject, 'id'>) });
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setVibeProjects(list);
          localStorage.setItem(LOCAL_STORAGE_VIBE_KEY, JSON.stringify(list));
        } else {
          localStorage.setItem(LOCAL_STORAGE_VIBE_KEY, JSON.stringify(vibeProjects));
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot vibe_projects error, using local fallback:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      alert('구글 로그인 중 문제가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out failed:', error);
    }
  };

  // Submit Idea
  const submitIdea = async (data: { 
    nickname: string; 
    category: CategoryType; 
    title: string; 
    description: string;
  }): Promise<boolean> => {
    const finalNickname = data.nickname.trim() || '익명의 작성자';
    const newIdeaPayload = {
      nickname: finalNickname,
      category: data.category,
      title: data.title.trim(),
      description: data.description.trim() || '',
      likesCount: 0,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };

    try {
      const docRef = await addDoc(collection(db, 'ideas'), newIdeaPayload);
      const newIdea: Idea = { id: docRef.id, ...newIdeaPayload };
      setIdeas((prev) => [newIdea, ...prev.filter(i => i.id !== newIdea.id)]);
      
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#f59e0b', '#38bdf8']
      });
      return true;
    } catch (error) {
      console.warn('Firestore save failed, fallback to local state:', error);
      const fallbackId = 'local-' + Date.now();
      const newIdea: Idea = { id: fallbackId, ...newIdeaPayload };
      const updated = [newIdea, ...ideas];
      setIdeas(updated);
      localStorage.setItem(LOCAL_STORAGE_IDEAS_KEY, JSON.stringify(updated));
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#f59e0b']
      });
      return true;
    }
  };

  // Vote Idea (Dotori)
  const voteIdea = async (id: string): Promise<boolean> => {
    if (votedIdeaIds.includes(id)) {
      alert('이미 공감(도토리)을 보낸 아이디어입니다!');
      return false;
    }

    const nextVoted = [...votedIdeaIds, id];
    setVotedIdeaIds(nextVoted);
    localStorage.setItem(LOCAL_STORAGE_VOTED_KEY, JSON.stringify(nextVoted));

    setIdeas((prev) => 
      prev.map((idea) => idea.id === id ? { ...idea, likesCount: idea.likesCount + 1 } : idea)
    );

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#d97706', '#f97316', '#fbbf24']
    });

    try {
      if (!id.startsWith('seed-') && !id.startsWith('local-')) {
        await updateDoc(doc(db, 'ideas', id), {
          likesCount: increment(1)
        });
      }
      return true;
    } catch (error) {
      console.warn('Firestore vote update skipped or offline:', error);
      return true;
    }
  };

  // Delete Idea (Admin only)
  const deleteIdea = async (id: string): Promise<boolean> => {
    if (!isAdmin) {
      alert('운영자 권한이 필요합니다.');
      return false;
    }

    if (!confirm('정말 이 아이디어를 삭제하시겠습니까?')) {
      return false;
    }

    try {
      if (!id.startsWith('seed-') && !id.startsWith('local-')) {
        await deleteDoc(doc(db, 'ideas', id));
      }
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      return true;
    } catch (error) {
      console.error('Delete idea error:', error);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      return true;
    }
  };

  // Update Idea Status (Admin only)
  const updateIdeaStatus = async (id: string, status: Idea['status']): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      if (!id.startsWith('seed-') && !id.startsWith('local-')) {
        await updateDoc(doc(db, 'ideas', id), { status });
      }
      setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      return true;
    } catch (error) {
      console.error('Update idea status error:', error);
      setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      return true;
    }
  };

  // Add Vibe Project (Admin only)
  const addVibeProject = async (data: Omit<VibeProject, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!isAdmin) {
      alert('운영자 권한이 필요합니다.');
      return false;
    }

    const payload = {
      ...data,
      createdAt: new Date().toISOString(),
      authorEmail: currentUser?.email || ADMIN_EMAIL
    };

    try {
      const docRef = await addDoc(collection(db, 'vibe_projects'), payload);
      const newProj: VibeProject = { id: docRef.id, ...payload };
      setVibeProjects((prev) => [newProj, ...prev]);

      if (data.relatedIdeaId) {
        updateIdeaStatus(data.relatedIdeaId, 'completed');
      }
      return true;
    } catch (error) {
      console.warn('Firestore add vibe project error, fallback local:', error);
      const newProj: VibeProject = { id: 'vibe-' + Date.now(), ...payload };
      setVibeProjects((prev) => [newProj, ...prev]);
      if (data.relatedIdeaId) {
        updateIdeaStatus(data.relatedIdeaId, 'completed');
      }
      return true;
    }
  };

  // Update Vibe Project (Admin only)
  const updateVibeProject = async (id: string, data: Partial<VibeProject>): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      if (!id.startsWith('vibe-')) {
        await updateDoc(doc(db, 'vibe_projects', id), data);
      }
      setVibeProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
      return true;
    } catch (error) {
      console.error('Update vibe project error:', error);
      setVibeProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
      return true;
    }
  };

  // Delete Vibe Project (Admin only)
  const deleteVibeProject = async (id: string): Promise<boolean> => {
    if (!isAdmin) return false;
    if (!confirm('이 바이브코딩 프로젝트 카드를 삭제하시겠습니까?')) return false;

    try {
      if (!id.startsWith('vibe-')) {
        await deleteDoc(doc(db, 'vibe_projects', id));
      }
      setVibeProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error('Delete vibe project error:', error);
      setVibeProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    }
  };

  // Download CSV with UTF-8 BOM
  const downloadCSV = () => {
    const headers = ['등록일시', '카테고리', '제목', '부연설명', '작성자(닉네임)', '좋아요(공감수)', '진행상태'];
    const rows = ideas.map((item) => {
      const formattedDate = new Date(item.createdAt).toLocaleString('ko-KR');
      const safeDesc = (item.description || '').replace(/"/g, '""');
      const safeTitle = (item.title || '').replace(/"/g, '""');
      const safeNick = (item.nickname || '').replace(/"/g, '""');
      const statusLabel = item.status === 'completed' ? '제작완료' : item.status === 'in_progress' ? '제작중' : '접수';

      return [
        `"${formattedDate}"`,
        `"${item.category}"`,
        `"${safeTitle}"`,
        `"${safeDesc}"`,
        `"${safeNick}"`,
        item.likesCount,
        `"${statusLabel}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `모가중_교직원_아이디어_목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        ideas,
        vibeProjects,
        currentUser,
        isAdmin,
        isAuthLoading,
        votedIdeaIds,
        visitorStats,
        activeTab,
        setActiveTab,
        loginWithGoogle,
        logout,
        submitIdea,
        voteIdea,
        deleteIdea,
        updateIdeaStatus,
        addVibeProject,
        updateVibeProject,
        deleteVibeProject,
        downloadCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
