// Módulo de Internacionalização (i18n)

export const translations = {
  pt: {
    // Autenticação
    app_title: "Armário Virtual",
    login_subtitle: "Acesse sua conta corporativa",
    signup_subtitle: "Crie sua conta no Armário Virtual",
    email_label: "E-mail",
    password_label: "Senha",
    new_password_label: "Nova Senha",
    confirm_password_label: "Confirmar Nova Senha",
    username_label: "Nome de Usuário",
    email_placeholder: "seu.email@exemplo.com",
    password_placeholder: "••••••••",
    signup_password_placeholder: "Mínimo 6 caracteres",
    username_placeholder: "Ex: MariaSilva",
    btn_login: "Entrar",
    btn_logging_in: "Entrando...",
    btn_signup: "Criar Conta",
    btn_signing_up: "Cadastrando...",
    no_account: "Não possui uma conta?",
    link_signup: "Cadastre-se",
    have_account: "Já possui uma conta?",
    link_login: "Faça Login",
    signup_success_redirect: "Cadastro realizado com sucesso! Faça login para acessar.",

    // Top Header e Nav
    welcome_greeting: "Bem-vindo, {username}",
    btn_logout_title: "Sair da Conta",
    nav_dashboard: "Painel",
    nav_wardrobe: "Guarda-Roupa",
    nav_collections: "Coleções",
    nav_wishlist: "Wishlist",
    nav_admin: "Painel Admin",
    nav_settings: "Configurações",

    // Títulos das Páginas
    page_dashboard: "Painel Geral",
    page_wardrobe: "Guarda-Roupa",
    page_collections: "Coleções",
    page_wishlist: "Wishlist",
    page_board: "Montar Combinação",
    page_admin: "Painel do Administrador",
    page_settings: "Configurações do Usuário",

    // Dashboard View
    welcome_banner_title: "Bem-vindo ao seu Armário Virtual",
    welcome_banner_desc: "Gerencie suas peças, monte looks interativos e planeje suas próximas aquisições.",
    card_items_title: "Gestão de Peças",
    card_items_desc: "Adicione novas peças do seu guarda-roupa via foto ou upload de arquivo.",
    btn_add_item: "Adicionar Peça",
    card_collections_title: "Coleções Temáticas",
    card_collections_desc: "Organize seus outfits por eventos, estações do ano ou ocasiões de trabalho.",
    btn_create_collection: "Criar Coleção",
    card_outfits_title: "Criar Combinação",
    card_outfits_desc: "Combine suas peças no Board Visual para montar e salvar novos outfits.",
    btn_create_outfit: "Montar Look",

    // Board View
    board_title: "Montar Combinação de Roupas",
    board_subtitle: "Organize e ajuste suas peças no Board Visual.",
    btn_back: "Voltar",
    board_canvas_text: "Área de montagem da combinação (Board Visual).",

    // Admin View
    admin_banner_title: "Painel de Administração",
    admin_banner_desc: "Visão geral e métricas agregadas da plataforma. Dados restritos sem exibição de fotos ou arquivos dos usuários.",
    metric_users_label: "Contas Cadastradas",
    metric_users_desc: "Total de usuários registrados no sistema.",
    metric_items_label: "Itens Registrados",
    metric_items_desc: "Total de peças cadastradas em todos os guarda-roupas.",

    // Settings View
    settings_profile_title: "Perfil do Usuário",
    settings_profile_desc: "Informações da sua conta logada no sistema.",
    settings_username: "Nome de Usuário",
    settings_email: "E-mail",
    settings_password_title: "Segurança e Senha",
    settings_password_desc: "Altere a sua senha de acesso à conta.",
    btn_change_password: "Alterar Senha",
    settings_lang_title: "Idioma da Interface",
    settings_lang_desc: "Selecione seu idioma de preferência para todo o site.",
    lang_pt: "Português (Brasil)",
    lang_en: "English",
    lang_ru: "Русский",

    // Modal de Alterar Senha
    modal_change_password_title: "Alterar Senha",
    modal_change_password_desc: "Digite e confirme sua nova senha abaixo.",
    btn_cancel: "Cancelar",
    btn_save_password: "Salvar Nova Senha",
    btn_saving_password: "Salvando...",
    password_change_success: "Senha alterada com sucesso!",
    password_mismatch_error: "As senhas digitadas não coincidem.",
    fill_all_fields: "Por favor, preencha todos os campos.",
    password_min_length: "A senha deve ter no mínimo 6 caracteres.",
    supabase_connection_error: "Erro na conexão com o Supabase."
  },

  en: {
    // Autenticação
    app_title: "Virtual Wardrobe",
    login_subtitle: "Access your corporate account",
    signup_subtitle: "Create your Virtual Wardrobe account",
    email_label: "Email",
    password_label: "Password",
    new_password_label: "New Password",
    confirm_password_label: "Confirm New Password",
    username_label: "Username",
    email_placeholder: "your.email@example.com",
    password_placeholder: "••••••••",
    signup_password_placeholder: "Minimum 6 characters",
    username_placeholder: "Ex: MarySmith",
    btn_login: "Sign In",
    btn_logging_in: "Signing in...",
    btn_signup: "Create Account",
    btn_signing_up: "Creating account...",
    no_account: "Don't have an account?",
    link_signup: "Sign up",
    have_account: "Already have an account?",
    link_login: "Sign in",
    signup_success_redirect: "Registration completed successfully! Please sign in to continue.",

    // Top Header e Nav
    welcome_greeting: "Welcome, {username}",
    btn_logout_title: "Log out",
    nav_dashboard: "Dashboard",
    nav_wardrobe: "Wardrobe",
    nav_collections: "Collections",
    nav_wishlist: "Wishlist",
    nav_admin: "Admin Panel",
    nav_settings: "Settings",

    // Títulos das Páginas
    page_dashboard: "Overview Dashboard",
    page_wardrobe: "Wardrobe",
    page_collections: "Collections",
    page_wishlist: "Wishlist",
    page_board: "Create Outfit",
    page_admin: "Admin Dashboard",
    page_settings: "User Settings",

    // Dashboard View
    welcome_banner_title: "Welcome to your Virtual Wardrobe",
    welcome_banner_desc: "Manage your clothing items, create interactive outfits, and plan your next purchases.",
    card_items_title: "Item Management",
    card_items_desc: "Add new wardrobe items via photo or file upload.",
    btn_add_item: "Add Item",
    card_collections_title: "Themed Collections",
    card_collections_desc: "Organize your outfits by events, seasons, or work occasions.",
    btn_create_collection: "Create Collection",
    card_outfits_title: "Create Outfit",
    card_outfits_desc: "Combine items on the Visual Board to assemble and save new outfits.",
    btn_create_outfit: "Create Look",

    // Board View
    board_title: "Create Outfit Combination",
    board_subtitle: "Organize and adjust your items on the Visual Board.",
    btn_back: "Back",
    board_canvas_text: "Outfit assembly area (Visual Board).",

    // Admin View
    admin_banner_title: "Administration Panel",
    admin_banner_desc: "Overview and aggregated platform metrics. Restricted data without displaying user photos or files.",
    metric_users_label: "Registered Accounts",
    metric_users_desc: "Total users registered in the system.",
    metric_items_label: "Registered Items",
    metric_items_desc: "Total items registered across all wardrobes.",

    // Settings View
    settings_profile_title: "User Profile",
    settings_profile_desc: "Information about your currently logged-in account.",
    settings_username: "Username",
    settings_email: "Email",
    settings_password_title: "Security & Password",
    settings_password_desc: "Change your account access password.",
    btn_change_password: "Change Password",
    settings_lang_title: "Interface Language",
    settings_lang_desc: "Select your preferred language for the entire website.",
    lang_pt: "Português (Brasil)",
    lang_en: "English",
    lang_ru: "Русский",

    // Modal de Alterar Senha
    modal_change_password_title: "Change Password",
    modal_change_password_desc: "Enter and confirm your new password below.",
    btn_cancel: "Cancel",
    btn_save_password: "Save New Password",
    btn_saving_password: "Saving...",
    password_change_success: "Password updated successfully!",
    password_mismatch_error: "Entered passwords do not match.",
    fill_all_fields: "Please fill in all fields.",
    password_min_length: "Password must be at least 6 characters long.",
    supabase_connection_error: "Supabase connection error."
  },

  ru: {
    // Autenticação
    app_title: "Виртуальный Гардероб",
    login_subtitle: "Войдите в свою корпоративную учетную запись",
    signup_subtitle: "Создайте аккаунт в Виртуальном Гардеробе",
    email_label: "Электронная почта",
    password_label: "Пароль",
    new_password_label: "Новый пароль",
    confirm_password_label: "Подтвердите новый пароль",
    username_label: "Имя пользователя",
    email_placeholder: "vash.email@example.com",
    password_placeholder: "••••••••",
    signup_password_placeholder: "Минимум 6 символов",
    username_placeholder: "Например: МарияСидорова",
    btn_login: "Войти",
    btn_logging_in: "Вход...",
    btn_signup: "Создать аккаунт",
    btn_signing_up: "Регистрация...",
    no_account: "Нет аккаунта?",
    link_signup: "Зарегистрироваться",
    have_account: "Уже есть аккаунт?",
    link_login: "Войти",
    signup_success_redirect: "Регистрация успешно завершена! Пожалуйста, войдите в систему.",

    // Top Header e Nav
    welcome_greeting: "Добро пожаловать, {username}",
    btn_logout_title: "Выйти из аккаунта",
    nav_dashboard: "Панель",
    nav_wardrobe: "Гардероб",
    nav_collections: "Коллекции",
    nav_wishlist: "Wishlist",
    nav_admin: "Панель админа",
    nav_settings: "Настройки",

    // Títulos das Páginas
    page_dashboard: "Главная панель",
    page_wardrobe: "Гардероб",
    page_collections: "Коллекции",
    page_wishlist: "Wishlist",
    page_board: "Создать образ",
    page_admin: "Панель администратора",
    page_settings: "Настройки пользователя",

    // Dashboard View
    welcome_banner_title: "Добро пожаловать в ваш Виртуальный Гардероб",
    welcome_banner_desc: "Управляйте вещами, создавайте интерактивные образы и планируйте покупки.",
    card_items_title: "Управление вещами",
    card_items_desc: "Добавляйте новые вещи в гардероб с помощью фото или загрузки файлов.",
    btn_add_item: "Добавить вещь",
    card_collections_title: "Тематические коллекции",
    card_collections_desc: "Организуйте наряды по мероприятиям, сезонам или рабочим поводам.",
    btn_create_collection: "Создать коллекцию",
    card_outfits_title: "Создать комбинацию",
    card_outfits_desc: "Комбинируйте вещи на интерактивной доске и сохраняйте новые образы.",
    btn_create_outfit: "Собрать образ",

    // Board View
    board_title: "Создание комбинации одежды",
    board_subtitle: "Организуйте и настраивайте ваши вещи на интерактивной доске.",
    btn_back: "Назад",
    board_canvas_text: "Область сборки комбинации (Интерактивная доска).",

    // Admin View
    admin_banner_title: "Панель администратора",
    admin_banner_desc: "Общий обзор и агрегированные метрики платформы. Конфиденциальные данные без отображения фотографий пользователей.",
    metric_users_label: "Зарегистрированные аккаунты",
    metric_users_desc: "Всего зарегистрированных пользователей в системе.",
    metric_items_label: "Зарегистрированные вещи",
    metric_items_desc: "Всего вещей, добавленных во все гардеробы.",

    // Settings View
    settings_profile_title: "Профиль пользователя",
    settings_profile_desc: "Информация о текущей учетной записи.",
    settings_username: "Имя пользователя",
    settings_email: "Электронная почта",
    settings_password_title: "Безопасность и пароль",
    settings_password_desc: "Измените пароль для доступа к аккаунту.",
    btn_change_password: "Изменить пароль",
    settings_lang_title: "Язык интерфейса",
    settings_lang_desc: "Выберите предпочитаемый язык для всего сайта.",
    lang_pt: "Português (Brasil)",
    lang_en: "English",
    lang_ru: "Русский",

    // Modal de Alterar Senha
    modal_change_password_title: "Изменить пароль",
    modal_change_password_desc: "Введите и подтвердите ваш новый пароль ниже.",
    btn_cancel: "Отмена",
    btn_save_password: "Сохранить новый пароль",
    btn_saving_password: "Сохранение...",
    password_change_success: "Пароль успешно изменен!",
    password_mismatch_error: "Введенные пароли не совпадают.",
    fill_all_fields: "Пожалуйста, заполните все поля.",
    password_min_length: "Пароль должен содержать не менее 6 символов.",
    supabase_connection_error: "Ошибка подключения к Supabase."
  }
};

