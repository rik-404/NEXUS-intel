export type UserRole = 'atendente' | 'lider' | 'supervisor' | 'administrador' | 'auditor';

export type KBArticleStatus = 'rascunho' | 'em_revisao' | 'publicado' | 'arquivado';

export type IncidentStatus = 'aberto' | 'em_analise' | 'resolvido' | 'cancelado';

export type IncidentSeverity = 'baixa' | 'media' | 'alta' | 'critica';

export type SuggestionStatus = 'pendente' | 'em_revisao' | 'aprovado' | 'rejeitado';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
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
  supervisorId?: string;
  supervisorName?: string;
  startedAt: string;
  endedAt?: string;
  status: 'ativo' | 'encerrado';
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
  clientIdentifierMasked: string; // LGPD
  systemName: string;
  freeDescription: string;
  recurrenceCount: number;
  durationSeconds: number;
  resolvedByKbArticleId?: string;
  resolvedByKbArticleTitle?: string;
  createdAt: string;
}

export interface KBAttachment {
  id: string;
  articleId: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'video' | 'link';
  fileUrl: string;
  fileSizeBytes?: number;
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
  reviewerId?: string;
  reviewerName?: string;
  status: KBArticleStatus;
  currentVersion: number;
  helpfulCount: number;
  notHelpfulCount: number;
  viewsCount: number;
  tags: string[];
  attachments?: KBAttachment[];
  createdAt: string;
  updatedAt: string;
  userVote?: 'helpful' | 'not_helpful' | null;
  isFavorite?: boolean;
}

export interface KBArticleVersion {
  id: string;
  articleId: string;
  version: number;
  title: string;
  content: string;
  editedBy: string;
  editedByName: string;
  changeSummary: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  symptomId?: string;
  createdBy: string;
  assignedSupervisorId?: string;
  slaExpiresAt: string;
  resolvedAt?: string;
  createdAt: string;
  occurrenceCount: number;
}

export interface ArticleSuggestion {
  id: string;
  title: string;
  problemDescription: string;
  proposedSolution?: string;
  suggestedBy: string;
  suggestedByName: string;
  status: SuggestionStatus;
  createdAt: string;
}

export interface ShiftHandover {
  id: string;
  shiftId: string;
  shiftTitle: string;
  authorId: string;
  authorName: string;
  pendingTasks: string;
  shiftAlerts: string;
  observations: string;
  createdAt: string;
}

// Utility helper for LGPD Masking
export function maskSensitiveData(input: string): string {
  if (!input) return '';
  // Mask CPF: 123.456.789-00 -> ***.456.789-**
  let result = input.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/g, '***.$2.$3-**');
  // Mask unformatted 11 digit numbers (CPF)
  result = result.replace(/\b(\d{3})(\d{3})(\d{3})(\d{2})\b/g, '***$2$3**');
  // Mask Email
  result = result.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, p1, p2) => {
    const visible = p1.length > 2 ? p1.substring(0, 2) + '***' : '***';
    return `${visible}@${p2}`;
  });
  return result;
}
