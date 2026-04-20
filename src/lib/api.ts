const API_BASE = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('study_tracker_token');
}

async function fetchAPI(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }

  return data;
}

export const api = {
  // Auth
  register: (data: { email: string; username: string; password: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { email: string; password: string }) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  getMe: () => fetchAPI('/auth/me'),

  // Admin
  getUsers: (status?: string) => fetchAPI(`/admin/users${status ? `?status=${status}` : ''}`),
  approveUser: (userId: string) => fetchAPI('/admin/approve', { method: 'POST', body: JSON.stringify({ userId }) }),
  rejectUser: (userId: string) => fetchAPI('/admin/reject', { method: 'POST', body: JSON.stringify({ userId }) }),
  deleteUser: (userId: string) => fetchAPI('/admin/delete', { method: 'DELETE', body: JSON.stringify({ userId }) }),
  updateRole: (userId: string, role: string) => fetchAPI('/admin/role', { method: 'POST', body: JSON.stringify({ userId, role }) }),
  getSettings: () => fetchAPI('/admin/settings'),
  updateSettings: (settings: Record<string, string>) => fetchAPI('/admin/settings', { method: 'POST', body: JSON.stringify(settings) }),

  // Study
  getTopics: () => fetchAPI('/study/topics'),
  createTopic: (data: any) => fetchAPI('/study/topics', { method: 'POST', body: JSON.stringify(data) }),
  deleteTopic: (id: string) => fetchAPI('/study/topics', { method: 'DELETE', body: JSON.stringify({ id }) }),
  
  getStudyLogs: (days?: number) => fetchAPI(`/study/logs${days ? `?days=${days}` : ''}`),
  createStudyLog: (data: any) => fetchAPI('/study/logs', { method: 'POST', body: JSON.stringify(data) }),

  getRevisions: () => fetchAPI('/study/revisions'),
  createRevision: (data: any) => fetchAPI('/study/revisions', { method: 'POST', body: JSON.stringify(data) }),
  updateRevision: (data: any) => fetchAPI('/study/revisions', { method: 'PATCH', body: JSON.stringify(data) }),

  // Flashcards
  getFlashcards: (topicId?: string) => fetchAPI(`/flashcards${topicId ? `?topicId=${topicId}` : ''}`),
  createFlashcard: (data: any) => fetchAPI('/flashcards', { method: 'POST', body: JSON.stringify(data) }),
  updateFlashcard: (data: any) => fetchAPI('/flashcards', { method: 'PATCH', body: JSON.stringify(data) }),
  deleteFlashcard: (id: string) => fetchAPI('/flashcards', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Quiz
  getQuizzes: () => fetchAPI('/quiz'),
  createQuiz: (data: any) => fetchAPI('/quiz', { method: 'POST', body: JSON.stringify(data) }),
  updateQuiz: (data: any) => fetchAPI('/quiz', { method: 'PATCH', body: JSON.stringify(data) }),

  // Goals
  getGoals: () => fetchAPI('/goals'),
  createGoal: (data: any) => fetchAPI('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (data: any) => fetchAPI('/goals', { method: 'PATCH', body: JSON.stringify(data) }),
  deleteGoal: (id: string) => fetchAPI('/goals', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Mood
  getMoods: () => fetchAPI('/mood'),
  logMood: (data: any) => fetchAPI('/mood', { method: 'POST', body: JSON.stringify(data) }),

  // AI
  chatWithAI: (message: string, history?: any[]) => fetchAPI('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),

  // Analytics
  getAnalytics: () => fetchAPI('/analytics'),

  // Search
  search: (q: string) => fetchAPI(`/search?q=${encodeURIComponent(q)}`),

  // Focus
  getFocusSessions: () => fetchAPI('/focus'),
  startFocusSession: (duration?: number) => fetchAPI('/focus', { method: 'POST', body: JSON.stringify({ duration }) }),
  completeFocusSession: (id: string) => fetchAPI('/focus', { method: 'PATCH', body: JSON.stringify({ id, completed: true }) }),

  // Formulas
  getFormulas: () => fetchAPI('/formulas'),
  createFormula: (data: any) => fetchAPI('/formulas', { method: 'POST', body: JSON.stringify(data) }),
  deleteFormula: (id: string) => fetchAPI('/formulas', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Achievements
  getAchievements: () => fetchAPI('/achievements'),
  checkAchievements: () => fetchAPI('/achievements', { method: 'POST' }),

  // Folders
  getFolders: () => fetchAPI('/folders'),
  createFolder: (data: any) => fetchAPI('/folders', { method: 'POST', body: JSON.stringify(data) }),
  deleteFolder: (id: string) => fetchAPI('/folders', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Gamification
  getGamification: () => fetchAPI('/gamification'),

  // Seed
  seed: () => fetchAPI('/seed', { method: 'POST' }),
};
