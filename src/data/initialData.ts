import { Idea, VibeProject } from '../types';

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'seed-1',
    nickname: '진로상담실',
    category: 'AI활용',
    title: '교과 세특 초안 작성 보조기 (키워드 입력형)',
    description: '학생의 대표 탐구활동 3가지를 체크하면 NEIS 글자수(바이트) 규격에 맞는 개별 맞춤형 세특 예시 문안을 자동 추천해주는 도구',
    likesCount: 32,
    createdAt: '2026-10-15T09:20:00.000Z',
    status: 'completed',
    vibeAppId: 'vibe-2'
  },
  {
    id: 'seed-2',
    nickname: '담임3년차',
    category: '업무자동화',
    title: '학급 자리배치 및 짝꿍 스마트 추첨기',
    description: '시력 배려 학생, 분리 배치가 필요한 학생 조건을 반영하여 공정하고 빠르게 칠판 기준 교실 자리표를 자동 생성하는 웹앱',
    likesCount: 27,
    createdAt: '2026-10-16T11:15:00.000Z',
    status: 'completed',
    vibeAppId: 'vibe-1'
  },
  {
    id: 'seed-3',
    nickname: '과학수석교사',
    category: '수업자료제작',
    title: '수업 도입용 3분 퀴즈쇼 골든벨 타이머',
    description: '배경음악과 긴장감 넘치는 카운트다운 타이머가 함께 나와 교실 대형 모니터에 바로 띄울 수 있는 인터랙티브 퀴즈 도구',
    likesCount: 22,
    createdAt: '2026-10-16T14:40:00.000Z',
    status: 'completed',
    vibeAppId: 'vibe-3'
  },
  {
    id: 'seed-4',
    nickname: '교무기획부',
    category: '글쓰기',
    title: '가정통신문 공문 초안 다듬기 도구',
    description: '딱딱한 관청 문체를 학부모님께 친근하면서도 명확한 공공언어로 순화하고 핵심 일정만 카드뉴스로 요약해주는 서식 보조기',
    likesCount: 19,
    createdAt: '2026-10-17T08:30:00.000Z',
    status: 'in_progress'
  },
  {
    id: 'seed-5',
    nickname: '미술열정쌤',
    category: '이미지생성',
    title: '학교 축제/체육대회 홍보 포스터 생성 프롬프트 아카이브',
    description: '생성형 AI를 처음 써보는 교직원도 학교 행사 포스터를 5분 만에 완성할 수 있는 한글-영어 최적 프롬프트 프리셋 모음',
    likesCount: 15,
    createdAt: '2026-10-17T16:10:00.000Z',
    status: 'pending'
  },
  {
    id: 'seed-6',
    nickname: '정보부장',
    category: '영상제작',
    title: '동아리 활동 영상 자동 컷편집 및 릴스 제작 가이드',
    description: '스마트폰으로 찍은 학생 활동 영상을 학교 공식 유튜브 쇼츠 형식으로 1분 만에 템플릿화하는 도구',
    likesCount: 11,
    createdAt: '2026-10-18T10:00:00.000Z',
    status: 'pending'
  }
];

export const INITIAL_VIBE_PROJECTS: VibeProject[] = [
  {
    id: 'vibe-1',
    title: '모가중 학급 자리배치 스마트 추첨기',
    description: '분리배치 조건 및 앞자리 배려 학생 설정을 탑재한 원클릭 교실 자리배치 웹앱입니다. 엑셀 명렬표 붙여넣기 및 인쇄 모드를 지원합니다.',
    appUrl: 'https://moga-middle-seats.web.app',
    category: '업무자동화',
    relatedIdeaId: 'seed-2',
    createdAt: '2026-10-17T12:00:00.000Z',
    authorEmail: 'lbymeet12@gmail.com'
  },
  {
    id: 'vibe-2',
    title: '교과 세특 NEIS 글자수 계산 및 맞춤형 문장 생성기',
    description: '나이스 바이트 기준에 정확하게 맞춘 학생 과목별 세특 초안 보조기입니다. 과목별 핵심 성취기준 연계 문장을 제공합니다.',
    appUrl: 'https://moga-setek-maker.web.app',
    category: 'AI활용',
    relatedIdeaId: 'seed-1',
    createdAt: '2026-10-17T15:30:00.000Z',
    authorEmail: 'lbymeet12@gmail.com'
  },
  {
    id: 'vibe-3',
    title: '도토리 골든벨 인터랙티브 수업 타이머',
    description: '신나는 싸이월드풍 효과음과 카운트다운 애니메이션이 탑재되어 수업 도입부 퀴즈 집중도를 200% 올려주는 교사용 타이머입니다.',
    appUrl: 'https://moga-goldenbell.web.app',
    category: '수업자료제작',
    relatedIdeaId: 'seed-3',
    createdAt: '2026-10-18T09:00:00.000Z',
    authorEmail: 'lbymeet12@gmail.com'
  }
];
