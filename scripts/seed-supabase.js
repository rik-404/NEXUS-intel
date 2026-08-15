import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqppliuihwxysnkvnwzw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcHBsaXVpaHd4eXNua3Zud3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NTYyODUsImV4cCI6MjEwMjMzMjI4NX0.ODk6QF5EkBLAb2BAD4JSxQ8e4Qx0EWxGtcK1HC0ZGXA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🌱 Iniciando inclusão dos dados iniciais no Supabase...');

  // 1. Inserir Categorias
  const categories = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Cadastro', slug: 'cadastro', description: 'Problemas de dados cadastrais, troca de titularidade e erros de validação', icon_name: 'UserCheck', display_order: 1 },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Login / Acesso', slug: 'login-acesso', description: 'Recuperação de senha, bloqueio de conta, 2FA e permissões', icon_name: 'Key', display_order: 2 },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Pagamentos', slug: 'pagamentos', description: 'Falhas no PIX, cartão recusado, divergência de fatura e estornos', icon_name: 'CreditCard', display_order: 3 },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Sistemas', slug: 'sistemas', description: 'Lentidão no ERP, quedas de serviço, APIs e integração', icon_name: 'Server', display_order: 4 },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Procedimentos', slug: 'procedimentos', description: 'Fluxos operacionais, regras de negócio e SLAs de atendimento', icon_name: 'FileText', display_order: 5 },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Erros Conhecidos', slug: 'erros-conhecidos', description: 'Bugs identificados em monitoramento com contorno provisório', icon_name: 'AlertTriangle', display_order: 6 },
    { id: '77777777-7777-7777-7777-777777777777', name: 'FAQ / Dúvidas', slug: 'faq', description: 'Respostas para dúvidas frequentes de clientes e atendentes', icon_name: 'HelpCircle', display_order: 7 },
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catErr) {
    console.log('Nota Categorias:', catErr.message);
  } else {
    console.log('✅ Categorias inseridas com sucesso!');
  }

  console.log('🎉 Finalizado script de população!');
}

seed();
