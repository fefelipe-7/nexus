export type AssetType = 'cash' | 'investments' | 'property' | 'vehicle' | 'other_assets';
export type LiabilityType = 'debts' | 'installments' | 'obligations';

export interface PatrimonyAsset {
    id: string;
    name: string;
    type: AssetType;
    currentValue: number;
    lastUpdated: Date;
    description?: string;
    linkedModuleId?: string;
}

export interface PatrimonyLiability {
    id: string;
    name: string;
    type: LiabilityType;
    currentValue: number;
    lastUpdated: Date;
    description?: string;
    linkedModuleId?: string;
}

export interface PatrimonyComposition {
    assets: {
        cash: number;
        investments: number;
        property: number;
        vehicle: number;
        other: number;
    };
    liabilities: {
        debts: number;
        installments: number;
        obligations: number;
    };
}

export interface PatrimonyHistory {
    date: Date;
    netWorth: number;
    assets: number;
    liabilities: number;
    note?: string;
}

export interface PatrimonySummary {
    netWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    variation: {
        amount: number;
        percentage: number;
        period: 'month' | 'year';
    };
    composition: PatrimonyComposition;
    lastUpdated: Date;
}

export interface PatrimonyData {
    summary: PatrimonySummary;
    assets: PatrimonyAsset[];
    liabilities: PatrimonyLiability[];
    history: PatrimonyHistory[];
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
    cash: 'Caixa e Equivalentes',
    investments: 'Investimentos',
    property: 'Imóveis',
    vehicle: 'Veículos',
    other_assets: 'Outros Ativos',
};

export const ASSET_TYPE_COLORS: Record<AssetType, string> = {
    cash: '#10b981',
    investments: '#3b82f6',
    property: '#8b5cf6',
    vehicle: '#f59e0b',
    other_assets: '#6b7280',
};

export const LIABILITY_TYPE_LABELS: Record<LiabilityType, string> = {
    debts: 'Dívidas',
    installments: 'Parcelamentos',
    obligations: 'Obrigações',
};

export const LIABILITY_TYPE_COLORS: Record<LiabilityType, string> = {
    debts: '#ef4444',
    installments: '#f97316',
    obligations: '#ec4899',
};
