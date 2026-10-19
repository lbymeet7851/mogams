export type CategoryType = 
  | 'AI활용'
  | '수업자료제작'
  | '이미지생성'
  | '영상제작'
  | '업무자동화'
  | '글쓰기'
  | '기타';

export const CATEGORIES: CategoryType[] = [
  'AI활용',
  '수업자료제작',
  '이미지생성',
  '영상제작',
  '업무자동화',
  '글쓰기',
  '기타'
];

export interface Idea {
  id: string;
  nickname: string;
  category: CategoryType;
  title: string;
  description?: string;
  likesCount: number;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  vibeAppId?: string;
}

export interface VibeProject {
  id: string;
  title: string;
  description: string;
  appUrl: string;
  category: string;
  relatedIdeaId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  authorEmail?: string;
}

export interface VisitorStats {
  today: number;
  total: number;
  lastDate?: string;
}

export type ActiveTab = 'home' | 'all' | 'vibe' | 'admin';
