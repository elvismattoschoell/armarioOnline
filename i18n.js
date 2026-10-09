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
    board_add_items_title: "Minhas Peças",
    board_add_items_desc: "Clique numa peça para adicioná-la ao canvas.",
    board_name_placeholder: "Nome da Combinação (ex: Casual Verão)",
    btn_save_board: "Salvar Combinação",
    btn_clear_canvas: "Limpar Canvas",
    board_canvas_instructions: "Selecione peças na barra lateral para começar a montar sua combinação.",
    saved_combinations_title: "Combinações Salvas",
    combination_save_success: "Combinação salva com sucesso!",
    combination_name_required: "Por favor, digite um nome para a combinação.",
    combination_empty_error: "Adicione pelo menos uma peça ao canvas antes de salvar.",
    no_saved_combinations: "Nenhuma combinação salva ainda.",

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

    // Guarda-Roupa (Wardrobe View)
    wardrobe_title: "Meu Guarda-Roupa",
    wardrobe_subtitle: "Gerencie suas peças organizadas e divididas por categoria.",
    btn_add_piece: "Adicionar Peça",
    empty_wardrobe_title: "Nenhuma peça cadastrada",
    empty_wardrobe_desc: "Sua coleção está vazia. Clique no botão acima para cadastrar sua primeira peça.",
    no_image: "Sem imagem",

    // Modal de Cadastro de Peça
    modal_add_piece_title: "Cadastrar Nova Peça",
    modal_add_piece_desc: "Tire uma foto ou faça upload da imagem da sua peça de roupa.",
    piece_image_label: "Foto da Peça",
    piece_nome_label: "Nome da Peça *",
    piece_nome_placeholder: "Ex: Camiseta Branca Básica",
    piece_categoria_label: "Categoria *",
    piece_categoria_placeholder: "Ex: Camiseta, Calça...",
    piece_cor_label: "Cor",
    piece_cor_placeholder: "Ex: Preto, Azul Marinho...",
    piece_estacao_label: "Estação",
    piece_formalidade_label: "Formalidade",
    piece_marca_label: "Marca",
    piece_marca_placeholder: "Ex: Zara, Nike...",
    piece_tamanho_label: "Tamanho",
    piece_tamanho_placeholder: "Ex: M, G, 42...",
    btn_save_piece: "Salvar Peça",
    btn_saving_piece: "Salvando...",
    btn_choose_photo: "Escolher Foto",

    // Categorias de Roupas
    category_camiseta: "Camiseta",
    category_camisa: "Camisa",
    category_casaco: "Casaco",
    category_jaqueta: "Jaqueta",
    category_moletom: "Moletom",
    category_calca: "Calça",
    category_bermuda: "Bermuda / Calções",
    category_saia: "Saia",
    category_vestido: "Vestido",
    category_calcado: "Calçado / Tênis",
    category_acessorio: "Acessório",
    category_chapeu: "Chapéu / Boné",
    category_outros: "Outros",
    btn_crop: "Recortar",
    btn_eraser: "Borracha",
    btn_apply_crop: "Aplicar Recorte",
    btn_invert_selection: "Inverter Seleção",
    btn_undo_original: "Foto Original",
    btn_clear_trace: "Limpar Traço",
    btn_confirm_crop: "Confirmar Recorte",
    tool_lasso: "Laço",
    tool_eraser: "Borracha",
    label_brush_size: "Espessura:",
    piece_add_success: "Peça cadastrada com sucesso!",
    piece_name_category_required: "Por favor, informe o Nome e a Categoria da peça.",
    select_option_none: "Selecione...",

    // Opções de Estação e Formalidade
    season_summer: "Verão",
    season_winter: "Inverno",
    season_autumn: "Outono",
    season_spring: "Primavera",
    season_all: "Todas as Estações",
    formality_casual: "Casual",
    formality_smart_casual: "Esporte Fino",
    formality_formal: "Formal / Social",
    formality_sport: "Esportivo",

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
    board_add_items_title: "My Items",
    board_add_items_desc: "Click an item to add it to the canvas.",
    board_name_placeholder: "Combination Name (e.g. Summer Casual)",
    btn_save_board: "Save Combination",
    btn_clear_canvas: "Clear Canvas",
    board_canvas_instructions: "Select items from the sidebar to start creating your combination.",
    saved_combinations_title: "Saved Combinations",
    combination_save_success: "Combination saved successfully!",
    combination_name_required: "Please enter a name for the combination.",
    combination_empty_error: "Add at least one item to the canvas before saving.",
    no_saved_combinations: "No saved combinations yet.",

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

    // Guarda-Roupa (Wardrobe View)
    wardrobe_title: "My Wardrobe",
    wardrobe_subtitle: "Manage your clothing items organized and grouped by category.",
    btn_add_piece: "Add Piece",
    empty_wardrobe_title: "No clothing items registered",
    empty_wardrobe_desc: "Your collection is empty. Click the button above to register your first piece.",
    no_image: "No image",

    // Modal de Cadastro de Peça
    modal_add_piece_title: "Register New Clothing Item",
    modal_add_piece_desc: "Take a photo or upload an image of your clothing item.",
    piece_image_label: "Item Photo",
    piece_nome_label: "Item Name *",
    piece_nome_placeholder: "Ex: Basic White T-Shirt",
    piece_categoria_label: "Category *",
    piece_categoria_placeholder: "Ex: T-Shirt, Pants...",
    piece_cor_label: "Color",
    piece_cor_placeholder: "Ex: Black, Navy Blue...",
    piece_estacao_label: "Season",
    piece_formalidade_label: "Formality",
    piece_marca_label: "Brand",
    piece_marca_placeholder: "Ex: Zara, Nike...",
    piece_tamanho_label: "Size",
    piece_tamanho_placeholder: "Ex: M, L, 42...",
    btn_save_piece: "Save Item",
    btn_saving_piece: "Saving...",
    btn_choose_photo: "Choose Photo",

    // Categorias de Roupas
    category_camiseta: "T-Shirt",
    category_camisa: "Shirt",
    category_casaco: "Coat",
    category_jaqueta: "Jacket",
    category_moletom: "Hoodie / Sweatshirt",
    category_calca: "Pants",
    category_bermuda: "Shorts",
    category_saia: "Skirt",
    category_vestido: "Dress",
    category_calcado: "Footwear / Shoes",
    category_acessorio: "Accessory",
    category_chapeu: "Hat / Cap",
    category_outros: "Others",
    btn_crop: "Crop",
    btn_eraser: "Eraser",
    btn_apply_crop: "Apply Crop",
    btn_invert_selection: "Invert Selection",
    btn_undo_original: "Original Photo",
    btn_clear_trace: "Clear Trace",
    btn_confirm_crop: "Confirm Crop",
    tool_lasso: "Lasso",
    tool_eraser: "Eraser",
    label_brush_size: "Thickness:",
    piece_add_success: "Clothing item registered successfully!",
    piece_name_category_required: "Please provide the Item Name and Category.",
    select_option_none: "Select...",

    // Opções de Estação e Formalidade
    season_summer: "Summer",
    season_winter: "Winter",
    season_autumn: "Autumn",
    season_spring: "Spring",
    season_all: "All Seasons",
    formality_casual: "Casual",
    formality_smart_casual: "Smart Casual",
    formality_formal: "Formal",
    formality_sport: "Sportswear",

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
    board_add_items_title: "Мои вещи",
    board_add_items_desc: "Нажмите на вещь, чтобы добавить её на доску.",
    board_name_placeholder: "Название комбинации (напр., Летний повседневный)",
    btn_save_board: "Сохранить комбинацию",
    btn_clear_canvas: "Очистить доску",
    board_canvas_instructions: "Выберите вещи в боковой панели, чтобы начать сборку комбинации.",
    saved_combinations_title: "Сохраненные комбинации",
    combination_save_success: "Комбинация успешно сохранена!",
    combination_name_required: "Пожалуйста, введите название комбинации.",
    combination_empty_error: "Добавьте хотя бы одну вещь на доску перед сохранением.",
    no_saved_combinations: "Пока нет сохраненных комбинаций.",

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

    // Guarda-Roupa (Wardrobe View)
    wardrobe_title: "Мой Гардероб",
    wardrobe_subtitle: "Управляйте вашими вещами, сгруппированными по категориям.",
    btn_add_piece: "Добавить вещь",
    empty_wardrobe_title: "Нет добавленных вещей",
    empty_wardrobe_desc: "Ваша коллекция пуста. Нажмите кнопку выше, чтобы добавить первую вещь.",
    no_image: "Без изображения",

    // Modal de Cadastro de Peça
    modal_add_piece_title: "Добавить новую вещь",
    modal_add_piece_desc: "Сделайте фото или загрузите изображение вашей вещи.",
    piece_image_label: "Фото вещи",
    piece_nome_label: "Название вещи *",
    piece_nome_placeholder: "Например: Белая базовая футболка",
    piece_categoria_label: "Категория *",
    piece_categoria_placeholder: "Например: Футболка, Брюки...",
    piece_cor_label: "Цвет",
    piece_cor_placeholder: "Например: Черный, Тёмно-синий...",
    piece_estacao_label: "Сезон",
    piece_formalidade_label: "Стиль",
    piece_marca_label: "Бренд",
    piece_marca_placeholder: "Например: Zara, Nike...",
    piece_tamanho_label: "Размер",
    piece_tamanho_placeholder: "Например: M, L, 42...",
    btn_save_piece: "Сохранить вещь",
    btn_saving_piece: "Сохранение...",
    btn_choose_photo: "Выбрать фото",

    // Categorias de Roupas
    category_camiseta: "Футболка",
    category_camisa: "Рубашка",
    category_casaco: "Пальто",
    category_jaqueta: "Куртка",
    category_moletom: "Толстовка",
    category_calca: "Брюки",
    category_bermuda: "Шорты",
    category_saia: "Юбка",
    category_vestido: "Платье",
    category_calcado: "Обувь",
    category_acessorio: "Аксессуар",
    category_chapeu: "Головной убор",
    category_outros: "Другое",
    btn_crop: "Обрезать",
    btn_eraser: "Ластик",
    btn_apply_crop: "Применить обрезку",
    btn_invert_selection: "Инвертировать выделение",
    btn_undo_original: "Исходное фото",
    btn_clear_trace: "Очистить контур",
    btn_confirm_crop: "Подтвердить обрезку",
    tool_lasso: "Lasso",
    tool_eraser: "Ластик",
    label_brush_size: "Толщина:",
    piece_add_success: "Вещь успешно добавлена!",
    piece_name_category_required: "Пожалуйста, укажите название и категорию вещи.",
    select_option_none: "Выберите...",

    // Opções de Estação e Formalidade
    season_summer: "Лето",
    season_winter: "Зима",
    season_autumn: "Осень",
    season_spring: "Весна",
    season_all: "Все сезоны",
    formality_casual: "Повседневный",
    formality_smart_casual: "Smart Casual",
    formality_formal: "Официальный",
    formality_sport: "Спортивный",

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
