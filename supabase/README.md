# Migrations do Supabase - Nexus

## Como aplicar as migrations

1. Acesse o painel do Supabase: https://hialddemgdxrixuhomvg.supabase.co

2. Vá para SQL Editor

3. Copie e cole o conteúdo do arquivo `migrations/001_initial_schema.sql`

4. Execute o SQL

## Estrutura do Banco de Dados

O schema inclui as seguintes tabelas:

- **personal_states**: Estados pessoais (humor, energia, estresse)
- **actions**: Ações, tarefas e hábitos
- **events**: Eventos agendados e inesperados
- **goals**: Metas e objetivos
- **routines**: Rotinas diárias/semanais/mensais
- **routine_logs**: Logs de conclusão de rotinas
- **knowledge**: Base de conhecimento (notas, ideias, aprendizados)
- **reflections**: Reflexões e diários

Todas as tabelas incluem:
- Row Level Security (RLS) habilitado
- Políticas de acesso baseadas no user_id
- Índices para otimização de queries
- Constraints de validação
