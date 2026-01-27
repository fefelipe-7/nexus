import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import { PieChart, AlertTriangle } from 'lucide-react';

interface BudgetData {
    category: string;
    limit: string;
    period: 'monthly' | 'weekly' | 'yearly';
    alertThreshold: string;
}

interface BudgetWizardProps {
    onComplete: (budget: any) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Category
function CategoryStep({ data, updateData }: any) {
    const categories = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros'];

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">Categoria</label>
            <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => updateData({ category: cat })}
                        className={`p-4 rounded-xl border text-left transition-all ${data.category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Step 2: Limits
function LimitsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Limite do Orçamento</label>
                <Input
                    type="number"
                    value={data.limit}
                    onChange={(e) => updateData({ limit: e.target.value })}
                    placeholder="0,00"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <select
                    value={data.period}
                    onChange={(e) => updateData({ period: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                >
                    <option value="monthly">Mensal</option>
                    <option value="weekly">Semanal</option>
                    <option value="yearly">Anual</option>
                </select>
            </div>
        </div>
    );
}

// Step 3: Alerts
function AlertsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Alerta de Consumo (%)</label>
                <p className="text-xs text-muted-foreground">
                    Avise-me quando atingir esta porcentagem do limite
                </p>
                <Input
                    type="number"
                    min="1"
                    max="100"
                    value={data.alertThreshold}
                    onChange={(e) => updateData({ alertThreshold: e.target.value })}
                    placeholder="Ex: 80"
                />
            </div>
        </div>
    );
}

export function BudgetWizard({ onComplete, onCancel }: BudgetWizardProps) {
    const initialData: BudgetData = {
        category: '',
        limit: '',
        period: 'monthly',
        alertThreshold: '80'
    };

    const steps: WizardStep<BudgetData>[] = [
        {
            id: 'category',
            title: 'Categoria',
            component: CategoryStep,
            validate: (data) => ({ isValid: !!data.category, error: 'Selecione uma categoria' })
        },
        {
            id: 'limits',
            title: 'Limites',
            component: LimitsStep,
            validate: (data) => ({ isValid: !!data.limit, error: 'Defina o limite do orçamento' })
        },
        {
            id: 'alerts',
            title: 'Alertas',
            component: AlertsStep,
            validate: (data) => ({ isValid: true })
        }
    ];

    const handleComplete = async (data: BudgetData) => {
        await onComplete({
            category: data.category,
            limit_amount: parseFloat(data.limit),
            period: data.period,
            alert_threshold: parseInt(data.alertThreshold || '80'),
            start_date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <WizardBase
            title="Novo Orçamento"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
