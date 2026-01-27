import { Button } from '@/ui/components/components/ui';
import { Calendar, Plus } from 'lucide-react';

interface EmptySubscriptionsProps {
    onAddSubscription: () => void;
}

export function EmptySubscriptions({ onAddSubscription }: EmptySubscriptionsProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <Calendar className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Assinaturas Recorrentes
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Mantenha o controle de todos os seus serviços de assinatura, streamings e pagamentos recorrentes.
            </p>

            <Button onClick={onAddSubscription} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Assinatura
            </Button>
        </div>
    );
}
