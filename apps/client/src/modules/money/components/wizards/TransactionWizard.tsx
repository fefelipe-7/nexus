import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import type { AccountTransaction } from '@/modules/money/types/accounts.types';
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Calendar } from 'lucide-react';
import { cn } from '@nexus/shared';

interface TransactionData {
    type: 'income' | 'expense' | 'transfer' | null;
    amount: string;
    category: string;
    accountId: string;
    date: string;
    description: string;
}

interface TransactionWizardProps {
    accounts: Array<{ id: string; name: string }>;
    onComplete: (transaction: Omit<AccountTransaction, 'id'>) => Promise<void>;
    onCancel: () => void;
}

// Step 1: Type Selection
function TypeStep({ data, updateData, goNext }: any) {
    const types = [
        {
            value: 'income' as const,
            label: 'Receita',
            icon: ArrowDownCircle,
            color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
            description: 'Dinheiro que entra'
        },
        {
            value: 'expense' as const,
            label: 'Despesa',
            icon: ArrowUpCircle,
            color: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
            description: 'Dinheiro que sai'
        },
        {
            value: 'transfer' as const,
            label: 'Transferência',
            icon: ArrowRightLeft,
            color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
            description: 'Entre contas'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {types.map((type) => {
                    const Icon = type.icon;
                    const isSelected = data.type === type.value;

                    return (
                        <button
                            key={type.value}
                            onClick={() => {
                                updateData({ type: type.value });
                                setTimeout(goNext, 300);
                            }}
                            className={cn(
                                "p-6 rounded-2xl border-2 transition-all text-left space-y-3 hover:scale-105",
                                isSelected
                                    ? `${type.color} shadow-lg`
                                    : "border-border hover:border-foreground/30"
                            )}
                        >
                            <Icon className="h-10 w-10" />
                            <div>
                                <h3 className="font-bold text-lg">{type.label}</h3>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Step 2: Amount and Category
function AmountStep({ data, updateData }: any) {
    const categories = data.type === 'income'
        ? ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outro']
        : data.type === 'expense'
            ? ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outro']
            : [];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                    Valor *
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        R$
                    </span>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => updateData({ amount: e.target.value })}
                        placeholder="0,00"
                        className="pl-10 h-14 text-2xl font-bold"
                        autoFocus
                    />
                </div>
            </div>

            {data.type !== 'transfer' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateData({ category: cat })}
                                className={cn(
                                    "p-3 rounded-xl text-sm font-medium transition-all border",
                                    data.category === cat
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-muted text-foreground border-border hover:border-foreground/30"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Step 3: Account and Date
function AccountDateStep({ data, updateData, accounts }: any) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="account" className="text-sm font-medium">
                    Conta *
                </label>
                <select
                    id="account"
                    value={data.accountId}
                    onChange={(e) => updateData({ accountId: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((acc: any) => (
                        <option key={acc.id} value={acc.id}>
                            {acc.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                    Data *
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="date"
                        type="date"
                        value={data.date || today}
                        onChange={(e) => updateData({ date: e.target.value })}
                        className="pl-12 h-12"
                    />
                </div>
            </div>
        </div>
    );
}

// Step 4: Description
function DescriptionStep({ data, updateData }: any) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Descrição *
                </label>
                <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    placeholder="Ex: Compra no supermercado"
                    className="h-12"
                    autoFocus
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Adicione uma descrição para identificar facilmente esta transação no futuro.
            </p>
        </div>
    );
}

// Step 5: Confirmation
function ConfirmationStep({ data, accounts }: any) {
    const account = accounts.find((a: any) => a.id === data.accountId);
    const amount = parseFloat(data.amount || '0');
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-muted/30 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="font-bold capitalize">{data.type}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className={cn(
                        "font-bold text-xl",
                        data.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                        {data.type === 'expense' ? '-' : '+'} {formattedAmount}
                    </span>
                </div>

                {data.category && (
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                        <span className="text-sm text-muted-foreground">Categoria</span>
                        <span className="font-medium">{data.category}</span>
                    </div>
                )}

                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Conta</span>
                    <span className="font-medium">{account?.name}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Data</span>
                    <span className="font-medium">
                        {new Date(data.date).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Descrição</span>
                    <span className="font-medium">{data.description}</span>
                </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
                Revise os dados acima antes de confirmar
            </p>
        </div>
    );
}

export function TransactionWizard({ accounts, onComplete, onCancel }: TransactionWizardProps) {
    const initialData: TransactionData = {
        type: null,
        amount: '',
        category: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    };

    const steps: WizardStep<TransactionData>[] = [
        {
            id: 'type',
            title: 'Tipo de Transação',
            description: 'Selecione o tipo de movimentação financeira',
            component: TypeStep,
            validate: (data) => ({
                isValid: !!data.type,
                error: 'Selecione um tipo de transação'
            })
        },
        {
            id: 'amount',
            title: 'Valor e Categoria',
            description: 'Informe o valor e a categoria',
            component: (props) => <AmountStep {...props} />,
            validate: (data) => ({
                isValid: !!data.amount && parseFloat(data.amount) > 0 && (data.type === 'transfer' || !!data.category),
                error: 'Preencha o valor e a categoria'
            })
        },
        {
            id: 'account',
            title: 'Conta e Data',
            description: 'Selecione a conta e a data da transação',
            component: (props) => <AccountDateStep {...props} accounts={accounts} />,
            validate: (data) => ({
                isValid: !!data.accountId && !!data.date,
                error: 'Selecione a conta e a data'
            })
        },
        {
            id: 'description',
            title: 'Descrição',
            description: 'Adicione uma descrição para identificar esta transação',
            component: DescriptionStep,
            validate: (data) => ({
                isValid: !!data.description.trim(),
                error: 'Adicione uma descrição'
            })
        },
        {
            id: 'confirmation',
            title: 'Confirmação',
            description: 'Revise os dados antes de salvar',
            component: (props) => <ConfirmationStep {...props} accounts={accounts} />
        }
    ];

    const handleComplete = async (data: TransactionData) => {
        const amount = parseFloat(data.amount);
        const finalAmount = data.type === 'expense' ? -amount : amount;

        await onComplete({
            accountId: data.accountId,
            date: new Date(data.date),
            description: data.description,
            amount: finalAmount,
            type: data.type!,
            category: data.category || undefined
        });
    };

    return (
        <WizardBase
            title="Nova Transação"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
