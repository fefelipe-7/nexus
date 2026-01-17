import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@nexus/shared';
import { getAllModules } from '@/config/modules.config';
import { ChevronRight, X } from 'lucide-react';

interface ModuleSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModuleSheet({ isOpen, onClose }: ModuleSheetProps) {
    const location = useLocation();
    const modules = getAllModules();
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    // Find current module based on path
    const currentModule = modules.find(m =>
        location.pathname === m.path || location.pathname.startsWith(m.path + '/')
    );

    const isModuleActive = (modulePath: string) => {
        return location.pathname === modulePath || location.pathname.startsWith(modulePath + '/');
    };

    const isSubmoduleActive = (submodulePath: string) => {
        return location.pathname === submodulePath;
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                <div className="bg-background rounded-t-2xl border-t shadow-xl max-h-[80vh] flex flex-col">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pb-3 border-b">
                        <h2 className="text-lg font-semibold">Navegação</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modules List */}
                    <nav className="flex-1 overflow-y-auto py-2 px-2">
                        {modules.map((module) => {
                            const isActive = isModuleActive(module.path);
                            const isExpanded = expandedModule === module.id || (isActive && !expandedModule);
                            const Icon = module.icon;

                            return (
                                <div key={module.id} className="mb-1">
                                    {/* Module Header */}
                                    <div
                                        className={cn(
                                            'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
                                            isActive
                                                ? 'bg-primary/10'
                                                : 'active:bg-accent'
                                        )}
                                    >
                                        <Link
                                            to={module.path}
                                            onClick={onClose}
                                            className="flex items-center gap-3 flex-1 min-w-0"
                                        >
                                            <div className={cn(
                                                'p-2 rounded-lg transition-colors',
                                                isActive
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-muted text-muted-foreground'
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    'text-sm font-medium truncate',
                                                    isActive && 'text-primary'
                                                )}>
                                                    {module.name}
                                                </p>
                                                {module.submodules.length > 0 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {module.submodules.length} seções
                                                    </p>
                                                )}
                                            </div>
                                        </Link>

                                        {module.submodules.length > 0 && (
                                            <button
                                                onClick={() => toggleModule(module.id)}
                                                className="p-2 hover:bg-accent rounded-lg transition-all"
                                                aria-label={isExpanded ? 'Recolher' : 'Expandir'}
                                            >
                                                <ChevronRight
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-200',
                                                        isExpanded && 'rotate-90'
                                                    )}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Submodules */}
                                    {isExpanded && module.submodules.length > 0 && (
                                        <div className="pl-6 mt-1 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                                            {module.submodules.map((submodule) => {
                                                const SubIcon = submodule.icon || Icon;
                                                const isSubActive = isSubmoduleActive(submodule.path);

                                                return (
                                                    <Link
                                                        key={submodule.id}
                                                        to={submodule.path}
                                                        onClick={onClose}
                                                        className={cn(
                                                            'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all',
                                                            isSubActive
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'text-muted-foreground active:bg-accent'
                                                        )}
                                                    >
                                                        <SubIcon className="h-4 w-4" />
                                                        <span className="text-sm">{submodule.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Current Location Footer */}
                    {currentModule && (
                        <div className="border-t px-4 py-3 bg-muted/30">
                            <p className="text-xs text-muted-foreground">
                                Você está em: <span className="font-medium text-foreground">{currentModule.name}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
