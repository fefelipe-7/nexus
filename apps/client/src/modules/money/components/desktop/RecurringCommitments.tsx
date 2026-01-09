import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/components/ui';
import { DataTable, Column } from '@/ui/components/desktop';
import { Repeat, Calendar } from 'lucide-react';
import type { RecurringCommitment } from '../../types/cashflow.types';

interface RecurringCommitmentsProps {
  commitments: RecurringCommitment[];
}

export function RecurringCommitments({ commitments }: RecurringCommitmentsProps) {
  const totalMonthly = commitments
    .filter(c => c.isActive)
    .reduce((sum, c) => sum + c.amount, 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const columns: Column<RecurringCommitment>[] = [
    {
      key: 'name',
      label: 'Compromisso',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    {
      key: 'frequency',
      label: 'Frequência',
      sortable: true,
      render: (item) => {
        const labels = {
          daily: 'Diário',
          weekly: 'Semanal',
          monthly: 'Mensal',
          yearly: 'Anual',
        };
        return <span className="text-sm">{labels[item.frequency]}</span>;
      },
    },
    {
      key: 'nextDate',
      label: 'Próximo Vencimento',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(item.nextDate)}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Valor',
      sortable: true,
      render: (item) => (
        <span className="font-semibold">
          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '120px',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Compromissos Recorrentes
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Impacto Mensal</p>
            <p className="text-lg font-bold text-primary">
              R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={commitments}
          columns={columns}
          keyExtractor={(item) => item.id}
        />
      </CardContent>
    </Card>
  );
}
