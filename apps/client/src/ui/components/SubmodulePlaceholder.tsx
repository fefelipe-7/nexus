import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@nexus/ui';

interface SubmodulePlaceholderProps {
  title: string;
  description?: string;
  moduleName: string;
}

export function SubmodulePlaceholder({ title, description, moduleName }: SubmodulePlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-4 rounded-full bg-muted">
          <Construction className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground max-w-md">{description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Este submódulo de <span className="font-semibold">{moduleName}</span> está em desenvolvimento.
          </p>
        </div>
      </div>
    </div>
  );
}
