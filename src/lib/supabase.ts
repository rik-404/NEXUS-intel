import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Occurrence, 
  Category, 
  Subject, 
  StandardSymptom, 
  UserProfile, 
  Shift, 
  KBArticle,
  Incident,
  ArticleSuggestion,
  UserRole
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SUBJECTS, 
  INITIAL_SYMPTOMS, 
  INITIAL_PROFILES, 
  INITIAL_SHIFTS, 
  INITIAL_ARTICLES, 
  INITIAL_OCCURRENCES 
} from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let globalSupabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) return null;
  if (!globalSupabaseClient) {
    globalSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return globalSupabaseClient;
};

export const supabase = getSupabaseClient();

// ==========================================
// LOCAL STORAGE STORE & SESSION MANAGEMENT
// ==========================================

const STORAGE_KEYS = {
  PROFILES: 'nexus_profiles_v1',
  OCCURRENCES: 'nexus_occurrences_v1',
  ARTICLES: 'nexus_articles_v1',
  CURRENT_USER: 'nexus_current_user_v1',
  SHIFTS: 'nexus_shifts_v1',
  INCIDENTS: 'nexus_incidents_v1',
  SUGGESTIONS: 'nexus_suggestions_v1'
};

export function initMockStore() {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OCCURRENCES)) {
    localStorage.setItem(STORAGE_KEYS.OCCURRENCES, JSON.stringify(INITIAL_OCCURRENCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIFTS)) {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(INITIAL_SHIFTS));
  }
}

