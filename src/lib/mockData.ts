import { Category, Subject, StandardSymptom, UserProfile, Shift, Occurrence, KBArticle } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Cadastro', slug: 'cadastro', description: 'Problemas de dados cadastrais, troca de titularidade e erros de validação', iconName: 'UserCheck', displayOrder: 1 },
  { id: 'cat-2', name: 'Login / Acesso', slug: 'login-acesso', description: 'Recuperação de senha, bloqueio de conta, 2FA e permissões', iconName: 'Key', displayOrder: 2 },
  { id: 'cat-3', name: 'Pagamentos', slug: 'pagamentos', description: 'Falhas no PIX, cartão recusado, divergência de fatura e estornos', iconName: 'CreditCard', displayOrder: 3 },
  { id: 'cat-4', name: 'Sistemas', slug: 'sistemas', description: 'Lentidão no ERP, quedas de serviço, APIs e integração', iconName: 'Server', displayOrder: 4 },
  { id: 'cat-5', name: 'Procedimentos', slug: 'procedimentos', description: 'Fluxos operacionais, regras de negócio e SLAs de atendimento', iconName: 'FileText', displayOrder: 5 },
  { id: 'cat-6', name: 'Erros Conhecidos', slug: 'erros-conhecidos', description: 'Bugs identificados em monitoramento com contorno provisório', iconName: 'AlertTriangle', displayOrder: 6 },
  { id: 'cat-7', name: 'FAQ / Dúvidas', slug: 'faq', description: 'Respostas para dúvidas frequentes de clientes e atendentes', iconName: 'HelpCircle', displayOrder: 7 },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Validação de CPF / CNPJ Inexistente', description: 'Erro na verificação da Receita Federal', isActive: true },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Atualização de Endereço sem Comprovante', description: 'Exceções operacionais para troca de endereço', isActive: true },
  { id: 'sub-3', categoryId: 'cat-2', name: 'Bloqueio Preventivo por 2FA Incorreto', description: 'Múltiplas tentativas de token com falha', isActive: true },
  { id: 'sub-4', categoryId: 'cat-2', name: 'Redefinição de Senha não Envia E-mail', description: 'Atraso no gateway de e-mail transacional', isActive: true },
  { id: 'sub-5', categoryId: 'cat-3', name: 'PIX Confirmado mas Saldo Não Atualizado', description: 'Atraso na conciliação de webhook bancário', isActive: true },
  { id: 'sub-6', categoryId: 'cat-3', name: 'Erro no Checkout Cartão de Crédito', description: 'Recusa 51 / Saldo insuficiente ou anti-fraude', isActive: true },
  { id: 'sub-7', categoryId: 'cat-4', name: 'Timeout na Consulta de Pedidos ERP', description: 'Lentidão em banco de dados réplica', isActive: true },
  { id: 'sub-8', categoryId: 'cat-6', name: 'Tela Branca no App Android (v4.2.1)', description: 'Crash ao abrir aba de pagamentos', isActive: true },
];

export const INITIAL_SYMPTOMS: StandardSymptom[] = [
  { id: 'sym-1', subjectId: 'sub-3', code: 'ERR_2FA_LOCK', title: 'Conta Bloqueada por Código 2FA Expirado', description: 'Cliente insere token após os 30s válidos' },
  { id: 'sym-2', subjectId: 'sub-5', code: 'ERR_PIX_PENDING', title: 'PIX Processado sem Retorno de Webhook', description: 'Notificação do banco demorando mais de 5 minutos' },
  { id: 'sym-3', subjectId: 'sub-7', code: 'ERR_ERP_TIMEOUT_504', title: 'HTTP 504 Gateway Timeout na Busca de Pedidos', description: 'Tempo de resposta excedido no servidor principal' },
  { id: 'sym-4', subjectId: 'sub-8', code: 'BUG_ANDROID_BLANK_PAGE', title: 'NullPointerException em PaymentFragment.kt', description: 'Versão v4.2.1 do aplicativo Android' },
];

// O único usuário ativo por enquanto é o Desenvolvedor Admin (admin)
export const INITIAL_PROFILES: UserProfile[] = [
  { 
    id: 'usr-dev-admin', 
    fullName: 'Desenvolvedor Admin', 
    email: 'vendrmaminiinformatica.contato@gmail.com', 
    role: 'administrador', 
    teamName: 'Engenharia & Dev', 
    isActive: true, 
    createdAt: '2026-08-15T00:00:00Z' 
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 'shift-1', title: 'Turno Principal (07h às 15h)', supervisorId: 'usr-dev-admin', supervisorName: 'Desenvolvedor Admin', startedAt: '2026-08-15T07:00:00Z', status: 'ativo' },
];

