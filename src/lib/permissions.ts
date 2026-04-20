export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PREMIUM: 'premium',
} as const;

export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export function canAccessDashboard(user: { role: string; status: string }): boolean {
  return user.status === STATUS.APPROVED;
}

export function canManageUsers(user: { role: string }): boolean {
  return user.role === ROLES.ADMIN;
}

export function isAdmin(user: { role: string }): boolean {
  return user.role === ROLES.ADMIN;
}

export function canCreateContent(user: { role: string; status: string }): boolean {
  return user.status === STATUS.APPROVED;
}

export function canViewAnalytics(user: { role: string }): boolean {
  return [ROLES.ADMIN, ROLES.TEACHER].includes(user.role as any);
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXP(xp);
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { current: xp - currentLevelXP, needed: 100, progress: Math.min(progress, 100) };
}
