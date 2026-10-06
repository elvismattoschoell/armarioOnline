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
  const dashboardView = document.getElementById('dashboard-view');
  const boardView = document.getElementById('board-view');
  const btnCreateOutfit = document.getElementById('btn-quick-create-outfit');
  const btnCloseBoard = document.getElementById('btn-close-board');
  const pageTitle = document.getElementById('page-title');

  // Define usuário temporário/inicial
  if (userGreeting) {
    userGreeting.textContent = 'Usuário';
  }

  // Função para abrir o fluxo do Board Visual (criar/editar combinação)
  const openBoardView = () => {
    if (dashboardView) dashboardView.style.display = 'none';
    if (boardView) boardView.style.display = 'block';
    if (pageTitle) pageTitle.textContent = 'Montar Combinação';
    navButtons.forEach(btn => btn.classList.remove('active'));
  };

  // Função para fechar o Board Visual e voltar ao Painel
  const closeBoardView = () => {
    if (boardView) boardView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    if (pageTitle) pageTitle.textContent = 'Painel Geral';
    const dashboardNavBtn = document.querySelector('.nav-menu button[data-view="dashboard"]');
    if (dashboardNavBtn) dashboardNavBtn.classList.add('active');
  };

  // Navegação básica das abas
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Se estivesse no board, esconde ao trocar de aba principal
      if (boardView) boardView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';

      navButtons.forEach(btn => btn.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const view = target.getAttribute('data-view');
      if (pageTitle) {
        const titleMap = {
          dashboard: 'Painel Geral',
          wardrobe: 'Guarda-Roupa',
          collections: 'Coleções',
          wishlist: 'Wishlist'
        };
        pageTitle.textContent = titleMap[view] || 'Painel Geral';
      }
      console.log(`Navegando para a visualização: ${view}`);
    });
  });

  // Event Listeners do Board View (fluxo de criar/editar combinação)
  if (btnCreateOutfit) {
    btnCreateOutfit.addEventListener('click', () => {
      console.log('Iniciando fluxo de criar combinação...');
      openBoardView();
    });
  }

  if (btnCloseBoard) {
    btnCloseBoard.addEventListener('click', () => {
      closeBoardView();
    });
  }

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
