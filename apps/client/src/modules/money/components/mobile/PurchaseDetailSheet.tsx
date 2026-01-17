import { useState } from 'react';
import { X, Edit2, Repeat, Split, Trash2, ExternalLink, CreditCard, Calendar, Tag, FileText } from 'lucide-react';
import { cn } from '@nexus/shared';
import { Button } from '@/ui/components/components/ui';
import type { Purchase } from '../../types/purchases.types';
import { PAYMENT_METHOD_LABELS, PURCHASE_TYPE_LABELS } from '../../types/purchases.types';

interface PurchaseDetailSheetProps {
  purchase: Purchase | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (purchase: Purchase) => void;
  onMarkRecurring?: (purchase: Purchase) => void;
  onSplit?: (purchase: Purchase) => void;
  onDelete?: (purchase: Purchase) => void;
}

export function PurchaseDetailSheet({ 
  purchase, 
  isOpen, 
  onClose,
  onEdit,
  onMarkRecurring,
  onSplit,
  onDelete,
}: PurchaseDetailSheetProps) {
  if (!isOpen || !purchase) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-4 pb-4 border-b">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: purchase.category?.color || '#6b7280' }}
                />
                <h2 className="text-lg font-semibold truncate">
                  {purchase.establishment || purchase.description}
                </h2>
              </div>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(purchase.amount)}
              </p>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Detalhes */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{formatDateTime(purchase.date)}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>{PAYMENT_METHOD_LABELS[purchase.paymentMethod]}</span>
                {purchase.installments && (
                  <span className="text-muted-foreground">
                    ({purchase.installments.current}/{purchase.installments.total}x)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{purchase.category?.name || 'Sem categoria'}</span>
                {!purchase.category && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    Categorizar
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{PURCHASE_TYPE_LABELS[purchase.type]}</span>
              </div>

              {purchase.notes && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm">{purchase.notes}</p>
                </div>
              )}

              {/* Vínculos */}
              {purchase.linkedTo && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Vinculado a</p>
                    <p className="text-sm font-medium truncate">{purchase.linkedTo.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-4 bg-muted/30">
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="ghost" 
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => onEdit?.(purchase)}
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-[10px]">Editar</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => onMarkRecurring?.(purchase)}
              >
                <Repeat className="h-4 w-4" />
                <span className="text-[10px]">Recorrente</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => onSplit?.(purchase)}
              >
                <Split className="h-4 w-4" />
                <span className="text-[10px]">Dividir</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex flex-col items-center gap-1 h-auto py-3 text-destructive hover:text-destructive"
                onClick={() => onDelete?.(purchase)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-[10px]">Excluir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
