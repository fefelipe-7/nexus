# Nexus - Seu Centro de Comando Pessoal

Nexus é um sistema abrangente de gerenciamento de vida pessoal projetado para ser o núcleo central da sua vida digital. Ele organiza, contextualiza e interpreta seus dados pessoais em múltiplos domínios de vida.

## Funcionalidades

- **Rastreamento de Múltiplos Domínios**: Estado pessoal, ações, eventos, metas, rotinas, conhecimento e reflexões
- **Offline-First**: Funcionalidade completa sem conexão com a internet
- **Insights Assistidos por IA**: Detecção de padrões, correlações e resumos contextuais
- **Foco em Privacidade**: Armazenamento de dados local com controle do usuário
- **Interface Atraente**: Interface calma e neutra com profundidade progressiva
- **Multiplataforma**: Funciona em dispositivos desktop e móveis

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS + componentes shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Armazenamento Local**: Dexie (wrapper do IndexedDB)
- **Roteamento**: React Router
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

## Arquitetura

Nexus segue uma arquitetura local-first com:
- Persistência de dados no lado do cliente usando IndexedDB
- Estrutura de domínio modular
- Camada de interpretação de IA para insights
- Modelo de sincronização de consistência eventual

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
