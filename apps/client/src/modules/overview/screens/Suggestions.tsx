import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/ui/components/components/ui';
import { Lightbulb, CheckCircle2, Clock, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Suggestions() {
  const navigate = useNavigate();
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const suggestions = [
    {
      id: 1,
      type: 'organizational',
      message: 'Quer transformar esses registros em um projeto?',
      reason: 'Você tem 5 registros relacionados ao mesmo tema que poderiam ser organizados como um projeto',
      action: {
        label: 'Criar Projeto',
        callback: () => navigate('/projects/personal')
      }
    },
    {
      id: 2,
      type: 'preventive',
      message: 'Você costuma esquecer essa conta. Quer ativar alerta?',
      reason: 'Histórico mostra que você esqueceu dessa fatura 2 vezes nos últimos 6 meses',
      action: {
        label: 'Ativar Alerta',
        callback: () => navigate('/money/accounts')
      }
    },
    {
      id: 3,
      type: 'optimization',
      message: 'Se dormir 30min mais cedo, seu padrão melhora.',
      reason: 'Análise de dados mostra correlação entre sono mais cedo e melhor produtividade',
      action: {
        label: 'Ajustar Rotina',
        callback: () => navigate('/health/sleep')
      }
    }
  ];

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'organizational':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'preventive':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'optimization':
        return 'border-green-500/30 bg-green-500/5';
      case 'reflective':
        return 'border-purple-500/30 bg-purple-500/5';
      default:
        return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getSuggestionBadgeColor = (type: string) => {
    switch (type) {
      case 'organizational':
        return 'bg-blue-500/20 text-blue-700';
      case 'preventive':
        return 'bg-amber-500/20 text-amber-700';
      case 'optimization':
        return 'bg-green-500/20 text-green-700';
      case 'reflective':
        return 'bg-purple-500/20 text-purple-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'organizational':
        return '📋 Organização';
      case 'preventive':
        return '🛡️ Prevenção';
      case 'optimization':
        return '⚡ Otimização';
      case 'reflective':
        return '🤔 Reflexão';
      default:
        return '💡 Sugestão';
    }
  };

  const visibleSuggestions = suggestions.filter(s => !dismissedSuggestions.includes(s.id.toString()));

  const handleDismiss = (id: string) => {
    setDismissedSuggestions([...dismissedSuggestions, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sugestões Inteligentes</h1>
        <p className="text-muted-foreground mt-2">Onde o Nexus começa a parecer "vivo"</p>
      </div>

      {visibleSuggestions.length === 0 ? (
        <Card className="bg-blue-500/5 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-blue-500 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-foreground">Nenhuma sugestão no momento</p>
              <p className="text-sm text-muted-foreground mt-1">Você está fazendo tudo certo!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className={`cursor-pointer hover:shadow-md transition-all ${getSuggestionColor(suggestion.type)}`}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg h-fit ${getSuggestionBadgeColor(suggestion.type)}`}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{suggestion.message}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getSuggestionBadgeColor(suggestion.type)}`}>
                            {getSuggestionLabel(suggestion.type)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{suggestion.reason}</p>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            onClick={suggestion.action.callback}
                            className="gap-2"
                          >
                            {suggestion.action.label}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDismiss(suggestion.id.toString())}
                          >
                            Descartar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-purple-500/5 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Como Funcionam as Sugestões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">📋 <span className="font-semibold">Organização</span></p>
            <p className="text-sm text-muted-foreground">Estruture dados existentes de forma mais eficiente</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">🛡️ <span className="font-semibold">Prevenção</span></p>
            <p className="text-sm text-muted-foreground">Evite problemas futuros com base em padrões</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">⚡ <span className="font-semibold">Otimização</span></p>
            <p className="text-sm text-muted-foreground">Melhore seus padrões e hábitos</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">🤔 <span className="font-semibold">Reflexão</span></p>
            <p className="text-sm text-muted-foreground">Revise e reflita sobre sua vida</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/5 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Controle de Frequência</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            As sugestões aparecem com moderação para não virar ruído. Você pode descartar qualquer uma delas.
          </p>
          <p className="text-xs text-muted-foreground">
            Dica: Quanto mais você interage com as sugestões, mais personalizadas elas ficam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
