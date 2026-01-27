import { Construction } from 'lucide-react';

export function Purchases() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="mb-6 p-6 rounded-full bg-muted/30">
                <Construction className="h-16 w-16 text-muted-foreground/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
                Planejamento de Compras
            </h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Este módulo está sendo preparado para você gerenciar suas listas de compras e desejos.
                Em breve disponível.
            </p>
        </div>
    );
}
