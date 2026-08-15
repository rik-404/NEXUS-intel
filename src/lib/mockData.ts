import { Category, Subject, StandardSymptom, UserProfile, Shift, Occurrence, KBArticle } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Bônus e Promoções', slug: 'bonus-promocoes', description: 'Regras de rollover, ativação de bônus, giros grátis e promoções vigentes', iconName: 'Gift', displayOrder: 1 },
  { id: 'cat-2', name: 'Não Houve Contato', slug: 'nao-houve-contato', description: 'Chamados encerrados sem resposta do cliente ou desconexão prematura', iconName: 'PhoneOff', displayOrder: 2 },
  { id: 'cat-3', name: 'Cashback', slug: 'cashback', description: 'Cálculo de programa de fidelidade, reembolso de perdas e créditos', iconName: 'Coins', displayOrder: 3 },
  { id: 'cat-4', name: 'Cassino Ao Vivo', slug: 'cassino-ao-vivo', description: 'Problemas em roleta, blackjack, baccarat e provedores como Evolution/Pragmatic', iconName: 'Tv', displayOrder: 4 },
  { id: 'cat-5', name: 'Depósito', slug: 'deposito', description: 'PIX pendente, atraso no envio de saldo, comprovantes e gateway de pagamento', iconName: 'ArrowDownCircle', displayOrder: 5 },
  { id: 'cat-6', name: 'Auto Exclusão', slug: 'auto-exclusao', description: 'Jogo responsável, pausa temporária ou bloqueio definitivo solicitado pelo usuário', iconName: 'UserX', displayOrder: 6 },
  { id: 'cat-7', name: 'Saque', slug: 'saque', description: 'Solicitação de retirada, análise de segurança, limite de saque e chave PIX', iconName: 'ArrowUpCircle', displayOrder: 7 },
  { id: 'cat-8', name: 'SMS', slug: 'sms', description: 'Falhas no envio do código de verificação via SMS e validação de telefone', iconName: 'MessageSquare', displayOrder: 8 },
  { id: 'cat-9', name: 'Cadastro', slug: 'cadastro', description: 'Alteração de dados cadastrais, erro de validação CPF e duplicidade de conta', iconName: 'UserCheck', displayOrder: 9 },
  { id: 'cat-10', name: 'Contas Banidas', slug: 'contas-banidas', description: 'Suspeita de fraudes, uso de robôs, contas vinculadas e violação de T&C', iconName: 'Ban', displayOrder: 10 },
  { id: 'cat-11', name: 'Torneios', slug: 'torneios', description: 'Classificação de liderança, premiação de lideres e regras de torneio', iconName: 'Trophy', displayOrder: 11 },
  { id: 'cat-12', name: 'GOS (Gestão Operacional de Segurança)', slug: 'gos', description: 'Auditorias de segurança interna, verificação de comportamento e compliance', iconName: 'ShieldAlert', displayOrder: 12 },
  { id: 'cat-13', name: 'Contestação', slug: 'contestacao', description: 'Chargebacks, disputas financeiras e contestação de apostas resolvidas', iconName: 'AlertCircle', displayOrder: 13 },
  { id: 'cat-14', name: 'Histórico Financeiro', slug: 'historico-financeiro', description: 'Relatório de transações, extrato detalhado de apostas e movimentações', iconName: 'Receipt', displayOrder: 14 },
  { id: 'cat-15', name: 'Cassino Slots', slug: 'cassino-slots', description: 'Jogos de caça-níqueis, rodadas trancadas, spingate e falhas de provedores', iconName: 'Dices', displayOrder: 15 },
  { id: 'cat-16', name: 'Imposto de Renda', slug: 'imposto-de-renda', description: 'Declaração de prêmios, retenção na fonte e tributação de apostas esportivas', iconName: 'FileText', displayOrder: 16 },
  { id: 'cat-17', name: 'KYC (Verificação de Identidade)', slug: 'kyc', description: 'Envio de documentos, selfie com documento, comprovante de residência e aprovação', iconName: 'BadgeCheck', displayOrder: 17 },
  { id: 'cat-18', name: 'Instabilidade', slug: 'instabilidade', description: 'Lentidão no site/app, erros 500/502/504, quedas de servidor e manutenção', iconName: 'Activity', displayOrder: 18 },
  { id: 'cat-19', name: 'Crash Games', slug: 'crash-games', description: 'Aviator, Spaceman, JetX, apostas presas e fechamento automático de rodada', iconName: 'Zap', displayOrder: 19 },
  { id: 'cat-20', name: 'E-mail', slug: 'email', description: 'Envio e recebimento de e-mails institucionais, redefinição de senha e suporte', iconName: 'Mail', displayOrder: 20 },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', categoryId: 'cat-5', name: 'PIX Pago mas Saldo Não Creditado', description: 'Atraso na liberação via gateway bancário', isActive: true },
  { id: 'sub-2', categoryId: 'cat-7', name: 'Saque Retido para Análise de Segurança', description: 'Pendência de verificação KYC antes do envio de valor', isActive: true },
  { id: 'sub-3', categoryId: 'cat-1', name: 'Rollover do Bônus Não Atingido', description: 'Dúvidas sobre o saldo bloqueado para saque', isActive: true },
  { id: 'sub-4', categoryId: 'cat-17', name: 'Documento Recusado na Etapa KYC', description: 'Imagens ilegíveis ou documento fora da validade', isActive: true },
  { id: 'sub-5', categoryId: 'cat-19', name: 'Aposta Travada no Aviator / Spaceman', description: 'Desconexão durante a subida da curva do multiplicador', isActive: true },
];

export const INITIAL_SYMPTOMS: StandardSymptom[] = [
  { id: 'sym-1', subjectId: 'sub-1', code: 'ERR_PIX_DELAY', title: 'PIX Processado sem Retorno de Webhook', description: 'Atraso no envio da confirmação bancária' },
  { id: 'sym-2', subjectId: 'sub-2', code: 'SAQUE_PENDING_KYC', title: 'Saque Travado Aguardando Envio de Documento', description: 'Trava automática do sistema anti-fraude' },
  { id: 'sym-3', subjectId: 'sub-5', code: 'CRASH_DISCONNECT', title: 'Perda de Conexão WebSocket no Crash Game', description: 'Erro de socket de comunicação com provedor' },
];

export const INITIAL_PROFILES: UserProfile[] = [
  { 
    id: '00000000-0000-0000-0000-000000000001', 
    fullName: 'Desenvolvedor Admin', 
    email: 'vendrmaminiinformatica.contato@gmail.com', 
    role: 'administrador', 
    teamName: 'Engenharia & Dev', 
    isActive: true, 
    createdAt: '2026-08-15T00:00:00Z' 
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 'shift-1', title: 'Turno Principal (07h às 15h)', supervisorId: '00000000-0000-0000-0000-000000000001', supervisorName: 'Desenvolvedor Admin', startedAt: '2026-08-15T07:00:00Z', status: 'ativo' },
];

export const INITIAL_ARTICLES: KBArticle[] = [];
export const INITIAL_OCCURRENCES: Occurrence[] = [];
