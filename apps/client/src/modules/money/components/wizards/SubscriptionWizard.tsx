import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import { Calendar } from 'lucide-react';

interface SubscriptionData {
    name: string;
    amount: string;
    frequency: 'monthly' | 'yearly' | 'weekly';
    nextBillingDate: string;
    category: string;
}

interface SubscriptionWizardProps {
    onComplete: (data: any) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Service Details
function ServiceStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Serviço</label>
                <Input
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="Ex: Netflix, Spotify, Amazon Prime"
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Valor da Assinatura</label>
                <Input
                    type="number"
                    step="0.01"
                    value={data.amount}
                    onChange={(e) => updateData({ amount: e.target.value })}
                    placeholder="0,00"
                />
            </div>
        </div>
    );
}

// Step 2: Billing Cycle
function BillingStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Frequência</label>
                <select
                    value={data.frequency}
                    onChange={(e) => updateData({ frequency: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background"
                >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                    <option value="weekly">Semanal</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Próxima Cobrança</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="date"
                        value={data.nextBillingDate}
                        onChange={(e) => updateData({ nextBillingDate: e.target.value })}
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
    );
}

// Step 3: Category
function CategoryStep({ data, updateData }: any) {
    const categories = ['Streaming', 'Software', 'Jogos', 'Educação', 'Música', 'Nuvem', 'Outros'];

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

export function SubscriptionWizard({ onComplete, onCancel }: SubscriptionWizardProps) {
    const initialData: SubscriptionData = {
        name: '',
        amount: '',
        frequency: 'monthly',
        nextBillingDate: new Date().toISOString().split('T')[0],
        category: ''
    };

    const steps: WizardStep<SubscriptionData>[] = [
        {
            id: 'service',
            title: 'Serviço',
            component: ServiceStep,
            validate: (data) => ({ isValid: !!data.name && !!data.amount, error: 'Informe nome e valor' })
        },
        {
            id: 'billing',
            title: 'Cobrança',
            component: BillingStep,
            validate: (data) => ({ isValid: !!data.nextBillingDate, error: 'Informe a data de cobrança' })
        },
        {
            id: 'category',
            title: 'Categoria',
            component: CategoryStep,
            validate: (data) => ({ isValid: !!data.category, error: 'Selecione uma categoria' })
        }
    ];

    const handleComplete = async (data: SubscriptionData) => {
        await onComplete({
            name: data.name,
            amount: parseFloat(data.amount),
            frequency: data.frequency,
            next_billing_date: data.nextBillingDate,
            category: data.category
        });
    };

    return (
        <WizardBase
            title="Nova Assinatura"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
