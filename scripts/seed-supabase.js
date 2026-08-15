const supabaseUrl = 'https://mqppliuihwxysnkvnwzw.supabase.co/rest/v1';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcHBsaXVpaHd4eXNua3Zud3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NTYyODUsImV4cCI6MjEwMjMzMjI4NX0.ODk6QF5EkBLAb2BAD4JSxQ8e4Qx0EWxGtcK1HC0ZGXA';

async function seedViaRest() {
  console.log('🚀 Enviando as 20 Categorias diretamente para a API REST do Supabase...');

  const categories = [
    { name: 'Bônus e Promoções', slug: 'bonus-promocoes', description: 'Regras de rollover, ativação de bônus, giros grátis e promoções vigentes', icon_name: 'Gift', display_order: 1 },
    { name: 'Não Houve Contato', slug: 'nao-houve-contato', description: 'Chamados encerrados sem resposta do cliente ou desconexão prematura', icon_name: 'PhoneOff', display_order: 2 },
    { name: 'Cashback', slug: 'cashback', description: 'Cálculo de programa de fidelidade, reembolso de perdas e créditos', icon_name: 'Coins', display_order: 3 },
    { name: 'Cassino Ao Vivo', slug: 'cassino-ao-vivo', description: 'Problemas em roleta, blackjack, baccarat e provedores como Evolution/Pragmatic', icon_name: 'Tv', display_order: 4 },
    { name: 'Depósito', slug: 'deposito', description: 'PIX pendente, atraso no envio de saldo, comprovantes e gateway de pagamento', icon_name: 'ArrowDownCircle', display_order: 5 },
    { name: 'Auto Exclusão', slug: 'auto-exclusao', description: 'Jogo responsável, pausa temporária ou bloqueio definitivo solicitado pelo usuário', icon_name: 'UserX', display_order: 6 },
    { name: 'Saque', slug: 'saque', description: 'Solicitação de retirada, análise de segurança, limite de saque e chave PIX', icon_name: 'ArrowUpCircle', display_order: 7 },
    { name: 'SMS', slug: 'sms', description: 'Falhas no envio do código de verificação via SMS e validação de telefone', icon_name: 'MessageSquare', display_order: 8 },
    { name: 'Cadastro', slug: 'cadastro', description: 'Alteração de dados cadastrais, erro de validação CPF e duplicidade de conta', icon_name: 'UserCheck', display_order: 9 },
    { name: 'Contas Banidas', slug: 'contas-banidas', description: 'Suspeita de fraudes, uso de robôs, contas vinculadas e violação de T&C', icon_name: 'Ban', display_order: 10 },
    { name: 'Torneios', slug: 'torneios', description: 'Classificação de liderança, premiação de lideres e regras de torneio', icon_name: 'Trophy', display_order: 11 },
    { name: 'GOS (Gestão Operacional de Segurança)', slug: 'gos', description: 'Auditorias de segurança interna, verificação de comportamento e compliance', icon_name: 'ShieldAlert', display_order: 12 },
    { name: 'Contestação', slug: 'contestacao', description: 'Chargebacks, disputas financeiras e contestação de apostas resolvidas', icon_name: 'AlertCircle', display_order: 13 },
    { name: 'Histórico Financeiro', slug: 'historico-financeiro', description: 'Relatório de transações, extrato detalhado de apostas e movimentações', icon_name: 'Receipt', display_order: 14 },
    { name: 'Cassino Slots', slug: 'cassino-slots', description: 'Jogos de caça-níqueis, rodadas trancadas, spingate e falhas de provedores', icon_name: 'Dices', display_order: 15 },
    { name: 'Imposto de Renda', slug: 'imposto-de-renda', description: 'Declaração de prêmios, retenção na fonte e tributação de apostas esportivas', icon_name: 'FileText', display_order: 16 },
    { name: 'KYC (Verificação de Identidade)', slug: 'kyc', description: 'Envio de documentos, selfie com documento, comprovante de residência e aprovação', icon_name: 'BadgeCheck', display_order: 17 },
    { name: 'Instabilidade', slug: 'instabilidade', description: 'Lentidão no site/app, erros 500/502/504, quedas de servidor e manutenção', icon_name: 'Activity', display_order: 18 },
    { name: 'Crash Games', slug: 'crash-games', description: 'Aviator, Spaceman, JetX, apostas presas e fechamento automático de rodada', icon_name: 'Zap', display_order: 19 },
    { name: 'E-mail', slug: 'email', description: 'Envio e recebimento de e-mails institucionais, redefinição de senha e suporte', icon_name: 'Mail', display_order: 20 },
  ];

  try {
    const res = await fetch(`${supabaseUrl}/categories`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(categories)
    });

    if (res.ok) {
      console.log('✅ As 20 Categorias foram gravadas com sucesso no Supabase PostgreSQL!');
    } else {
      const errText = await res.text();
      console.log('Status REST:', res.status, errText);
    }
  } catch (err) {
    console.error('Erro na requisição REST:', err);
  }
}

seedViaRest();
