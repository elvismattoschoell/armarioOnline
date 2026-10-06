// Conexão Supabase via CDN Client
const SUPABASE_URL = 'https://aetjnkhkphdomjufawfh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fJmTV_HEH0EKff1OSUruAw_xuE8j9fa';

// Inicialização do cliente Supabase usando a biblioteca oficial disponibilizada via CDN
let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error('Supabase SDK não foi carregado corretamente via CDN.');
}

export { supabaseClient, SUPABASE_URL };
