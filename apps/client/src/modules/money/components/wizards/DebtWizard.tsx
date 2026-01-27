import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import { Calendar } from 'lucide-react';

interface DebtData {
    name: string;
    totalAmount: string;
    interestRate: string;
    dueDate: string;
}

interface DebtWizardProps {
    onComplete: (data: any) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Debt Details
function DetailsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Dívida</label>
                <Input
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="Ex: Empréstimo Pessoal, Financiamento Carro"
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Valor Total</label>
                <Input
                    type="number"
                    step="0.01"
                    value={data.totalAmount}
                    onChange={(e) => updateData({ totalAmount: e.target.value })}
                    placeholder="0,00"
                />
            </div>
        </div>
    );
}

// Step 2: Payment Terms
function TermsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Taxa de Juros Mensal (%)</label>
                <Input
                    type="number"
                    step="0.1"
                    value={data.interestRate}
                    onChange={(e) => updateData({ interestRate: e.target.value })}
                    placeholder="Ex: 2.5"
                />
            </div>
        </div>
    );
}

// Step 3: Dates
function DateStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Data de Vencimento</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="date"
                        value={data.dueDate}
                        onChange={(e) => updateData({ dueDate: e.target.value })}
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
    );
}

export function DebtWizard({ onComplete, onCancel }: DebtWizardProps) {
    const initialData: DebtData = {
        name: '',
        totalAmount: '',
        interestRate: '',
        dueDate: new Date().toISOString().split('T')[0]
    };

    const steps: WizardStep<DebtData>[] = [
        {
            id: 'details',
            title: 'Detalhes',
            component: DetailsStep,
            validate: (data) => ({ isValid: !!data.name && !!data.totalAmount, error: 'Informe nome e valor' })
        },
        {
            id: 'terms',
            title: 'Termos',
            component: TermsStep,
            validate: (data) => ({ isValid: true })
        },
        {
            id: 'date',
            title: 'Datas',
            component: DateStep,
            validate: (data) => ({ isValid: !!data.dueDate, error: 'Informe a data de vencimento' })
        }
    ];

    const handleComplete = async (data: DebtData) => {
        await onComplete({
            name: data.name,
            total_amount: parseFloat(data.totalAmount),
            remaining_amount: parseFloat(data.totalAmount), // Initially full amount
            interest_rate: data.interestRate ? parseFloat(data.interestRate) : null,
            due_date: data.dueDate
        });
    };

    return (
        <WizardBase
            title="Nova Dívida"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
