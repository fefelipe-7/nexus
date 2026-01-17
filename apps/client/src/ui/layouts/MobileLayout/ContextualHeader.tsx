import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Grid3x3 } from 'lucide-react';
import { ThemeSelector } from '@/ui/components/components/ThemeSelector';
import { getAllModules } from '@/config/modules.config';
import { cn } from '@nexus/shared';
import logoNexus from '@/assets/logo-nexus.png';

interface ContextualHeaderProps {
    onOpenNavigation: () => void;
}

export function ContextualHeader({ onOpenNavigation }: ContextualHeaderProps) {
    const location = useLocation();
    const modules = getAllModules();

    // Parse current location
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isHome = location.pathname === '/';

    // Find current module and submodule
    const currentModule = modules.find(m =>
        location.pathname === m.path || location.pathname.startsWith(m.path + '/')
    );

    const currentSubmodule = currentModule?.submodules.find(s =>
        location.pathname === s.path
    );

    // Determine what to show
    const showBackButton = pathSegments.length > 0;
    const backPath = currentSubmodule
        ? currentModule?.path
        : '/';

    const title = isHome
        ? 'Início'
        : currentSubmodule
            ? currentSubmodule.name
            : currentModule?.name || 'Nexus';

    const subtitle = currentSubmodule
        ? currentModule?.name
        : undefined;

    const CurrentIcon = currentSubmodule?.icon || currentModule?.icon;

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
            <div className="flex h-14 items-center gap-3 px-4">
                {/* Back / Logo */}
                {showBackButton ? (
                    <Link
                        to={backPath || '/'}
                        className="p-2 -ml-2 hover:bg-accent rounded-lg transition-colors active:scale-95"
                        aria-label="Voltar"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoNexus} alt="Nexus" className="h-7 w-7" />
                    </Link>
                )}

                {/* Title Section */}
                <div className="flex-1 min-w-0">
                    {isHome ? (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Nexus
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 min-w-0">
                            {CurrentIcon && (
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    currentModule && `bg-${currentModule.color}-500/10`
                                )}>
                                    <CurrentIcon className={cn(
                                        "h-4 w-4",
                                        currentModule && `text-${currentModule.color}-600`
                                    )} />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate leading-tight">{title}</p>
                                {subtitle && (
                                    <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <ThemeSelector />
                    <button
                        onClick={onOpenNavigation}
                        className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95"
                        aria-label="Menu de navegação"
                    >
                        <Grid3x3 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
