export type UserRole = 'atendente' | 'lider' | 'supervisor' | 'administrador' | 'auditor';

export type KBArticleStatus = 'rascunho' | 'em_revisao' | 'publicado' | 'arquivado';

export type IncidentStatus = 'aberto' | 'em_analise' | 'resolvido' | 'cancelado';

export type IncidentSeverity = 'baixa' | 'media' | 'alta' | 'critica';

export type SuggestionStatus = 'pendente' | 'em_revisao' | 'aprovado' | 'rejeitado';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  role: UserRole;
  teamName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface Subject {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface StandardSymptom {
  id: string;
  subjectId?: string;
  code: string;
  title: string;
  description?: string;
}

export interface Shift {
  id: string;
  title: string;
  supervisorId: string;
  supervisorName: string;
  startedAt: string;
  endedAt?: string;
  status: 'ativo' | 'encerrado' | 'pausado';
}

export interface ShiftHandover {
  id: string;
  shiftId: string;
  shiftTitle: string;
  authorId: string;
  authorName: string;
  pendingTasks?: string;
  shiftAlerts?: string;
  observations?: string;
  createdAt: string;
}

export interface Occurrence {
  id: string;
  protocolNumber: string;
  attendantId: string;
  attendantName: string;
  shiftId?: string;
  categoryId: string;
  categoryName: string;
  subjectId: string;
  subjectName: string;
  symptomId?: string;
  symptomTitle?: string;
  clientIdentifierMasked: string;
  systemName: string;
  freeDescription: string;
  recurrenceCount: number;
  durationSeconds: number;
  resolvedByKbArticleId?: string;
  resolvedByKbArticleTitle?: string;
  createdAt: string;
}

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  reviewerName?: string;
  status: KBArticleStatus;
  currentVersion: number;
  helpfulCount: number;
  notHelpfulCount: number;
  viewsCount: number;
  tags: string[];
  attachments?: { id: string; fileName: string; fileUrl: string; fileSize?: string; fileType?: string }[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  userVote?: 'helpful' | 'not_helpful' | null;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedSystem: string;
  startedAt: string;
  resolvedAt?: string;
}

export interface ArticleSuggestion {
  id: string;
  occurrenceId: string;
  occurrenceProtocol: string;
  suggestedTitle: string;
  suggestedSummary: string;
  suggestedContent: string;
  categoryId: string;
  categoryName: string;
  authorName: string;
  status: SuggestionStatus;
  createdAt: string;
}

export function maskSensitiveData(input: string): string {
  if (!input) return '';
  const clean = input.trim();

  // Email pattern
  if (clean.includes('@')) {
    const parts = clean.split('@');
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.substring(0, 2)}***${name[name.length - 1]}@${domain}`;
  }

  // CPF pattern (11 digits or formatted)
  const numbersOnly = clean.replace(/\D/g, '');
  if (numbersOnly.length === 11) {
    return `***.${numbersOnly.substring(3, 6)}.${numbersOnly.substring(6, 9)}-**`;
  }

  // Generic text masking
  if (clean.length <= 4) return '***';
  return `${clean.substring(0, 2)}***${clean.substring(clean.length - 2)}`;
}
