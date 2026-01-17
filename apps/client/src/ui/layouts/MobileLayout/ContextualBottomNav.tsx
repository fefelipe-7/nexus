import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { Home, LayoutDashboard, ChevronUp } from 'lucide-react';
import { getAllModules } from '@/config/modules.config';
import { useState } from 'react';

export function ContextualBottomNav() {
    const location = useLocation();
    const modules = getAllModules();
    const [showSubmodules, setShowSubmodules] = useState(false);

    // Find current module
    const currentModule = modules.find(m =>
        location.pathname === m.path || location.pathname.startsWith(m.path + '/')
    );

    const isHome = location.pathname === '/';
    const isInModule = currentModule && location.pathname !== '/';

    // Get quick access submodules (first 3)
    const quickSubmodules = currentModule?.submodules.slice(0, 3) || [];
    const hasMoreSubmodules = (currentModule?.submodules.length || 0) > 3;

    const isPathActive = (path: string) => {
        return location.pathname === path;
    };

    // Home/Overview mode
    if (!isInModule || isHome) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    <Link
                        to="/"
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[72px]',
                            isHome ? 'text-primary' : 'text-muted-foreground active:scale-95'
                        )}
                    >
                        <Home className={cn('h-5 w-5', isHome && 'scale-110')} />
                        <span className={cn('text-xs', isHome ? 'font-semibold' : 'font-medium')}>Início</span>
                    </Link>

                    <Link
                        to="/overview"
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[72px]',
                            isPathActive('/overview') ? 'text-primary' : 'text-muted-foreground active:scale-95'
                        )}
                    >
                        <LayoutDashboard className={cn('h-5 w-5', isPathActive('/overview') && 'scale-110')} />
                        <span className={cn('text-xs', isPathActive('/overview') ? 'font-semibold' : 'font-medium')}>Visão Geral</span>
                    </Link>

                    {/* Quick access to 2 most used modules */}
                    {modules.slice(1, 3).map((module) => {
                        const Icon = module.icon;
                        const isActive = location.pathname.startsWith(module.path);

                        return (
                            <Link
                                key={module.id}
                                to={module.path}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[72px]',
                                    isActive ? 'text-primary' : 'text-muted-foreground active:scale-95'
                                )}
                            >
                                <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
                                <span className={cn(
                                    'text-xs truncate max-w-[60px]',
                                    isActive ? 'font-semibold' : 'font-medium'
                                )}>
                                    {module.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        );
    }

    // Inside a module - show contextual navigation
    const ModuleIcon = currentModule.icon;

    return (
        <>
            {/* Submodules Sheet */}
            {showSubmodules && currentModule.submodules.length > 0 && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setShowSubmodules(false)}
                    />
                    <div className="fixed inset-x-0 bottom-16 z-50 p-4 animate-in slide-in-from-bottom duration-200">
                        <div className="bg-background rounded-2xl border shadow-xl overflow-hidden">
                            <div className="p-3 border-b">
                                <p className="text-sm font-medium">{currentModule.name}</p>
                                <p className="text-xs text-muted-foreground">Todas as seções</p>
                            </div>
                            <div className="max-h-[40vh] overflow-y-auto p-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {currentModule.submodules.map((sub) => {
                                        const SubIcon = sub.icon || ModuleIcon;
                                        const isActive = isPathActive(sub.path);

                                        return (
                                            <Link
                                                key={sub.id}
                                                to={sub.path}
                                                onClick={() => setShowSubmodules(false)}
                                                className={cn(
                                                    'flex items-center gap-2 p-3 rounded-xl transition-all',
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted/50 active:bg-accent'
                                                )}
                                            >
                                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                                <span className="text-xs font-medium truncate">{sub.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t safe-area-bottom">
                <div className="flex items-center h-16 px-2">
                    {/* Module indicator */}
                    <Link
                        to={currentModule.path}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[64px]',
                            isPathActive(currentModule.path) ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        <ModuleIcon className="h-5 w-5" />
                        <span className="text-[10px] font-medium truncate max-w-[56px]">
                            {currentModule.name}
                        </span>
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-8 bg-border mx-1" />

                    {/* Quick submodules */}
                    <div className="flex-1 flex items-center justify-around">
                        {quickSubmodules.map((sub) => {
                            const SubIcon = sub.icon || ModuleIcon;
                            const isActive = isPathActive(sub.path);

                            return (
                                <Link
                                    key={sub.id}
                                    to={sub.path}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all min-w-[56px]',
                                        isActive ? 'text-primary' : 'text-muted-foreground active:scale-95'
                                    )}
                                >
                                    <SubIcon className={cn('h-4 w-4', isActive && 'scale-110')} />
                                    <span className={cn(
                                        'text-[10px] truncate max-w-[52px]',
                                        isActive ? 'font-semibold' : 'font-medium'
                                    )}>
                                        {sub.name.split(' ')[0]}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* More button */}
                    {hasMoreSubmodules && (
                        <button
                            onClick={() => setShowSubmodules(!showSubmodules)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px]',
                                showSubmodules ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                            )}
                        >
                            <ChevronUp className={cn(
                                'h-4 w-4 transition-transform',
                                showSubmodules && 'rotate-180'
                            )} />
                            <span className="text-[10px] font-medium">Mais</span>
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
}