export const INITIAL_ARTICLES: KBArticle[] = [
  {
    id: 'art-1',
    title: 'Procedimento de Desbloqueio Manual de 2FA',
    slug: 'desbloqueio-manual-2fa',
    summary: 'Instruções passo a passo para autenticar identidade do cliente e desativar 2FA temporariamente.',
    content: `## Visão Geral
Quando o cliente errar o código 2FA 3 vezes consecutivas, a conta entra em estado de bloqueio preventivo de 15 minutos.

### Passos para Desbloqueio Seguro:
1. **Validação de Identidade:** Confirme Nome Completo, os últimos 4 dígitos do CPF e a data de nascimento.
2. **Checagem no Painel de Admin:** Acesse o menu *Segurança > Usuários > Status 2FA*.
3. **Clique em "Resetar Desafio":** Isso enviará um link temporário para o e-mail cadastrado.
4. **Alerta de Segurança:** Avise o cliente para conferir a caixa de SPAM caso não receba em 2 minutos.

> ⚠️ **Atenção (LGPD):** Nunca solicite fotos da frente e verso do documento via chat não criptografado. Use o portal oficial de envio.`,
    categoryId: 'cat-2',
    categoryName: 'Login / Acesso',
    authorId: 'usr-dev-admin',
    authorName: 'Desenvolvedor Admin',
    status: 'publicado',
    currentVersion: 2,
    helpfulCount: 42,
    notHelpfulCount: 1,
    viewsCount: 184,
    tags: ['2fa', 'segurança', 'desbloqueio', 'login'],
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z',
    userVote: 'helpful',
    isFavorite: true,
  },
  {
    id: 'art-2',
    title: 'Contorno para Instabilidade PIX - Conciliação Manual',
    slug: 'contorno-instabilidade-pix',
    summary: 'Como consultar o ID de End-to-End da transação PIX no parceiro bancário quando o webhook falhar.',
    content: `## Diagnóstico
Se o cliente enviou o comprovante PIX com o código \`E904008882026... \` mas o saldo no sistema continua pendente, siga as etapas:

### Procedimento de Conciliação:
1. Copie o **E2E ID** do comprovante enviado pelo cliente.
2. Abra a ferramenta **Nexus Pay Admin > Consultas PIX**.
3. Cole o ID no campo *EndToEndId* e clique em **Buscar no Banco Central**.
4. Se o status for **PAGO**, clique em **Forçar Webhook Interno**. O saldo atualizará em 10 segundos.`,
    categoryId: 'cat-3',
    categoryName: 'Pagamentos',
    authorId: 'usr-dev-admin',
    authorName: 'Desenvolvedor Admin',
    status: 'publicado',
    currentVersion: 1,
    helpfulCount: 29,
    notHelpfulCount: 3,
    viewsCount: 140,
    tags: ['pix', 'pagamento', 'e2eid', 'conciliacao'],
    createdAt: '2026-07-15T11:20:00Z',
    updatedAt: '2026-07-15T11:20:00Z',
  }
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: 'occ-1',
    protocolNumber: 'OC-20260815-001',
    attendantId: 'usr-dev-admin',
    attendantName: 'Desenvolvedor Admin',
    shiftId: 'shift-1',
    categoryId: 'cat-2',
    categoryName: 'Login / Acesso',
    subjectId: 'sub-3',
    subjectName: 'Bloqueio Preventivo por 2FA Incorreto',
    symptomId: 'sym-1',
    symptomTitle: 'Conta Bloqueada por Código 2FA Expirado',
    clientIdentifierMasked: 'CPF ***.892.104-**',
    systemName: 'Portal Web',
    freeDescription: 'Cliente informou que errou o token de 6 dígitos enviado por SMS 3 vezes seguidas. Efetuado reset seguro de credenciais via KB #art-1.',
    recurrenceCount: 1,
    durationSeconds: 240,
    resolvedByKbArticleId: 'art-1',
    resolvedByKbArticleTitle: 'Procedimento de Desbloqueio Manual de 2FA',
    createdAt: '2026-08-15T08:15:00Z'
  },
  {
    id: 'occ-2',
    protocolNumber: 'OC-20260815-002',
    attendantId: 'usr-dev-admin',
    attendantName: 'Desenvolvedor Admin',
    shiftId: 'shift-1',
    categoryId: 'cat-3',
    categoryName: 'Pagamentos',
    subjectId: 'sub-5',
    subjectName: 'PIX Confirmado mas Saldo Não Atualizado',
    symptomId: 'sym-2',
    symptomTitle: 'PIX Processado sem Retorno de Webhook',
    clientIdentifierMasked: 'CPF ***.334.901-**',
    systemName: 'Gateway Pgto',
    freeDescription: 'Cliente realizou PIX às 08:10h, valor de R$ 150,00. O dinheiro saiu da conta mas o app continuava exibindo cobrança em aberto.',
    recurrenceCount: 4,
    durationSeconds: 410,
    resolvedByKbArticleId: 'art-2',
    resolvedByKbArticleTitle: 'Contorno para Instabilidade PIX - Conciliação Manual',
    createdAt: '2026-08-15T08:42:00Z'
  }
];
