import { supabaseClient } from './supabase.js';

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones do Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Elementos do DOM
  const userGreeting = document.getElementById('user-greeting');
  const navButtons = document.querySelectorAll('.nav-menu button');

  // Define usuário temporário/inicial
  if (userGreeting) {
    userGreeting.textContent = 'Usuário';
  }

  // Navegação básica das abas
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      navButtons.forEach(btn => btn.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const view = target.getAttribute('data-view');
      console.log(`Navegando para a visualização: ${view}`);
    });
  });

  // Ações rápidas do Dashboard
  const btnAddItem = document.getElementById('btn-quick-add-item');
  const btnCreateCollection = document.getElementById('btn-quick-create-collection');

  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      console.log('Ação rápida: Adicionar Peça iniciada.');
    });
  }

  if (btnCreateCollection) {
    btnCreateCollection.addEventListener('click', () => {
      console.log('Ação rápida: Criar Coleção iniciada.');
    });
  }
});
