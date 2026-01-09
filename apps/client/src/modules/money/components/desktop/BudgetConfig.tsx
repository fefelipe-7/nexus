import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { Settings, Plus, Edit2 } from 'lucide-react';
import { Button } from '@/ui/components/components/ui';
import type { BudgetConfig as BudgetConfigType } from '../../types/budget.types';

interface BudgetConfigProps {
  config: BudgetConfigType;
  onCreateBudget?: () => void;
  onEditBudget?: () => void;
  onAddCategory?: () => void;
}

export function BudgetConfig({ 
  config, 
  onCreateBudget,
  onEditBudget,
  onAddCategory 
}: BudgetConfigProps) {
  if (!config.isConfigured) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Orçamento Não Configurado</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Configure seu orçamento mensal para começar a controlar seus gastos e receber alertas importantes
              </p>
            </div>
            <Button onClick={onCreateBudget} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Definir Orçamento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEditBudget}>
            <Edit2 className="h-4 w-4 mr-2" />
            Editar Orçamento
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Orçamento Total</p>
            <p className="text-xl font-bold">
              R$ {config.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Período</p>
            <p className="text-xl font-bold capitalize">
              {config.period === 'monthly' ? 'Mensal' : config.period === 'weekly' ? 'Semanal' : 'Personalizado'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Ações Rápidas</p>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={onAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={onEditBudget}>
              <Edit2 className="h-4 w-4 mr-2" />
              Ajustar Valores
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Dica: Você pode clicar em qualquer categoria para ver detalhes e ajustar configurações individuais
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
