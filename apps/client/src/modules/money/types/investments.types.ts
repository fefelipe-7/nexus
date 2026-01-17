export type AssetClass = 'fixed_income' | 'stocks' | 'funds' | 'crypto' | 'retirement' | 'real_estate' | 'other';
export type RiskLevel = 'low' | 'medium' | 'high';
export type LiquidityType = 'immediate' | 'short_term' | 'medium_term' | 'long_term';

export interface Asset {
    id: string;
    name: string;
    ticker?: string;
    assetClass: AssetClass;
    institution: string;
    investedAmount: number;
    currentValue: number;
    profitability: number;
    profitabilityPercentage: number;
    riskLevel: RiskLevel;
    liquidity: LiquidityType;
    applicationDate: Date;
    maturityDate?: Date;
    isStrategic: boolean;
    linkedGoalId?: string;
    notes?: string;
    history?: Array<{
        date: Date;
        value: number;
    }>;
}

export interface InvestmentGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    linkedAssets: string[];
    icon: string;
    color: string;
}

export interface AllocationByClass {
    assetClass: AssetClass;
    totalValue: number;
    percentage: number;
    count: number;
}

export interface AllocationByInstitution {
    institution: string;
    totalValue: number;
    percentage: number;
}

export interface InvestmentsSummary {
    totalInvested: number;
    currentValue: number;
    totalProfitability: number;
    totalProfitabilityPercentage: number;
    monthlyProfitability: number;
    monthlyProfitabilityPercentage: number;
    yearlyProfitability: number;
    yearlyProfitabilityPercentage: number;
    globalRiskLevel: RiskLevel;
    assetsCount: number;
    allocationByClass: AllocationByClass[];
    allocationByInstitution: AllocationByInstitution[];
    liquidityDistribution: {
        immediate: number;
        shortTerm: number;
        mediumTerm: number;
        longTerm: number;
    };
}

export interface InvestmentsData {
    summary: InvestmentsSummary;
    assets: Asset[];
    goals: InvestmentGoal[];
}

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
    fixed_income: 'Renda Fixa',
    stocks: 'Ações',
    funds: 'Fundos',
    crypto: 'Criptoativos',
    retirement: 'Previdência',
    real_estate: 'Imobiliário',
    other: 'Outros',
};

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
    fixed_income: '#10b981',
    stocks: '#3b82f6',
    funds: '#8b5cf6',
    crypto: '#f59e0b',
    retirement: '#6366f1',
    real_estate: '#ec4899',
    other: '#6b7280',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
};

export const LIQUIDITY_LABELS: Record<LiquidityType, string> = {
    immediate: 'Imediata',
    short_term: 'Curto prazo',
    medium_term: 'Médio prazo',
    long_term: 'Longo prazo',
};