export const DataService = {
  // Profiles & Current Active Session
  getCurrentUser(): UserProfile | null {
    initMockStore();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null; // FIX: Return null when logged out, do NOT fallback to default user!
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUserRole(role: UserRole) {
    const user = this.getCurrentUser();
    if (!user) return null;
    const updated = { ...user, role };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    this.updateUser(user.id, { role });
    return updated;
  },

  getAllProfiles(): UserProfile[] {
    initMockStore();
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return raw ? JSON.parse(raw) : INITIAL_PROFILES;
  },

  registerUser(data: { fullName: string; email: string; role: UserRole; teamName: string }): UserProfile {
    initMockStore();
    const profiles = this.getAllProfiles();
    
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `00000000-0000-4000-8000-${String(Date.now()).padStart(12, '0')}`;

    const newUser: UserProfile = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      teamName: data.teamName || 'Geral',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedList = [newUser, ...profiles];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedList));

    const client = getSupabaseClient();
    if (client) {
      client.from('profiles').upsert([{
        id: newUser.id,
        full_name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        team_name: newUser.teamName,
        is_active: true
      }], { onConflict: 'email' }).then(({ error }) => {
        if (error) console.log('Supabase sync profiles:', error.message);
      });
    }

    return newUser;
  },

  updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
    initMockStore();
    const profiles = this.getAllProfiles();
    const idx = profiles.findIndex(p => p.id === userId);
    if (idx === -1) throw new Error('Usuário não encontrado');

    const updated = { ...profiles[idx], ...updates };
    profiles[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    }

    const client = getSupabaseClient();
    if (client) {
      client.from('profiles').update({
        full_name: updated.fullName,
        role: updated.role,
        team_name: updated.teamName,
        is_active: updated.isActive
      }).eq('email', updated.email).then(({ error }) => {
        if (error) console.log('Supabase update profiles note:', error.message);
      });
    }

    return updated;
  },

  toggleUserActive(userId: string): UserProfile {
    const profiles = this.getAllProfiles();
    const user = profiles.find(p => p.id === userId);
    if (!user) throw new Error('Usuário não encontrado');
    return this.updateUser(userId, { isActive: !user.isActive });
  },

  logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(() => {});
    }
  },

  // Categories, Subjects & Symptoms
  getCategories(): Category[] {
    return INITIAL_CATEGORIES;
  },

  getSubjects(categoryId?: string): Subject[] {
    if (!categoryId) return INITIAL_SUBJECTS;
    return INITIAL_SUBJECTS.filter(s => s.categoryId === categoryId);
  },

  getSymptoms(subjectId?: string): StandardSymptom[] {
    if (!subjectId) return INITIAL_SYMPTOMS;
    return INITIAL_SYMPTOMS.filter(s => s.subjectId === subjectId);
  },

  // Shifts
  getActiveShift(): Shift | null {
    initMockStore();
    const shifts: Shift[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHIFTS) || '[]');
    return shifts.find(s => s.status === 'ativo') || null;
  },

  // Occurrences
  getOccurrences(): Occurrence[] {
    initMockStore();
    const raw = localStorage.getItem(STORAGE_KEYS.OCCURRENCES);
    return raw ? JSON.parse(raw) : INITIAL_OCCURRENCES;
  },

  createOccurrence(occurrenceData: Omit<Occurrence, 'id' | 'protocolNumber' | 'createdAt'>): Occurrence {
    initMockStore();
    const list = this.getOccurrences();
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const seqNumber = String(list.length + 1).padStart(3, '0');
    const newProtocol = `OC-${dateStr}-${seqNumber}`;

    const newOccurrence: Occurrence = {
      ...occurrenceData,
      id: `occ-${Date.now()}`,
      protocolNumber: newProtocol,
      createdAt: new Date().toISOString()
    };

    const updatedList = [newOccurrence, ...list];
    localStorage.setItem(STORAGE_KEYS.OCCURRENCES, JSON.stringify(updatedList));

    const client = getSupabaseClient();
    if (client) {
      client.from('occurrences').insert([{
        protocol_number: newProtocol,
        attendant_id: occurrenceData.attendantId.startsWith('usr-') ? '00000000-0000-0000-0000-000000000001' : occurrenceData.attendantId,
        category_id: '11111111-1111-1111-1111-111111111111',
        subject_id: '11111111-1111-1111-1111-111111111111',
        client_identifier_masked: occurrenceData.clientIdentifierMasked,
        system_name: occurrenceData.systemName,
        free_description: occurrenceData.freeDescription,
        recurrence_count: occurrenceData.recurrenceCount,
        duration_seconds: occurrenceData.durationSeconds
      }]).then(({ error }) => {
        if (error) console.log('Supabase sync occurrences:', error.message);
      });
    }

    return newOccurrence;
  },

  // Knowledge Base Articles
  getArticles(): KBArticle[] {
    initMockStore();
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return raw ? JSON.parse(raw) : INITIAL_ARTICLES;
  },

  getArticleBySlug(slug: string): KBArticle | undefined {
    return this.getArticles().find(a => a.slug === slug);
  },

  voteArticleHelpful(articleId: string, isHelpful: boolean): KBArticle {
    const list = this.getArticles();
    const articleIndex = list.findIndex(a => a.id === articleId);
    if (articleIndex === -1) throw new Error('Artigo não encontrado');

    const article = list[articleIndex];
    if (isHelpful) {
      article.helpfulCount += 1;
      article.userVote = 'helpful';
    } else {
      article.notHelpfulCount += 1;
      article.userVote = 'not_helpful';
    }

    list[articleIndex] = article;
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
    return article;
  },

  toggleFavoriteArticle(articleId: string): KBArticle {
    const list = this.getArticles();
    const articleIndex = list.findIndex(a => a.id === articleId);
    if (articleIndex === -1) throw new Error('Artigo não encontrado');

    const article = list[articleIndex];
    article.isFavorite = !article.isFavorite;
    list[articleIndex] = article;
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
    return article;
  },

  createArticle(articleData: Partial<KBArticle>): KBArticle {
    const list = this.getArticles();
    const slug = articleData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `art-${Date.now()}`;
    const newArticle: KBArticle = {
      id: `art-${Date.now()}`,
      title: articleData.title || 'Sem título',
      slug,
      summary: articleData.summary || '',
      content: articleData.content || '',
      categoryId: articleData.categoryId || 'cat-1',
      categoryName: articleData.categoryName || 'Cadastro',
      authorId: articleData.authorId || 'usr-1',
      authorName: articleData.authorName || 'Atendente',
      status: articleData.status || 'rascunho',
      currentVersion: 1,
      helpfulCount: 0,
      notHelpfulCount: 0,
      viewsCount: 0,
      tags: articleData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newArticle, ...list];
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    return newArticle;
  }
};
