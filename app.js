import { supabaseClient } from './supabase.js';
import { getLanguage, setLanguage, t, translateSupabaseError, updateDOMTranslations, getCategoryTranslation } from './i18n.js';

// Estado Global do Usuário Atual
let currentUser = null;
let wardrobeMode = 'active'; // 'active' | 'archived'
let currentManagingCollectionId = null;

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
  const collectionsView = document.getElementById('collections-view');
  const wishlistView = document.getElementById('wishlist-view');
  const adminView = document.getElementById('admin-view');
  const settingsView = document.getElementById('settings-view');
  const viewSections = [dashboardView, wardrobeView, boardView, collectionsView, wishlistView, adminView, settingsView];

  // Elementos do Guarda-Roupa
  const wardrobeCategoriesContainer = document.getElementById('wardrobe-categories-container');
  const btnOpenAddPieceModal = document.getElementById('btn-open-add-piece-modal');
  const tabBtnActive = document.getElementById('tab-btn-active');
  const tabBtnArchived = document.getElementById('tab-btn-archived');

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

  // Elementos do Modal de Edição de Peça
  const modalEditPiece = document.getElementById('modal-edit-piece');
  const btnCloseEditPieceModal = document.getElementById('btn-close-edit-piece-modal');
  const btnCancelEditPiece = document.getElementById('btn-cancel-edit-piece');
  const editPieceForm = document.getElementById('edit-piece-form');
  const editPieceIdInput = document.getElementById('edit-piece-id');
  const editPieceNomeInput = document.getElementById('edit-piece-nome');
  const editPieceCategoriaInput = document.getElementById('edit-piece-categoria');
  const editPieceCorInput = document.getElementById('edit-piece-cor');
  const editPieceEstacaoInput = document.getElementById('edit-piece-estacao');
  const editPieceFormalidadeInput = document.getElementById('edit-piece-formalidade');
  const editPieceMarcaInput = document.getElementById('edit-piece-marca');
  const editPieceTamanhoInput = document.getElementById('edit-piece-tamanho');
  const editPieceModalMessage = document.getElementById('edit-piece-modal-message');
  const btnSubmitEditPiece = document.getElementById('btn-submit-edit-piece');

  // Elementos de Coleções
  const collectionsGrid = document.getElementById('collections-grid');
  const modalAddCollection = document.getElementById('modal-add-collection');
  const btnCloseCollectionModal = document.getElementById('btn-close-collection-modal');
  const btnCancelCollection = document.getElementById('btn-cancel-collection');
  const addCollectionForm = document.getElementById('add-collection-form');
  const collectionNomeInput = document.getElementById('collection-nome');
  const collectionDescInput = document.getElementById('collection-desc');
  const collectionModalMessage = document.getElementById('collection-modal-message');
  const btnSubmitCollection = document.getElementById('btn-submit-collection');

  const modalManageCollection = document.getElementById('modal-manage-collection');
  const btnCloseManageCollectionModal = document.getElementById('btn-close-manage-collection-modal');
  const collectionOutfitsSelectorList = document.getElementById('collection-outfits-selector-list');
  const btnSaveCollectionOutfits = document.getElementById('btn-save-collection-outfits');
  const manageCollectionTitle = document.getElementById('manage-collection-title');

  // Modal de Visualizar Coleção
  const modalViewCollection = document.getElementById('modal-view-collection');
  const btnCloseViewCollectionModal = document.getElementById('btn-close-view-collection-modal');
  const btnCloseViewCollection = document.getElementById('btn-close-view-collection');
  const viewCollectionTitle = document.getElementById('view-collection-title');
  const viewCollectionDesc = document.getElementById('view-collection-desc');
  const viewCollectionOutfitsGrid = document.getElementById('view-collection-outfits-grid');

  // Elementos de Wishlist
  const wishlistGrid = document.getElementById('wishlist-grid');
  const modalAddWishlist = document.getElementById('modal-add-wishlist');
  const btnCloseWishlistModal = document.getElementById('btn-close-wishlist-modal');
  const btnCancelWishlist = document.getElementById('btn-cancel-wishlist');
  const addWishlistForm = document.getElementById('add-wishlist-form');
  const wishlistImageInput = document.getElementById('wishlist-image');
  const wishlistImagePreview = document.getElementById('wishlist-image-preview');
  const wishlistImagePreviewContainer = document.getElementById('wishlist-image-preview-container');
  const wishlistNomeInput = document.getElementById('wishlist-nome');
  const wishlistCategoriaInput = document.getElementById('wishlist-categoria');
  const wishlistPrecoInput = document.getElementById('wishlist-preco');
  const wishlistLinkInput = document.getElementById('wishlist-link');
  const wishlistObservacoesInput = document.getElementById('wishlist-observacoes');
  const wishlistModalMessage = document.getElementById('wishlist-modal-message');
  const btnSubmitWishlist = document.getElementById('btn-submit-wishlist');

  const btnCreateOutfit = document.getElementById('btn-quick-create-outfit');
  const btnCloseBoard = document.getElementById('btn-close-board');
  const pageTitle = document.getElementById('page-title');

  // Elementos de Configurações
  const settingsDisplayUsername = document.getElementById('settings-display-username');
  const settingsDisplayEmail = document.getElementById('settings-display-email');
  const languageSelector = document.getElementById('language-selector');
  const authLanguageSelector = document.getElementById('auth-language-selector');

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
  const metricCombinationsCount = document.getElementById('metric-combinations-count');
  const metricWishlistCount = document.getElementById('metric-wishlist-count');
  const adminCategoryChart = document.getElementById('admin-category-chart');
  const adminOverviewChart = document.getElementById('admin-overview-chart');

  // Configura seletor de idioma de acordo com a preferência atual
  const syncLanguageSelectors = () => {
    const currentLang = getLanguage();
    if (languageSelector) languageSelector.value = currentLang;
    if (authLanguageSelector) authLanguageSelector.value = currentLang;
  };

  const handleLanguageChange = (selectedLang) => {
    if (setLanguage(selectedLang)) {
      syncLanguageSelectors();
      updateDOMTranslations();
      if (signupForm && signupForm.style.display !== 'none') {
        if (authSubtitleText) authSubtitleText.textContent = t('signup_subtitle');
      } else {
        if (authSubtitleText) authSubtitleText.textContent = t('login_subtitle');
      }
      if (currentUser) {
        updateUserSettingsDisplay();
        loadWardrobeItems();
      }
      refreshIcons();
    }
  };

  syncLanguageSelectors();

  if (languageSelector) {
    languageSelector.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value);
    });
  }

  if (authLanguageSelector) {
    authLanguageSelector.addEventListener('change', (e) => {
      handleLanguageChange(e.target.value);
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

  // Função auxiliar para mensagens nos modais
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

  const showEditPieceModalMessage = (text, type = 'error') => {
    if (!editPieceModalMessage) return;
    editPieceModalMessage.textContent = text;
    editPieceModalMessage.className = `auth-message ${type}`;
    editPieceModalMessage.style.display = 'block';
  };

  const clearEditPieceModalMessage = () => {
    if (!editPieceModalMessage) return;
    editPieceModalMessage.textContent = '';
    editPieceModalMessage.style.display = 'none';
  };

  const showCollectionModalMessage = (text, type = 'error') => {
    if (!collectionModalMessage) return;
    collectionModalMessage.textContent = text;
    collectionModalMessage.className = `auth-message ${type}`;
    collectionModalMessage.style.display = 'block';
  };

  const clearCollectionModalMessage = () => {
    if (!collectionModalMessage) return;
    collectionModalMessage.textContent = '';
    collectionModalMessage.style.display = 'none';
  };

  const showWishlistModalMessage = (text, type = 'error') => {
    if (!wishlistModalMessage) return;
    wishlistModalMessage.textContent = text;
    wishlistModalMessage.className = `auth-message ${type}`;
    wishlistModalMessage.style.display = 'block';
  };

  const clearWishlistModalMessage = () => {
    if (!wishlistModalMessage) return;
    wishlistModalMessage.textContent = '';
    wishlistModalMessage.style.display = 'none';
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
      initBoardView();
    } else if (viewName === 'collections') {
      if (collectionsView) collectionsView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_collections');
        pageTitle.textContent = t('page_collections');
      }
      loadCollections();
    } else if (viewName === 'wishlist') {
      if (wishlistView) wishlistView.style.display = 'block';
      if (pageTitle) {
        pageTitle.setAttribute('data-i18n', 'page_wishlist');
        pageTitle.textContent = t('page_wishlist');
      }
      loadWishlistItems();
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

  // --- Painel Admin Overhaul e Analytics ---
  const loadAdminMetrics = async () => {
    if (!supabaseClient) return;

    if (metricUsersCount) metricUsersCount.textContent = '...';
    if (metricItemsCount) metricItemsCount.textContent = '...';
    if (metricCombinationsCount) metricCombinationsCount.textContent = '...';
    if (metricWishlistCount) metricWishlistCount.textContent = '...';

    try {
      // 1. Total Registered Accounts
      let totalUsers = 0;
      const { data: rpcCount, error: rpcErr } = await supabaseClient.rpc('get_total_users_count');
      if (!rpcErr && typeof rpcCount === 'number') {
        totalUsers = rpcCount;
      } else {
        const { count: profilesCount } = await supabaseClient
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        totalUsers = profilesCount || 1;
      }

      // 2. Active Pieces Count & Items Data
      const { count: itemsCount, data: itemsData } = await supabaseClient
        .from('roupas')
        .select('*');

      const totalItems = itemsCount || (itemsData ? itemsData.length : 0);

      // 3. Combinations Count
      const { count: combinationsCount } = await supabaseClient
        .from('combinacoes')
        .select('*', { count: 'exact', head: true });

      const totalCombinations = combinationsCount || 0;

      // 4. Wishlist Items Count
      const { count: wishlistCount } = await supabaseClient
        .from('wishlist')
        .select('*', { count: 'exact', head: true });

      const totalWishlist = wishlistCount || 0;

      if (metricUsersCount) metricUsersCount.textContent = totalUsers.toString();
      if (metricItemsCount) metricItemsCount.textContent = totalItems.toString();
      if (metricCombinationsCount) metricCombinationsCount.textContent = totalCombinations.toString();
      if (metricWishlistCount) metricWishlistCount.textContent = totalWishlist.toString();

      // Render Minimalist Bar Charts matching neutral gray corporate theme
      renderAdminCategoryChart(itemsData || []);
      renderAdminOverviewChart(totalUsers, totalItems, totalCombinations, totalWishlist);

    } catch (err) {
      console.error('Erro ao carregar métricas admin:', err);
      if (metricUsersCount) metricUsersCount.textContent = '1';
      if (metricItemsCount) metricItemsCount.textContent = '0';
      if (metricCombinationsCount) metricCombinationsCount.textContent = '0';
      if (metricWishlistCount) metricWishlistCount.textContent = '0';
    }
  };

  // Render Sleek Donut Chart: Items by Category
  const renderAdminCategoryChart = (items) => {
    if (!adminCategoryChart) return;

    if (!items || items.length === 0) {
      adminCategoryChart.innerHTML = `<p style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 24px;">Sem dados de categoria cadastrados.</p>`;
      return;
    }

    const catCounts = {};
    let totalCount = 0;
    items.forEach(item => {
      const cat = getCategoryTranslation(item.categoria || 'Outros');
      catCounts[cat] = (catCounts[cat] || 0) + 1;
      totalCount += 1;
    });

    const entries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const colorPalette = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

    // Donut SVG Calculations
    const radius = 60;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;

    let svgSlicesHtml = '';
    let legendHtml = '<div class="chart-legend-grid">';

    entries.forEach(([cat, count], index) => {
      const color = colorPalette[index % colorPalette.length];
      const percentage = totalCount > 0 ? (count / totalCount) : 0;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle * circumference;

      accumulatedAngle += percentage;

      svgSlicesHtml += `
        <circle cx="100" cy="100" r="${radius}"
                fill="none"
                stroke="${color}"
                stroke-width="${strokeWidth}"
                stroke-dasharray="${strokeDasharray}"
                stroke-dashoffset="${strokeDashoffset}"
                class="donut-slice"
                data-tooltip="${cat}: ${count} (${Math.round(percentage * 100)}%)">
          <title>${cat}: ${count} (${Math.round(percentage * 100)}%)</title>
        </circle>
      `;

      legendHtml += `
        <div class="chart-legend-item">
          <span class="legend-color-dot" style="background-color: ${color};"></span>
          <span class="legend-label">${cat}</span>
          <span class="legend-value">${count} <small>(${Math.round(percentage * 100)}%)</small></span>
        </div>
      `;
    });

    legendHtml += '</div>';

    const donutSvg = `
      <div class="donut-chart-wrapper">
        <div class="donut-svg-container">
          <svg viewBox="0 0 200 200" class="donut-svg">
            <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#f1f5f9" stroke-width="${strokeWidth}" />
            ${svgSlicesHtml}
          </svg>
          <div class="donut-center-text">
            <span class="donut-total-value">${totalCount}</span>
            <span class="donut-total-label">${t('metric_items_label')}</span>
          </div>
        </div>
        ${legendHtml}
      </div>
    `;

    adminCategoryChart.innerHTML = donutSvg;
  };

  // Render Modern SVG Line/Area Chart: System Overview & Activity
  const renderAdminOverviewChart = (users, items, combinations, wishlist) => {
    if (!adminOverviewChart) return;

    const metrics = [
      { label: t('metric_users_label'), count: users, shortLabel: 'Usuários' },
      { label: t('metric_items_label'), count: items, shortLabel: 'Peças' },
      { label: t('metric_combinations_label'), count: combinations, shortLabel: 'Outfits' },
      { label: t('metric_wishlist_label'), count: wishlist, shortLabel: 'Wishlist' }
    ];

    const maxVal = Math.max(...metrics.map(m => m.count), 10);
    const chartWidth = 320;
    const chartHeight = 160;
    const paddingX = 40;
    const paddingY = 25;
    const plotWidth = chartWidth - paddingX * 2;
    const plotHeight = chartHeight - paddingY * 2;

    const points = metrics.map((m, idx) => {
      const x = paddingX + (idx / (metrics.length - 1)) * plotWidth;
      const y = paddingY + plotHeight - (m.count / maxVal) * plotHeight;
      return { x, y, count: m.count, label: m.shortLabel, fullLabel: m.label };
    });

    // Build SVG Path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;
      pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY + 10} L ${points[0].x} ${chartHeight - paddingY + 10} Z`;

    let gridLinesHtml = '';
    const gridSteps = 3;
    for (let i = 0; i <= gridSteps; i++) {
      const gridY = paddingY + (i / gridSteps) * plotHeight;
      const val = Math.round(maxVal - (i / gridSteps) * maxVal);
      gridLinesHtml += `
        <line x1="${paddingX - 5}" y1="${gridY}" x2="${chartWidth - paddingX + 5}" y2="${gridY}" stroke="#e2e8f0" stroke-dasharray="2 2" stroke-width="1" />
        <text x="${paddingX - 10}" y="${gridY + 3}" text-anchor="end" font-size="9" fill="#94a3b8" font-family="inherit">${val}</text>
      `;
    }

    let pointsHtml = '';
    points.forEach(p => {
      pointsHtml += `
        <g class="chart-node-group">
          <circle cx="${p.x}" cy="${p.y}" r="5" fill="#0f172a" stroke="#ffffff" stroke-width="2" class="chart-point">
            <title>${p.fullLabel}: ${p.count}</title>
          </circle>
          <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="10" font-weight="700" fill="#0f172a">${p.count}</text>
          <text x="${p.x}" y="${chartHeight - 4}" text-anchor="middle" font-size="9" font-weight="600" fill="#64748b">${p.label}</text>
        </g>
      `;
    });

    const svgHtml = `
      <div class="line-chart-wrapper">
        <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="line-chart-svg">
          <defs>
            <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0f172a" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          ${gridLinesHtml}
          <path d="${areaD}" fill="url(#lineChartGradient)" />
          <path d="${pathD}" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ${pointsHtml}
        </svg>
      </div>
    `;

    adminOverviewChart.innerHTML = svgHtml;
  };

  // --- Handlers do Supabase Auth ---

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

      if (password.length < 6) {
        showAuthMessage(t('signup_password_placeholder'));
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
        signupForm.reset();
        signupForm.style.display = 'none';
        loginForm.style.display = 'flex';
        if (authSubtitleText) authSubtitleText.textContent = t('login_subtitle');
        showAuthMessage(t('signup_success_redirect'), 'success');
      }
    });
  }

  // Modal de Visualização da Coleção (Inspect Outfits)
  const openViewCollectionModal = async (collectionId, collectionName, collectionDesc) => {
    if (viewCollectionTitle) viewCollectionTitle.textContent = t('modal_view_collection_title', { name: collectionName });
    if (viewCollectionDesc) viewCollectionDesc.textContent = collectionDesc || t('modal_view_collection_desc');
    if (viewCollectionOutfitsGrid) viewCollectionOutfitsGrid.innerHTML = 'Carregando outfits...';

    if (modalViewCollection) modalViewCollection.style.display = 'flex';

    try {
      const { data: junctions, error: juncErr } = await supabaseClient
        .from('colecao_combinacoes')
        .select('combinacao_id, combinacoes(*)')
        .eq('colecao_id', collectionId);

      if (juncErr) {
        console.error('Erro ao buscar outfits da coleção:', juncErr);
        if (viewCollectionOutfitsGrid) viewCollectionOutfitsGrid.innerHTML = `<p style="color: var(--error-text); text-align: center;">${translateSupabaseError(juncErr)}</p>`;
        return;
      }

      const outfits = (junctions || [])
        .map(j => j.combinacoes)
        .filter(Boolean);

      if (!outfits || outfits.length === 0) {
        if (viewCollectionOutfitsGrid) {
          viewCollectionOutfitsGrid.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 24px;">${t('empty_collection_outfits')}</p>`;
        }
        return;
      }

      if (viewCollectionOutfitsGrid) viewCollectionOutfitsGrid.innerHTML = '';

      outfits.forEach(comb => {
        const cardEl = document.createElement('div');
        cardEl.className = 'combination-card';

        cardEl.innerHTML = `
          <div class="combination-card-header">
            <h5 class="combination-title">${comb.nome}</h5>
            <span class="piece-tag">${Array.isArray(comb.canvas_state) ? comb.canvas_state.length : 0} peças</span>
          </div>
          <div class="combination-preview-box"></div>
          <div class="combination-card-actions">
            <button class="btn btn-primary btn-sm btn-load-to-board" data-id="${comb.id}">
              <i data-lucide="sparkles" class="icon-sm"></i>
              <span>Abrir no Canvas</span>
            </button>
            <button class="btn btn-secondary btn-sm btn-export-combination" data-id="${comb.id}" title="Exportar PNG">
              <i data-lucide="download" class="icon-sm"></i>
            </button>
          </div>
        `;

        renderCombinationToCanvas(comb.canvas_state, 320, 180, { backgroundColor: '#f8f9fa' })
          .then(thumbCanvas => {
            const previewBox = cardEl.querySelector('.combination-preview-box');
            if (previewBox) {
              previewBox.innerHTML = '';
              thumbCanvas.style.width = '100%';
              thumbCanvas.style.height = '100%';
              thumbCanvas.style.objectFit = 'contain';
              previewBox.appendChild(thumbCanvas);
            }
          })
          .catch(err => console.error('Erro ao gerar preview do outfit da coleção:', err));

        const btnLoad = cardEl.querySelector('.btn-load-to-board');
        if (btnLoad) {
          btnLoad.addEventListener('click', () => {
            if (Array.isArray(comb.canvas_state)) {
              canvasItems = JSON.parse(JSON.stringify(comb.canvas_state));
              selectedItemId = null;
              if (boardOutfitNameInput) boardOutfitNameInput.value = comb.nome;
              closeViewCollectionModal();
              showSection('board');
              renderCanvas();
            }
          });
        }

        const btnExport = cardEl.querySelector('.btn-export-combination');
        if (btnExport) {
          btnExport.addEventListener('click', () => {
            exportCombinationPNG(comb.canvas_state, comb.nome);
          });
        }

        viewCollectionOutfitsGrid.appendChild(cardEl);
      });

      refreshIcons();
    } catch (err) {
      console.error('Erro ao abrir modal de visualização de coleção:', err);
    }
  };

  const closeViewCollectionModal = () => {
    if (modalViewCollection) modalViewCollection.style.display = 'none';
  };

  if (btnCloseViewCollectionModal) btnCloseViewCollectionModal.addEventListener('click', closeViewCollectionModal);
  if (btnCloseViewCollection) btnCloseViewCollection.addEventListener('click', closeViewCollectionModal);

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

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      updateUIForSession(null);
    });
  }

  // Modal de Senha
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

  // Verificação Inicial da Sessão
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

  // Event Listeners de Ações Rápidas
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

  const btnAddItem = document.getElementById('btn-quick-add-item');
  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      openAddPieceModal();
    });
  }

  // --- Lógica e Operações do Guarda-Roupa e Processamento Visual ---

  const btnRemoveBg = document.getElementById('btn-remove-bg');
  const btnInvertSelection = document.getElementById('btn-invert-selection');
  const btnCropImage = document.getElementById('btn-crop-image');
  const btnEraserDirect = document.getElementById('btn-eraser-direct');
  const btnUndoOriginal = document.getElementById('btn-undo-original');
  const imageProcessingActions = document.getElementById('image-processing-actions');

  const cropCanvasEditor = document.getElementById('crop-canvas-editor');
  const cropCanvasControls = document.getElementById('crop-canvas-controls');
  const btnToolLasso = document.getElementById('btn-tool-lasso');
  const btnToolEraser = document.getElementById('btn-tool-eraser');
  const brushSizeSlider = document.getElementById('brush-size-slider');
  const brushSizeVal = document.getElementById('brush-size-val');
  const btnClearTrace = document.getElementById('btn-clear-trace');
  const btnConfirmCrop = document.getElementById('btn-confirm-crop');
  const btnCancelCrop = document.getElementById('btn-cancel-crop');

  let originalImageSrc = null;
  let processedBlob = null;

  let currentTool = 'lasso';
  let isDrawing = false;
  let pathPoints = [];
  let baseEditorImage = null;
  let offscreenCanvas = null;
  let lastCoord = null;

  const closeCanvasEditor = () => {
    pathPoints = [];
    isDrawing = false;
    lastCoord = null;
    offscreenCanvas = null;
    if (cropCanvasControls) cropCanvasControls.style.display = 'none';
    if (cropCanvasEditor) cropCanvasEditor.style.display = 'none';
    if (imageProcessingActions) imageProcessingActions.style.display = 'flex';
    if (pieceImagePreview) pieceImagePreview.style.display = 'block';
  };

  if (pieceImageInput) {
    pieceImageInput.addEventListener('change', (e) => {
      closeCanvasEditor();
      processedBlob = null;
      originalImageSrc = null;

      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          originalImageSrc = event.target.result;
          if (pieceImagePreview) pieceImagePreview.src = originalImageSrc;
          if (imagePreviewContainer) imagePreviewContainer.style.display = 'flex';
          if (imageProcessingActions) imageProcessingActions.style.display = 'flex';
          if (cropCanvasControls) cropCanvasControls.style.display = 'none';
          if (cropCanvasEditor) cropCanvasEditor.style.display = 'none';
          refreshIcons();
        };
        reader.readAsDataURL(file);
      } else {
        if (pieceImagePreview) pieceImagePreview.src = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      }
    });
  }

  const applyAlphaMaskFromBlob = (origSrc, maskBlob) => {
    return new Promise((resolve, reject) => {
      const origImg = new Image();
      origImg.crossOrigin = 'Anonymous';
      origImg.onload = () => {
        const maskImg = new Image();
        maskImg.crossOrigin = 'Anonymous';
        const maskUrl = URL.createObjectURL(maskBlob);
        maskImg.onload = () => {
          const width = origImg.naturalWidth || origImg.width;
          const height = origImg.naturalHeight || origImg.height;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(origImg, 0, 0, width, height);
          const origData = ctx.getImageData(0, 0, width, height);

          const maskCanvas = document.createElement('canvas');
          maskCanvas.width = width;
          maskCanvas.height = height;
          const maskCtx = maskCanvas.getContext('2d');
          maskCtx.drawImage(maskImg, 0, 0, width, height);
          const maskData = maskCtx.getImageData(0, 0, width, height);

          const oPixels = origData.data;
          const mPixels = maskData.data;

          for (let i = 0; i < oPixels.length; i += 4) {
            oPixels[i + 3] = mPixels[i + 3];
          }

          ctx.putImageData(origData, 0, 0);
          URL.revokeObjectURL(maskUrl);

          canvas.toBlob((finalBlob) => {
            if (finalBlob) {
              resolve(finalBlob);
            } else {
              reject(new Error('Falha ao gerar blob do canvas'));
            }
          }, 'image/png');
        };
        maskImg.onerror = (err) => {
          URL.revokeObjectURL(maskUrl);
          reject(err);
        };
        maskImg.src = maskUrl;
      };
      origImg.onerror = (err) => reject(err);
      origImg.src = origSrc;
    });
  };

  const bgRemoveProgressContainer = document.getElementById('bg-remove-progress-container');
  const bgRemoveProgressStatus = document.getElementById('bg-remove-progress-status');
  const bgRemoveProgressPercent = document.getElementById('bg-remove-progress-percent');
  const bgRemoveProgressFill = document.getElementById('bg-remove-progress-fill');

  const updateBgProgress = (percent, statusText) => {
    if (bgRemoveProgressContainer) bgRemoveProgressContainer.style.display = 'flex';
    const rounded = Math.min(100, Math.max(0, Math.round(percent)));
    if (bgRemoveProgressPercent) bgRemoveProgressPercent.textContent = `${rounded}%`;
    if (bgRemoveProgressFill) bgRemoveProgressFill.style.width = `${rounded}%`;
    if (statusText && bgRemoveProgressStatus) {
      bgRemoveProgressStatus.textContent = statusText;
    }
  };

  const hideBgProgress = () => {
    if (bgRemoveProgressContainer) bgRemoveProgressContainer.style.display = 'none';
    if (bgRemoveProgressPercent) bgRemoveProgressPercent.textContent = '0%';
    if (bgRemoveProgressFill) bgRemoveProgressFill.style.width = '0%';
  };

  const isWasmSupported = () => {
    try {
      if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
        const module = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
        if (module instanceof WebAssembly.Module) {
          return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const isIOSDevice = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isMobileIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isMacTouch = /Macintosh/.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
    return isMobileIOS || isMacTouch;
  };

  const scaleImageIfNeeded = (imageSrc, maxDimension = 1024) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width <= maxDimension && height <= maxDimension) {
          resolve(imageSrc);
          return;
        }

        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(imageSrc);
          }
        }, 'image/png');
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  if (btnRemoveBg) {
    btnRemoveBg.addEventListener('click', async () => {
      if (!pieceImagePreview || !pieceImagePreview.src) return;

      closeCanvasEditor();
      clearPieceModalMessage();

      const originalBtnText = btnRemoveBg.querySelector('span')
        ? btnRemoveBg.querySelector('span').textContent
        : t('btn_remove_bg');

      btnRemoveBg.disabled = true;
      if (btnRemoveBg.querySelector('span')) {
        btnRemoveBg.querySelector('span').textContent = t('btn_removing_bg');
      }

      const imageSource = originalImageSrc || pieceImagePreview.src;
      updateBgProgress(5, t('bg_removing_progress'));

      let currentSimulated = 5;
      const progressInterval = setInterval(() => {
        if (currentSimulated < 85) {
          currentSimulated += Math.floor(Math.random() * 6) + 2;
          if (currentSimulated > 85) currentSimulated = 85;
          updateBgProgress(currentSimulated, t('bg_processing_image'));
        }
      }, 300);

      try {
        let responseBlob = null;

        if (!isWasmSupported()) {
          console.warn("WebAssembly não é suportado neste navegador/dispositivo.");
          showPieceModalMessage(t('bg_wasm_not_supported'), 'error');
        } else {
          try {
            const isIOS = isIOSDevice();
            const sourceForImgly = isIOS ? await scaleImageIfNeeded(imageSource, 1024) : imageSource;

            const imglyModule = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.8/+esm');
            const removeBackground = imglyModule.default || imglyModule.removeBackground;

            if (typeof removeBackground === 'function') {
              const imglyConfig = {
                model: isIOS ? 'isnet_quint8' : 'isnet_fp16',
                device: 'cpu',
                progress: (key, current, total) => {
                  if (total && total > 0) {
                    const p = Math.round((current / total) * 100);
                    const statusMsg = key.includes('fetch') ? t('bg_downloading_model') : t('bg_processing_image');
                    updateBgProgress(p, statusMsg);
                  }
                }
              };

              responseBlob = await removeBackground(sourceForImgly, imglyConfig);
            }
          } catch (imglyErr) {
            console.error("Falha detalhada ao executar @imgly/background-removal:", imglyErr);
            showPieceModalMessage(t('bg_removal_error_details', { details: imglyErr.message || 'Erro no Web Worker/WASM' }), 'error');
          }
        }

        clearInterval(progressInterval);

        if (responseBlob) {
          updateBgProgress(90, t('bg_processing_image'));
          const compositedBlob = await applyAlphaMaskFromBlob(imageSource, responseBlob);
          processedBlob = compositedBlob;
          const newUrl = URL.createObjectURL(compositedBlob);
          pieceImagePreview.src = newUrl;
          updateBgProgress(100, t('bg_removed_success'));
          setTimeout(hideBgProgress, 1000);
          showPieceModalMessage(t('bg_removed_success'), 'success');
        } else {
          hideBgProgress();
          pieceImagePreview.src = imageSource;
          showPieceModalMessage(t('bg_removal_fallback'), 'info');
        }
      } catch (err) {
        clearInterval(progressInterval);
        hideBgProgress();
        console.warn('Erro na remoção de fundo:', err);
        if (pieceImagePreview && imageSource) {
          pieceImagePreview.src = imageSource;
        }
        showPieceModalMessage(t('bg_removal_fallback'), 'info');
      } finally {
        btnRemoveBg.disabled = false;
        if (btnRemoveBg.querySelector('span')) {
          btnRemoveBg.querySelector('span').textContent = originalBtnText;
        }
      }
    });
  }

  if (btnInvertSelection) {
    btnInvertSelection.addEventListener('click', () => {
      if (!pieceImagePreview || !pieceImagePreview.src || !originalImageSrc) {
        showPieceModalMessage('Carregue uma imagem antes de inverter a seleção.', 'error');
        return;
      }

      closeCanvasEditor();

      const origImg = new Image();
      origImg.crossOrigin = 'Anonymous';
      origImg.onload = () => {
        const currentImg = new Image();
        currentImg.crossOrigin = 'Anonymous';
        currentImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = origImg.width;
          canvas.height = origImg.height;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
          const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const origCanvas = document.createElement('canvas');
          origCanvas.width = origImg.width;
          origCanvas.height = origImg.height;
          const origCtx = origCanvas.getContext('2d');
          origCtx.drawImage(origImg, 0, 0);
          const origData = origCtx.getImageData(0, 0, origCanvas.width, origCanvas.height);

          const cPixels = currentData.data;
          const oPixels = origData.data;

          for (let i = 0; i < cPixels.length; i += 4) {
            if (cPixels[i + 3] < 128) {
              cPixels[i] = oPixels[i];
              cPixels[i + 1] = oPixels[i + 1];
              cPixels[i + 2] = oPixels[i + 2];
              cPixels[i + 3] = 255;
            } else {
              cPixels[i + 3] = 0;
            }
          }

          ctx.putImageData(currentData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              processedBlob = blob;
              const newUrl = URL.createObjectURL(blob);
              pieceImagePreview.src = newUrl;
              showPieceModalMessage('Seleção invertida com sucesso!', 'success');
            }
          }, 'image/png');
        };
        currentImg.src = pieceImagePreview.src;
      };
      origImg.src = originalImageSrc;
    });
  }

  if (btnUndoOriginal) {
    btnUndoOriginal.addEventListener('click', () => {
      if (originalImageSrc) {
        closeCanvasEditor();
        processedBlob = null;
        pieceImagePreview.src = originalImageSrc;
        showPieceModalMessage('Foto original restaurada com sucesso!', 'success');
      } else {
        showPieceModalMessage('Nenhuma foto original para restaurar.', 'error');
      }
    });
  }

  // --- Lógica de Abas do Guarda-Roupa (Peças Ativas vs Arquivadas) ---
  if (tabBtnActive && tabBtnArchived) {
    tabBtnActive.addEventListener('click', () => {
      wardrobeMode = 'active';
      tabBtnActive.classList.add('active');
      tabBtnArchived.classList.remove('active');
      loadWardrobeItems();
    });

    tabBtnArchived.addEventListener('click', () => {
      wardrobeMode = 'archived';
      tabBtnArchived.classList.add('active');
      tabBtnActive.classList.remove('active');
      loadWardrobeItems();
    });
  }

  // Abrir e Fechar Modal de Cadastro de Peça
  const openAddPieceModal = () => {
    clearPieceModalMessage();
    closeCanvasEditor();
    processedBlob = null;
    originalImageSrc = null;
    if (addPieceForm) addPieceForm.reset();
    if (pieceImagePreview) pieceImagePreview.src = '';
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (modalAddPiece) modalAddPiece.style.display = 'flex';
  };

  const closeAddPieceModal = () => {
    closeCanvasEditor();
    processedBlob = null;
    originalImageSrc = null;
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

  if (modalAddPiece) {
    modalAddPiece.addEventListener('click', (e) => {
      if (e.target === modalAddPiece) {
        closeAddPieceModal();
      }
    });
  }

  // --- Lógica de Edição de Peça Existente ---
  const openEditPieceModal = (piece) => {
    clearEditPieceModalMessage();
    if (editPieceIdInput) editPieceIdInput.value = piece.id;
    if (editPieceNomeInput) editPieceNomeInput.value = piece.nome || '';
    if (editPieceCategoriaInput) editPieceCategoriaInput.value = piece.categoria || '';
    if (editPieceCorInput) editPieceCorInput.value = piece.cor || '';
    if (editPieceEstacaoInput) editPieceEstacaoInput.value = piece.estacao || '';
    if (editPieceFormalidadeInput) editPieceFormalidadeInput.value = piece.formalidade || '';
    if (editPieceMarcaInput) editPieceMarcaInput.value = piece.marca || '';
    if (editPieceTamanhoInput) editPieceTamanhoInput.value = piece.tamanho || '';

    if (modalEditPiece) modalEditPiece.style.display = 'flex';
  };

  const closeEditPieceModal = () => {
    if (modalEditPiece) modalEditPiece.style.display = 'none';
    clearEditPieceModalMessage();
    if (editPieceForm) editPieceForm.reset();
  };

  if (btnCloseEditPieceModal) btnCloseEditPieceModal.addEventListener('click', closeEditPieceModal);
  if (btnCancelEditPiece) btnCancelEditPiece.addEventListener('click', closeEditPieceModal);

  if (editPieceForm) {
    editPieceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearEditPieceModalMessage();

      const id = editPieceIdInput.value;
      const nome = editPieceNomeInput.value.trim();
      const categoria = editPieceCategoriaInput.value.trim();
      const cor = editPieceCorInput.value.trim();
      const estacao = editPieceEstacaoInput.value;
      const formalidade = editPieceFormalidadeInput.value;
      const marca = editPieceMarcaInput.value.trim();
      const tamanho = editPieceTamanhoInput.value.trim();

      if (!id || !nome || !categoria) {
        showEditPieceModalMessage(t('piece_name_category_required'));
        return;
      }

      btnSubmitEditPiece.disabled = true;
      btnSubmitEditPiece.querySelector('span').textContent = t('btn_updating_piece');

      const { error } = await supabaseClient
        .from('roupas')
        .update({
          nome,
          categoria,
          cor: cor || null,
          estacao: estacao || null,
          formalidade: formalidade || null,
          marca: marca || null,
          tamanho: tamanho || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      btnSubmitEditPiece.disabled = false;
      btnSubmitEditPiece.querySelector('span').textContent = t('btn_update_piece');

      if (error) {
        showEditPieceModalMessage(translateSupabaseError(error));
      } else {
        showEditPieceModalMessage(t('piece_updated_success'), 'success');
        setTimeout(() => {
          closeEditPieceModal();
          loadWardrobeItems();
        }, 1000);
      }
    });
  }

  // Event Delegation global para gatilhos de cadastro
  document.addEventListener('click', (e) => {
    const triggerBtn = e.target.closest('[data-action="open-add-piece"]');
    if (triggerBtn) {
      e.preventDefault();
      openAddPieceModal();
    }
  });

  // Atualizar Datalist Autocomplete de Categorias (suportando novas categorias personalizadas)
  const updateCategoriesDatalist = (existingCategories) => {
    if (!categoriesDatalist) return;
    const defaultCategories = [
      'Camiseta',
      'Camisa',
      'Casaco',
      'Jaqueta',
      'Moletom',
      'Calça',
      'Bermuda / Calções',
      'Saia',
      'Vestido',
      'Calçado / Tênis',
      'Acessório',
      'Chapéu / Boné'
    ];

    const rawList = Array.from(
      new Set([...defaultCategories, ...existingCategories.filter(Boolean)])
    );

    const translatedSet = new Set(rawList.map(cat => getCategoryTranslation(cat)));

    categoriesDatalist.innerHTML = Array.from(translatedSet)
      .map(translated => `<option value="${translated}"></option>`)
      .join('');
  };

  // Carregar e Renderizar Peças do Guarda-Roupa Agrupadas por Categoria (Ativas vs Arquivadas)
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

      const allCategories = (roupas || []).map(r => r.categoria);
      updateCategoriesDatalist(allCategories);

      // Filtra conforme a aba selecionada (Ativas vs Arquivadas)
      const filteredRoupas = (roupas || []).filter(item => {
        if (wardrobeMode === 'archived') {
          return item.status === 'Arquivado';
        } else {
          return item.status !== 'Arquivado';
        }
      });

      if (filteredRoupas.length === 0) {
        if (wardrobeMode === 'archived') {
          wardrobeCategoriesContainer.innerHTML = `
            <div class="empty-wardrobe-card">
              <i data-lucide="archive" class="empty-wardrobe-icon"></i>
              <h4 class="card-title" data-i18n="empty_archived_title">${t('empty_archived_title')}</h4>
              <p class="card-desc" data-i18n="empty_archived_desc">${t('empty_archived_desc')}</p>
            </div>
          `;
        } else {
          wardrobeCategoriesContainer.innerHTML = `
            <div class="empty-wardrobe-card">
              <i data-lucide="shirt" class="empty-wardrobe-icon"></i>
              <h4 class="card-title" data-i18n="empty_wardrobe_title">${t('empty_wardrobe_title')}</h4>
              <p class="card-desc" data-i18n="empty_wardrobe_desc">${t('empty_wardrobe_desc')}</p>
              <button class="btn btn-primary" data-action="open-add-piece" style="margin-top: 16px;">
                <i data-lucide="plus" class="icon"></i>
                <span data-i18n="btn_add_piece">${t('btn_add_piece')}</span>
              </button>
            </div>
          `;
        }
        refreshIcons();
        return;
      }

      // Agrupa peças por Categoria
      const grouped = {};
      filteredRoupas.forEach(item => {
        const cat = item.categoria ? item.categoria.trim() : 'Outros';
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(item);
      });

      wardrobeCategoriesContainer.innerHTML = '';

      Object.keys(grouped).forEach(categoryName => {
        const items = grouped[categoryName];
        const translatedCatName = getCategoryTranslation(categoryName);

        const groupEl = document.createElement('div');
        groupEl.className = 'category-group';

        const headerEl = document.createElement('div');
        headerEl.className = 'category-header';
        headerEl.innerHTML = `
          <div class="category-title-area">
            <i data-lucide="tag" class="icon" style="color: var(--primary-color);"></i>
            <h4 class="category-title">${translatedCatName}</h4>
            <span class="category-badge">${translatedCatName} (${items.length})</span>
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

          const actionsHtml = wardrobeMode === 'archived'
            ? `
              <div class="piece-actions">
                <button class="btn btn-secondary btn-sm btn-restore-piece" data-id="${piece.id}" data-name="${piece.nome}">
                  <i data-lucide="rotate-ccw" class="icon-sm"></i>
                  <span>${t('btn_restore_piece')}</span>
                </button>
              </div>
            `
            : `
              <div class="piece-actions">
                <button class="btn btn-secondary btn-sm btn-edit-piece" data-id="${piece.id}">
                  <i data-lucide="pencil" class="icon-sm"></i>
                  <span>${t('btn_edit_piece')}</span>
                </button>
                <button class="btn btn-secondary btn-sm btn-archive-piece" data-id="${piece.id}" data-name="${piece.nome}">
                  <i data-lucide="archive" class="icon-sm"></i>
                  <span>${t('btn_archive_piece')}</span>
                </button>
              </div>
            `;

          cardEl.innerHTML = `
            <div class="piece-image-wrapper">
              ${imgHtml}
            </div>
            <div class="piece-info">
              <h5 class="piece-title">${piece.nome}</h5>
              ${detailsTags ? `<div class="piece-details">${detailsTags}</div>` : ''}
              ${actionsHtml}
            </div>
          `;

          // Bind Edit button
          const btnEdit = cardEl.querySelector('.btn-edit-piece');
          if (btnEdit) {
            btnEdit.addEventListener('click', () => openEditPieceModal(piece));
          }

          // Bind Archive (Soft Delete) button
          const btnArchive = cardEl.querySelector('.btn-archive-piece');
          if (btnArchive) {
            btnArchive.addEventListener('click', async () => {
              if (confirm(t('confirm_archive_piece', { name: piece.nome }))) {
                const { error } = await supabaseClient
                  .from('roupas')
                  .update({ status: 'Arquivado', updated_at: new Date().toISOString() })
                  .eq('id', piece.id);

                if (error) {
                  alert(translateSupabaseError(error));
                } else {
                  loadWardrobeItems();
                }
              }
            });
          }

          // Bind Restore button
          const btnRestore = cardEl.querySelector('.btn-restore-piece');
          if (btnRestore) {
            btnRestore.addEventListener('click', async () => {
              if (confirm(t('confirm_restore_piece', { name: piece.nome }))) {
                const { error } = await supabaseClient
                  .from('roupas')
                  .update({ status: 'Ativo', updated_at: new Date().toISOString() })
                  .eq('id', piece.id);

                if (error) {
                  alert(translateSupabaseError(error));
                } else {
                  loadWardrobeItems();
                }
              }
            });
          }

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

      if (!supabaseClient || !currentUser || !currentUser.id) {
        showPieceModalMessage(t('supabase_connection_error'));
        return;
      }

      const userId = currentUser.id;

      btnSubmitPiece.disabled = true;
      btnSubmitPiece.querySelector('span').textContent = t('btn_saving_piece');

      let publicImageUrl = null;

      const imageFile = pieceImageInput.files[0];
      if (processedBlob || imageFile) {
        try {
          const fileToUpload = processedBlob || imageFile;
          const fileExt = processedBlob ? 'png' : (imageFile ? imageFile.name.split('.').pop() : 'png');
          const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

          const { data: storageData, error: storageErr } = await supabaseClient
            .storage
            .from('roupas')
            .upload(fileName, fileToUpload, {
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

      const { data: insertedPiece, error: insertErr } = await supabaseClient
        .from('roupas')
        .insert({
          user_id: userId,
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

  // --- Coleções (Collections Feature) ---
  const openAddCollectionModal = () => {
    clearCollectionModalMessage();
    if (addCollectionForm) addCollectionForm.reset();
    if (modalAddCollection) modalAddCollection.style.display = 'flex';
  };

  const closeAddCollectionModal = () => {
    if (modalAddCollection) modalAddCollection.style.display = 'none';
    clearCollectionModalMessage();
    if (addCollectionForm) addCollectionForm.reset();
  };

  if (btnCloseCollectionModal) btnCloseCollectionModal.addEventListener('click', closeAddCollectionModal);
  if (btnCancelCollection) btnCancelCollection.addEventListener('click', closeAddCollectionModal);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="open-add-collection"]');
    if (btn) {
      e.preventDefault();
      openAddCollectionModal();
    }
  });

  if (addCollectionForm) {
    addCollectionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearCollectionModalMessage();

      const nome = collectionNomeInput.value.trim();
      const descricao = collectionDescInput.value.trim();

      if (!nome) {
        showCollectionModalMessage(t('collection_name_required'));
        return;
      }

      btnSubmitCollection.disabled = true;
      btnSubmitCollection.querySelector('span').textContent = t('btn_saving_collection');

      const { error } = await supabaseClient
        .from('colecoes')
        .insert({
          user_id: currentUser.id,
          nome,
          descricao: descricao || null
        });

      btnSubmitCollection.disabled = false;
      btnSubmitCollection.querySelector('span').textContent = t('btn_save_collection');

      if (error) {
        showCollectionModalMessage(translateSupabaseError(error));
      } else {
        showCollectionModalMessage(t('collection_create_success'), 'success');
        setTimeout(() => {
          closeAddCollectionModal();
          loadCollections();
        }, 1000);
      }
    });
  }

  // Carregar e Renderizar Coleções
  const loadCollections = async () => {
    if (!supabaseClient || !currentUser || !collectionsGrid) return;

    collectionsGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Carregando coleções...</p>';

    try {
      const { data: colecoes, error } = await supabaseClient
        .from('colecoes')
        .select('*, colecao_combinacoes(combinacao_id)')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar coleções:', error);
        collectionsGrid.innerHTML = `<p style="text-align: center; color: var(--error-text); grid-column: 1 / -1;">${translateSupabaseError(error)}</p>`;
        return;
      }

      if (!colecoes || colecoes.length === 0) {
        collectionsGrid.innerHTML = `
          <div class="empty-wardrobe-card" style="grid-column: 1 / -1;">
            <i data-lucide="folder-heart" class="empty-wardrobe-icon"></i>
            <h4 class="card-title" data-i18n="empty_collections_title">${t('empty_collections_title')}</h4>
            <p class="card-desc" data-i18n="empty_collections_desc">${t('empty_collections_desc')}</p>
            <button class="btn btn-primary" data-action="open-add-collection" style="margin-top: 16px;">
              <i data-lucide="folder-plus" class="icon"></i>
              <span data-i18n="btn_new_collection">${t('btn_new_collection')}</span>
            </button>
          </div>
        `;
        refreshIcons();
        return;
      }

      collectionsGrid.innerHTML = '';

      colecoes.forEach(col => {
        const outfitCount = col.colecao_combinacoes ? col.colecao_combinacoes.length : 0;
        const cardEl = document.createElement('div');
        cardEl.className = 'card collection-card';

        cardEl.innerHTML = `
          <div class="collection-header">
            <div class="collection-title-group">
              <i data-lucide="folder-heart" class="icon collection-icon"></i>
              <h4 class="card-title">${col.nome}</h4>
            </div>
            <button class="btn-icon btn-delete-collection" data-id="${col.id}" data-name="${col.nome}" title="Excluir Coleção">
              <i data-lucide="trash-2" class="icon"></i>
            </button>
          </div>
          <p class="card-desc">${col.descricao || ''}</p>
          <div class="collection-badge-group">
            <span class="piece-tag">${t('collection_outfits_count', { count: outfitCount })}</span>
          </div>
          <div class="collection-actions-row">
            <button class="btn btn-primary btn-sm btn-view-collection" data-id="${col.id}" data-name="${col.nome}">
              <i data-lucide="eye" class="icon-sm"></i>
              <span>${t('btn_view_collection')}</span>
            </button>
            <button class="btn btn-secondary btn-sm btn-manage-collection" data-id="${col.id}" data-name="${col.nome}">
              <i data-lucide="settings-2" class="icon-sm"></i>
              <span>${t('btn_add_combinations_to_collection')}</span>
            </button>
          </div>
        `;

        const btnDelete = cardEl.querySelector('.btn-delete-collection');
        if (btnDelete) {
          btnDelete.addEventListener('click', async () => {
            if (confirm(t('confirm_delete_collection', { name: col.nome }))) {
              const { error: delErr } = await supabaseClient
                .from('colecoes')
                .delete()
                .eq('id', col.id);

              if (delErr) {
                alert(translateSupabaseError(delErr));
              } else {
                loadCollections();
              }
            }
          });
        }

        const btnView = cardEl.querySelector('.btn-view-collection');
        if (btnView) {
          btnView.addEventListener('click', () => {
            openViewCollectionModal(col.id, col.nome, col.descricao);
          });
        }

        const btnManage = cardEl.querySelector('.btn-manage-collection');
        if (btnManage) {
          btnManage.addEventListener('click', () => {
            openManageCollectionModal(col.id, col.nome);
          });
        }

        collectionsGrid.appendChild(cardEl);
      });

      refreshIcons();
    } catch (err) {
      console.error('Erro ao carregar coleções:', err);
    }
  };

  // Modal para Gerenciar Combinações da Coleção
  const openManageCollectionModal = async (collectionId, collectionName) => {
    currentManagingCollectionId = collectionId;
    if (manageCollectionTitle) manageCollectionTitle.textContent = t('modal_manage_collection_outfits_title', { name: collectionName });
    if (collectionOutfitsSelectorList) collectionOutfitsSelectorList.innerHTML = 'Carregando combinações...';

    if (modalManageCollection) modalManageCollection.style.display = 'flex';

    try {
      // Fetch user combinations
      const { data: combinacoes } = await supabaseClient
        .from('combinacoes')
        .select('*')
        .eq('user_id', currentUser.id);

      // Fetch junction rows for this collection
      const { data: junctions } = await supabaseClient
        .from('colecao_combinacoes')
        .select('combinacao_id')
        .eq('colecao_id', collectionId);

      const attachedIds = new Set((junctions || []).map(j => j.combinacao_id));

      if (!combinacoes || combinacoes.length === 0) {
        collectionOutfitsSelectorList.innerHTML = `<p style="color: var(--text-muted); padding: 12px;">${t('no_saved_combinations')}</p>`;
        return;
      }

      collectionOutfitsSelectorList.innerHTML = '';
      combinacoes.forEach(comb => {
        const itemEl = document.createElement('label');
        itemEl.className = 'collection-outfit-checkbox-item';
        const isChecked = attachedIds.has(comb.id);
        const itemCount = Array.isArray(comb.canvas_state) ? comb.canvas_state.length : 0;

        itemEl.innerHTML = `
          <input type="checkbox" value="${comb.id}" ${isChecked ? 'checked' : ''}>
          <div class="outfit-checkbox-preview"></div>
          <div class="outfit-checkbox-info">
            <span class="outfit-checkbox-name">${comb.nome}</span>
            <span class="piece-tag">${itemCount} peças</span>
          </div>
        `;

        renderCombinationToCanvas(comb.canvas_state, 120, 80, { backgroundColor: '#f8f9fa' })
          .then(thumbCanvas => {
            const previewContainer = itemEl.querySelector('.outfit-checkbox-preview');
            if (previewContainer) {
              thumbCanvas.style.width = '100%';
              thumbCanvas.style.height = '100%';
              thumbCanvas.style.objectFit = 'contain';
              previewContainer.appendChild(thumbCanvas);
            }
          })
          .catch(err => console.error('Erro no preview do checkbox da coleção:', err));

        collectionOutfitsSelectorList.appendChild(itemEl);
      });
    } catch (err) {
      console.error('Erro ao abrir gerenciamento de coleção:', err);
    }
  };

  const closeManageCollectionModal = () => {
    if (modalManageCollection) modalManageCollection.style.display = 'none';
    currentManagingCollectionId = null;
  };

  if (btnCloseManageCollectionModal) btnCloseManageCollectionModal.addEventListener('click', closeManageCollectionModal);

  if (btnSaveCollectionOutfits) {
    btnSaveCollectionOutfits.addEventListener('click', async () => {
      if (!currentManagingCollectionId) return;

      const checkboxes = collectionOutfitsSelectorList.querySelectorAll('input[type="checkbox"]');
      const selectedIds = [];
      checkboxes.forEach(cb => {
        if (cb.checked) selectedIds.push(cb.value);
      });

      btnSaveCollectionOutfits.disabled = true;

      try {
        // Clear existing junction rows
        await supabaseClient
          .from('colecao_combinacoes')
          .delete()
          .eq('colecao_id', currentManagingCollectionId);

        // Insert new junction rows
        if (selectedIds.length > 0) {
          const rowsToInsert = selectedIds.map(combId => ({
            colecao_id: currentManagingCollectionId,
            combinacao_id: combId
          }));
          await supabaseClient.from('colecao_combinacoes').insert(rowsToInsert);
        }

        btnSaveCollectionOutfits.disabled = false;
        closeManageCollectionModal();
        loadCollections();
      } catch (err) {
        console.error('Erro ao salvar combinações da coleção:', err);
        btnSaveCollectionOutfits.disabled = false;
      }
    });
  }

  // --- Wishlist Feature ---
  // Wishlist Background Removal Elements
  const btnWishlistRemoveBg = document.getElementById('btn-wishlist-remove-bg');
  const btnWishlistInvertSelection = document.getElementById('btn-wishlist-invert-selection');
  const btnWishlistUndoOriginal = document.getElementById('btn-wishlist-undo-original');
  const wishlistBgRemoveProgressContainer = document.getElementById('wishlist-bg-remove-progress-container');
  const wishlistBgRemoveProgressStatus = document.getElementById('wishlist-bg-remove-progress-status');
  const wishlistBgRemoveProgressPercent = document.getElementById('wishlist-bg-remove-progress-percent');
  const wishlistBgRemoveProgressFill = document.getElementById('wishlist-bg-remove-progress-fill');

  let wishlistOriginalImageSrc = null;
  let wishlistProcessedBlob = null;

  const updateWishlistBgProgress = (percent, statusText) => {
    if (wishlistBgRemoveProgressContainer) wishlistBgRemoveProgressContainer.style.display = 'flex';
    const rounded = Math.min(100, Math.max(0, Math.round(percent)));
    if (wishlistBgRemoveProgressPercent) wishlistBgRemoveProgressPercent.textContent = `${rounded}%`;
    if (wishlistBgRemoveProgressFill) wishlistBgRemoveProgressFill.style.width = `${rounded}%`;
    if (statusText && wishlistBgRemoveProgressStatus) {
      wishlistBgRemoveProgressStatus.textContent = statusText;
    }
  };

  const hideWishlistBgProgress = () => {
    if (wishlistBgRemoveProgressContainer) wishlistBgRemoveProgressContainer.style.display = 'none';
    if (wishlistBgRemoveProgressPercent) wishlistBgRemoveProgressPercent.textContent = '0%';
    if (wishlistBgRemoveProgressFill) wishlistBgRemoveProgressFill.style.width = '0%';
  };

  const openAddWishlistModal = () => {
    clearWishlistModalMessage();
    wishlistProcessedBlob = null;
    wishlistOriginalImageSrc = null;
    hideWishlistBgProgress();
    if (addWishlistForm) addWishlistForm.reset();
    if (wishlistImagePreview) wishlistImagePreview.src = '';
    if (wishlistImagePreviewContainer) wishlistImagePreviewContainer.style.display = 'none';
    if (modalAddWishlist) modalAddWishlist.style.display = 'flex';
  };

  const closeAddWishlistModal = () => {
    wishlistProcessedBlob = null;
    wishlistOriginalImageSrc = null;
    hideWishlistBgProgress();
    if (modalAddWishlist) modalAddWishlist.style.display = 'none';
    clearWishlistModalMessage();
    if (addWishlistForm) addWishlistForm.reset();
  };

  if (btnCloseWishlistModal) btnCloseWishlistModal.addEventListener('click', closeAddWishlistModal);
  if (btnCancelWishlist) btnCancelWishlist.addEventListener('click', closeAddWishlistModal);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="open-add-wishlist"]');
    if (btn) {
      e.preventDefault();
      openAddWishlistModal();
    }
  });

  if (wishlistImageInput) {
    wishlistImageInput.addEventListener('change', (e) => {
      wishlistProcessedBlob = null;
      wishlistOriginalImageSrc = null;
      hideWishlistBgProgress();

      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          wishlistOriginalImageSrc = event.target.result;
          if (wishlistImagePreview) wishlistImagePreview.src = wishlistOriginalImageSrc;
          if (wishlistImagePreviewContainer) wishlistImagePreviewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnWishlistRemoveBg) {
    btnWishlistRemoveBg.addEventListener('click', async () => {
      if (!wishlistImagePreview || !wishlistImagePreview.src) return;

      clearWishlistModalMessage();

      const originalBtnText = btnWishlistRemoveBg.querySelector('span')
        ? btnWishlistRemoveBg.querySelector('span').textContent
        : t('btn_remove_bg');

      btnWishlistRemoveBg.disabled = true;
      if (btnWishlistRemoveBg.querySelector('span')) {
        btnWishlistRemoveBg.querySelector('span').textContent = t('btn_removing_bg');
      }

      const imageSource = wishlistOriginalImageSrc || wishlistImagePreview.src;
      updateWishlistBgProgress(5, t('bg_removing_progress'));

      let currentSimulated = 5;
      const progressInterval = setInterval(() => {
        if (currentSimulated < 85) {
          currentSimulated += Math.floor(Math.random() * 6) + 2;
          if (currentSimulated > 85) currentSimulated = 85;
          updateWishlistBgProgress(currentSimulated, t('bg_processing_image'));
        }
      }, 300);

      try {
        let responseBlob = null;

        if (!isWasmSupported()) {
          console.warn("WebAssembly não é suportado neste navegador.");
          showWishlistModalMessage(t('bg_wasm_not_supported'), 'error');
        } else {
          try {
            const isIOS = isIOSDevice();
            const sourceForImgly = isIOS ? await scaleImageIfNeeded(imageSource, 1024) : imageSource;

            const imglyModule = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.8/+esm');
            const removeBackground = imglyModule.default || imglyModule.removeBackground;

            if (typeof removeBackground === 'function') {
              const imglyConfig = {
                model: isIOS ? 'isnet_quint8' : 'isnet_fp16',
                device: 'cpu',
                progress: (key, current, total) => {
                  if (total && total > 0) {
                    const p = Math.round((current / total) * 100);
                    const statusMsg = key.includes('fetch') ? t('bg_downloading_model') : t('bg_processing_image');
                    updateWishlistBgProgress(p, statusMsg);
                  }
                }
              };

              responseBlob = await removeBackground(sourceForImgly, imglyConfig);
            }
          } catch (imglyErr) {
            console.error("Falha ao executar @imgly/background-removal na wishlist:", imglyErr);
            showWishlistModalMessage(t('bg_removal_error_details', { details: imglyErr.message || 'Erro no Web Worker/WASM' }), 'error');
          }
        }

        clearInterval(progressInterval);

        if (responseBlob) {
          updateWishlistBgProgress(90, t('bg_processing_image'));
          const compositedBlob = await applyAlphaMaskFromBlob(imageSource, responseBlob);
          wishlistProcessedBlob = compositedBlob;
          const newUrl = URL.createObjectURL(compositedBlob);
          wishlistImagePreview.src = newUrl;
          updateWishlistBgProgress(100, t('bg_removed_success'));
          setTimeout(hideWishlistBgProgress, 1000);
          showWishlistModalMessage(t('bg_removed_success'), 'success');
        } else {
          hideWishlistBgProgress();
          wishlistImagePreview.src = imageSource;
          showWishlistModalMessage(t('bg_removal_fallback'), 'info');
        }
      } catch (err) {
        clearInterval(progressInterval);
        hideWishlistBgProgress();
        console.warn('Erro na remoção de fundo wishlist:', err);
        if (wishlistImagePreview && imageSource) {
          wishlistImagePreview.src = imageSource;
        }
        showWishlistModalMessage(t('bg_removal_fallback'), 'info');
      } finally {
        btnWishlistRemoveBg.disabled = false;
        if (btnWishlistRemoveBg.querySelector('span')) {
          btnWishlistRemoveBg.querySelector('span').textContent = originalBtnText;
        }
      }
    });
  }

  if (btnWishlistInvertSelection) {
    btnWishlistInvertSelection.addEventListener('click', () => {
      if (!wishlistImagePreview || !wishlistImagePreview.src || !wishlistOriginalImageSrc) {
        showWishlistModalMessage('Carregue uma imagem antes de inverter a seleção.', 'error');
        return;
      }

      const origImg = new Image();
      origImg.crossOrigin = 'Anonymous';
      origImg.onload = () => {
        const currentImg = new Image();
        currentImg.crossOrigin = 'Anonymous';
        currentImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = origImg.width;
          canvas.height = origImg.height;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
          const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const origCanvas = document.createElement('canvas');
          origCanvas.width = origImg.width;
          origCanvas.height = origImg.height;
          const origCtx = origCanvas.getContext('2d');
          origCtx.drawImage(origImg, 0, 0);
          const origData = origCtx.getImageData(0, 0, origCanvas.width, origCanvas.height);

          const cPixels = currentData.data;
          const oPixels = origData.data;

          for (let i = 0; i < cPixels.length; i += 4) {
            if (cPixels[i + 3] < 128) {
              cPixels[i] = oPixels[i];
              cPixels[i + 1] = oPixels[i + 1];
              cPixels[i + 2] = oPixels[i + 2];
              cPixels[i + 3] = 255;
            } else {
              cPixels[i + 3] = 0;
            }
          }

          ctx.putImageData(currentData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              wishlistProcessedBlob = blob;
              const newUrl = URL.createObjectURL(blob);
              wishlistImagePreview.src = newUrl;
              showWishlistModalMessage('Seleção invertida com sucesso!', 'success');
            }
          }, 'image/png');
        };
        currentImg.src = wishlistImagePreview.src;
      };
      origImg.src = wishlistOriginalImageSrc;
    });
  }

  if (btnWishlistUndoOriginal) {
    btnWishlistUndoOriginal.addEventListener('click', () => {
      if (wishlistOriginalImageSrc) {
        wishlistProcessedBlob = null;
        wishlistImagePreview.src = wishlistOriginalImageSrc;
        showWishlistModalMessage('Foto original restaurada com sucesso!', 'success');
      }
    });
  }

  if (addWishlistForm) {
    addWishlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearWishlistModalMessage();

      const nome = wishlistNomeInput.value.trim();
      const categoria = wishlistCategoriaInput.value.trim();
      const preco = wishlistPrecoInput.value ? parseFloat(wishlistPrecoInput.value) : null;
      const link = wishlistLinkInput.value.trim();
      const obs = wishlistObservacoesInput.value.trim();

      if (!nome) {
        showWishlistModalMessage(t('piece_name_category_required'));
        return;
      }

      btnSubmitWishlist.disabled = true;
      btnSubmitWishlist.querySelector('span').textContent = t('btn_saving_wishlist');

      let publicImageUrl = null;
      const imageFile = wishlistImageInput.files[0];
      if (wishlistProcessedBlob || imageFile) {
        try {
          const fileToUpload = wishlistProcessedBlob || imageFile;
          const fileExt = wishlistProcessedBlob ? 'png' : (imageFile ? imageFile.name.split('.').pop() : 'png');
          const fileName = `wishlist_${currentUser.id}_${Date.now()}.${fileExt}`;

          const { error: storageErr } = await supabaseClient
            .storage
            .from('roupas')
            .upload(fileName, fileToUpload);

          if (!storageErr) {
            const { data: urlData } = supabaseClient.storage.from('roupas').getPublicUrl(fileName);
            if (urlData) publicImageUrl = urlData.publicUrl;
          }
        } catch (err) {
          console.warn('Erro ao subir foto wishlist:', err);
        }
      }

      const { error } = await supabaseClient
        .from('wishlist')
        .insert({
          user_id: currentUser.id,
          nome,
          categoria: categoria || null,
          preco_estimado: preco,
          link_compra: link || null,
          observacoes: obs || null,
          imagem_url: publicImageUrl,
          status: 'Desejado'
        });

      btnSubmitWishlist.disabled = false;
      btnSubmitWishlist.querySelector('span').textContent = t('btn_save_wishlist');

      if (error) {
        showWishlistModalMessage(translateSupabaseError(error));
      } else {
        showWishlistModalMessage(t('wishlist_add_success'), 'success');
        setTimeout(() => {
          closeAddWishlistModal();
          loadWishlistItems();
        }, 1000);
      }
    });
  }

  // Carregar e Renderizar Itens da Wishlist
  const loadWishlistItems = async () => {
    if (!supabaseClient || !currentUser || !wishlistGrid) return;

    wishlistGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Carregando wishlist...</p>';

    try {
      const { data: wishlist, error } = await supabaseClient
        .from('wishlist')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar wishlist:', error);
        wishlistGrid.innerHTML = `<p style="text-align: center; color: var(--error-text); grid-column: 1 / -1;">${translateSupabaseError(error)}</p>`;
        return;
      }

      if (!wishlist || wishlist.length === 0) {
        wishlistGrid.innerHTML = `
          <div class="empty-wardrobe-card" style="grid-column: 1 / -1;">
            <i data-lucide="shopping-bag" class="empty-wardrobe-icon"></i>
            <h4 class="card-title" data-i18n="empty_wishlist_title">${t('empty_wishlist_title')}</h4>
            <p class="card-desc" data-i18n="empty_wishlist_desc">${t('empty_wishlist_desc')}</p>
            <button class="btn btn-primary" data-action="open-add-wishlist" style="margin-top: 16px;">
              <i data-lucide="plus" class="icon"></i>
              <span data-i18n="btn_add_wishlist_item">${t('btn_add_wishlist_item')}</span>
            </button>
          </div>
        `;
        refreshIcons();
        return;
      }

      wishlistGrid.innerHTML = '';

      wishlist.forEach(item => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card wishlist-card';

        const imgHtml = item.imagem_url
          ? `<img src="${item.imagem_url}" alt="${item.nome}" class="piece-image" loading="lazy">`
          : `
            <div class="piece-image-placeholder">
              <i data-lucide="shopping-bag" class="icon"></i>
              <span>${t('no_image')}</span>
            </div>
          `;

        const isAcquired = item.status === 'Adquirido';

        cardEl.innerHTML = `
          <div class="piece-image-wrapper">
            ${imgHtml}
          </div>
          <div class="piece-info">
            <div class="wishlist-card-header">
              <h5 class="piece-title">${item.nome}</h5>
              <span class="status-pill ${isAcquired ? 'acquired' : 'desired'}">${isAcquired ? t('wishlist_status_acquired') : t('wishlist_status_desired')}</span>
            </div>
            <div class="piece-details">
              ${item.categoria ? `<span class="piece-tag">${getCategoryTranslation(item.categoria)}</span>` : ''}
              ${item.preco_estimado ? `<span class="piece-tag">$ ${parseFloat(item.preco_estimado).toFixed(2)}</span>` : ''}
            </div>
            ${item.observacoes ? `<p class="wishlist-notes">${item.observacoes}</p>` : ''}
            <div class="wishlist-actions">
              ${item.link_compra ? `<a href="${item.link_compra}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i data-lucide="external-link" class="icon-sm"></i> Store</a>` : ''}
              ${item.imagem_url ? `
                <button class="btn btn-secondary btn-sm btn-compare-wishlist-item" data-id="${item.id}" title="${t('btn_compare_on_board')}">
                  <i data-lucide="sparkles" class="icon-sm"></i> ${t('btn_compare_on_board')}
                </button>
              ` : ''}
              ${!isAcquired ? `
                <button class="btn btn-secondary btn-sm btn-mark-acquired" data-id="${item.id}">
                  <i data-lucide="check" class="icon-sm"></i> ${t('btn_mark_acquired')}
                </button>
              ` : ''}
              <button class="btn btn-primary btn-sm btn-convert-wardrobe" data-id="${item.id}">
                <i data-lucide="arrow-right" class="icon-sm"></i> ${t('btn_convert_to_wardrobe')}
              </button>
              <button class="btn-icon btn-delete-wishlist" data-id="${item.id}">
                <i data-lucide="trash-2" class="icon"></i>
              </button>
            </div>
          </div>
        `;

        const btnCompare = cardEl.querySelector('.btn-compare-wishlist-item');
        if (btnCompare) {
          btnCompare.addEventListener('click', () => {
            compareWishlistItemOnBoard(item);
          });
        }

        const btnMark = cardEl.querySelector('.btn-mark-acquired');
        if (btnMark) {
          btnMark.addEventListener('click', async () => {
            await supabaseClient.from('wishlist').update({ status: 'Adquirido' }).eq('id', item.id);
            loadWishlistItems();
          });
        }

        const btnConvert = cardEl.querySelector('.btn-convert-wardrobe');
        if (btnConvert) {
          btnConvert.addEventListener('click', async () => {
            if (confirm(t('confirm_convert_wishlist', { name: item.nome }))) {
              // 1. Insert as active piece in wardrobe
              await supabaseClient.from('roupas').insert({
                user_id: currentUser.id,
                nome: item.nome,
                categoria: item.categoria || 'Outros',
                imagem_url: item.imagem_url,
                status: 'Ativo'
              });

              // 2. Update status in wishlist
              await supabaseClient.from('wishlist').update({ status: 'Adquirido' }).eq('id', item.id);

              alert(t('wishlist_converted_success'));
              loadWishlistItems();
            }
          });
        }

        const btnDel = cardEl.querySelector('.btn-delete-wishlist');
        if (btnDel) {
          btnDel.addEventListener('click', async () => {
            await supabaseClient.from('wishlist').delete().eq('id', item.id);
            loadWishlistItems();
          });
        }

        wishlistGrid.appendChild(cardEl);
      });

      refreshIcons();
    } catch (err) {
      console.error('Erro ao carregar wishlist:', err);
    }
  };

  // ============================================================================
  // --- Módulo Board View (Combinações & Canvas Editor) ---
  // ============================================================================

  const boardCanvas = document.getElementById('board-canvas');
  const boardCanvasPlaceholder = document.getElementById('board-canvas-placeholder');
  const boardItemsPalette = document.getElementById('board-items-palette');
  const boardOutfitNameInput = document.getElementById('board-outfit-name');
  const btnSaveBoard = document.getElementById('btn-save-board');
  const btnClearBoard = document.getElementById('btn-clear-board');
  const savedCombinationsList = document.getElementById('saved-combinations-list');

  let canvasItems = [];
  let selectedItemId = null;
  let nextZIndex = 1;
  let currentBoardPaletteTab = 'wardrobe';

  const paletteTabWardrobe = document.getElementById('palette-tab-wardrobe');
  const paletteTabWishlist = document.getElementById('palette-tab-wishlist');
  const btnCompareWishlistBoard = document.getElementById('btn-compare-wishlist-board');

  if (paletteTabWardrobe) {
    paletteTabWardrobe.addEventListener('click', () => {
      currentBoardPaletteTab = 'wardrobe';
      paletteTabWardrobe.classList.add('active');
      if (paletteTabWishlist) paletteTabWishlist.classList.remove('active');
      loadBoardPaletteItems('wardrobe');
    });
  }

  if (paletteTabWishlist) {
    paletteTabWishlist.addEventListener('click', () => {
      currentBoardPaletteTab = 'wishlist';
      paletteTabWishlist.classList.add('active');
      if (paletteTabWardrobe) paletteTabWardrobe.classList.remove('active');
      loadBoardPaletteItems('wishlist');
    });
  }

  if (btnCompareWishlistBoard) {
    btnCompareWishlistBoard.addEventListener('click', () => {
      currentBoardPaletteTab = 'wishlist';
      if (paletteTabWishlist) paletteTabWishlist.classList.add('active');
      if (paletteTabWardrobe) paletteTabWardrobe.classList.remove('active');
      showSection('board');
      loadBoardPaletteItems('wishlist');
    });
  }

  const initBoardView = async () => {
    await loadBoardPaletteItems(currentBoardPaletteTab);
    await loadSavedCombinations();
  };

  const loadBoardPaletteItems = async (tab = currentBoardPaletteTab) => {
    if (!supabaseClient || !currentUser || !boardItemsPalette) return;

    boardItemsPalette.innerHTML = '<p style="font-size:0.75rem; color: var(--text-muted); grid-column: span 2;">Carregando peças...</p>';

    try {
      if (tab === 'wishlist') {
        const { data: wishlist, error } = await supabaseClient
          .from('wishlist')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error || !wishlist || wishlist.length === 0) {
          boardItemsPalette.innerHTML = `<p style="font-size:0.75rem; color: var(--text-muted); grid-column: span 2;">${t('empty_wishlist_palette')}</p>`;
          return;
        }

        const imageItems = wishlist.filter(w => w.imagem_url);

        if (imageItems.length === 0) {
          boardItemsPalette.innerHTML = `<p style="font-size:0.75rem; color: var(--text-muted); grid-column: span 2;">${t('empty_wishlist_palette')}</p>`;
          return;
        }

        boardItemsPalette.innerHTML = '';
        imageItems.forEach(item => {
          const paletteItem = document.createElement('div');
          paletteItem.className = 'board-palette-item board-palette-wishlist-item';
          paletteItem.title = `${item.nome} (${t('badge_wishlist')})`;
          paletteItem.innerHTML = `
            <span class="board-palette-badge">${t('badge_wishlist')}</span>
            <img src="${item.imagem_url}" alt="${item.nome}" class="board-palette-img">
            <span class="board-palette-name">${item.nome}</span>
          `;

          paletteItem.addEventListener('click', () => {
            addItemToCanvas(item);
          });

          boardItemsPalette.appendChild(paletteItem);
        });
      } else {
        const { data: roupas, error } = await supabaseClient
          .from('roupas')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error || !roupas || roupas.length === 0) {
          boardItemsPalette.innerHTML = `<p style="font-size:0.75rem; color: var(--text-muted); grid-column: span 2;">${t('empty_wardrobe_title')}</p>`;
          return;
        }

        boardItemsPalette.innerHTML = '';
        roupas.forEach(piece => {
          if (!piece.imagem_url) return;

          const paletteItem = document.createElement('div');
          paletteItem.className = 'board-palette-item';
          paletteItem.title = piece.nome;
          paletteItem.innerHTML = `
            <img src="${piece.imagem_url}" alt="${piece.nome}" class="board-palette-img">
            <span class="board-palette-name">${piece.nome}</span>
          `;

          paletteItem.addEventListener('click', () => {
            addItemToCanvas(piece);
          });

          boardItemsPalette.appendChild(paletteItem);
        });
      }
    } catch (err) {
      console.error('Erro ao carregar palette do board:', err);
    }
  };

  const compareWishlistItemOnBoard = (item) => {
    if (!item || !item.imagem_url) {
      alert(t('no_image'));
      return;
    }

    showSection('board');
    currentBoardPaletteTab = 'wishlist';
    if (paletteTabWishlist) paletteTabWishlist.classList.add('active');
    if (paletteTabWardrobe) paletteTabWardrobe.classList.remove('active');
    loadBoardPaletteItems('wishlist');

    addItemToCanvas(item);
  };

  const updatePlaceholderVisibility = () => {
    if (!boardCanvasPlaceholder) return;
    if (canvasItems.length === 0) {
      boardCanvasPlaceholder.style.display = 'flex';
    } else {
      boardCanvasPlaceholder.style.display = 'none';
    }
  };

  const renderCanvas = () => {
    if (!boardCanvas) return;

    const existingElements = boardCanvas.querySelectorAll('.canvas-item');
    existingElements.forEach(el => el.remove());

    updatePlaceholderVisibility();

    canvasItems.forEach(item => {
      item.rotation = item.rotation || 0;

      const itemEl = document.createElement('div');
      itemEl.className = `canvas-item ${item.id === selectedItemId ? 'selected' : ''}`;
      itemEl.style.left = `${item.x}px`;
      itemEl.style.top = `${item.y}px`;
      itemEl.style.width = `${item.width}px`;
      itemEl.style.height = `${item.height}px`;
      itemEl.style.zIndex = item.zIndex;
      itemEl.style.transform = `rotate(${item.rotation}deg)`;
      itemEl.setAttribute('data-id', item.id);

      itemEl.innerHTML = `
        <img src="${item.image_url}" alt="${item.nome}" class="canvas-item-img">
        <div class="canvas-item-controls">
          <button class="canvas-ctrl-btn btn-rotate-left" title="Girar Esquerda">↺</button>
          <button class="canvas-ctrl-btn btn-layer-up" title="Avançar Camada">▲</button>
          <button class="canvas-ctrl-btn btn-layer-down" title="Recuar Camada">▼</button>
          <button class="canvas-ctrl-btn btn-rotate-right" title="Girar Direita">↻</button>
          <button class="canvas-ctrl-btn btn-delete-item" title="Remover Peça">✕</button>
        </div>
        <div class="canvas-rotate-handle" title="Girar Peça (Livre)">
          <i data-lucide="rotate-cw" class="icon-sm" style="width:12px;height:12px;"></i>
        </div>
        <div class="canvas-resize-handle"></div>
      `;

      makeCanvasItemInteractive(itemEl, item);

      boardCanvas.appendChild(itemEl);
    });

    refreshIcons();
  };

  const makeCanvasItemInteractive = (itemEl, item) => {
    itemEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (selectedItemId !== item.id) {
        selectedItemId = item.id;
        renderCanvas();
      }
    });

    itemEl.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      if (selectedItemId !== item.id) {
        selectedItemId = item.id;
        renderCanvas();
      }
    }, { passive: true });

    const btnRotateLeft = itemEl.querySelector('.btn-rotate-left');
    const btnRotateRight = itemEl.querySelector('.btn-rotate-right');
    const btnLayerUp = itemEl.querySelector('.btn-layer-up');
    const btnLayerDown = itemEl.querySelector('.btn-layer-down');
    const btnDeleteItem = itemEl.querySelector('.btn-delete-item');
    const resizeHandle = itemEl.querySelector('.canvas-resize-handle');
    const rotateHandle = itemEl.querySelector('.canvas-rotate-handle');

    if (btnRotateLeft) {
      btnRotateLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        item.rotation = (item.rotation - 15 + 360) % 360;
        itemEl.style.transform = `rotate(${item.rotation}deg)`;
        if (rotateHandle) rotateHandle.title = `Girar Peça (${item.rotation}°)`;
      });
    }

    if (btnRotateRight) {
      btnRotateRight.addEventListener('click', (e) => {
        e.stopPropagation();
        item.rotation = (item.rotation + 15) % 360;
        itemEl.style.transform = `rotate(${item.rotation}deg)`;
        if (rotateHandle) rotateHandle.title = `Girar Peça (${item.rotation}°)`;
      });
    }

    if (btnLayerUp) {
      btnLayerUp.addEventListener('click', (e) => {
        e.stopPropagation();
        item.zIndex += 1;
        if (item.zIndex > nextZIndex) nextZIndex = item.zIndex;
        renderCanvas();
      });
    }

    if (btnLayerDown) {
      btnLayerDown.addEventListener('click', (e) => {
        e.stopPropagation();
        item.zIndex = Math.max(1, item.zIndex - 1);
        renderCanvas();
      });
    }

    if (btnDeleteItem) {
      btnDeleteItem.addEventListener('click', (e) => {
        e.stopPropagation();
        canvasItems = canvasItems.filter(i => i.id !== item.id);
        if (selectedItemId === item.id) selectedItemId = null;
        renderCanvas();
      });
    }

    let isRotating = false;

    if (rotateHandle) {
      const startRotate = (e) => {
        e.stopPropagation();
        isRotating = true;

        document.addEventListener('mousemove', moveRotate);
        document.addEventListener('mouseup', stopRotate);
        document.addEventListener('touchmove', moveRotate, { passive: false });
        document.addEventListener('touchend', stopRotate);
      };

      const moveRotate = (e) => {
        if (!isRotating) return;
        if (e.touches) e.preventDefault();

        const canvasRect = boardCanvas ? boardCanvas.getBoundingClientRect() : itemEl.parentElement.getBoundingClientRect();
        const centerX = canvasRect.left + item.x + item.width / 2;
        const centerY = canvasRect.top + item.y + item.height / 2;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const radians = Math.atan2(clientY - centerY, clientX - centerX);
        let degrees = Math.round(radians * (180 / Math.PI));

        degrees = (degrees + 45 + 360) % 360;
        item.rotation = degrees;
        itemEl.style.transform = `rotate(${item.rotation}deg)`;
        if (rotateHandle) rotateHandle.title = `Girar Peça (${item.rotation}°)`;
      };

      const stopRotate = () => {
        isRotating = false;
        document.removeEventListener('mousemove', moveRotate);
        document.removeEventListener('mouseup', stopRotate);
        document.removeEventListener('touchmove', moveRotate);
        document.removeEventListener('touchend', stopRotate);
      };

      rotateHandle.addEventListener('mousedown', startRotate);
      rotateHandle.addEventListener('touchstart', startRotate, { passive: true });
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const startDrag = (e) => {
      if (e.target === resizeHandle || e.target === rotateHandle || e.target.closest('.canvas-rotate-handle') || e.target.closest('.canvas-item-controls')) return;
      isDragging = true;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;
      initialX = item.x;
      initialY = item.y;

      document.addEventListener('mousemove', moveDrag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', moveDrag, { passive: false });
      document.addEventListener('touchend', stopDrag);
    };

    const moveDrag = (e) => {
      if (!isDragging) return;
      if (e.touches) e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      item.x = Math.max(0, initialX + deltaX);
      item.y = Math.max(0, initialY + deltaY);

      itemEl.style.left = `${item.x}px`;
      itemEl.style.top = `${item.y}px`;
    };

    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener('mousemove', moveDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', moveDrag);
      document.removeEventListener('touchend', stopDrag);
    };

    itemEl.addEventListener('mousedown', startDrag);
    itemEl.addEventListener('touchstart', startDrag, { passive: true });

    let isResizing = false;
    let startW = 0;
    let startH = 0;

    if (resizeHandle) {
      const startResize = (e) => {
        e.stopPropagation();
        isResizing = true;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        startW = item.width;
        startH = item.height;

        document.addEventListener('mousemove', moveResize);
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchmove', moveResize, { passive: false });
        document.addEventListener('touchend', stopResize);
      };

      const moveResize = (e) => {
        if (!isResizing) return;
        if (e.touches) e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        item.width = Math.max(40, startW + deltaX);
        item.height = Math.max(40, startH + deltaY);

        itemEl.style.width = `${item.width}px`;
        itemEl.style.height = `${item.height}px`;
      };

      const stopResize = () => {
        isResizing = false;
        document.removeEventListener('mousemove', moveResize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', moveResize);
        document.removeEventListener('touchend', stopResize);
      };

      resizeHandle.addEventListener('mousedown', startResize);
      resizeHandle.addEventListener('touchstart', startResize, { passive: true });
    }
  };

  const addItemToCanvas = (piece) => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
      piece_id: piece.id,
      image_url: piece.imagem_url,
      nome: piece.nome,
      x: 50 + (canvasItems.length * 20) % 180,
      y: 50 + (canvasItems.length * 20) % 180,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: ++nextZIndex
    };

    canvasItems.push(newItem);
    selectedItemId = newItem.id;
    renderCanvas();
  };

  if (boardCanvas) {
    boardCanvas.addEventListener('click', (e) => {
      if (e.target === boardCanvas || e.target === boardCanvasPlaceholder) {
        selectedItemId = null;
        renderCanvas();
      }
    });
  }

  if (btnClearBoard) {
    btnClearBoard.addEventListener('click', () => {
      canvasItems = [];
      selectedItemId = null;
      if (boardOutfitNameInput) boardOutfitNameInput.value = '';
      renderCanvas();
    });
  }

  const renderCombinationToCanvas = async (items, targetWidth = 800, targetHeight = 600, options = {}) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    const bgColor = options.backgroundColor !== undefined ? options.backgroundColor : '#ffffff';
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    if (!Array.isArray(items) || items.length === 0) {
      return canvas;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    items.forEach(item => {
      const w = item.width || 150;
      const h = item.height || 150;
      const x = item.x || 0;
      const y = item.y || 0;
      const rotRad = ((item.rotation || 0) * Math.PI) / 180;

      const cx = x + w / 2;
      const cy = y + h / 2;

      const localCorners = [
        { dx: -w / 2, dy: -h / 2 },
        { dx: w / 2, dy: -h / 2 },
        { dx: w / 2, dy: h / 2 },
        { dx: -w / 2, dy: h / 2 }
      ];

      localCorners.forEach(corner => {
        const rotatedX = cx + (corner.dx * Math.cos(rotRad) - corner.dy * Math.sin(rotRad));
        const rotatedY = cy + (corner.dx * Math.sin(rotRad) + corner.dy * Math.cos(rotRad));

        if (rotatedX < minX) minX = rotatedX;
        if (rotatedX > maxX) maxX = rotatedX;
        if (rotatedY < minY) minY = rotatedY;
        if (rotatedY > maxY) maxY = rotatedY;
      });
    });

    if (minX === Infinity || maxX === -Infinity) {
      return canvas;
    }

    const contentW = Math.max(1, maxX - minX);
    const contentH = Math.max(1, maxY - minY);
    const contentCX = (minX + maxX) / 2;
    const contentCY = (minY + maxY) / 2;

    const padding = options.padding !== undefined ? options.padding : Math.min(targetWidth, targetHeight) * 0.08;
    const availW = Math.max(1, targetWidth - padding * 2);
    const availH = Math.max(1, targetHeight - padding * 2);

    const scale = Math.min(availW / contentW, availH / contentH);

    const targetCX = targetWidth / 2;
    const targetCY = targetHeight / 2;

    const sortedItems = [...items].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

    const loadedImages = await Promise.all(
      sortedItems.map(item => new Promise(resolve => {
        if (!item.image_url) return resolve({ item, img: null });
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve({ item, img });
        img.onerror = () => resolve({ item, img: null });
        img.src = item.image_url;
      }))
    );

    loadedImages.forEach(({ item, img }) => {
      if (!img) return;

      const w = item.width || 150;
      const h = item.height || 150;
      const x = item.x || 0;
      const y = item.y || 0;

      const cx = x + w / 2;
      const cy = y + h / 2;

      const relCX = cx - contentCX;
      const relCY = cy - contentCY;

      const destCX = targetCX + relCX * scale;
      const destCY = targetCY + relCY * scale;

      const destW = w * scale;
      const destH = h * scale;

      ctx.save();
      ctx.translate(destCX, destCY);
      if (item.rotation) {
        ctx.rotate((item.rotation * Math.PI) / 180);
      }
      ctx.drawImage(img, -destW / 2, -destH / 2, destW, destH);
      ctx.restore();
    });

    return canvas;
  };

  const exportCombinationPNG = async (items, name = 'combinacao') => {
    if (!items || items.length === 0) {
      alert(t('combination_empty_error'));
      return;
    }

    try {
      const canvas = await renderCombinationToCanvas(items, 1000, 800, {
        padding: 60,
        backgroundColor: '#ffffff'
      });

      const dataUrl = canvas.toDataURL('image/png');
      const sanitizedName = (name || 'combinacao')
        .toLowerCase()
        .replace(/[^a-z0-9_\-\s]/gi, '')
        .trim()
        .replace(/\s+/g, '_');

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${sanitizedName || 'combinacao'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Erro ao exportar PNG da combinação:', err);
      alert('Erro ao exportar imagem PNG.');
    }
  };

  const btnExportBoard = document.getElementById('btn-export-board');
  if (btnExportBoard) {
    btnExportBoard.addEventListener('click', () => {
      const outfitName = boardOutfitNameInput ? boardOutfitNameInput.value.trim() : 'combinacao';
      exportCombinationPNG(canvasItems, outfitName);
    });
  }

  if (btnSaveBoard) {
    btnSaveBoard.addEventListener('click', async () => {
      const outfitName = boardOutfitNameInput ? boardOutfitNameInput.value.trim() : '';

      if (!outfitName) {
        alert(t('combination_name_required'));
        return;
      }

      if (canvasItems.length === 0) {
        alert(t('combination_empty_error'));
        return;
      }

      if (!supabaseClient || !currentUser) {
        alert(t('supabase_connection_error'));
        return;
      }

      btnSaveBoard.disabled = true;

      try {
        const { data, error } = await supabaseClient
          .from('combinacoes')
          .insert({
            user_id: currentUser.id,
            nome: outfitName,
            canvas_state: canvasItems,
            is_favorite: false
          })
          .select()
          .single();

        btnSaveBoard.disabled = false;

        if (error) {
          console.error('Erro ao salvar combinação:', error);
          alert(translateSupabaseError(error));
        } else {
          alert(t('combination_save_success'));
          if (boardOutfitNameInput) boardOutfitNameInput.value = '';
          canvasItems = [];
          selectedItemId = null;
          renderCanvas();
          await loadSavedCombinations();
        }
      } catch (err) {
        console.error('Exceção ao salvar combinação:', err);
        btnSaveBoard.disabled = false;
      }
    });
  }

  const loadSavedCombinations = async () => {
    if (!supabaseClient || !currentUser || !savedCombinationsList) return;

    savedCombinationsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Carregando combinações...</p>';

    try {
      const { data: combinacoes, error } = await supabaseClient
        .from('combinacoes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar combinações:', error);
        savedCombinationsList.innerHTML = `<p style="text-align: center; color: var(--error-text); grid-column: 1 / -1;">${translateSupabaseError(error)}</p>`;
        return;
      }

      if (!combinacoes || combinacoes.length === 0) {
        savedCombinationsList.innerHTML = `<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;" data-i18n="no_saved_combinations">${t('no_saved_combinations')}</p>`;
        return;
      }

      savedCombinationsList.innerHTML = '';

      combinacoes.forEach(comb => {
        const cardEl = document.createElement('div');
        cardEl.className = 'combination-card';

        const isFav = !!comb.is_favorite;

        cardEl.innerHTML = `
          <div class="combination-card-header">
            <h5 class="combination-title">${comb.nome}</h5>
            <button class="btn-star-favorite ${isFav ? 'is-favorite' : ''}" data-id="${comb.id}" data-fav="${isFav}" title="${isFav ? 'Remover dos Favoritos' : 'Favoritar'}">
              <i data-lucide="star" class="icon star-icon"></i>
            </button>
          </div>
          <div class="combination-preview-box">
            <div class="preview-loading" style="display:flex; align-items:center; justify-center; height:100%; color:var(--text-muted); font-size:0.75rem;">Carregando prévia...</div>
          </div>
          <div class="combination-card-actions">
            <button class="btn btn-secondary btn-sm btn-load-combination" data-id="${comb.id}">
              <i data-lucide="external-link" class="icon"></i>
              <span>Carregar</span>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-sm btn-export-combination" data-id="${comb.id}" title="Exportar PNG">
              <i data-lucide="download" class="icon"></i>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-sm btn-delete-combination" data-id="${comb.id}" title="Excluir">
              <i data-lucide="trash-2" class="icon"></i>
            </button>
          </div>
        `;

        renderCombinationToCanvas(comb.canvas_state, 300, 160, { backgroundColor: '#f8f9fa' })
          .then(thumbCanvas => {
            const previewBox = cardEl.querySelector('.combination-preview-box');
            if (previewBox) {
              previewBox.innerHTML = '';
              thumbCanvas.style.width = '100%';
              thumbCanvas.style.height = '100%';
              thumbCanvas.style.objectFit = 'contain';
              previewBox.appendChild(thumbCanvas);
            }
          })
          .catch(err => console.error('Erro ao gerar preview da combinação:', err));

        const starBtn = cardEl.querySelector('.btn-star-favorite');
        if (starBtn) {
          starBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const currentFav = starBtn.getAttribute('data-fav') === 'true';
            const newFav = !currentFav;

            starBtn.setAttribute('data-fav', newFav.toString());
            if (newFav) {
              starBtn.classList.add('is-favorite');
            } else {
              starBtn.classList.remove('is-favorite');
            }

            const { error: updateErr } = await supabaseClient
              .from('combinacoes')
              .update({ is_favorite: newFav })
              .eq('id', comb.id);

            if (updateErr) {
              console.error('Erro ao atualizar favorito:', updateErr);
              starBtn.setAttribute('data-fav', currentFav.toString());
              if (currentFav) {
                starBtn.classList.add('is-favorite');
              } else {
                starBtn.classList.remove('is-favorite');
              }
            }
          });
        }

        const btnExportComb = cardEl.querySelector('.btn-export-combination');
        if (btnExportComb) {
          btnExportComb.addEventListener('click', () => {
            exportCombinationPNG(comb.canvas_state, comb.nome);
          });
        }

        const btnLoadComb = cardEl.querySelector('.btn-load-combination');
        if (btnLoadComb) {
          btnLoadComb.addEventListener('click', () => {
            if (Array.isArray(comb.canvas_state)) {
              canvasItems = JSON.parse(JSON.stringify(comb.canvas_state));
              selectedItemId = null;
              if (boardOutfitNameInput) boardOutfitNameInput.value = comb.nome;
              renderCanvas();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
        }

        const btnDeleteComb = cardEl.querySelector('.btn-delete-combination');
        if (btnDeleteComb) {
          btnDeleteComb.addEventListener('click', async () => {
            if (confirm(`Deseja excluir a combinação "${comb.nome}"?`)) {
              const { error: delErr } = await supabaseClient
                .from('combinacoes')
                .delete()
                .eq('id', comb.id);

              if (delErr) {
                alert(translateSupabaseError(delErr));
              } else {
                await loadSavedCombinations();
              }
            }
          });
        }

        savedCombinationsList.appendChild(cardEl);
      });

      refreshIcons();
    } catch (err) {
      console.error('Erro ao renderizar combinações salvas:', err);
    }
  };
});