// Mapeamento de mensagens de erro do Supabase por idioma
const supabaseErrorMessages = {
  "Invalid login credentials": {
    pt: "E-mail ou senha incorretos.",
    en: "Invalid email or password.",
    ru: "Неверный email или пароль."
  },
  "User already registered": {
    pt: "Usuário já cadastrado com este e-mail.",
    en: "User already registered with this email.",
    ru: "Пользователь с таким email уже зарегистрирован."
  },
  "Password should be at least 6 characters": {
    pt: "A senha deve ter no mínimo 6 caracteres.",
    en: "Password should be at least 6 characters.",
    ru: "Пароль должен содержать не менее 6 символов."
  },
  "Email not confirmed": {
    pt: "E-mail não confirmado. Por favor, verifique sua caixa de entrada.",
    en: "Email not confirmed. Please check your inbox.",
    ru: "Email не подтвержден. Пожалуйста, проверьте вашу почту."
  },
  "New password should be different from the old password": {
    pt: "A nova senha deve ser diferente da antiga.",
    en: "New password should be different from the old password.",
    ru: "Новый пароль должен отличаться от старого."
  },
  "Unable to validate email address: invalid format": {
    pt: "Formato de e-mail inválido.",
    en: "Invalid email format.",
    ru: "Неверный формат email."
  },
  "Rate limit exceeded": {
    pt: "Muitas tentativas. Por favor, aguarde alguns instantes.",
    en: "Rate limit exceeded. Please try again later.",
    ru: "Превышен лимит запросов. Пожалуйста, попробуйте позже."
  }
};

