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

  // --- Lógica e Operações do Guarda-Roupa e Processamento Visual de Imagens ---

  // Elementos do Processamento de Imagem
  const btnRemoveBg = document.getElementById('btn-remove-bg');
  const btnInvertSelection = document.getElementById('btn-invert-selection');
  const btnCropImage = document.getElementById('btn-crop-image');
  const btnEraserDirect = document.getElementById('btn-eraser-direct');
  const btnUndoOriginal = document.getElementById('btn-undo-original');
  const imageProcessingActions = document.getElementById('image-processing-actions');

  // Elementos do Editor de Recorte Livre (Lápis/Laço e Borracha)
  const cropCanvasEditor = document.getElementById('crop-canvas-editor');
  const cropCanvasControls = document.getElementById('crop-canvas-controls');
  const btnToolLasso = document.getElementById('btn-tool-lasso');
  const btnToolEraser = document.getElementById('btn-tool-eraser');
  const brushSizeSlider = document.getElementById('brush-size-slider');
  const brushSizeVal = document.getElementById('brush-size-val');
  const btnClearTrace = document.getElementById('btn-clear-trace');
  const btnConfirmCrop = document.getElementById('btn-confirm-crop');
  const btnCancelCrop = document.getElementById('btn-cancel-crop');

  let originalImageSrc = null; // Guarda a foto original sem processamento
  let processedBlob = null; // Guarda o blob processado (.png com transparência)

  // Estado do Editor de Canvas
  let currentTool = 'lasso'; // 'lasso' | 'eraser'
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

  // Preview de Imagem selecionada no Modal
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

  // Helper para aplicar máscara Alpha preservando 100% os canais RGB originais da imagem
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

          // Aplica APENAS o canal Alpha da máscara, mantendo R, G e B 100% intactos
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

  // Remoção de Fundo via IA / Segmentação de Imagem (@imgly/background-removal)
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

      try {
        const bgRemovalModule = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.8/+esm');
        const removeBackground = bgRemovalModule.removeBackground;

        // Executa a remoção de fundo com modelo de IA (ONNX / WebAssembly)
        const imageSource = originalImageSrc || pieceImagePreview.src;
        const rawAiBlob = await removeBackground(imageSource, {
          output: {
            format: 'image/png',
            quality: 1.0
          }
        });

        if (rawAiBlob) {
          // Aplica a máscara Alpha sobre a imagem original para preservar RGB, saturação e cores 100% intocadas
          const compositedBlob = await applyAlphaMaskFromBlob(imageSource, rawAiBlob);
          processedBlob = compositedBlob;
          const newUrl = URL.createObjectURL(compositedBlob);
          pieceImagePreview.src = newUrl;
          showPieceModalMessage(t('bg_removed_success'), 'success');
        }
      } catch (err) {
        console.error('Erro na remoção de fundo por IA:', err);
        showPieceModalMessage(t('bg_removal_error'), 'error');
      } finally {
        btnRemoveBg.disabled = false;
        if (btnRemoveBg.querySelector('span')) {
          btnRemoveBg.querySelector('span').textContent = originalBtnText;
        }
      }
    });
  }

  // Inverter Seleção (Togglamento da Máscara de Transparência)
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

  // Desfazer / Restaurar Foto Original
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

  // --- Lógica da Ferramenta de Recorte Livre (Lápis / Laço e Borracha) ---

  // Atualizar exibição de espessura
  if (brushSizeSlider && brushSizeVal) {
    brushSizeSlider.addEventListener('input', (e) => {
      brushSizeVal.textContent = `${e.target.value}px`;
    });
  }

  // Alternar Modos de Ferramenta
  if (btnToolLasso) {
    btnToolLasso.addEventListener('click', () => {
      currentTool = 'lasso';
      btnToolLasso.classList.add('active-tool');
      if (btnToolEraser) btnToolEraser.classList.remove('active-tool');
    });
  }

  if (btnToolEraser) {
    btnToolEraser.addEventListener('click', () => {
      currentTool = 'eraser';
      if (btnToolEraser) btnToolEraser.classList.add('active-tool');
      if (btnToolLasso) btnToolLasso.classList.remove('active-tool');
    });
  }

  // Redesenhar a imagem base e elementos visuais no canvas
  const redrawCanvasEditor = (cursorCoords = null) => {
    if (!cropCanvasEditor || !offscreenCanvas) return;
    const ctx = cropCanvasEditor.getContext('2d');
    ctx.clearRect(0, 0, cropCanvasEditor.width, cropCanvasEditor.height);
    ctx.drawImage(offscreenCanvas, 0, 0);

    // Desenha vetor do laço se estiver usando a ferramenta Lasso
    if (currentTool === 'lasso' && pathPoints.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }

      const lineThick = parseInt(brushSizeSlider ? brushSizeSlider.value : '4', 10);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = lineThick + 2;
      ctx.stroke();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = lineThick;
      ctx.setLineDash([6, 4]);
      ctx.stroke();

      if (pathPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y);
        ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Desenha cursor indicador da Borracha
    if (currentTool === 'eraser' && cursorCoords) {
      const thick = parseInt(brushSizeSlider ? brushSizeSlider.value : '20', 10);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cursorCoords.x, cursorCoords.y, thick / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cursorCoords.x, cursorCoords.y, thick / 2 + 1, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  };

  // Obter coordenadas de clique/toque mapeadas para as dimensões internas do canvas
  const getCanvasCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const applyEraserStroke = (p1, p2) => {
    if (!offscreenCanvas) return;
    const offCtx = offscreenCanvas.getContext('2d');
    const thick = parseInt(brushSizeSlider ? brushSizeSlider.value : '20', 10);

    offCtx.save();
    offCtx.globalCompositeOperation = 'destination-out';
    offCtx.lineWidth = thick;
    offCtx.lineCap = 'round';
    offCtx.lineJoin = 'round';

    offCtx.beginPath();
    if (p1) {
      offCtx.moveTo(p1.x, p1.y);
      offCtx.lineTo(p2.x, p2.y);
    } else {
      offCtx.arc(p2.x, p2.y, thick / 2, 0, Math.PI * 2);
    }
    offCtx.stroke();
    offCtx.restore();
  };

  if (cropCanvasEditor) {
    const startDraw = (e) => {
      isDrawing = true;
      const coords = getCanvasCoords(e, cropCanvasEditor);
      lastCoord = coords;

      if (currentTool === 'lasso') {
        pathPoints = [coords];
        redrawCanvasEditor(coords);
      } else if (currentTool === 'eraser') {
        applyEraserStroke(null, coords);
        redrawCanvasEditor(coords);
      }
    };

    const moveDraw = (e) => {
      const coords = getCanvasCoords(e, cropCanvasEditor);
      if (e.touches && isDrawing) e.preventDefault();

      if (isDrawing) {
        if (currentTool === 'lasso') {
          pathPoints.push(coords);
          redrawCanvasEditor(coords);
        } else if (currentTool === 'eraser') {
          applyEraserStroke(lastCoord, coords);
          lastCoord = coords;
          redrawCanvasEditor(coords);
        }
      } else {
        if (currentTool === 'eraser') {
          redrawCanvasEditor(coords);
        }
      }
    };

    const stopDraw = () => {
      isDrawing = false;
      lastCoord = null;
      redrawCanvasEditor();
    };

    cropCanvasEditor.addEventListener('mousedown', startDraw);
    cropCanvasEditor.addEventListener('mousemove', moveDraw);
    cropCanvasEditor.addEventListener('mouseup', stopDraw);
    cropCanvasEditor.addEventListener('mouseleave', stopDraw);

    cropCanvasEditor.addEventListener('touchstart', startDraw, { passive: false });
    cropCanvasEditor.addEventListener('touchmove', moveDraw, { passive: false });
    cropCanvasEditor.addEventListener('touchend', stopDraw);
  }

  // Inicializar o Editor de Canvas em modo Laço ou Borracha
  const openCanvasEditorWithTool = (toolName) => {
    if (!pieceImagePreview || !pieceImagePreview.src) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      baseEditorImage = img;
      pathPoints = [];
      isDrawing = false;
      lastCoord = null;
      currentTool = toolName;

      cropCanvasEditor.width = img.naturalWidth || img.width;
      cropCanvasEditor.height = img.naturalHeight || img.height;

      offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = cropCanvasEditor.width;
      offscreenCanvas.height = cropCanvasEditor.height;
      const offCtx = offscreenCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0);

      if (toolName === 'lasso') {
        if (btnToolLasso) btnToolLasso.classList.add('active-tool');
        if (btnToolEraser) btnToolEraser.classList.remove('active-tool');
      } else {
        if (btnToolEraser) btnToolEraser.classList.add('active-tool');
        if (btnToolLasso) btnToolLasso.classList.remove('active-tool');
      }

      redrawCanvasEditor();

      if (pieceImagePreview) pieceImagePreview.style.display = 'none';
      if (imageProcessingActions) imageProcessingActions.style.display = 'none';
      if (cropCanvasEditor) cropCanvasEditor.style.display = 'block';
      if (cropCanvasControls) cropCanvasControls.style.display = 'flex';
      refreshIcons();
    };
    img.src = pieceImagePreview.src;
  };

  if (btnCropImage) {
    btnCropImage.addEventListener('click', () => {
      openCanvasEditorWithTool('lasso');
    });
  }

  if (btnEraserDirect) {
    btnEraserDirect.addEventListener('click', () => {
      openCanvasEditorWithTool('eraser');
    });
  }

  // Limpar Traço
  if (btnClearTrace) {
    btnClearTrace.addEventListener('click', () => {
      pathPoints = [];
      if (baseEditorImage && offscreenCanvas) {
        const offCtx = offscreenCanvas.getContext('2d');
        offCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offCtx.drawImage(baseEditorImage, 0, 0);
        redrawCanvasEditor();
      }
    });
  }

  // Confirmar Edição/Borracha/Recorte Livre preservando 100% RGB da imagem original
  if (btnConfirmCrop) {
    btnConfirmCrop.addEventListener('click', async () => {
      if (!cropCanvasEditor || !baseEditorImage || !offscreenCanvas) return;

      if (pathPoints.length > 2 && currentTool === 'lasso') {
        const width = baseEditorImage.naturalWidth || baseEditorImage.width;
        const height = baseEditorImage.naturalHeight || baseEditorImage.height;

        const lassoMaskCanvas = document.createElement('canvas');
        lassoMaskCanvas.width = width;
        lassoMaskCanvas.height = height;
        const lCtx = lassoMaskCanvas.getContext('2d');

        lCtx.beginPath();
        lCtx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
          lCtx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        lCtx.closePath();
        lCtx.fillStyle = '#ffffff';
        lCtx.fill();

        lassoMaskCanvas.toBlob(async (maskBlob) => {
          if (maskBlob) {
            try {
              const imageSource = originalImageSrc || pieceImagePreview.src;
              const compositedBlob = await applyAlphaMaskFromBlob(imageSource, maskBlob);
              processedBlob = compositedBlob;
              const croppedUrl = URL.createObjectURL(compositedBlob);
              closeCanvasEditor();
              pieceImagePreview.src = croppedUrl;
              showPieceModalMessage('Recorte livre aplicado com sucesso!', 'success');
            } catch (err) {
              console.error('Erro ao aplicar corte:', err);
            }
          }
        }, 'image/png');
      } else {
        // Se a edição foi feita via Borracha ou sem laço definido
        offscreenCanvas.toBlob(async (maskBlob) => {
          if (maskBlob) {
            try {
              const imageSource = originalImageSrc || pieceImagePreview.src;
              const compositedBlob = await applyAlphaMaskFromBlob(imageSource, maskBlob);
              processedBlob = compositedBlob;
              const croppedUrl = URL.createObjectURL(compositedBlob);
              closeCanvasEditor();
              pieceImagePreview.src = croppedUrl;
              showPieceModalMessage('Edição/Borracha aplicada com sucesso!', 'success');
            } catch (err) {
              console.error('Erro ao confirmar edição:', err);
            }
          }
        }, 'image/png');
      }
    });
  }

  // Cancelar Recorte
  if (btnCancelCrop) {
    btnCancelCrop.addEventListener('click', () => {
      closeCanvasEditor();
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalAddPiece && modalAddPiece.style.display === 'flex') {
      closeAddPieceModal();
    }
  });

  // Event Delegation global para gatilhos de cadastro de peça
  document.addEventListener('click', (e) => {
    const triggerBtn = e.target.closest('[data-action="open-add-piece"]');
    if (triggerBtn) {
      e.preventDefault();
      openAddPieceModal();
    }
  });

  // Atualizar Datalist Autocomplete de Categorias
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
            <button class="btn btn-primary" data-action="open-add-piece" style="margin-top: 16px;">
              <i data-lucide="plus" class="icon"></i>
              <span data-i18n="btn_add_piece">${t('btn_add_piece')}</span>
            </button>
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

      if (!supabaseClient || !currentUser || !currentUser.id) {
        showPieceModalMessage(t('supabase_connection_error'));
        return;
      }

      const userId = currentUser.id;

      btnSubmitPiece.disabled = true;
      btnSubmitPiece.querySelector('span').textContent = t('btn_saving_piece');

      let publicImageUrl = null;

      // Upload de Imagem para o bucket 'roupas' no Supabase Storage com user_id explícito na estrutura de diretório
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

      // Gravação dos Dados da Peça na tabela public.roupas com user_id do utilizador associado
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

  if (btnCreateCollection) {
    btnCreateCollection.addEventListener('click', () => {
      console.log('Ação rápida: Criar Coleção iniciada.');
    });
  }
});
