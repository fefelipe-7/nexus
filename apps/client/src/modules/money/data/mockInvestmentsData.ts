import type { InvestmentsData, Asset, InvestmentGoal, InvestmentsSummary, AllocationByClass, AllocationByInstitution } from '../types/investments.types';

const assets: Asset[] = [
    {
        id: '1',
        name: 'Tesouro Selic 2029',
        assetClass: 'fixed_income',
        institution: 'XP Investimentos',
        investedAmount: 25000,
        currentValue: 27850,
        profitability: 2850,
        profitabilityPercentage: 11.4,
        riskLevel: 'low',
        liquidity: 'immediate',
        applicationDate: new Date(2023, 2, 15),
        maturityDate: new Date(2029, 2, 1),
        isStrategic: true,
        linkedGoalId: 'emergency',
        notes: 'Reserva de emergência',
    },
    {
        id: '2',
        name: 'CDB Banco Inter 120%',
        assetClass: 'fixed_income',
        institution: 'Inter',
        investedAmount: 15000,
        currentValue: 16250,
        profitability: 1250,
        profitabilityPercentage: 8.33,
        riskLevel: 'low',
        liquidity: 'short_term',
        applicationDate: new Date(2024, 0, 10),
        maturityDate: new Date(2026, 0, 10),
        isStrategic: false,
    },
    {
        id: '3',
        name: 'PETR4',
        ticker: 'PETR4',
        assetClass: 'stocks',
        institution: 'Clear',
        investedAmount: 12000,
        currentValue: 14580,
        profitability: 2580,
        profitabilityPercentage: 21.5,
        riskLevel: 'high',
        liquidity: 'immediate',
        applicationDate: new Date(2024, 3, 20),
        isStrategic: false,
    },
    {
        id: '4',
        name: 'IVVB11',
        ticker: 'IVVB11',
        assetClass: 'stocks',
        institution: 'Clear',
        investedAmount: 20000,
        currentValue: 23400,
        profitability: 3400,
        profitabilityPercentage: 17,
        riskLevel: 'medium',
        liquidity: 'immediate',
        applicationDate: new Date(2023, 8, 5),
        isStrategic: true,
        linkedGoalId: 'retirement',
        notes: 'ETF S&P 500',
    },
    {
        id: '5',
        name: 'Fundo Alaska Black',
        assetClass: 'funds',
        institution: 'XP Investimentos',
        investedAmount: 10000,
        currentValue: 11200,
        profitability: 1200,
        profitabilityPercentage: 12,
        riskLevel: 'high',
        liquidity: 'short_term',
        applicationDate: new Date(2024, 5, 1),
        isStrategic: false,
    },
    {
        id: '6',
        name: 'Bitcoin',
        ticker: 'BTC',
        assetClass: 'crypto',
        institution: 'Binance',
        investedAmount: 8000,
        currentValue: 15200,
        profitability: 7200,
        profitabilityPercentage: 90,
        riskLevel: 'high',
        liquidity: 'immediate',
        applicationDate: new Date(2023, 10, 15),
        isStrategic: false,
        notes: 'HODLing',
    },
    {
        id: '7',
        name: 'Ethereum',
        ticker: 'ETH',
        assetClass: 'crypto',
        institution: 'Binance',
        investedAmount: 5000,
        currentValue: 7800,
        profitability: 2800,
        profitabilityPercentage: 56,
        riskLevel: 'high',
        liquidity: 'immediate',
        applicationDate: new Date(2024, 1, 20),
        isStrategic: false,
    },
    {
        id: '8',
        name: 'Previdência PGBL',
        assetClass: 'retirement',
        institution: 'Itaú',
        investedAmount: 35000,
        currentValue: 38500,
        profitability: 3500,
        profitabilityPercentage: 10,
        riskLevel: 'medium',
        liquidity: 'long_term',
        applicationDate: new Date(2020, 5, 1),
        isStrategic: true,
        linkedGoalId: 'retirement',
        notes: 'Aportes mensais de R$ 500',
    },
    {
        id: '9',
        name: 'LCI Caixa',
        assetClass: 'fixed_income',
        institution: 'Caixa',
        investedAmount: 20000,
        currentValue: 21800,
        profitability: 1800,
        profitabilityPercentage: 9,
        riskLevel: 'low',
        liquidity: 'medium_term',
        applicationDate: new Date(2024, 6, 15),
        maturityDate: new Date(2026, 6, 15),
        isStrategic: false,
    },
    {
        id: '10',
        name: 'FII HGLG11',
        ticker: 'HGLG11',
        assetClass: 'real_estate',
        institution: 'Clear',
        investedAmount: 8000,
        currentValue: 8400,
        profitability: 400,
        profitabilityPercentage: 5,
        riskLevel: 'medium',
        liquidity: 'immediate',
        applicationDate: new Date(2024, 9, 1),
        isStrategic: false,
        notes: 'Dividendos mensais ~0.8%',
    },
];

