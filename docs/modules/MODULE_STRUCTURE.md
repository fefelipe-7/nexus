# Estrutura de Módulos do Nexus

## Visão Geral

O Nexus é organizado em 12 módulos principais que representam os domínios da vida. Cada módulo possui submódulos específicos que organizam funcionalidades relacionadas.

## Princípios de Organização

1. **Independência com Interoperabilidade**: Todo módulo é independente, mas pode se comunicar com outros
2. **Responsabilidades Claras**: Submódulos representam responsabilidades específicas
3. **Mensurabilidade**: Tudo é rastreável, mensurável ou contextualizável
4. **Escalabilidade**: Estrutura pensada para uso pessoal e futuro multi-conta

## Módulos Principais

### 1. Visão Geral (`/overview`)
**Descrição**: Ponto de entrada do Nexus. Visão consolidada de tudo.

**Submódulos**:
- Resumo do Dia
- Resumo da Semana
- Alertas Importantes
- Pendências Críticas
- Próximos Eventos
- Indicadores Rápidos
- Sugestões Inteligentes

---

### 2. Dinheiro (`/money`)
**Descrição**: Tudo que envolve valor financeiro, sem divisão artificial.

**Submódulos**:
- Fluxo de Dinheiro (entradas, saídas, recorrências)
- Contas e Carteiras (bancos, dinheiro físico, contas digitais)
- Cartões
- Orçamento
- Compras e Gastos
- Assinaturas
- Dívidas e Parcelamentos
- Investimentos
- Patrimônio Financeiro
- Metas Financeiras
- Relatórios e Histórico

---

### 3. Tempo (`/time`)
**Descrição**: Onde a vida acontece.

**Submódulos**:
- Agenda
- Compromissos
- Tarefas
- Hábitos
- Rotinas
- Prioridades
- Histórico do Tempo
- Planejamento Semanal

---

### 4. Objetivos (`/goals`)
**Descrição**: Direção da vida, não apenas tarefas.

**Submódulos**:
- Objetivos de Vida
- Objetivos Anuais
- Metas de Curto Prazo
- Planos de Ação
- Indicadores de Progresso
- Revisões Periódicas
- Conexão com Hábitos e Projetos

---

### 5. Saúde (`/health`)
**Descrição**: Corpo e mente no mesmo lugar.

**Submódulos**:
- Saúde Física
- Saúde Mental
- Humor e Emoções
- Sono
- Alimentação
- Exercícios
- Medicamentos
- Consultas e Exames
- Histórico de Saúde
- Alertas

---

### 6. Pessoas (`/people`)
**Descrição**: Relacionamentos organizados de forma natural.

**Submódulos**:
- Contatos Importantes
- Família
- Relacionamentos
- Histórico de Interações
- Datas Importantes
- Anotações por Pessoa
- Redes de Apoio

---

### 7. Trabalho & Estudos (`/work-study`)
**Descrição**: Produção intelectual e profissional juntas.

**Submódulos**:
- Empregos/Atividades Atuais
- Projetos Profissionais
- Renda Associada
- Estudos e Cursos
- Habilidades
- Certificações
- Metas Profissionais
- Portfólio/Histórico
- Processos Seletivos

---

### 8. Casa & Coisas (`/home-things`)
**Descrição**: Onde patrimônio e logística se encontram.

**Submódulos**:
- Imóveis
- Moradia (Aluguel, Condomínio)
- Contas da Casa
- Manutenções
- Inventário Pessoal
- Garantias
- Seguros
- Veículos
- Transporte e Deslocamentos

---

### 9. Projetos (`/projects`)
**Descrição**: Qualquer coisa que tenha começo, meio e fim.

**Submódulos**:
- Projetos Pessoais
- Projetos Profissionais
- Projetos Criativos
- Tarefas por Projeto
- Recursos
- Prazos
- Status
- Resultados
- Aprendizados

---

### 10. Vida Digital (`/digital-life`)
**Descrição**: Sua presença online organizada.

**Submódulos**:
- Contas Online
- Assinaturas Digitais
- Serviços Conectados
- Segurança Digital
- Identidade Digital
- Backups
- Histórico de Acessos

---

### 11. Memórias (`/memories`)
**Descrição**: Registro da vida ao longo do tempo.

**Submódulos**:
- Diário
- Eventos Marcantes
- Conquistas
- Reflexões
- Linha do Tempo
- Arquivos Pessoais
- Fotos (Metadados)

---

### 12. Insights (`/insights`)
**Descrição**: Onde tudo se conecta.

**Submódulos**:
- Dashboards
- Correlações entre Áreas
- Padrões de Comportamento
- Alertas Inteligentes
- Recomendações
- Revisões Automáticas
- Relatórios Periódicos

---

## Estrutura de Arquivos

```
apps/client/src/
├── modules/
│   ├── overview/
│   │   ├── screens/
│   │   │   └── Overview.tsx
│   │   └── index.ts
│   ├── money/
│   ├── time/
│   ├── goals/
│   ├── health/
│   ├── people/
│   ├── work-study/
│   ├── home-things/
│   ├── projects/
│   ├── digital-life/
│   ├── memories/
│   └── insights/
├── config/
│   └── modules.config.ts
└── types/
    └── modules.types.ts
```

## Configuração de Módulos

A configuração centralizada está em `config/modules.config.ts` e define:
- ID do módulo
- Nome de exibição
- Ícone (Lucide React)
- Caminho de rota
- Cor do tema
- Descrição
- Lista de submódulos

## Roteamento

O roteamento é gerado dinamicamente em `App.tsx` baseado na configuração de módulos, garantindo:
- Consistência entre navegação e rotas
- Facilidade de adicionar novos módulos
- Manutenibilidade centralizada

## Navegação

A navegação possui dois níveis:
1. **Navegação Principal**: Sidebar com os 12 módulos principais
2. **Navegação de Submódulos**: Cards clicáveis na tela de cada módulo

## Breadcrumbs

Sistema de breadcrumbs automático que mostra:
- Home → Módulo → Submódulo
- Links clicáveis para navegação rápida

## Próximos Passos

Para implementar um novo submódulo:
1. Criar componente em `modules/{module}/screens/{Submodule}.tsx`
2. Atualizar rota em `App.tsx` para usar o componente real ao invés do placeholder
3. Adicionar lógica de negócio e integração com dados

## Interoperabilidade entre Módulos

Exemplos de conexões:
- **Dinheiro ↔ Saúde**: Gastos com saúde, plano de saúde
- **Dinheiro ↔ Trabalho**: Renda, despesas profissionais
- **Tempo ↔ Objetivos**: Tarefas vinculadas a metas
- **Saúde ↔ Tempo**: Hábitos de exercício, sono
- **Pessoas ↔ Memórias**: Eventos com pessoas específicas
- **Insights**: Conecta todos os módulos para análises
