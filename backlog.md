# Backlog do Projeto - Armário Virtual (armarioOnline)

**Data de Início:** 2025-05-18
**Status Geral:** Em Andamento
**Diretrizes de UI/UX:** Estritamente corporativa, limpa e minimalista. Fundo branco (`#FFFFFF`), tons de cinza, alto contraste, sem emojis, foco em telas desktop e tablet (>= 768px). Uso exclusivo de ícones Lucide.

---

## Estrutura de Tarefas Sequenciais

### 1. Infraestrutura Base e Configuração Inicial
- [x] Criar `backlog.md` e registrar início do projeto
- [x] Criar `index.html` com HTML5 semântico e importação CDN do Supabase e Lucide Icons
- [x] Criar `style.css` com design system corporativo (fundo `#FFFFFF`, paleta neutra, tipografia e layout responsivo >= 768px)
- [x] Criar `supabase.js` configurando a conexão com Supabase via CDN
- [x] Criar `app.js` inicializador do sistema e navegação base

### 2. Módulo de Autenticação & Onboarding (RF01)
- [ ] Implementar tela de Login / Cadastro via Supabase Auth
- [ ] Implementar fluxo de autenticação e persistência de sessão
- [ ] Criar Dashboard Principal com saudação personalizada e ações rápidas ([Adicionar Peça], [Criar Coleção])

### 3. Módulo de Gestão de Peças e Estoque (RF02)
- [ ] Criar formulário e modal de cadastro de peças (Upload de arquivo e integração Câmera)
- [ ] Implementar modal de tutorial de fotografia (com "Pular" e "Não mostrar novamente")
- [ ] Integrar processamento assíncrono para remoção de fundo
- [ ] Implementar cadastro de atributos da peça (Categoria, Cor, Estação, Formalidade)
- [ ] Gerenciamento de status da peça (`Ativo`, `Vou me desfazer`, `Arquivado`)
- [ ] Galeria e listagem de peças com filtros por atributos e status

### 4. Módulo Board Visual - Lookbook Interativo (RF03)
- [ ] Implementar área interativa de canvas/board visual (*drag-and-drop*, redimensionar, girar e ordem de camadas *z-index*)
- [ ] Implementar salvamento do estado do board (matriz de coordenadas, escala e *z-index*)
- [ ] Implementar geração automática de imagem de capa do outfit/look

### 5. Módulo Coleções Temáticas (RF04)
- [ ] Criar CRUD de Coleções (ex: "Trabalho", "Halloween 2026")
- [ ] Implementar associação de outfits/looks criados a coleções específicas
- [ ] Visualização de coleções e outfits vinculados

### 6. Módulo Wishlist e Comparador (RF05)
- [ ] Criar formulário e listagem da Wishlist (Peça desejada, imagem, preço)
- [ ] Implementar modo de simulação no Board misturando itens da Wishlist com o guarda-roupa atual
- [ ] Implementar ações da Wishlist ("Marcar como Comprada" / "Arquivar")

---

## Histórico de Atualizações
- **2025-05-18:** Projeto iniciado, `backlog.md` criado e arquitetura sequencial mapeada.
