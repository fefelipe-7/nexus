import { WizardBase, WizardStep } from '@/components/wizards/WizardBase';
import { Input } from '@/ui/components/components/ui';
import { CreditCard, Wallet } from 'lucide-react';
import { cn } from '@nexus/shared';

interface CardData {
    type: 'credit' | 'debit' | null;
    name: string;
    lastDigits: string;
    brand: string;
    limit: string;
    closingDay: string;
    dueDay: string;
    accountId: string;
    color: string;
}

interface CardWizardProps {
    accounts: Array<{ id: string; name: string }>;
    onComplete: (card: any) => Promise<void>;
    onCancel: () => void;
}

const COLORS = [
    '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

// Step 1: Type Selection
function TypeStep({ data, updateData, goNext }: any) {
    const types = [
        {
            value: 'credit',
            label: 'Crédito',
            icon: CreditCard,
            description: 'Cartão com fatura e limite'
        },
        {
            value: 'debit',
            label: 'Débito',
            icon: Wallet,
            description: 'Vinculado ao saldo da conta'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                ? "border-foreground bg-muted"
                                : "border-border hover:border-foreground/30"
                        )}
                    >
                        <Icon className="h-8 w-8" />
                        <div>
                            <h3 className="font-bold text-lg">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

// Step 2: Card Details
function DetailsStep({ data, updateData }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Cartão *</label>
                <Input
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                    placeholder="Ex: Nubank Black"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Últimos 4 dígitos</label>
                    <Input
                        value={data.lastDigits}
                        onChange={(e) => updateData({ lastDigits: e.target.value })}
                        placeholder="1234"
                        maxLength={4}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Bandeira</label>
                    <Input
                        value={data.brand}
                        onChange={(e) => updateData({ brand: e.target.value })}
                        placeholder="Ex: Mastercard"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Cor</label>
                <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => updateData({ color: c })}
                            className={cn(
                                "w-8 h-8 rounded-full transition-all",
                                data.color === c ? "ring-2 ring-foreground ring-offset-2" : "opacity-70 hover:opacity-100"
                            )}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Step 3: Limits (Credit only)
function LimitsStep({ data, updateData }: any) {
    if (data.type === 'debit') {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Cartões de débito não precisam de configuração de limite.</p>
                <p className="text-sm text-muted-foreground mt-2">Clique em Próximo para continuar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Limite Total</label>
                <Input
                    type="number"
                    value={data.limit}
                    onChange={(e) => updateData({ limit: e.target.value })}
                    placeholder="0,00"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Dia Fechamento</label>
                    <Input
                        type="number"
                        min="1"
                        max="31"
                        value={data.closingDay}
                        onChange={(e) => updateData({ closingDay: e.target.value })}
                        placeholder="DD"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Dia Vencimento</label>
                    <Input
                        type="number"
                        min="1"
                        max="31"
                        value={data.dueDay}
                        onChange={(e) => updateData({ dueDay: e.target.value })}
                        placeholder="DD"
                    />
                </div>
            </div>
        </div>
    );
}

// Step 4: Account
function AccountStep({ data, updateData, accounts }: any) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Conta Vinculada (Pagamento)</label>
                <p className="text-xs text-muted-foreground mb-2">
                    Selecione a conta de onde sairá o dinheiro para pagar a fatura
                </p>
                <select
                    value={data.accountId}
                    onChange={(e) => updateData({ accountId: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground"
                >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((acc: any) => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

// Step 5: Confirmation
function ConfirmationStep({ data, accounts }: any) {
    const account = accounts.find((a: any) => a.id === data.accountId);

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-xl bg-muted/30 border border-border space-y-4">
                <div
                    className="h-40 rounded-xl max-w-sm mx-auto p-6 flex flex-col justify-between text-white shadow-lg"
                    style={{ backgroundColor: data.color }}
                >
                    <div className="flex justify-between items-start">
                        <span className="font-bold text-lg">{data.name}</span>
                        <span className="text-xs opacity-80 uppercase">{data.brand}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm opacity-90 font-mono">
                            <span>••••</span>
                            <span>••••</span>
                            <span>••••</span>
                            <span>{data.lastDigits || '0000'}</span>
                        </div>
                        <div className="flex justify-between items-end text-xs opacity-80">
                            <span>{data.type === 'credit' ? 'CRÉDITO' : 'DÉBITO'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tipo</span>
                        <span className="font-medium capitalize">{data.type === 'credit' ? 'Crédito' : 'Débito'}</span>
                    </div>
                    {data.limit && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Limite</span>
                            <span className="font-medium">R$ {data.limit}</span>
                        </div>
                    )}
                    {account && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Conta Principal</span>
                            <span className="font-medium">{account.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CardWizard({ accounts, onComplete, onCancel }: CardWizardProps) {
    const initialData: CardData = {
        type: null,
        name: '',
        lastDigits: '',
        brand: '',
        limit: '',
        closingDay: '',
        dueDay: '',
        accountId: '',
        color: COLORS[0]
    };

    const steps: WizardStep<CardData>[] = [
        {
            id: 'type',
            title: 'Tipo de Cartão',
            component: TypeStep,
            validate: (data) => ({ isValid: !!data.type, error: 'Selecione o tipo' })
        },
        {
            id: 'details',
            title: 'Detalhes',
            component: DetailsStep,
            validate: (data) => ({ isValid: !!data.name && !!data.lastDigits, error: 'Informe nome e últimos dígitos' })
        },
        {
            id: 'limits',
            title: 'Limite e Datas',
            component: LimitsStep,
            validate: (data) => {
                if (data.type === 'debit') return { isValid: true };
                return {
                    isValid: !!data.limit && !!data.closingDay && !!data.dueDay,
                    error: 'Informe limite e datas de fechamento/vencimento'
                };
            }
        },
        {
            id: 'account',
            title: 'Conta Vinculada',
            component: (props) => <AccountStep {...props} accounts={accounts} />,
            validate: (data) => ({ isValid: !!data.accountId, error: 'Selecione uma conta' })
        },
        {
            id: 'confirmation',
            title: 'Confirmar',
            component: (props) => <ConfirmationStep {...props} accounts={accounts} />
        }
    ];

    const handleComplete = async (data: CardData) => {
        await onComplete({
            type: data.type!,
            name: data.name,
            last_digits: data.lastDigits,
            brand: data.brand || 'Card',
            limit_amount: data.limit ? parseFloat(data.limit) : null,
            closing_day: data.closingDay ? parseInt(data.closingDay) : null,
            due_day: data.dueDay ? parseInt(data.dueDay) : null,
            account_id: data.accountId,
            color: data.color
        });
    };

    return (
        <WizardBase
            title="Novo Cartão"
            steps={steps}
            initialData={initialData}
            onComplete={handleComplete}
            onCancel={onCancel}
        />
    );
}
