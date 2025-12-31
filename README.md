# Nexus - Seu Centro de Comando Pessoal

Nexus é um sistema abrangente de gerenciamento de vida pessoal projetado para ser o núcleo central da sua vida digital. Ele organiza, contextualiza e interpreta seus dados pessoais em múltiplos domínios de vida.

## Funcionalidades

- **Rastreamento de Múltiplos Domínios**: Estado pessoal, ações, eventos, metas, rotinas, conhecimento e reflexões
- **Offline-First**: Funcionalidade completa sem conexão com a internet
- **Insights Assistidos por IA**: Detecção de padrões, correlações e resumos contextuais
- **Foco em Privacidade**: Armazenamento de dados local com controle do usuário
- **Interface Atraente**: Interface calma e neutra com profundidade progressiva
- **Sistema de Temas**: 5 temas personalizáveis (Padrão, Oceano, Floresta, Pôr do Sol, Meia-Noite)
- **Multiplataforma**: Funciona em dispositivos desktop e móveis

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS + componentes shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Armazenamento Local**: Dexie (wrapper do IndexedDB)
- **Roteamento**: React Router
- **Estado**: Zustand
- **Ícones**: Lucide React

## Começando

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Faça o build para produção:
```bash
npm run build
```

## Arquitetura Modular

Nexus segue uma arquitetura modular baseada em monorepo com separação clara de responsabilidades:

### Estrutura de Diretórios

```
NEXUS/
├─ apps/client/          # Aplicação React principal
│  ├─ src/app/           # Bootstrap e configuração
│  ├─ src/ui/            # Componentes de interface
│  ├─ src/screens/       # Telas da aplicação
│  ├─ src/state/         # Gerenciamento de estado (Zustand)
│  ├─ src/data/          # Camada de dados (Dexie/Supabase)
│  └─ src/ai/            # Integração com IA
│
├─ packages/
│  ├─ core/              # Lógica de domínio (DDD + Hexagonal)
│  │  ├─ domain/         # Entidades e regras de negócio
│  │  ├─ use-cases/      # Casos de uso
│  │  └─ ports/          # Interfaces (Hexagonal Architecture)
│  ├─ shared/            # Utilitários e tipos compartilhados
│  ├─ data-model/        # Schemas e migrações
│  ├─ sync-engine/       # Motor de sincronização
│  ├─ analytics/         # Análise de dados
│  ├─ ai-core/           # Núcleo de IA
│  └─ privacy/           # Privacidade e conformidade
│
├─ services/             # Serviços backend (futuro)
├─ infra/                # Infraestrutura e configuração
└─ docs/                 # Documentação

```

### Princípios Arquiteturais

1. **Domain-Driven Design (DDD)**: Entidades de domínio bem definidas
2. **Hexagonal Architecture**: Core isolado de detalhes de implementação
3. **Local-First**: Dados locais como fonte primária
4. **Modularidade**: Pacotes independentes e reutilizáveis
5. **Privacy by Design**: Controle total do usuário sobre seus dados

Consulte `docs/context/architecture.txt` para mais detalhes sobre a arquitetura.

## Configuração do Supabase

1. Copie `.env.example` para `.env`
2. Adicione suas credenciais do Supabase no arquivo `.env`
3. Execute as migrations SQL localizadas em `supabase/migrations/001_initial_schema.sql` no painel SQL do Supabase
4. Consulte `supabase/README.md` para mais detalhes sobre a estrutura do banco de dados

## Filosofia

Nexus é projetado para:
- Reduzir a carga cognitiva e a fragmentação
- Fornecer continuidade temporal em sua vida
- Ampliar a conscientização e a clareza
- Adaptar-se ao seu nível de engajamento preferido
- Manter a privacidade por design

## Repositório

https://github.com/fefelipe-7/nexus.git

## Licença

Privado - Todos os direitos reservados
