import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import { Target, Calendar } from 'lucide-react';

interface GoalData {
    name: string;
    targetAmount: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
}

interface FinancialGoalWizardProps {
    onComplete: (data: any) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Basic Info
function InfoStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Meta</label>
                <Input
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="Ex: Viagem para Europa, Reserva de Emergência"
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Valor Alvo</label>
                <Input
                    type="number"
                    step="0.01"
                    value={data.targetAmount}
                    onChange={(e) => updateData({ targetAmount: e.target.value })}
                    placeholder="0,00"
                />
            </div>
        </div>
    );
}

// Step 2: Deadline and Priority
function PlanningStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Prazo</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="date"
                        value={data.deadline}
                        onChange={(e) => updateData({ deadline: e.target.value })}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <select
                    value={data.priority}
                    onChange={(e) => updateData({ priority: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                >
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                </select>
            </div>
        </div>
    );
}

export function FinancialGoalWizard({ onComplete, onCancel }: FinancialGoalWizardProps) {
    const initialData: GoalData = {
        name: '',
        targetAmount: '',
        deadline: '',
        priority: 'medium'
    };

    const steps: WizardStep<GoalData>[] = [
        {
            id: 'info',
            title: 'Informações',
            component: InfoStep,
            validate: (data) => ({ isValid: !!data.name && !!data.targetAmount, error: 'Informe nome e valor alvo' })
        },
        {
            id: 'planning',
            title: 'Planejamento',
            component: PlanningStep,
            validate: (data) => ({ isValid: !!data.deadline, error: 'Defina um prazo' })
        }
    ];

    const handleComplete = async (data: GoalData) => {
        await onComplete({
            name: data.name,
            target_amount: parseFloat(data.targetAmount),
            current_amount: 0,
            deadline: data.deadline,
            priority: data.priority,
            status: 'active'
        });
    };

    return (
        <WizardBase
            title="Nova Meta Financeira"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
