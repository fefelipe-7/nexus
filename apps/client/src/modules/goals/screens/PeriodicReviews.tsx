import { useState } from 'react';
import { ReviewsHeader } from '../components/mobile/ReviewsHeader';
import { ReviewAgenda } from '../components/mobile/ReviewAgenda';
import { ReviewHistory } from '../components/mobile/ReviewHistory';
import { ReviewFlow } from '../components/mobile/ReviewFlow';
import { mockReviewsData } from '../data/mockReviewsData';
import { PeriodicReview, ReviewType } from '../types/reviews.types';
import { Button } from '@/ui/components/components/ui';
import { Compass, Sparkles } from 'lucide-react';

export function PeriodicReviews() {
    const [isFlowActive, setIsFlowActive] = useState(false);
    const [selectedReview, setSelectedReview] = useState<PeriodicReview | null>(null);

    const startReview = (type: ReviewType = 'weekly') => {
        setIsFlowActive(true);
    };

    if (isFlowActive) {
        return (
            <ReviewFlow
                type="weekly"
                onCancel={() => setIsFlowActive(false)}
                onComplete={() => setIsFlowActive(false)}
            />
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
            <ReviewsHeader
                onNewReview={() => startReview()}
                onViewHistory={() => { }}
            />

            <section className="space-y-12">
                <ReviewAgenda agenda={mockReviewsData.agenda} />

                <div className="pt-4 border-t border-border/40">
                    <ReviewHistory
                        history={mockReviewsData.history}
                        onSelect={setSelectedReview}
                    />
                </div>
            </section>

            {/* Philosophy Placeholder */}
            <section className="pt-8 text-center space-y-6">
                <div className="inline-flex p-3 rounded-2xl bg-muted/30 border border-border/40">
                    <Compass className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="max-w-[280px] mx-auto space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic px-4">
                        "A revisão periódica não é sobre o que você fez, mas sobre quem você está se tornando através do que faz."
                    </p>
                </div>
            </section>
        </div>
    );
}
