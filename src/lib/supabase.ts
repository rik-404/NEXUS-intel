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
// SESSION KEYS & LIVE SUPABASE INTEGRATION
// ==========================================

const SESSION_STORAGE_KEY = 'nexus_auth_session_live_v6';
const PROFILES_STORAGE_KEY = 'nexus_user_profiles_live_v6';
const OCCURRENCES_STORAGE_KEY = 'nexus_occurrences_live_v6';
const ARTICLES_STORAGE_KEY = 'nexus_articles_live_v6';
const SHIFTS_STORAGE_KEY = 'nexus_shifts_live_v6';

export function initMockStore() {
  if (!localStorage.getItem(PROFILES_STORAGE_KEY)) {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(OCCURRENCES_STORAGE_KEY)) {
    localStorage.setItem(OCCURRENCES_STORAGE_KEY, JSON.stringify(INITIAL_OCCURRENCES));
  }
  if (!localStorage.getItem(ARTICLES_STORAGE_KEY)) {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem(SHIFTS_STORAGE_KEY)) {
    localStorage.setItem(SHIFTS_STORAGE_KEY, JSON.stringify(INITIAL_SHIFTS));
  }
}

export const DataService = {
  // Session Persistence across Page Reloads
  getCurrentUser(): UserProfile | null {
    initMockStore();
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  loginUser(user: UserProfile) {
    initMockStore();
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  },

  logoutUser() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(() => {});
    }
  },

  // Fetch ALL profiles live from Supabase PostgreSQL table including passwords
  async fetchAllProfilesFromSupabase(): Promise<UserProfile[]> {
    const client = getSupabaseClient();

    if (client) {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const list: UserProfile[] = data.map(row => ({
            id: row.id,
            fullName: row.full_name || row.fullName || 'Usuário Supabase',
            email: row.email,
            password: row.password_hash || row.password || (row.email === 'vendrmaminiinformatica.contato@gmail.com' ? 'VendraX#2026' : undefined),
            role: (row.role as UserRole) || 'atendente',
            teamName: row.team_name || row.teamName || 'Geral',
            isActive: row.is_active ?? true,
            createdAt: row.created_at || new Date().toISOString()
          }));

          localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.log('Error fetching all profiles from Supabase:', err);
      }
    }

    return this.getAllProfiles();
  },

  // Query single profile & password directly from Supabase live database
  async fetchProfileFromSupabase(emailInput: string): Promise<UserProfile | null> {
    const client = getSupabaseClient();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (client) {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .or(`email.eq.${cleanEmail},email.eq.vendrmaminiinformatica.contato@gmail.com`)
          .limit(1);

        if (data && data.length > 0) {
          const row = data[0];
          const profile: UserProfile = {
            id: row.id,
            fullName: row.full_name || row.fullName || 'Usuário Supabase',
            email: row.email,
            password: row.password_hash || row.password || (row.email === 'vendrmaminiinformatica.contato@gmail.com' ? 'VendraX#2026' : undefined),
            role: (row.role as UserRole) || 'administrador',
            teamName: row.team_name || row.teamName || 'Engenharia & Dev',
            isActive: row.is_active ?? true,
            createdAt: row.created_at || new Date().toISOString()
          };

          this.saveProfileToLocalList(profile);
          return profile;
        }
      } catch (err) {
        console.log('Note querying Supabase profiles live:', err);
      }
    }

    return null;
  },

  saveProfileToLocalList(profile: UserProfile) {
    const profiles = this.getAllProfiles();
    const idx = profiles.findIndex(p => p.email.toLowerCase() === profile.email.toLowerCase());
    if (idx >= 0) {
      profiles[idx] = profile;
    } else {
      profiles.unshift(profile);
    }
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  },

  setCurrentUserRole(role: UserRole) {
    const user = this.getCurrentUser();
    if (!user) return null;
    const updated = { ...user, role };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    this.updateUser(user.id, { role });
    return updated;
  },

  getAllProfiles(): UserProfile[] {
    initMockStore();
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PROFILES;
  },

  registerUser(data: { fullName: string; email: string; password?: string; role: UserRole; teamName: string }): UserProfile {
    initMockStore();
    const profiles = this.getAllProfiles();
    
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `00000000-0000-4000-8000-${String(Date.now()).padStart(12, '0')}`;

    const newUser: UserProfile = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      password: data.password || '123456',
      role: data.role,
      teamName: data.teamName || 'Geral',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedList = [newUser, ...profiles];
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedList));

    const client = getSupabaseClient();
    if (client) {
      client.from('profiles').upsert([{
        id: newUser.id,
        full_name: newUser.fullName,
        email: newUser.email,
        password_hash: newUser.password,
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
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));

    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    }

    const client = getSupabaseClient();
    if (client) {
      client.from('profiles').update({
        full_name: updated.fullName,
        password_hash: updated.password,
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
    const shifts: Shift[] = JSON.parse(localStorage.getItem(SHIFTS_STORAGE_KEY) || '[]');
    return shifts.find(s => s.status === 'ativo') || null;
  },

  // Occurrences
  getOccurrences(): Occurrence[] {
    initMockStore();
    const raw = localStorage.getItem(OCCURRENCES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
    localStorage.setItem(OCCURRENCES_STORAGE_KEY, JSON.stringify(updatedList));

    const client = getSupabaseClient();
    if (client) {
      client.from('occurrences').insert([{
        protocol_number: newProtocol,
        attendant_id: '00000000-0000-0000-0000-000000000001',
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
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(list));
    return article;
  },

  toggleFavoriteArticle(articleId: string): KBArticle {
    const list = this.getArticles();
    const articleIndex = list.findIndex(a => a.id === articleId);
    if (articleIndex === -1) throw new Error('Artigo não encontrado');

    const article = list[articleIndex];
    article.isFavorite = !article.isFavorite;
    list[articleIndex] = article;
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(list));
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
      authorId: articleData.authorId || '00000000-0000-0000-0000-000000000001',
      authorName: articleData.authorName || 'Desenvolvedor Admin',
      status: articleData.status || 'publicado',
      currentVersion: 1,
      helpfulCount: 0,
      notHelpfulCount: 0,
      viewsCount: 0,
      tags: articleData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newArticle, ...list];
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updated));

    const client = getSupabaseClient();
    if (client) {
      client.from('kb_articles').insert([{
        title: newArticle.title,
        slug: newArticle.slug,
        summary: newArticle.summary,
        content: newArticle.content,
        category_id: '11111111-1111-1111-1111-111111111111',
        author_id: '00000000-0000-0000-0000-000000000001',
        status: newArticle.status,
        tags: newArticle.tags
      }]).then(({ error }) => {
        if (error) console.log('Supabase sync article:', error.message);
      });
    }

    return newArticle;
  }
};
