import { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, Calendar, Tag, FileText, Plus } from 'lucide-react';
import { Button, Input } from '@/ui/components/components/ui';
import { cn } from '@nexus/shared';
import type { PaymentMethod, PurchaseType, PurchaseCategory } from '../../types/purchases.types';
import { PAYMENT_METHOD_LABELS, PURCHASE_TYPE_LABELS } from '../../types/purchases.types';

interface AddPurchaseSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (purchase: {
        description: string;
        amount: number;
        category?: string;
        paymentMethod: PaymentMethod;
        type: PurchaseType;
    }) => void;
    categories: PurchaseCategory[];
}

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string; icon: typeof CreditCard }> = [
    { value: 'credit_card', label: 'Crédito', icon: CreditCard },
    { value: 'debit_card', label: 'Débito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
    { value: 'cash', label: 'Dinheiro', icon: Banknote },
];

export function AddPurchaseSheet({ isOpen, onClose, onAdd, categories }: AddPurchaseSheetProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
    const [type, setType] = useState<PurchaseType>('purchase');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [step, setStep] = useState<'amount' | 'details'>('amount');

    if (!isOpen) return null;

    const handleAmountSubmit = () => {
        if (parseFloat(amount) > 0) {
            setStep('details');
        }
    };

    const handleSubmit = () => {
        if (!description || !amount) return;

        onAdd({
            description,
            amount: parseFloat(amount),
            category: selectedCategory || undefined,
            paymentMethod,
            type,
        });

        // Reset
        setDescription('');
        setAmount('');
        setPaymentMethod('credit_card');
        setType('purchase');
        setSelectedCategory(null);
        setStep('amount');
        onClose();
    };

    const formatDisplayAmount = (value: string) => {
        if (!value) return 'R$ 0,00';
        const num = parseFloat(value);
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(num);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pb-3 border-b">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Plus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Nova Compra</h2>
                                <p className="text-xs text-muted-foreground">
                                    {step === 'amount' ? 'Digite o valor' : 'Detalhes'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {step === 'amount' ? (
                            <div className="space-y-6">
                                {/* Amount Display */}
                                <div className="text-center py-8">
                                    <p className="text-4xl font-bold tracking-tight">
                                        {formatDisplayAmount(amount)}
                                    </p>
                                </div>

                                {/* Numpad */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                if (key === '⌫') {
                                                    setAmount(prev => prev.slice(0, -1));
                                                } else {
                                                    setAmount(prev => prev + key);
                                                }
                                            }}
                                            className="h-14 rounded-xl bg-muted hover:bg-accent text-lg font-semibold transition-all active:scale-95"
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    className="w-full h-12"
                                    onClick={handleAmountSubmit}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                >
                                    Continuar
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Amount Summary */}
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                    <span className="text-sm text-muted-foreground">Valor</span>
                                    <button
                                        onClick={() => setStep('amount')}
                                        className="text-lg font-bold text-primary"
                                    >
                                        {formatDisplayAmount(amount)}
                                    </button>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                        Descrição
                                    </label>
                                    <Input
                                        placeholder="Ex: Almoço, Supermercado..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="h-12"
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                        Forma de Pagamento
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {PAYMENT_OPTIONS.map(option => {
                                            const Icon = option.icon;
                                            const isActive = paymentMethod === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setPaymentMethod(option.value)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted hover:bg-accent"
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span className="text-[10px] font-medium">{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                        Categoria
                                    </label>
                                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all",
                                                    selectedCategory === cat.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted hover:bg-accent"
                                                )}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: selectedCategory === cat.id ? 'currentColor' : cat.color }}
                                                />
                                                <span className="text-xs font-medium">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <Button
                                    className="w-full h-12"
                                    onClick={handleSubmit}
                                    disabled={!description}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Registrar Compra
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
