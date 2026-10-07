import { supabaseClient } from './supabase.js';
import { getLanguage, setLanguage, t, translateSupabaseError, updateDOMTranslations } from './i18n.js';

// Estado Global do Usuário Atual
let currentUser = null;

// Helper para re-renderizar ícones Lucide
const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', async () => {
  // Configura idioma inicial no DOM
  updateDOMTranslations();
  refreshIcons();

  // Elementos DOM de Autenticação e App
  const authView = document.getElementById('auth-view');
  const appLayout = document.getElementById('app-layout');
  const authSubtitleText = document.getElementById('auth-subtitle-text');
  const authMessage = document.getElementById('auth-message');

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const linkShowSignup = document.getElementById('link-show-signup');
  const linkShowLogin = document.getElementById('link-show-login');

  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const signupUsernameInput = document.getElementById('signup-username');
  const signupEmailInput = document.getElementById('signup-email');
  const signupPasswordInput = document.getElementById('signup-password');

  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const btnSignupSubmit = document.getElementById('btn-signup-submit');

  // Elementos DOM do Dashboard / Layout
  const userGreeting = document.getElementById('user-greeting');
  const btnLogout = document.getElementById('btn-logout');
  const navButtons = document.querySelectorAll('.nav-menu button');
  const navAdminItem = document.getElementById('nav-admin-item');

  // Views / Seções do App
  const dashboardView = document.getElementById('dashboard-view');
  const wardrobeView = document.getElementById('wardrobe-view');
  const boardView = document.getElementById('board-view');
  const adminView = document.getElementById('admin-view');
  const settingsView = document.getElementById('settings-view');
  const viewSections = [dashboardView, wardrobeView, boardView, adminView, settingsView];

  // Elementos do Guarda-Roupa
  const wardrobeCategoriesContainer = document.getElementById('wardrobe-categories-container');
  const btnOpenAddPieceModal = document.getElementById('btn-open-add-piece-modal');
  const modalAddPiece = document.getElementById('modal-add-piece');
  const btnClosePieceModal = document.getElementById('btn-close-piece-modal');
  const btnCancelPiece = document.getElementById('btn-cancel-piece');
  const addPieceForm = document.getElementById('add-piece-form');
  const pieceImageInput = document.getElementById('piece-image');
  const pieceImagePreview = document.getElementById('piece-image-preview');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const pieceNomeInput = document.getElementById('piece-nome');
  const pieceCategoriaInput = document.getElementById('piece-categoria');
  const categoriesDatalist = document.getElementById('categories-datalist');
  const pieceCorInput = document.getElementById('piece-cor');
  const pieceEstacaoInput = document.getElementById('piece-estacao');
  const pieceFormalidadeInput = document.getElementById('piece-formalidade');
  const pieceMarcaInput = document.getElementById('piece-marca');
  const pieceTamanhoInput = document.getElementById('piece-tamanho');
  const pieceModalMessage = document.getElementById('piece-modal-message');
  const btnSubmitPiece = document.getElementById('btn-submit-piece');

  const btnCreateOutfit = document.getElementById('btn-quick-create-outfit');
  const btnCloseBoard = document.getElementById('btn-close-board');
  const pageTitle = document.getElementById('page-title');

  // Elementos de Configurações
  const settingsDisplayUsername = document.getElementById('settings-display-username');
  const settingsDisplayEmail = document.getElementById('settings-display-email');
  const languageSelector = document.getElementById('language-selector');

  // Elementos do Modal de Alteração de Senha
  const btnOpenChangePasswordModal = document.getElementById('btn-open-change-password-modal');
  const modalChangePassword = document.getElementById('modal-change-password');
  const btnClosePasswordModal = document.getElementById('btn-close-password-modal');
  const btnCancelPassword = document.getElementById('btn-cancel-password');
  const changePasswordForm = document.getElementById('change-password-form');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordModalMessage = document.getElementById('password-modal-message');
  const btnSubmitPassword = document.getElementById('btn-submit-password');

  // Métricas do Admin
  const metricUsersCount = document.getElementById('metric-users-count');
  const metricItemsCount = document.getElementById('metric-items-count');

  // Configura seletor de idioma de acordo com a preferência atual
  if (languageSelector) {
    languageSelector.value = getLanguage();
    languageSelector.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      if (setLanguage(selectedLang)) {
        updateDOMTranslations();
        if (currentUser) {
          updateUserSettingsDisplay();
        }
        refreshIcons();
      }
    });
  }

  // Função auxiliar para exibir mensagens no card de auth
  const showAuthMessage = (text, type = 'error') => {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
  };

  const clearAuthMessage = () => {
    if (!authMessage) return;
    authMessage.textContent = '';
    authMessage.style.display = 'none';
  };

  // Função auxiliar para mensagens no modal de senha
  const showPasswordModalMessage = (text, type = 'error') => {
    if (!passwordModalMessage) return;
    passwordModalMessage.textContent = text;
    passwordModalMessage.className = `auth-message ${type}`;
    passwordModalMessage.style.display = 'block';
  };

  const clearPasswordModalMessage = () => {
    if (!passwordModalMessage) return;
    passwordModalMessage.textContent = '';
    passwordModalMessage.style.display = 'none';
  };

  // Função auxiliar para mensagens no modal de roupa
  const showPieceModalMessage = (text, type = 'error') => {
    if (!pieceModalMessage) return;
    pieceModalMessage.textContent = text;
    pieceModalMessage.className = `auth-message ${type}`;
    pieceModalMessage.style.display = 'block';
  };

  const clearPieceModalMessage = () => {
    if (!pieceModalMessage) return;
    pieceModalMessage.textContent = '';
    pieceModalMessage.style.display = 'none';
  };

  // Alternar entre formulários de Login e Cadastro
  if (linkShowSignup) {
    linkShowSignup.addEventListener('click', (e) => {
      e.preventDefault();
      clearAuthMessage();
      loginForm.style.display = 'none';
      signupForm.style.display = 'flex';
      if (authSubtitleText) authSubtitleText.textContent = t('signup_subtitle');
    });
  }

  if (linkShowLogin) {
    linkShowLogin.addEventListener('click', (e) => {
      e.preventDefault();
      clearAuthMessage();
      signupForm.style.display = 'none';
      loginForm.style.display = 'flex';
      if (authSubtitleText) authSubtitleText.textContent = t('login_subtitle');
    });
  }

  // Checar se usuário é Admin
  const checkIsAdmin = (user) => {
    if (!user) return false;
    return user.user_metadata?.role === 'admin';
  };

  // Atualizar dados de exibição do usuário na área de Configurações
  const updateUserSettingsDisplay = () => {
    if (!currentUser) return;

    const username =
      currentUser.user_metadata?.username ||
      currentUser.user_metadata?.name ||
      currentUser.email.split('@')[0];

    if (userGreeting) {
      userGreeting.textContent = t('welcome_greeting', { username });
    }

    if (settingsDisplayUsername) {
      settingsDisplayUsername.textContent = username;
    }

    if (settingsDisplayEmail) {
      settingsDisplayEmail.textContent = currentUser.email || '--';
    }
  };

  // Atualizar a interface conforme a sessão do usuário
  const updateUIForSession = async (session) => {
    if (session && session.user) {
      currentUser = session.user;
      updateUserSettingsDisplay();

      // Oculta tela de Auth e mostra App Layout
      if (authView) authView.style.display = 'none';
      if (appLayout) appLayout.style.display = 'flex';

      // Checa Administrador
      const isAdmin = checkIsAdmin(currentUser);
      if (navAdminItem) {
        navAdminItem.style.display = isAdmin ? 'block' : 'none';
      }

      // Define visualização padrão (Dashboard)
      showSection('dashboard');
    } else {
      currentUser = null;
      if (appLayout) appLayout.style.display = 'none';
      if (authView) authView.style.display = 'flex';
    }
    updateDOMTranslations();
    refreshIcons();
  };

  // Função para exibir uma seção principal do App
  const showSection = (viewName) => {
    viewSections.forEach(section => {
      if (section) section.style.display = 'none';
    });

    if (viewName === 'dashboard') {
      if (dashboardView) dashboardView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_dashboard');
        pageTitle.textContent = t('page_dashboard');
      }
    } else if (viewName === 'wardrobe') {
      if (wardrobeView) wardrobeView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_wardrobe');
        pageTitle.textContent = t('page_wardrobe');
      }
      loadWardrobeItems();
    } else if (viewName === 'board') {
      if (boardView) boardView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_board');
        pageTitle.textContent = t('page_board');
      }
    } else if (viewName === 'admin') {
      if (adminView) adminView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_admin');
        pageTitle.textContent = t('page_admin');
      }
      loadAdminMetrics();
    } else if (viewName === 'settings') {
      if (settingsView) settingsView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_settings');
        pageTitle.textContent = t('page_settings');
      }
      updateUserSettingsDisplay();
    } else {
      if (dashboardView) dashboardView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_dashboard');
        pageTitle.textContent = t('page_dashboard');
      }
    }

    // Atualiza estado ativo dos botões da sidebar
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    updateDOMTranslations();
    refreshIcons();
  };

  // Função para carregar métricas agregadas do Admin sem expor dados pessoais ou imagens
  const loadAdminMetrics = async () => {
    if (!supabaseClient) return;

    if (metricUsersCount) metricUsersCount.textContent = '...';
    if (metricItemsCount) metricItemsCount.textContent = '...';

    try {
      let totalUsers = 0;
      const { count: profilesCount, error: profilesErr } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!profilesErr && profilesCount !== null) {
        totalUsers = profilesCount;
      } else {
        totalUsers = 1;
      }

      let totalItems = 0;
      const { count: itemsCount, error: itemsErr } = await supabaseClient
        .from('roupas')
        .select('*', { count: 'exact', head: true });

      if (!itemsErr && itemsCount !== null) {
        totalItems = itemsCount;
      } else {
        // Fallback para tabela alternativa caso exista
        const { count: fallbackCount, error: fallbackErr } = await supabaseClient
          .from('items')
          .select('*', { count: 'exact', head: true });
        if (!fallbackErr && fallbackCount !== null) {
          totalItems = fallbackCount;
        } else {
          totalItems = 0;
        }
      }

      if (metricUsersCount) metricUsersCount.textContent = totalUsers.toString();
      if (metricItemsCount) metricItemsCount.textContent = totalItems.toString();
    } catch (err) {
      console.error('Erro ao carregar métricas admin:', err);
      if (metricUsersCount) metricUsersCount.textContent = '1';
      if (metricItemsCount) metricItemsCount.textContent = '0';
    }
  };

  // --- Handlers do Supabase Auth ---

  // 1. Cadastro (signUp) - Com Redirecionamento Automático para Login
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthMessage();

      const username = signupUsernameInput.value.trim();
      const email = signupEmailInput.value.trim();
      const password = signupPasswordInput.value;

      if (!username || !email || !password) {
        showAuthMessage(t('fill_all_fields'));
        return;
      }

      if (!supabaseClient) {
        showAuthMessage(t('supabase_connection_error'));
        return;
      }

      btnSignupSubmit.disabled = true;
      btnSignupSubmit.querySelector('span').textContent = t('btn_signing_up');

      const { error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      btnSignupSubmit.disabled = false;
      btnSignupSubmit.querySelector('span').textContent = t('btn_signup');

      if (error) {
        showAuthMessage(translateSupabaseError(error));
      } else {
        // Limpa formulário de cadastro e redireciona para a tela de Login
        signupForm.reset();
        signupForm.style.display = 'none';
        loginForm.style.display = 'flex';
        if (authSubtitleText) authSubtitleText.textContent = t('login_subtitle');
        showAuthMessage(t('signup_success_redirect'), 'success');
      }
    });
  }

  // 2. Login (signInWithPassword)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthMessage();

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;

      if (!email || !password) {
        showAuthMessage(t('fill_all_fields'));
        return;
      }

      if (!supabaseClient) {
        showAuthMessage(t('supabase_connection_error'));
        return;
      }

      btnLoginSubmit.disabled = true;
      btnLoginSubmit.querySelector('span').textContent = t('btn_logging_in');

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      btnLoginSubmit.disabled = false;
      btnLoginSubmit.querySelector('span').textContent = t('btn_login');

      if (error) {
        showAuthMessage(translateSupabaseError(error));
      } else {
        clearAuthMessage();
        updateUIForSession(data.session);
      }
    });
  }

  // 3. Logout (signOut)
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      updateUIForSession(null);
    });
  }

  // --- Handlers do Modal de Alteração de Senha ---
  if (btnOpenChangePasswordModal) {
    btnOpenChangePasswordModal.addEventListener('click', () => {
      clearPasswordModalMessage();
      if (changePasswordForm) changePasswordForm.reset();
      if (modalChangePassword) modalChangePassword.style.display = 'flex';
    });
  }

  const closeModalPassword = () => {
    if (modalChangePassword) modalChangePassword.style.display = 'none';
    clearPasswordModalMessage();
    if (changePasswordForm) changePasswordForm.reset();
  };

  if (btnClosePasswordModal) {
    btnClosePasswordModal.addEventListener('click', closeModalPassword);
  }

  if (btnCancelPassword) {
    btnCancelPassword.addEventListener('click', closeModalPassword);
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearPasswordModalMessage();

      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!newPassword || !confirmPassword) {
        showPasswordModalMessage(t('fill_all_fields'));
        return;
      }

      if (newPassword.length < 6) {
        showPasswordModalMessage(t('password_min_length'));
        return;
      }

      if (newPassword !== confirmPassword) {
        showPasswordModalMessage(t('password_mismatch_error'));
        return;
      }

      if (!supabaseClient) {
        showPasswordModalMessage(t('supabase_connection_error'));
        return;
      }

      btnSubmitPassword.disabled = true;
      btnSubmitPassword.querySelector('span').textContent = t('btn_saving_password');

      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      btnSubmitPassword.disabled = false;
      btnSubmitPassword.querySelector('span').textContent = t('btn_save_password');

      if (error) {
        showPasswordModalMessage(translateSupabaseError(error));
      } else {
        showPasswordModalMessage(t('password_change_success'), 'success');
        setTimeout(() => {
          closeModalPassword();
        }, 1500);
      }
    });
  }

  // Verificação Inicial da Sessão e Ouvinte de Mudança de Estado de Auth
  if (supabaseClient) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    updateUIForSession(session);

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      updateUIForSession(session);
    });
  } else {
    showAuthMessage(t('supabase_connection_error'));
  }

  // Navegação do Menu
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const view = target.getAttribute('data-view');
      showSection(view);
    });
  });

  // Event Listeners do Board View
  if (btnCreateOutfit) {
    btnCreateOutfit.addEventListener('click', () => {
      showSection('board');
    });
  }

  if (btnCloseBoard) {
    btnCloseBoard.addEventListener('click', () => {
      showSection('dashboard');
    });
  }

  // Ações rápidas do Dashboard
  const btnAddItem = document.getElementById('btn-quick-add-item');
  const btnCreateCollection = document.getElementById('btn-quick-create-collection');

  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      openAddPieceModal();
    });
  }

  // --- Lógica e Operações do Guarda-Roupa ---

  // Preview de Imagem selecionada no Modal
  if (pieceImageInput) {
    pieceImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (pieceImagePreview) pieceImagePreview.src = event.target.result;
          if (imagePreviewContainer) imagePreviewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      } else {
        if (pieceImagePreview) pieceImagePreview.src = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      }
    });
  }

  // Abrir e Fechar Modal de Cadastro de Peça
  const openAddPieceModal = () => {
    clearPieceModalMessage();
    if (addPieceForm) addPieceForm.reset();
    if (pieceImagePreview) pieceImagePreview.src = '';
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (modalAddPiece) modalAddPiece.style.display = 'flex';
  };

  const closeAddPieceModal = () => {
    if (modalAddPiece) modalAddPiece.style.display = 'none';
    clearPieceModalMessage();
    if (addPieceForm) addPieceForm.reset();
    if (pieceImagePreview) pieceImagePreview.src = '';
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
  };

  if (btnOpenAddPieceModal) {
    btnOpenAddPieceModal.addEventListener('click', openAddPieceModal);
  }

  if (btnClosePieceModal) {
    btnClosePieceModal.addEventListener('click', closeAddPieceModal);
  }

  if (btnCancelPiece) {
    btnCancelPiece.addEventListener('click', closeAddPieceModal);
  }

  // Atualizar Datalist Autocomplete de Categorias
  const updateCategoriesDatalist = (existingCategories) => {
    if (!categoriesDatalist) return;
    const defaultCategories = [
      'Camisetas',
      'Camisas',
      'Calças',
      'Bermudas e Shorts',
      'Casacos e Jaquetas',
      'Vestidos e Saias',
      'Calçados',
      'Acessórios'
    ];

    const uniqueCategories = Array.from(
      new Set([...defaultCategories, ...existingCategories.filter(Boolean)])
    );

    categoriesDatalist.innerHTML = uniqueCategories
      .map(cat => `<option value="${cat.trim()}"></option>`)
      .join('');
  };

  // Carregar e Renderizar Peças do Guarda-Roupa Agrupadas por Categoria
  const loadWardrobeItems = async () => {
    if (!supabaseClient || !currentUser) return;
    if (!wardrobeCategoriesContainer) return;

    wardrobeCategoriesContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 32px;">Carregando peças...</p>';

    try {
      const { data: roupas, error } = await supabaseClient
        .from('roupas')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar roupas:', error);
        wardrobeCategoriesContainer.innerHTML = `<p style="text-align: center; color: var(--error-text); padding: 32px;">${translateSupabaseError(error)}</p>`;
        return;
      }

      if (!roupas || roupas.length === 0) {
        wardrobeCategoriesContainer.innerHTML = `
          <div class="empty-wardrobe-card">
            <i data-lucide="shirt" class="empty-wardrobe-icon"></i>
            <h4 class="card-title" data-i18n="empty_wardrobe_title">${t('empty_wardrobe_title')}</h4>
            <p class="card-desc" data-i18n="empty_wardrobe_desc">${t('empty_wardrobe_desc')}</p>
          </div>
        `;
        updateCategoriesDatalist([]);
        refreshIcons();
        return;
      }

      // Agrupa peças por Categoria
      const grouped = {};
      roupas.forEach(item => {
        const cat = item.categoria ? item.categoria.trim() : 'Outros';
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(item);
      });

      // Atualiza datalist autocomplete com categorias existentes
      updateCategoriesDatalist(Object.keys(grouped));

      // Limpa container e renderiza cada grupo de categoria
      wardrobeCategoriesContainer.innerHTML = '';

      Object.keys(grouped).forEach(categoryName => {
        const items = grouped[categoryName];

        const groupEl = document.createElement('div');
        groupEl.className = 'category-group';

        const headerEl = document.createElement('div');
        headerEl.className = 'category-header';
        headerEl.innerHTML = `
          <div class="category-title-area">
            <i data-lucide="tag" class="icon" style="color: var(--primary-color);"></i>
            <h4 class="category-title">${categoryName}</h4>
            <span class="category-badge">${categoryName} (${items.length})</span>
          </div>
        `;

        const gridEl = document.createElement('div');
        gridEl.className = 'pieces-grid';

        items.forEach(piece => {
          const cardEl = document.createElement('div');
          cardEl.className = 'piece-card';

          const imgHtml = piece.imagem_url
            ? `<img src="${piece.imagem_url}" alt="${piece.nome}" class="piece-image" loading="lazy">`
            : `
              <div class="piece-image-placeholder">
                <i data-lucide="image" class="icon"></i>
                <span data-i18n="no_image">${t('no_image')}</span>
              </div>
            `;

          let detailsTags = '';
          if (piece.cor) detailsTags += `<span class="piece-tag">${piece.cor}</span>`;
          if (piece.estacao) detailsTags += `<span class="piece-tag">${piece.estacao}</span>`;
          if (piece.formalidade) detailsTags += `<span class="piece-tag">${piece.formalidade}</span>`;
          if (piece.marca) detailsTags += `<span class="piece-tag">${piece.marca}</span>`;
          if (piece.tamanho) detailsTags += `<span class="piece-tag">${t('piece_tamanho_label')}: ${piece.tamanho}</span>`;

          cardEl.innerHTML = `
            <div class="piece-image-wrapper">
              ${imgHtml}
            </div>
            <div class="piece-info">
              <h5 class="piece-title">${piece.nome}</h5>
              ${detailsTags ? `<div class="piece-details">${detailsTags}</div>` : ''}
            </div>
          `;

          gridEl.appendChild(cardEl);
        });

        groupEl.appendChild(headerEl);
        groupEl.appendChild(gridEl);
        wardrobeCategoriesContainer.appendChild(groupEl);
      });

      refreshIcons();
    } catch (err) {
      console.error('Erro na renderização do guarda-roupa:', err);
      wardrobeCategoriesContainer.innerHTML = `<p style="text-align: center; color: var(--error-text); padding: 32px;">${t('supabase_connection_error')}</p>`;
    }
  };

  // Submissão do Formulário de Nova Peça
  if (addPieceForm) {
    addPieceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearPieceModalMessage();

      const nome = pieceNomeInput.value.trim();
      const categoria = pieceCategoriaInput.value.trim();
      const cor = pieceCorInput ? pieceCorInput.value.trim() : '';
      const estacao = pieceEstacaoInput ? pieceEstacaoInput.value : '';
      const formalidade = pieceFormalidadeInput ? pieceFormalidadeInput.value : '';
      const marca = pieceMarcaInput ? pieceMarcaInput.value.trim() : '';
      const tamanho = pieceTamanhoInput ? pieceTamanhoInput.value.trim() : '';

      if (!nome || !categoria) {
        showPieceModalMessage(t('piece_name_category_required'));
        return;
      }

      if (!supabaseClient || !currentUser) {
        showPieceModalMessage(t('supabase_connection_error'));
        return;
      }

      btnSubmitPiece.disabled = true;
      btnSubmitPiece.querySelector('span').textContent = t('btn_saving_piece');

      let publicImageUrl = null;

      // Upload de Imagem para o bucket 'roupas' no Supabase Storage
      const imageFile = pieceImageInput.files[0];
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

          const { data: storageData, error: storageErr } = await supabaseClient
            .storage
            .from('roupas')
            .upload(fileName, imageFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (storageErr) {
            console.error('Erro de upload de imagem:', storageErr);
            showPieceModalMessage(`Erro ao enviar imagem: ${storageErr.message || storageErr.error_description || 'Falha no Storage'}`);
            btnSubmitPiece.disabled = false;
            btnSubmitPiece.querySelector('span').textContent = t('btn_save_piece');
            return;
          }

          // Obter URL pública
          const { data: publicUrlData } = supabaseClient
            .storage
            .from('roupas')
            .getPublicUrl(fileName);

          if (publicUrlData && publicUrlData.publicUrl) {
            publicImageUrl = publicUrlData.publicUrl;
          }
        } catch (uploadErr) {
          console.error('Erro exceção no upload:', uploadErr);
          showPieceModalMessage(`Erro no upload: ${uploadErr.message || 'Falha de conexão'}`);
          btnSubmitPiece.disabled = false;
          btnSubmitPiece.querySelector('span').textContent = t('btn_save_piece');
          return;
        }
      }

      // Gravação dos Dados da Peça na tabela public.roupas
      const { data: insertedPiece, error: insertErr } = await supabaseClient
        .from('roupas')
        .insert({
          user_id: currentUser.id,
          nome: nome,
          categoria: categoria,
          cor: cor || null,
          estacao: estacao || null,
          formalidade: formalidade || null,
          marca: marca || null,
          tamanho: tamanho || null,
          imagem_url: publicImageUrl,
          status: 'Ativo'
        })
        .select()
        .single();

      btnSubmitPiece.disabled = false;
      btnSubmitPiece.querySelector('span').textContent = t('btn_save_piece');

      if (insertErr) {
        showPieceModalMessage(translateSupabaseError(insertErr));
      } else {
        showPieceModalMessage(t('piece_add_success'), 'success');
        setTimeout(() => {
          closeAddPieceModal();
          showSection('wardrobe');
        }, 1200);
      }
    });
  }

  if (btnCreateCollection) {
    btnCreateCollection.addEventListener('click', () => {
      console.log('Ação rápida: Criar Coleção iniciada.');
    });
  }
});
