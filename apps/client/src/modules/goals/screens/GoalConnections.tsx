import { ConnectionsHeader } from '../components/mobile/ConnectionsHeader';
import { ConnectionMacroView } from '../components/mobile/ConnectionMacroView';
import { GoalHabitLinks } from '../components/mobile/GoalHabitLinks';
import { GoalProjectLinks } from '../components/mobile/GoalProjectLinks';
import { CoherenceDiagnostic } from '../components/mobile/CoherenceDiagnostic';
import { mockConnectionsData } from '../data/mockConnectionsData';
import { Network } from 'lucide-react';

export function GoalConnections() {
    return (
        <div className="p-4 sm:p-6 space-y-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <ConnectionsHeader onFilterClick={() => { }} />

            <ConnectionMacroView metrics={mockConnectionsData.metrics} />

            <section className="pt-4 border-t border-border/40">
                <CoherenceDiagnostic issues={mockConnectionsData.diagnostics} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <GoalHabitLinks connections={mockConnectionsData.connections} />
            </section>

            <section className="pt-4 border-t border-border/40">
                <GoalProjectLinks connections={mockConnectionsData.connections} />
            </section>

            {/* Philosophy Footer */}
            <footer className="pt-12 text-center space-y-6">
                <div className="inline-flex p-3 rounded-2xl bg-muted/30 border border-border/40">
                    <Network className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="max-w-[280px] mx-auto space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic px-4">
                        "Objetivos sem hábitos são apenas intenções; hábitos sem objetivos são apenas rotina. A conexão é que gera o sistema."
                    </p>
                </div>
            </footer>
        </div>
    );
}
