import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';

interface InvestmentData {
    type: string;
    name: string;
    amount: string;
    institution: string;
}

interface InvestmentWizardProps {
    onComplete: (data: any) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Type
function TypeStep({ data, updateData }: any) {
    const types = ['Renda Fixa', 'Ações', 'Fundos', 'Cripto', 'Tesouro Direto', 'Imóveis', 'Outros'];

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">Tipo de Investimento</label>
            <div className="grid grid-cols-2 gap-3">
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => updateData({ type })}
                        className={`p-4 rounded-xl border text-left transition-all ${data.type === type ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Step 2: Details
function DetailsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Ativo</label>
                <Input
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="Ex: CDB Nubank, PETR4, Bitcoin"
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Instituição</label>
                <Input
                    value={data.institution}
                    onChange={(e) => updateData({ institution: e.target.value })}
                    placeholder="Ex: XP Investimentos, Binance"
                />
            </div>
        </div>
    );
}

// Step 3: Value
function ValueStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Valor Investido</label>
                <Input
                    type="number"
                    step="0.01"
                    value={data.amount}
                    onChange={(e) => updateData({ amount: e.target.value })}
                    placeholder="0,00"
                    autoFocus
                />
            </div>
        </div>
    );
}

export function InvestmentWizard({ onComplete, onCancel }: InvestmentWizardProps) {
    const initialData: InvestmentData = {
        type: '',
        name: '',
        amount: '',
        institution: ''
    };

    const steps: WizardStep<InvestmentData>[] = [
        {
            id: 'type',
            title: 'Tipo',
            component: TypeStep,
            validate: (data) => ({ isValid: !!data.type, error: 'Selecione o tipo' })
        },
        {
            id: 'details',
            title: 'Detalhes',
            component: DetailsStep,
            validate: (data) => ({ isValid: !!data.name, error: 'Informe o nome do ativo' })
        },
        {
            id: 'value',
            title: 'Valor',
            component: ValueStep,
            validate: (data) => ({ isValid: !!data.amount && parseFloat(data.amount) > 0, error: 'Informe o valor investido' })
        }
    ];

    const handleComplete = async (data: InvestmentData) => {
        await onComplete({
            type: data.type,
            name: data.name,
            amount: parseFloat(data.amount),
            current_value: parseFloat(data.amount), // Initially same as amount
            institution: data.institution
        });
    };

    return (
        <WizardBase
            title="Novo Investimento"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
