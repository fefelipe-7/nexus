import { useState } from 'react';
import { Button, Input } from '@/ui/components/components/ui';
import { X } from 'lucide-react';
import type { Account, AccountType } from '@/modules/money/types/accounts.types';

interface AccountFormProps {
    account?: Account;
    onSubmit: (data: Omit<Account, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
    { value: 'checking', label: 'Conta Corrente' },
    { value: 'savings', label: 'Poupança' },
    { value: 'investment', label: 'Investimentos' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'credit', label: 'Crédito' }
];

const COLORS = [
    '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

const ICONS = ['💳', '🏦', '📈', '💵', '💰', '🪙', '💎', '🎯', '📊', '🔐'];

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
    const [name, setName] = useState(account?.name || '');
    const [type, setType] = useState<AccountType>(account?.type || 'checking');
    const [balance, setBalance] = useState(account?.balance?.toString() || '0');
    const [institution, setInstitution] = useState(account?.institution || '');
    const [color, setColor] = useState(account?.color || COLORS[0]);
    const [icon, setIcon] = useState(account?.icon || ICONS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Nome é obrigatório');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            await onSubmit({
                name: name.trim(),
                type,
                status: 'active',
                balance: parseFloat(balance) || 0,
                currency: 'BRL',
                institution: institution.trim() || undefined,
                color,
                icon
            });

            onCancel();
        } catch (err) {
            setError('Erro ao salvar conta. Tente novamente.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {account ? 'Editar Conta' : 'Nova Conta'}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome da Conta *</label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Conta Corrente Principal"
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Tipo *</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value as AccountType)}
                                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                                required
                            >
                                {ACCOUNT_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Balance */}
                        <div className="space-y-2">
                            <label htmlFor="balance" className="text-sm font-medium">Saldo Inicial</label>
                            <Input
                                id="balance"
                                type="number"
                                step="0.01"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        {/* Institution */}
                        <div className="space-y-2">
                            <label htmlFor="institution" className="text-sm font-medium">Instituição (Opcional)</label>
                            <Input
                                id="institution"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                placeholder="Ex: Nubank, Banco Inter"
                            />
                        </div>

                        {/* Color */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cor</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-10 h-10 rounded-lg transition-all ${color === c ? 'ring-2 ring-foreground ring-offset-2' : ''
                                            }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ícone</label>
                            <div className="flex gap-2 flex-wrap">
                                {ICONS.map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setIcon(i)}
                                        className={`w-12 h-12 text-2xl rounded-lg border transition-all ${icon === i ? 'border-foreground bg-muted' : 'border-border'
                                            }`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-rose-600">{error}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
