'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, ViewType } from '@/stores/appStore';
import { api } from '@/lib/api';

// Icon imports
import {
  LayoutDashboard, Calendar, Brain, Target, Timer, BookOpen,
  BarChart3, Shield, MessageSquare, Smile, Trophy, FlaskConical,
  Search, FolderOpen, Plus, LogOut, Menu, X, ChevronRight,
  Flame, Star, Zap, CheckCircle, Clock, TrendingUp,
  Bell, Settings, Users, ArrowUp, ArrowDown, Trash2, Eye,
  EyeOff, Sparkles, Play, Pause, RotateCcw, Send,
  Lightbulb, Award, Layers, Edit3, Save, AlertCircle, Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ==================== AUTH SCREENS ====================

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, setAuthStatus } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const res = await api.register({ email, username, password });
        if (res.status === 'pending') {
          setAuthStatus('pending');
        } else {
          setMode('login');
          setError('');
        }
        return;
      }

      const res = await api.login({ email, password });
      login(res.user, res.token);
    } catch (err: any) {
      if (err.status === 403 && err.error?.includes('review')) {
        setAuthStatus('pending');
      } else if (err.status === 403 && err.error?.includes('rejected')) {
        setAuthStatus('rejected');
      } else {
        setError(err.error || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-3/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow"
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold neon-text">StudyTracker AI</h1>
            <p className="text-muted-foreground text-sm mt-1">Your personal AI study coach</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-input/50 border-glass-border mt-1"
                required
              />
            </div>

            {mode === 'register' && (
              <div>
                <Label className="text-sm text-muted-foreground">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="bg-input/50 border-glass-border mt-1"
                  required
                />
              </div>
            )}

            <div>
              <Label className="text-sm text-muted-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-input/50 border-glass-border pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {mode === 'register' && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Admin approval required before access is granted
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function PendingScreen() {
  const { setAuthStatus } = useAppStore();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 max-w-md w-full text-center relative z-10"
      >
        <div className="w-16 h-16 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-chart-2" />
        </div>
        <h2 className="text-xl font-bold mb-2">Under Review</h2>
        <p className="text-muted-foreground mb-6">
          Your account is under review. Please wait for admin approval.
        </p>
        <Button
          variant="outline"
          onClick={() => setAuthStatus('unauthenticated')}
          className="glass-card"
        >
          Back to Login
        </Button>
      </motion.div>
    </div>
  );
}

function RejectedScreen() {
  const { setAuthStatus } = useAppStore();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 max-w-md w-full text-center relative z-10"
      >
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Your request was rejected. Contact admin for assistance.
        </p>
        <Button
          variant="outline"
          onClick={() => setAuthStatus('unauthenticated')}
          className="glass-card"
        >
          Back to Login
        </Button>
      </motion.div>
    </div>
  );
}

// ==================== SIDEBAR ====================

const navItems: { id: ViewType; label: string; icon: any; section: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
  { id: 'topics', label: 'Topics', icon: BookOpen, section: 'Main' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, section: 'Main' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, section: 'Study' },
  { id: 'quiz', label: 'Quiz', icon: Target, section: 'Study' },
  { id: 'focus', label: 'Focus Mode', icon: Timer, section: 'Study' },
  { id: 'revisions', label: 'Revisions', icon: RotateCcw, section: 'Study' },
  { id: 'goals', label: 'Goals', icon: CheckCircle, section: 'Track' },
  { id: 'mood', label: 'Mood Tracker', icon: Smile, section: 'Track' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Track' },
  { id: 'ai-coach', label: 'AI Coach', icon: MessageSquare, section: 'AI' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, section: 'Profile' },
  { id: 'formulas', label: 'Formulas', icon: FlaskConical, section: 'Library' },
  { id: 'folders', label: 'Folders', icon: FolderOpen, section: 'Library' },
];

function Sidebar() {
  const { currentView, setCurrentView, user, logout, sidebarOpen, toggleSidebar } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const sections = ['Main', 'Study', 'Track', 'AI', 'Profile', 'Library'];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        className={`fixed left-0 top-0 h-screen gradient-sidebar border-r border-sidebar-border z-50 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform lg:transition-none`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0 neon-glow">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <h1 className="font-bold text-sm neon-text">StudyTracker</h1>
              <p className="text-[10px] text-muted-foreground">AI Study Coach</p>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <ChevronRight className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 custom-scrollbar py-2">
          {sections.map(section => {
            const items = navItems.filter(i => i.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section} className="mb-2">
                {!collapsed && (
                  <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
                    {section}
                  </p>
                )}
                {items.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <Tooltip key={item.id} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => { setCurrentView(item.id); if (sidebarOpen) toggleSidebar(); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all relative group
                            ${isActive
                              ? 'text-sidebar-primary-foreground bg-sidebar-primary/10'
                              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                            }
                            ${collapsed ? 'justify-center px-2' : ''}
                          `}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full"
                            />
                          )}
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sidebar-primary' : ''}`} />
                          {!collapsed && <span>{item.label}</span>}
                          {item.id === 'ai-coach' && !collapsed && (
                            <Sparkles className="w-3 h-3 text-chart-2 ml-auto" />
                          )}
                        </button>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="text-xs">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </ScrollArea>

        {/* Admin link */}
        {user?.role === 'admin' && (
          <div className="px-2 pb-2">
            <button
              onClick={() => { setCurrentView('admin'); if (sidebarOpen) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all
                ${currentView === 'admin'
                  ? 'text-sidebar-primary-foreground bg-sidebar-primary/10'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
            >
              <Shield className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </button>
          </div>
        )}

        {/* User card */}
        <div className="p-3 border-t border-sidebar-border">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-[10px] text-muted-foreground">Lvl {user?.level || 1} · {user?.xp || 0} XP</p>
              </div>
            )}
            {!collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={logout} className="p-1.5 hover:bg-sidebar-accent rounded-md text-sidebar-foreground/60 hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Sign Out</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// ==================== HEADER ====================

function Header() {
  const { currentView, toggleSidebar, user, setSearchOpen } = useAppStore();
  const viewLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    flashcards: 'Flashcards',
    quiz: 'Quiz',
    focus: 'Focus Mode',
    revisions: 'Revisions',
    topics: 'Topics',
    goals: 'Goals',
    analytics: 'Analytics',
    admin: 'Admin Panel',
    'ai-coach': 'AI Study Coach',
    mood: 'Mood Tracker',
    achievements: 'Achievements',
    formulas: 'Formula Library',
    search: 'Search',
    folders: 'Folders',
  };

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-glass-border px-4 lg:px-6 py-3">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-accent rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">{viewLabels[currentView] || 'Dashboard'}</h2>
        <div className="flex-1" />
        
        {/* Search trigger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">Search (Ctrl+K)</TooltipContent>
        </Tooltip>

        {/* Streak badge */}
        {user?.streak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-chart-2/10 rounded-full text-chart-2 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 fire-glow" />
            {user.streak}d
          </div>
        )}

        {/* Level badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full text-primary text-xs font-medium">
          <Star className="w-3.5 h-3.5" />
          Lvl {user?.level || 1}
        </div>
      </div>
    </header>
  );
}

// ==================== XP BAR ====================

function XPBar() {
  const { user } = useAppStore();
  const level = Math.floor((user?.xp || 0) / 100) + 1;
  const xpInLevel = (user?.xp || 0) % 100;
  const progress = xpInLevel;

  return (
    <div className="flex items-center gap-3 px-4 lg:px-6 py-2 glass-card border-b border-glass-border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Zap className="w-3 h-3 text-primary" />
        <span>{user?.xp || 0} XP</span>
      </div>
      <div className="flex-1 max-w-xs">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full xp-bar rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">{xpInLevel}/100 to Level {level + 1}</span>
    </div>
  );
}

// ==================== DASHBOARD ====================

function DashboardView() {
  const { user, setCurrentView } = useAppStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, topicsData, logsData] = await Promise.all([
        api.getAnalytics().catch(() => null),
        api.getTopics().catch(() => []),
        api.getStudyLogs(7).catch(() => ({ logs: [] })),
      ]);
      setAnalytics(analyticsData);
      setTopics(topicsData);
      setRecentLogs(logsData?.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isNewUser = !topics.length && (!analytics?.overview?.totalStudySessions);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 glass-card rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Onboarding */}
      {isNewUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-primary/20 neon-glow"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Welcome to StudyTracker 🚀</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Let&apos;s get you started on your learning journey! Here&apos;s what to do:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: BookOpen, label: 'Add Topic', desc: 'Create your first subject', view: 'topics' as ViewType, color: 'text-primary' },
                  { icon: RotateCcw, label: 'Plan Revision', desc: 'Schedule your reviews', view: 'revisions' as ViewType, color: 'text-chart-2' },
                  { icon: Timer, label: 'Start Focus', desc: 'Begin a study session', view: 'focus' as ViewType, color: 'text-chart-4' },
                ].map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentView(step.view)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-background/80 border border-glass-border transition-all text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-background ${step.color}`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: 'Add Topic', view: 'topics' as ViewType, gradient: 'from-primary/20 to-primary/5' },
          { icon: Timer, label: 'Start Timer', view: 'focus' as ViewType, gradient: 'from-chart-2/20 to-chart-2/5' },
          { icon: Layers, label: 'Flashcards', view: 'flashcards' as ViewType, gradient: 'from-chart-3/20 to-chart-3/5' },
          { icon: MessageSquare, label: 'AI Coach', view: 'ai-coach' as ViewType, gradient: 'from-chart-4/20 to-chart-4/5' },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setCurrentView(action.view)}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.gradient} border border-glass-border hover:border-primary/20 transition-all group`}
          >
            <action.icon className="w-5 h-5 text-foreground/80 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Study Time', value: analytics?.overview?.weeklyMinutes ? `${Math.round(analytics.overview.weeklyMinutes / 60 * 10) / 10}h` : '0h', sub: 'this week', icon: Clock, color: 'text-primary' },
          { label: 'Topics', value: String(topics.length || 0), sub: topics.length ? `${topics.filter((t: any) => t.progress > 50).length} mastered` : "You haven't started yet", icon: BookOpen, color: 'text-chart-2' },
          { label: 'Streak', value: `${user?.streak || 0}d`, sub: user?.streak ? `Best: ${user.longestStreak}d` : 'Start your first session today', icon: Flame, color: 'text-chart-5' },
          { label: 'XP Earned', value: String(user?.xp || 0), sub: `Level ${user?.level || 1}`, icon: Zap, color: 'text-chart-3' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="glass-card border-glass-border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity + Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Activity */}
        <Card className="glass-card border-glass-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.weeklyData?.length ? (
              <div className="flex items-end gap-2 h-32">
                {analytics.weeklyData.map((day: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((day.minutes / 120) * 100, 4)}%` }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-full rounded-t-md ${day.minutes > 0 ? 'gradient-primary' : 'bg-muted/30'}`}
                    />
                    <span className="text-[10px] text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Start your first session today</p>
                  <p className="text-[10px] mt-1">Consistency beats intensity</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Topics List */}
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Topics</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setCurrentView('topics')} className="h-6 text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topics.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {topics.slice(0, 5).map((topic: any) => (
                  <div key={topic.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }} />
                    <span className="text-sm flex-1 truncate">{topic.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5">{topic._count?.studyLogs || 0} logs</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-center">
                <div>
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No topics yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Add your first subject to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Smart Suggestions */}
      <Card className="glass-card border-glass-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-chart-2" />
            </div>
            <div>
              <p className="text-sm font-medium">AI Suggestion</p>
              <p className="text-xs text-muted-foreground">
                {!topics.length
                  ? "Start with one subject today. Even 15 minutes counts!"
                  : user?.streak === 0
                  ? "You haven't studied recently. Start a quick 25-min focus session!"
                  : user?.streak < 3
                  ? "You're building momentum! Try to study every day this week."
                  : `Great ${user?.streak}-day streak! Keep it going with a revision session.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== TOPICS VIEW ====================

function TopicsView() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10b981');

  const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];

  useEffect(() => { loadTopics(); }, []);

  const loadTopics = async () => {
    try {
      const data = await api.getTopics();
      setTopics(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addTopic = async () => {
    if (!name.trim()) return;
    try {
      await api.createTopic({ name, description, color });
      setName(''); setDescription(''); setShowAdd(false);
      loadTopics();
    } catch (e) { console.error(e); }
  };

  const deleteTopic = async (id: string) => {
    try {
      await api.deleteTopic(id);
      loadTopics();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Topics</h3>
          <p className="text-sm text-muted-foreground">{topics.length} topic{topics.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Topic
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <Input placeholder="Topic name" value={name} onChange={(e) => setName(e.target.value)} className="bg-input/50" />
                <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-input/50" rows={2} />
                <div className="flex gap-2 flex-wrap">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white/30' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={addTopic} disabled={!name.trim()} className="gradient-primary text-primary-foreground">Create</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 glass-card rounded-xl animate-pulse" />)}
        </div>
      ) : topics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic: any, i: number) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="glass-card border-glass-border hover:border-primary/20 transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                      <h4 className="font-medium text-sm">{topic.name}</h4>
                    </div>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {topic.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline" className="text-[10px] h-5">{topic._count?.studyLogs || 0} logs</Badge>
                    <Badge variant="outline" className="text-[10px] h-5">{topic._count?.flashcards || 0} cards</Badge>
                    <Badge variant="outline" className="text-[10px] h-5">{topic._count?.revisions || 0} revisions</Badge>
                  </div>
                  <div className="mt-3">
                    <Progress value={topic.progress} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-glass-border">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <h4 className="font-medium mb-1">No topics yet</h4>
            <p className="text-sm text-muted-foreground mb-4">Create your first topic to start tracking your studies</p>
            <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Add Your First Topic
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== FLASHCARDS VIEW ====================

function FlashcardsView() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tag, setTag] = useState('');
  const [topicId, setTopicId] = useState('');
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [fc, tp] = await Promise.all([api.getFlashcards(), api.getTopics()]);
      setFlashcards(fc);
      setTopics(tp);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addFlashcard = async () => {
    if (!front.trim() || !back.trim()) return;
    try {
      await api.createFlashcard({ front, back, tag, topicId: topicId || null });
      setFront(''); setBack(''); setTag(''); setShowAdd(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const toggleMastered = async (id: string, mastered: boolean) => {
    try {
      await api.updateFlashcard({ id, mastered: !mastered });
      loadData();
    } catch (e) { console.error(e); }
  };

  const deleteFlashcard = async (id: string) => {
    try { await api.deleteFlashcard(id); loadData(); } catch (e) { console.error(e); }
  };

  const nextCard = () => {
    setFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const unmasteredCards = flashcards.filter(c => !c.mastered);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Flashcards</h3>
          <p className="text-sm text-muted-foreground">{flashcards.length} card{flashcards.length !== 1 ? 's' : ''} · {unmasteredCards.length} to review</p>
        </div>
        <div className="flex gap-2">
          {flashcards.length > 0 && (
            <Button variant="outline" onClick={() => { setStudyMode(!studyMode); setCurrentCard(0); setFlipped(false); }} className="glass-card">
              {studyMode ? <Layers className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {studyMode ? 'All Cards' : 'Study Mode'}
            </Button>
          )}
          <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" /> Add Card
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Front (Question)</Label>
                    <Input placeholder="What is...?" value={front} onChange={(e) => setFront(e.target.value)} className="bg-input/50 mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Back (Answer)</Label>
                    <Input placeholder="The answer is..." value={back} onChange={(e) => setBack(e.target.value)} className="bg-input/50 mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Tag (optional)</Label>
                    <Input placeholder="e.g. physics, ch1" value={tag} onChange={(e) => setTag(e.target.value)} className="bg-input/50 mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Topic</Label>
                    <Select value={topicId} onValueChange={setTopicId}>
                      <SelectTrigger className="bg-input/50 mt-1"><SelectValue placeholder="Select topic" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No topic</SelectItem>
                        {topics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addFlashcard} disabled={!front.trim() || !back.trim()} className="gradient-primary text-primary-foreground">Create Card</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {studyMode && unmasteredCards.length > 0 ? (
        <div className="flex flex-col items-center py-8">
          <p className="text-sm text-muted-foreground mb-4">Card {currentCard + 1} of {unmasteredCards.length}</p>
          <motion.div
            className="w-full max-w-lg h-64 glass-card rounded-2xl cursor-pointer flex items-center justify-center p-8"
            onClick={() => setFlipped(!flipped)}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div style={{ transform: flipped ? 'rotateY(180deg)' : '', backfaceVisibility: 'hidden' }} className="text-center">
              <p className="text-lg">{unmasteredCards[currentCard]?.front}</p>
              {flipped && <p className="text-sm text-primary mt-4">{unmasteredCards[currentCard]?.back}</p>}
            </div>
          </motion.div>
          {!flipped && <p className="text-xs text-muted-foreground mt-3">Tap to reveal answer</p>}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={prevCard}><RotateCcw className="w-4 h-4" /></Button>
            <Button onClick={() => toggleMastered(unmasteredCards[currentCard]?.id, false)} className="gradient-primary text-primary-foreground">Got it!</Button>
            <Button variant="outline" onClick={nextCard}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-40 glass-card rounded-xl animate-pulse" />)}
        </div>
      ) : flashcards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {flashcards.map((card: any, i: number) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={`glass-card border-glass-border ${card.mastered ? 'border-primary/20' : ''} group`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={card.mastered ? 'default' : 'outline'} className="text-[10px] h-5">
                      {card.mastered ? '✓ Mastered' : 'Review'}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleMastered(card.id, card.mastered)} className="p-1 hover:bg-accent rounded">
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteFlashcard(card.id)} className="p-1 hover:bg-destructive/10 rounded text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{card.front}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.back}</p>
                  {card.tag && <Badge variant="outline" className="text-[10px] h-5 mt-2">{card.tag}</Badge>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-glass-border">
          <CardContent className="p-12 text-center">
            <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <h4 className="font-medium mb-1">No flashcards yet</h4>
            <p className="text-sm text-muted-foreground mb-4">Create flashcards to review and memorize key concepts</p>
            <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Create Your First Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== FOCUS TIMER ====================

function FocusView() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(25);
  const [sessions, setSessions] = useState<any[]>([]);
  const { user } = useAppStore();

  const completeSessionAction = async (sid: string | null) => {
    setIsRunning(false);
    if (sid) {
      try {
        await api.completeFocusSession(sid);
        api.getFocusSessions().then(setSessions).catch(console.error);
      } catch (e) { console.error(e); }
    }
    setTimeLeft(duration * 60);
    setSessionId(null);
  };

  useEffect(() => {
    api.getFocusSessions().then(setSessions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer completed - schedule the completion handler
          setTimeout(() => {
            setIsRunning(false);
            setSessionId(prevSid => {
              if (prevSid) {
                api.completeFocusSession(prevSid).then(() => {
                  api.getFocusSessions().then(setSessions).catch(console.error);
                }).catch(console.error);
              }
              return null;
            });
            setTimeLeft(duration * 60);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, duration]);

  const startSession = async () => {
    try {
      const session = await api.startFocusSession(duration);
      setSessionId(session.id);
      setTimeLeft(duration * 60);
      setIsRunning(true);
    } catch (e) { console.error(e); }
  };

  const pauseSession = () => setIsRunning(false);

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setSessionId(null);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="max-w-md mx-auto">
        {/* Timer Display */}
        <div className="text-center py-8">
          <motion.div
            className="relative w-56 h-56 mx-auto mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRunning ? 'Focus time' : sessionId ? 'Paused' : 'Ready'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Duration selector */}
          {!isRunning && !sessionId && (
            <div className="flex gap-2 justify-center mb-6">
              {[15, 25, 45, 60].map(d => (
                <button
                  key={d}
                  onClick={() => { setDuration(d); setTimeLeft(d * 60); }}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${duration === d ? 'gradient-primary text-primary-foreground' : 'glass-card hover:bg-accent'}`}
                >
                  {d}m
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isRunning && !sessionId ? (
              <Button onClick={startSession} className="gradient-primary text-primary-foreground px-8">
                <Play className="w-4 h-4 mr-2" /> Start Focus
              </Button>
            ) : (
              <>
                <Button onClick={isRunning ? pauseSession : () => setIsRunning(true)} variant="outline" className="glass-card">
                  {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button onClick={() => completeSessionAction(sessionId)} className="gradient-primary text-primary-foreground">
                  <CheckCircle className="w-4 h-4 mr-1" /> Complete
                </Button>
                <Button onClick={resetSession} variant="outline" className="glass-card">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {isRunning && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mt-4"
            >
              🔒 Focus mode active · +30 XP on completion
            </motion.p>
          )}
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card className="glass-card border-glass-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {sessions.slice(0, 10).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.completed ? 'bg-primary' : 'bg-muted-foreground'}`} />
                      <span className="text-sm">{s.duration} min session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.completed && <Badge className="text-[10px] h-5">+{s.xpEarned} XP</Badge>}
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(s.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ==================== AI COACH ====================

function AICoachView() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your AI Study Coach 🎓 I can help you plan study sessions, suggest techniques, and keep you motivated. What would you like to work on today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await api.chatWithAI(userMessage, history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 flex flex-col h-[calc(100vh-10rem)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'gradient-primary text-primary-foreground rounded-br-md'
                : 'glass-card border-glass-border rounded-bl-md'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-card border-glass-border px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask your AI coach..."
          className="bg-input/50 glass-card"
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} className="gradient-primary text-primary-foreground shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ==================== QUIZ VIEW ====================

function QuizView() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [q, t] = await Promise.all([api.getQuizzes(), api.getTopics()]);
      setQuizzes(q); setTopics(t);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addQuestion = () => setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);

  const createQuiz = async () => {
    if (!title.trim() || questions.some(q => !q.question || !q.answer)) return;
    try {
      await api.createQuiz({ title, questions: questions.map(q => ({ question: q.question, options: q.options, answer: q.answer })) });
      setShowCreate(false); setTitle(''); setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
      loadData();
    } catch (e) { console.error(e); }
  };

  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.answer) score++;
    });
    try {
      await api.updateQuiz({ id: activeQuiz.id, score });
      setShowResults(true);
    } catch (e) { console.error(e); }
  };

  if (activeQuiz) {
    const score = activeQuiz.questions.reduce((acc: number, q: any, i: number) => acc + (selectedAnswers[i] === q.answer ? 1 : 0), 0);
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{activeQuiz.title}</h3>
          <Button variant="ghost" onClick={() => setActiveQuiz(null)}>Exit Quiz</Button>
        </div>
        {showResults ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold">{score}/{activeQuiz.questions.length}</h3>
            <p className="text-muted-foreground mt-2">{Math.round((score / activeQuiz.questions.length) * 100)}% correct · +{score * 5} XP</p>
            <Button onClick={() => { setActiveQuiz(null); loadData(); }} className="gradient-primary text-primary-foreground mt-6">Back to Quizzes</Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeQuiz.questions.map((q: any, i: number) => {
              const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
              return (
                <Card key={i} className="glass-card border-glass-border">
                  <CardContent className="p-4">
                    <p className="font-medium text-sm mb-3">Q{i + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {opts.map((opt: string, j: number) => (
                        <button
                          key={j}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [i]: opt })}
                          className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                            selectedAnswers[i] === opt ? 'bg-primary/20 border-primary/40 border' : 'glass-card border-glass-border hover:border-primary/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Button onClick={submitQuiz} disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length} className="w-full gradient-primary text-primary-foreground">
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quizzes</h3>
        <Button onClick={() => setShowCreate(!showCreate)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Create Quiz
        </Button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-4">
                <Input placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-input/50" />
                {questions.map((q, i) => (
                  <div key={i} className="space-y-2 p-3 glass-card rounded-lg">
                    <Input placeholder={`Question ${i + 1}`} value={q.question} onChange={(e) => {
                      const updated = [...questions]; updated[i] = { ...updated[i], question: e.target.value }; setQuestions(updated);
                    }} className="bg-input/50 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <Input key={j} placeholder={`Option ${j + 1}`} value={opt} onChange={(e) => {
                          const updated = [...questions]; updated[i].options[j] = e.target.value; setQuestions(updated);
                        }} className="bg-input/50 text-xs" />
                      ))}
                    </div>
                    <Input placeholder="Correct answer" value={q.answer} onChange={(e) => {
                      const updated = [...questions]; updated[i] = { ...updated[i], answer: e.target.value }; setQuestions(updated);
                    }} className="bg-input/50 text-sm" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addQuestion} className="glass-card">Add Question</Button>
                  <Button onClick={createQuiz} disabled={!title.trim()} className="gradient-primary text-primary-foreground">Create Quiz</Button>
                  <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map(i => <div key={i} className="h-28 glass-card rounded-xl animate-pulse" />)}
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quizzes.map((quiz: any) => (
            <Card key={quiz.id} className="glass-card border-glass-border hover:border-primary/20 transition-all cursor-pointer" onClick={() => startQuiz(quiz)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{quiz.title}</h4>
                  {quiz.score !== null && <Badge className="text-[10px]">{quiz.score}/{quiz.totalPoints}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{quiz.questions?.length || 0} questions</p>
                <Button size="sm" className="mt-3 gradient-primary text-primary-foreground w-full">
                  {quiz.completedAt ? 'Retake' : 'Start Quiz'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-glass-border">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <h4 className="font-medium mb-1">No quizzes yet</h4>
            <p className="text-sm text-muted-foreground mb-4">Test your knowledge with custom quizzes</p>
            <Button onClick={() => setShowCreate(true)} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== CALENDAR VIEW ====================

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [studyLogs, setStudyLogs] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api.getRevisions(), api.getStudyLogs(30), api.getGoals()])
      .then(([revs, logs, gls]) => {
        setRevisions(revs); setStudyLogs(logs.logs || []); setGoals(gls);
      })
      .catch(console.error);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRevisions = revisions.filter((r: any) => new Date(r.scheduledAt).toISOString().split('T')[0] === dateStr);
    const dayLogs = studyLogs.filter((l: any) => new Date(l.date).toISOString().split('T')[0] === dateStr);
    return { revisions: dayRevisions, logs: dayLogs };
  };

  const selectedEvents = selectedDate ? getEventsForDate(parseInt(selectedDate.split('-')[2])) : null;

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={prevMonth} className="glass-card">←</Button>
          <h3 className="text-lg font-semibold min-w-[180px] text-center">{monthName}</h3>
          <Button variant="outline" size="sm" onClick={nextMonth} className="glass-card">→</Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="glass-card border-glass-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] text-muted-foreground font-medium py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="h-12" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const events = getEventsForDate(day);
              const hasEvents = events.revisions.length > 0 || events.logs.length > 0;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-12 rounded-lg text-sm flex flex-col items-center justify-center gap-0.5 transition-all
                    ${isSelected ? 'bg-primary/20 border border-primary/40' : 'hover:bg-accent/50'}
                    ${isToday ? 'ring-1 ring-primary/50' : ''}
                  `}
                >
                  <span className={isToday ? 'text-primary font-bold' : ''}>{day}</span>
                  {hasEvents && (
                    <div className="flex gap-0.5">
                      {events.revisions.length > 0 && <div className="w-1 h-1 rounded-full bg-chart-2" />}
                      {events.logs.length > 0 && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card className="glass-card border-glass-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{new Date(selectedDate + 'T00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents && (selectedEvents.revisions.length > 0 || selectedEvents.logs.length > 0) ? (
              <div className="space-y-2">
                {selectedEvents.revisions.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-chart-2/10">
                    <RotateCcw className="w-3 h-3 text-chart-2" />
                    <span className="text-sm">{r.topic?.name || 'Revision'}</span>
                    <Badge variant="outline" className="text-[10px] h-5 ml-auto">{r.status}</Badge>
                  </div>
                ))}
                {selectedEvents.logs.map((l: any) => (
                  <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-sm">{l.topic?.name || 'Study'}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{l.duration}min</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No events on this date</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Study Logs</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-chart-2" /> Revisions</div>
      </div>
    </div>
  );
}

// ==================== REVISIONS VIEW ====================

function RevisionsView() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [topicId, setTopicId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [revs, tp] = await Promise.all([api.getRevisions(), api.getTopics()]);
      setRevisions(revs); setTopics(tp);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addRevision = async () => {
    if (!topicId || !scheduledAt) return;
    try {
      await api.createRevision({ topicId, scheduledAt });
      setShowAdd(false); setTopicId(''); setScheduledAt('');
      loadData();
    } catch (e) { console.error(e); }
  };

  const completeRevision = async (id: string) => {
    try {
      await api.updateRevision({ id, status: 'completed' });
      loadData();
    } catch (e) { console.error(e); }
  };

  const pending = revisions.filter((r: any) => r.status === 'pending');
  const completed = revisions.filter((r: any) => r.status === 'completed');

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Revisions</h3>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Schedule Revision
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <Select value={topicId} onValueChange={setTopicId}>
                  <SelectTrigger className="bg-input/50"><SelectValue placeholder="Select topic" /></SelectTrigger>
                  <SelectContent>{topics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="bg-input/50" />
                <div className="flex gap-2">
                  <Button onClick={addRevision} disabled={!topicId || !scheduledAt} className="gradient-primary text-primary-foreground">Schedule</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="pending">
        <TabsList className="glass-card">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-2">
          {pending.length > 0 ? pending.map((r: any) => (
            <Card key={r.id} className="glass-card border-glass-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.topic?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-muted-foreground">Due: {new Date(r.scheduledAt).toLocaleString()}</p>
                </div>
                <Button size="sm" onClick={() => completeRevision(r.id)} className="gradient-primary text-primary-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" /> Done
                </Button>
              </CardContent>
            </Card>
          )) : (
            <Card className="glass-card border-glass-border"><CardContent className="p-8 text-center text-muted-foreground text-sm">No pending revisions. Schedule one above!</CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-2">
          {completed.length > 0 ? completed.map((r: any) => (
            <Card key={r.id} className="glass-card border-glass-border opacity-70">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-through">{r.topic?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-muted-foreground">Completed: {r.completedAt ? new Date(r.completedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="glass-card border-glass-border"><CardContent className="p-8 text-center text-muted-foreground text-sm">No completed revisions yet</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== GOALS VIEW ====================

function GoalsView() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => { loadGoals(); }, []);

  const loadGoals = async () => {
    try { setGoals(await api.getGoals()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addGoal = async () => {
    if (!title.trim()) return;
    try {
      await api.createGoal({ title, description, targetDate: targetDate || null });
      setTitle(''); setDescription(''); setTargetDate(''); setShowAdd(false);
      loadGoals();
    } catch (e) { console.error(e); }
  };

  const toggleGoal = async (id: string, completed: boolean) => {
    try { await api.updateGoal({ id, completed: !completed }); loadGoals(); } catch (e) { console.error(e); }
  };

  const deleteGoal = async (id: string) => {
    try { await api.deleteGoal(id); loadGoals(); } catch (e) { console.error(e); }
  };

  const activeGoals = goals.filter((g: any) => !g.completed);
  const completedGoals = goals.filter((g: any) => g.completed);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Goals</h3>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Goal
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <Input placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-input/50" />
                <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-input/50" rows={2} />
                <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-input/50" />
                <div className="flex gap-2">
                  <Button onClick={addGoal} disabled={!title.trim()} className="gradient-primary text-primary-foreground">Create</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="active">
        <TabsList className="glass-card">
          <TabsTrigger value="active">Active ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Done ({completedGoals.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-2">
          {activeGoals.length > 0 ? activeGoals.map((g: any) => (
            <Card key={g.id} className="glass-card border-glass-border group">
              <CardContent className="p-4 flex items-center gap-3">
                <button onClick={() => toggleGoal(g.id, g.completed)} className="w-5 h-5 rounded-full border-2 border-primary/40 hover:border-primary transition-colors flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-primary opacity-0 group-hover:opacity-50 transition-opacity" />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium">{g.title}</p>
                  {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                  {g.targetDate && <p className="text-[10px] text-muted-foreground mt-1">Due: {new Date(g.targetDate).toLocaleDateString()}</p>}
                </div>
                <button onClick={() => deleteGoal(g.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          )) : (
            <Card className="glass-card border-glass-border"><CardContent className="p-8 text-center text-muted-foreground text-sm">Set your first study goal to stay on track!</CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-2">
          {completedGoals.length > 0 ? completedGoals.map((g: any) => (
            <Card key={g.id} className="glass-card border-glass-border opacity-60">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <p className="text-sm line-through flex-1">{g.title}</p>
                <Badge className="text-[10px]">+25 XP</Badge>
              </CardContent>
            </Card>
          )) : (
            <Card className="glass-card border-glass-border"><CardContent className="p-8 text-center text-muted-foreground text-sm">No completed goals yet</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== MOOD TRACKER ====================

function MoodView() {
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🤓', label: 'Focused', value: 'focused' },
  ];

  useEffect(() => { api.getMoods().then(setMoods).catch(console.error).finally(() => setLoading(false)); }, []);

  const logMood = async () => {
    if (!selectedMood) return;
    try {
      await api.logMood({ mood: selectedMood, note: note.trim() || null });
      setSelectedMood(''); setNote('');
      api.getMoods().then(setMoods).catch(console.error);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Mood Logger */}
      <Card className="glass-card border-glass-border">
        <CardHeader><CardTitle className="text-sm">How are you feeling today?</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {moodOptions.map(m => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedMood === m.value ? 'bg-primary/20 border border-primary/40 scale-105' : 'glass-card hover:bg-accent/50'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px]">{m.label}</span>
              </button>
            ))}
          </div>
          <Textarea placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="bg-input/50" rows={2} />
          <Button onClick={logMood} disabled={!selectedMood} className="gradient-primary text-primary-foreground">Log Mood</Button>
        </CardContent>
      </Card>

      {/* Mood History */}
      <Card className="glass-card border-glass-border">
        <CardHeader><CardTitle className="text-sm">Recent Moods</CardTitle></CardHeader>
        <CardContent>
          {moods.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {moods.map((m: any) => {
                const moodEmoji = moodOptions.find(o => o.value === m.mood)?.emoji || '❓';
                return (
                  <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                    <span className="text-xl">{moodEmoji}</span>
                    <div className="flex-1">
                      <p className="text-sm capitalize">{m.mood}</p>
                      {m.note && <p className="text-xs text-muted-foreground">{m.note}</p>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">Log your first mood to start tracking patterns</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== ANALYTICS VIEW ====================

function AnalyticsView() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 glass-card rounded-xl animate-pulse" />)}</div>;

  const overview = analytics?.overview || {};
  const level = analytics?.level || {};

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <h3 className="text-lg font-semibold">Analytics</h3>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Sessions', value: overview.totalStudySessions || 0, icon: Clock, color: 'text-primary' },
          { label: 'Monthly Hours', value: overview.monthlyMinutes ? `${Math.round(overview.monthlyMinutes / 60 * 10) / 10}h` : '0h', icon: TrendingUp, color: 'text-chart-2' },
          { label: 'Mastered Cards', value: overview.masteredFlashcards || 0, icon: Layers, color: 'text-chart-3' },
          { label: 'Focus Hours', value: overview.totalFocusMinutes ? `${Math.round(overview.totalFocusMinutes / 60 * 10) / 10}h` : '0h', icon: Timer, color: 'text-chart-4' },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-glass-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Chart */}
      <Card className="glass-card border-glass-border">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Weekly Study Time</CardTitle></CardHeader>
        <CardContent>
          {analytics?.weeklyData?.length ? (
            <div className="flex items-end gap-2 h-40">
              {analytics.weeklyData.map((day: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{day.minutes}m</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.minutes / 120) * 100, 4)}%` }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full rounded-t-md ${day.minutes > 0 ? 'gradient-primary' : 'bg-muted/30'}`}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No data yet. Start studying to see your analytics!</div>
          )}
        </CardContent>
      </Card>

      {/* Level & Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Level {level.current || 1}</p>
                <p className="text-xs text-muted-foreground">{level.xp || 0} XP total</p>
              </div>
            </div>
            <Progress value={level.xpProgress || 0} className="h-2" />
            <p className="text-[10px] text-muted-foreground mt-1">{Math.round(level.xpProgress || 0)}% to next level</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-chart-2/20 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-chart-2 fire-glow" />
              </div>
              <div>
                <p className="font-semibold">{level.streak || 0}-Day Streak</p>
                <p className="text-xs text-muted-foreground">Best: {level.longestStreak || 0} days</p>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${(level.streak || 0) > i ? 'bg-chart-2' : 'bg-muted/30'}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== ACHIEVEMENTS VIEW ====================

function AchievementsView() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUnlocked: 0, totalAchievements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements().then((data) => {
      setAchievements(data.achievements);
      setStats({ totalUnlocked: data.totalUnlocked, totalAchievements: data.totalAchievements });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Achievements</h3>
        <Badge className="gradient-primary text-primary-foreground">{stats.totalUnlocked}/{stats.totalAchievements}</Badge>
      </div>

      <Progress value={(stats.totalUnlocked / Math.max(stats.totalAchievements, 1)) * 100} className="h-2" />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 glass-card rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((a: any, i: number) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={`glass-card border-glass-border ${a.unlocked ? 'border-primary/20 neon-glow' : 'opacity-60'}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${a.unlocked ? 'bg-primary/20' : 'bg-muted/30 grayscale'}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={a.unlocked ? 'default' : 'outline'} className="text-[10px] h-5">
                        {a.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                      {a.xpReward > 0 && <span className="text-[10px] text-primary">+{a.xpReward} XP</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== FORMULAS VIEW ====================

function FormulasView() {
  const [formulas, setFormulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { api.getFormulas().then(setFormulas).catch(console.error).finally(() => setLoading(false)); }, []);

  const addFormula = async () => {
    if (!name.trim() || !formula.trim()) return;
    try {
      await api.createFormula({ name, formula, description, category });
      setName(''); setFormula(''); setDescription(''); setCategory(''); setShowAdd(false);
      api.getFormulas().then(setFormulas).catch(console.error);
    } catch (e) { console.error(e); }
  };

  const deleteFormula = async (id: string) => {
    try { await api.deleteFormula(id); api.getFormulas().then(setFormulas).catch(console.error); } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Formula Library</h3>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Formula
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Formula name" value={name} onChange={(e) => setName(e.target.value)} className="bg-input/50" />
                  <Input placeholder="Category (e.g. Physics)" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-input/50" />
                </div>
                <Input placeholder="Formula (e.g. E = mc²)" value={formula} onChange={(e) => setFormula(e.target.value)} className="bg-input/50 font-mono" />
                <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-input/50" rows={2} />
                <div className="flex gap-2">
                  <Button onClick={addFormula} disabled={!name.trim() || !formula.trim()} className="gradient-primary text-primary-foreground">Save</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[1, 2].map(i => <div key={i} className="h-24 glass-card rounded-xl animate-pulse" />)}</div>
      ) : formulas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formulas.map((f: any) => (
            <Card key={f.id} className="glass-card border-glass-border group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-lg font-mono text-primary mt-1">{f.formula}</p>
                  </div>
                  <button onClick={() => deleteFormula(f.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {f.description && <p className="text-xs text-muted-foreground mt-2">{f.description}</p>}
                {f.category && <Badge variant="outline" className="text-[10px] h-5 mt-2">{f.category}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-glass-border">
          <CardContent className="p-12 text-center">
            <FlaskConical className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <h4 className="font-medium mb-1">No formulas saved</h4>
            <p className="text-sm text-muted-foreground mb-4">Store important formulas for quick reference</p>
            <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Add Your First Formula
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== FOLDERS VIEW ====================

function FoldersView() {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { api.getFolders().then(setFolders).catch(console.error).finally(() => setLoading(false)); }, []);

  const addFolder = async () => {
    if (!name.trim()) return;
    try {
      await api.createFolder({ name, description });
      setName(''); setDescription(''); setShowAdd(false);
      api.getFolders().then(setFolders).catch(console.error);
    } catch (e) { console.error(e); }
  };

  const deleteFolder = async (id: string) => {
    try { await api.deleteFolder(id); api.getFolders().then(setFolders).catch(console.error); } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Folders</h3>
        <Button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> New Folder
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4 space-y-3">
                <Input placeholder="Folder name" value={name} onChange={(e) => setName(e.target.value)} className="bg-input/50" />
                <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-input/50" />
                <div className="flex gap-2">
                  <Button onClick={addFolder} disabled={!name.trim()} className="gradient-primary text-primary-foreground">Create</Button>
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{[1, 2, 3].map(i => <div key={i} className="h-24 glass-card rounded-xl animate-pulse" />)}</div>
      ) : folders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {folders.map((f: any) => (
            <Card key={f.id} className="glass-card border-glass-border hover:border-primary/20 transition-all group cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f._count?.topics || 0} topics · {f._count?.children || 0} subfolders</p>
                </div>
                <button onClick={() => deleteFolder(f.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-glass-border">
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <h4 className="font-medium mb-1">No folders yet</h4>
            <p className="text-sm text-muted-foreground mb-4">Organize your topics into folders</p>
            <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Create Folder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==================== ADMIN PANEL ====================

function AdminView() {
  const { user: currentUser } = useAppStore();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    try {
      const data = await api.getUsers(filter === 'all' ? undefined : filter);
      setUsers(data.users); setStats(data.stats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const approveUser = async (userId: string) => {
    try { await api.approveUser(userId); loadData(); } catch (e) { console.error(e); }
  };
  const rejectUser = async (userId: string) => {
    try { await api.rejectUser(userId); loadData(); } catch (e) { console.error(e); }
  };
  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    try { await api.deleteUser(userId); loadData(); } catch (e) { console.error(e); }
  };
  const updateRole = async (userId: string, role: string) => {
    try { await api.updateRole(userId, role); loadData(); } catch (e) { console.error(e); }
  };

  const toggleAutoApprove = async () => {
    const newVal = settings.auto_approve === 'true' ? 'false' : 'true';
    try {
      await api.updateSettings({ auto_approve: newVal });
      setSettings({ ...settings, auto_approve: newVal });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: stats.total, color: 'text-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-chart-2' },
          { label: 'Approved', value: stats.approved, color: 'text-primary' },
          { label: 'Rejected', value: stats.rejected, color: 'text-destructive' },
        ].map((s, i) => (
          <Card key={i} className="glass-card border-glass-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card className="glass-card border-glass-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-Approve New Users</p>
            <p className="text-xs text-muted-foreground">Automatically approve new registrations</p>
          </div>
          <Switch
            checked={settings.auto_approve === 'true'}
            onCheckedChange={toggleAutoApprove}
          />
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilter(f); setLoading(true); }}
            className={filter === f ? 'gradient-primary text-primary-foreground' : 'glass-card'}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* User List */}
      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 glass-card rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {users.map((u: any) => (
            <Card key={u.id} className="glass-card border-glass-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{u.username}</p>
                    <Badge variant={u.status === 'approved' ? 'default' : u.status === 'pending' ? 'outline' : 'destructive'} className="text-[10px] h-5">
                      {u.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] h-5">{u.role}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {u.status === 'pending' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => approveUser(u.id)} className="text-primary hover:text-primary hover:bg-primary/10">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => rejectUser(u.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {u.status === 'rejected' && (
                    <Button size="sm" variant="ghost" onClick={() => approveUser(u.id)} className="text-primary">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Select value={u.role} onValueChange={(role) => updateRole(u.id, role)}>
                    <SelectTrigger className="w-24 h-8 text-xs glass-card"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {u.id !== currentUser?.id && (
                    <Button size="sm" variant="ghost" onClick={() => deleteUser(u.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== GLOBAL SEARCH ====================

function GlobalSearchModal() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults(null); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try { setResults(await api.search(query)); } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={() => setSearchOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg mx-4 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="glass-card border-glass-border shadow-2xl">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 p-4 border-b border-glass-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, flashcards, formulas..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
              {loading && <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>}
              {results && !loading && (
                <>
                  {results.topics?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1">Topics</p>
                      {results.topics.map((t: any) => (
                        <button key={t.id} onClick={() => { setSearchOpen(false); useAppStore.getState().setCurrentView('topics'); }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 text-sm text-left">
                          <BookOpen className="w-4 h-4 text-primary" /> {t.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {results.flashcards?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1">Flashcards</p>
                      {results.flashcards.map((f: any) => (
                        <button key={f.id} onClick={() => { setSearchOpen(false); useAppStore.getState().setCurrentView('flashcards'); }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 text-sm text-left">
                          <Layers className="w-4 h-4 text-chart-2" /> {f.front}
                        </button>
                      ))}
                    </div>
                  )}
                  {results.formulas?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 py-1">Formulas</p>
                      {results.formulas.map((f: any) => (
                        <button key={f.id} onClick={() => { setSearchOpen(false); useAppStore.getState().setCurrentView('formulas'); }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 text-sm text-left">
                          <FlaskConical className="w-4 h-4 text-chart-3" /> {f.name}: {f.formula}
                        </button>
                      ))}
                    </div>
                  )}
                  {!results.topics?.length && !results.flashcards?.length && !results.formulas?.length && (
                    <p className="text-center text-muted-foreground text-sm py-4">No results found</p>
                  )}
                </>
              )}
              {!results && !loading && (
                <p className="text-center text-muted-foreground text-sm py-4">Type to search...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ==================== MAIN APP ====================

function AppShell() {
  const { currentView, user } = useAppStore();
  const sidebarWidth = 256;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'topics': return <TopicsView />;
      case 'flashcards': return <FlashcardsView />;
      case 'focus': return <FocusView />;
      case 'ai-coach': return <AICoachView />;
      case 'quiz': return <QuizView />;
      case 'calendar': return <CalendarView />;
      case 'revisions': return <RevisionsView />;
      case 'goals': return <GoalsView />;
      case 'mood': return <MoodView />;
      case 'analytics': return <AnalyticsView />;
      case 'achievements': return <AchievementsView />;
      case 'formulas': return <FormulasView />;
      case 'folders': return <FoldersView />;
      case 'admin': return user?.role === 'admin' ? <AdminView /> : <DashboardView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        <Sidebar />
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Header />
          <XPBar />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>
          <footer className="mt-auto p-4 text-center text-xs text-muted-foreground border-t border-glass-border">
            StudyTracker AI · Your Personal Study Coach · Built with ❤️
          </footer>
        </div>
        <GlobalSearchModal />
      </TooltipProvider>
    </div>
  );
}

// ==================== ROOT PAGE ====================

export default function HomePage() {
  const { isAuthenticated, authStatus, login, setAuthStatus, setUser, setToken, token } = useAppStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('study_tracker_token') : null;
    if (savedToken) {
      api.getMe().then((userData) => {
        setUser(userData);
        setToken(savedToken);
        setAuthStatus('authenticated');
        queueMicrotask(() => setInitializing(false));
      }).catch(() => {
        localStorage.removeItem('study_tracker_token');
        setAuthStatus('unauthenticated');
        queueMicrotask(() => setInitializing(false));
      });
    } else {
      setAuthStatus('unauthenticated');
      queueMicrotask(() => setInitializing(false));
    }
  }, []);

  // Check achievements periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    const check = () => { api.checkAchievements().catch(() => {}); };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Loading StudyTracker...</p>
        </motion.div>
      </div>
    );
  }

  if (authStatus === 'pending') return <PendingScreen />;
  if (authStatus === 'rejected') return <RejectedScreen />;
  if (!isAuthenticated) return <AuthScreen />;

  return <AppShell />;
}