const goals: InvestmentGoal[] = [
    {
        id: 'emergency',
        name: 'Reserva de Emergência',
        targetAmount: 30000,
        currentAmount: 27850,
        linkedAssets: ['1'],
        icon: '🛡️',
        color: '#10b981',
    },
    {
        id: 'retirement',
        name: 'Aposentadoria',
        targetAmount: 1000000,
        currentAmount: 61900,
        deadline: new Date(2050, 0, 1),
        linkedAssets: ['4', '8'],
        icon: '🏖️',
        color: '#6366f1',
    },
    {
        id: 'travel',
        name: 'Viagem Europa',
        targetAmount: 25000,
        currentAmount: 0,
        deadline: new Date(2027, 6, 1),
        linkedAssets: [],
        icon: '✈️',
        color: '#8b5cf6',
    },
    {
        id: 'property',
        name: 'Entrada Apartamento',
        targetAmount: 150000,
        currentAmount: 16250,
        deadline: new Date(2028, 0, 1),
        linkedAssets: ['2'],
        icon: '🏠',
        color: '#ec4899',
    },
];

// Calculate totals
const totalInvested = assets.reduce((sum, a) => sum + a.investedAmount, 0);
const currentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
const totalProfitability = currentValue - totalInvested;
const totalProfitabilityPercentage = (totalProfitability / totalInvested) * 100;

// Allocation by class
const allocationByClass: AllocationByClass[] = [
    { assetClass: 'fixed_income', totalValue: 0, percentage: 0, count: 0 },
    { assetClass: 'stocks', totalValue: 0, percentage: 0, count: 0 },
    { assetClass: 'funds', totalValue: 0, percentage: 0, count: 0 },
    { assetClass: 'crypto', totalValue: 0, percentage: 0, count: 0 },
    { assetClass: 'retirement', totalValue: 0, percentage: 0, count: 0 },
    { assetClass: 'real_estate', totalValue: 0, percentage: 0, count: 0 },
];

assets.forEach(a => {
    const alloc = allocationByClass.find(ac => ac.assetClass === a.assetClass);
    if (alloc) {
        alloc.totalValue += a.currentValue;
        alloc.count++;
    }
});

allocationByClass.forEach(a => {
    a.percentage = (a.totalValue / currentValue) * 100;
});

// Allocation by institution
const institutionMap: Record<string, number> = {};
assets.forEach(a => {
    institutionMap[a.institution] = (institutionMap[a.institution] || 0) + a.currentValue;
});

const allocationByInstitution: AllocationByInstitution[] = Object.entries(institutionMap).map(([institution, totalValue]) => ({
    institution,
    totalValue,
    percentage: (totalValue / currentValue) * 100,
}));

// Liquidity distribution
const liquidityDistribution = {
    immediate: assets.filter(a => a.liquidity === 'immediate').reduce((s, a) => s + a.currentValue, 0),
    shortTerm: assets.filter(a => a.liquidity === 'short_term').reduce((s, a) => s + a.currentValue, 0),
    mediumTerm: assets.filter(a => a.liquidity === 'medium_term').reduce((s, a) => s + a.currentValue, 0),
    longTerm: assets.filter(a => a.liquidity === 'long_term').reduce((s, a) => s + a.currentValue, 0),
};

const summary: InvestmentsSummary = {
    totalInvested,
    currentValue,
    totalProfitability,
    totalProfitabilityPercentage,
    monthlyProfitability: 2850,
    monthlyProfitabilityPercentage: 1.54,
    yearlyProfitability: 18500,
    yearlyProfitabilityPercentage: 11.2,
    globalRiskLevel: 'medium',
    assetsCount: assets.length,
    allocationByClass: allocationByClass.filter(a => a.count > 0),
    allocationByInstitution,
    liquidityDistribution,
};

export const mockInvestmentsData: InvestmentsData = {
    summary,
    assets,
    goals,
};