// Gerenciamento do Idioma Atual
let currentLang = localStorage.getItem('app_lang') || 'pt';

if (!translations[currentLang]) {
  currentLang = 'pt';
}

export const getLanguage = () => currentLang;

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    return true;
  }
  return false;
};

export const t = (key, params = {}) => {
  const langDict = translations[currentLang] || translations.pt;
  let message = langDict[key] || translations.pt[key] || key;

  Object.keys(params).forEach(param => {
    message = message.replace(`{${param}}`, params[param]);
  });

  return message;
};

export const translateSupabaseError = (errorRaw) => {
  if (!errorRaw) return t('supabase_connection_error');
  const errorMsg = typeof errorRaw === 'string' ? errorRaw : (errorRaw.message || '');

  for (const [key, map] of Object.entries(supabaseErrorMessages)) {
    if (errorMsg.toLowerCase().includes(key.toLowerCase())) {
      return map[currentLang] || map.pt;
    }
  }

  // Se for mensagem customizada ou não mapeada, tenta buscar ou retorna o próprio texto
  return errorMsg || t('supabase_connection_error');
};

// Atualiza dinamicamente elementos da página marcados com data-i18n
export const updateDOMTranslations = () => {
  // Traduzir texto simples
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = t(key);
    }
  });

  // Traduzir placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (key) {
      element.placeholder = t(key);
    }
  });

  // Traduzir atributos title
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (key) {
      element.title = t(key);
    }
  });
};
