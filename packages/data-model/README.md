# Nexus Data Model

Modelo de dados canônico do Nexus - um sistema operacional de vida.

## Visão Geral

Este pacote define as **entidades fundamentais** do Nexus baseadas no princípio de **single entry point**: usuários nunca escolhem módulos explicitamente, apenas criam **Records**. A classificação e enriquecimento são automáticos.

## Princípios de Design

1. **Single Entry Point**: Usuários criam apenas Records. A classificação é automática.
2. **Minimum Entities**: Sistema construído com um conjunto mínimo de entidades expressivas.
3. **Cross-Domain**: Uma entidade pode pertencer a múltiplos domínios de vida simultaneamente.
4. **Progressive Enrichment**: Dados podem começar incompletos e serem enriquecidos ao longo do tempo.
5. **AI-First**: Todas as entidades são projetadas para serem interpretáveis e correlacionáveis por IA.

## Entidades Base

### 1. **Record** (Registro)
A unidade atômica fundamental do Nexus. Tudo que é explicitamente adicionado pelo usuário começa como um Record.

**Papel no sistema**: Atua como camada universal de entrada e matéria-prima para todas as interpretações de alto nível.

**Exemplos**:
- Uma despesa financeira
- Uma tarefa
- Uma entrada de diário
- Um sintoma de saúde
- Um hábito completado
- Uma intenção de compra

### 2. **Event** (Evento)
Uma ocorrência temporal que pode impactar recursos, projetos, pessoas ou métricas.

**Papel no sistema**: Organiza a vida no tempo, conectando passado, presente e futuro.

**Exemplos**:
- Consulta médica
- Viagem
- Reunião
- Data de vencimento de conta
- Marco de projeto

### 3. **Person** (Pessoa)
Qualquer indivíduo relevante para a vida do usuário.

**Papel no sistema**: Atua como hub contextual conectando records, eventos e projetos.

**Exemplos**:
- Usuário
- Membro da família
- Amigo
- Colega de trabalho
- Prestador de serviço

### 4. **Project** (Projeto)
Um agrupamento intencional de esforço visando alcançar um objetivo.

**Papel no sistema**: Conecta objetivos com ações, tempo e recursos.

**Exemplos**:
- Organizar finanças
- Mudar de emprego
- Planejar uma viagem
- Construir o Nexus

### 5. **Resource** (Recurso)
Qualquer coisa que pode ser consumida, acumulada ou esgotada.

**Papel no sistema**: Permite análise quantitativa de trade-offs da vida.

**Tipos de recursos**:
- `money` (dinheiro)
- `time` (tempo)
- `energy` (energia)
- `attention` (atenção)
- `health` (saúde)
- `physical_space` (espaço físico)

### 6. **Metric** (Métrica)
Uma medição quantitativa ou categórica ao longo do tempo.

**Papel no sistema**: Alimenta insights, tendências e correlações.

**Exemplos**:
- Peso
- Duração do sono
- Humor
- Saldo da conta
- Score de produtividade

## Fluxo de Criação

```
1. Ponto de Entrada: Novo Record
   ↓
2. Ação do Usuário: Input de informação em formato livre, sem escolher módulo
   ↓
3. Ações do Sistema:
   - Analisar conteúdo
   - Inferir record_type
   - Detectar domínios relacionados
   - Sugerir links para pessoas, projetos, eventos
   - Gerar métricas ou mudanças de recursos se aplicável
   ↓
4. Confirmação do Usuário: Opcional e mínima
   ↓
5. Enriquecimento: Contínuo ao longo do tempo via IA e comportamento do usuário
```

## Estrutura de Arquivos

```
packages/data-model/
├── schemas/
│   ├── core-entities.ts      # Definições de tipos TypeScript
│   ├── validation.ts          # Schemas de validação Zod
│   └── index.ts              # Exportações centralizadas
├── migrations/               # Migrações de dados
├── serialization/           # Serialização/deserialização
└── README.md               # Este arquivo
```

## Uso

### Importar Tipos

```typescript
import { 
  Record, 
  Event, 
  Person, 
  Project, 
  Resource, 
  Metric 
} from '@nexus/data-model/schemas';
```

### Importar Schemas de Validação

```typescript
import { 
  CreateRecordInputSchema,
  RecordSchema,
  EventSchema 
} from '@nexus/data-model/schemas';

// Validar input do usuário
const result = CreateRecordInputSchema.safeParse(userInput);
if (result.success) {
  const validRecord = result.data;
  // Processar record válido
}
```

### Criar um Record

```typescript
import { CreateRecordInput } from '@nexus/data-model/schemas';

const newRecord: CreateRecordInput = {
  record_type: 'expense',
  title: 'Almoço no restaurante',
  description: 'Almoço de negócios com cliente',
  tags: ['alimentação', 'trabalho'],
  associated_domains: ['money', 'relationships'],
  origin: 'manual'
};
```

## Relacionamentos

As entidades são conectadas através de tabelas de relacionamento:

- **RecordLink**: Relacionamentos semânticos entre records e outras entidades
- **EventParticipant**: Pessoas envolvidas em eventos
- **EventRecord**: Records associados a eventos
- **ProjectRecord**: Records vinculados a projetos
- **ProjectMetric**: Métricas rastreando progresso de projetos
- **PersonRecord**: Records associados a pessoas
- **PersonInteraction**: Histórico de interações (eventos) com pessoas
- **MetricRecord**: Records que geraram ou se relacionam com métricas

## Database Schema

O schema do banco de dados está definido em:
```
supabase/migrations/002_nexus_core_entities.sql
```

Inclui:
- Todas as tabelas de entidades
- Tabelas de relacionamento
- Índices para performance
- Row Level Security (RLS)
- Triggers para atualização automática
- Funções auxiliares

## Versão

**Modelo Nexus**: v1.0.0

Este é o modelo canônico inicial do Nexus. Futuras versões manterão compatibilidade retroativa através do sistema de migrações.
