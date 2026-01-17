import type { PatrimonyData, PatrimonyAsset, PatrimonyLiability, PatrimonySummary, PatrimonyHistory } from '../types/patrimony.types';

const assets: PatrimonyAsset[] = [
    {
        id: '1',
        name: 'Conta Corrente Nubank',
        type: 'cash',
        currentValue: 8500,
        lastUpdated: new Date(2026, 0, 17),
        linkedModuleId: 'accounts',
    },
    {
        id: '2',
        name: 'Conta Corrente Itaú',
        type: 'cash',
        currentValue: 3200,
        lastUpdated: new Date(2026, 0, 17),
        linkedModuleId: 'accounts',
    },
    {
        id: '3',
        name: 'Reserva de Emergência',
        type: 'cash',
        currentValue: 27850,
        lastUpdated: new Date(2026, 0, 17),
        description: 'Tesouro Selic - liquidez imediata',
        linkedModuleId: 'investments',
    },
    {
        id: '4',
        name: 'Carteira de Investimentos',
        type: 'investments',
        currentValue: 157130,
        lastUpdated: new Date(2026, 0, 17),
        description: 'Ações, fundos, cripto, previdência',
        linkedModuleId: 'investments',
    },
    {
        id: '5',
        name: 'Apartamento',
        type: 'property',
        currentValue: 450000,
        lastUpdated: new Date(2025, 11, 1),
        description: 'Moradia atual - financiado',
    },
    {
        id: '6',
        name: 'Honda Civic 2023',
        type: 'vehicle',
        currentValue: 95000,
        lastUpdated: new Date(2025, 11, 15),
        description: 'Veículo principal - financiado',
    },
    {
        id: '7',
        name: 'Equipamentos de Trabalho',
        type: 'other_assets',
        currentValue: 25000,
        lastUpdated: new Date(2025, 10, 1),
        description: 'MacBook, monitores, acessórios',
    },
];

const liabilities: PatrimonyLiability[] = [
    {
        id: '1',
        name: 'Financiamento Apartamento',
        type: 'debts',
        currentValue: 280000,
        lastUpdated: new Date(2026, 0, 15),
        description: 'Saldo devedor Caixa',
        linkedModuleId: 'debts',
    },
    {
        id: '2',
        name: 'Financiamento Carro',
        type: 'debts',
        currentValue: 62500,
        lastUpdated: new Date(2026, 0, 10),
        description: 'Saldo devedor Santander',
        linkedModuleId: 'debts',
    },
    {
        id: '3',
        name: 'Empréstimo Pessoal',
        type: 'debts',
        currentValue: 18200,
        lastUpdated: new Date(2026, 0, 10),
        linkedModuleId: 'debts',
    },
    {
        id: '4',
        name: 'Cheque Especial',
        type: 'debts',
        currentValue: 2800,
        lastUpdated: new Date(2026, 0, 17),
        linkedModuleId: 'debts',
    },
    {
        id: '5',
        name: 'Parcelamentos Cartão',
        type: 'installments',
        currentValue: 31681,
        lastUpdated: new Date(2026, 0, 17),
        description: 'iPhone, MacBook, Geladeira, etc',
        linkedModuleId: 'debts',
    },
];

// Calculate totals
const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
const totalLiabilities = liabilities.reduce((sum, l) => sum + l.currentValue, 0);
const netWorth = totalAssets - totalLiabilities;

// Composition
const composition = {
    assets: {
        cash: assets.filter(a => a.type === 'cash').reduce((s, a) => s + a.currentValue, 0),
        investments: assets.filter(a => a.type === 'investments').reduce((s, a) => s + a.currentValue, 0),
        property: assets.filter(a => a.type === 'property').reduce((s, a) => s + a.currentValue, 0),
        vehicle: assets.filter(a => a.type === 'vehicle').reduce((s, a) => s + a.currentValue, 0),
        other: assets.filter(a => a.type === 'other_assets').reduce((s, a) => s + a.currentValue, 0),
    },
    liabilities: {
        debts: liabilities.filter(l => l.type === 'debts').reduce((s, l) => s + l.currentValue, 0),
        installments: liabilities.filter(l => l.type === 'installments').reduce((s, l) => s + l.currentValue, 0),
        obligations: liabilities.filter(l => l.type === 'obligations').reduce((s, l) => s + l.currentValue, 0),
    },
};

// History
const history: PatrimonyHistory[] = [
    { date: new Date(2025, 6, 1), netWorth: 320000, assets: 680000, liabilities: 360000 },
    { date: new Date(2025, 7, 1), netWorth: 328000, assets: 695000, liabilities: 367000 },
    { date: new Date(2025, 8, 1), netWorth: 335000, assets: 710000, liabilities: 375000 },
    { date: new Date(2025, 9, 1), netWorth: 348000, assets: 725000, liabilities: 377000 },
    { date: new Date(2025, 10, 1), netWorth: 358000, assets: 740000, liabilities: 382000 },
    { date: new Date(2025, 11, 1), netWorth: 365000, assets: 755000, liabilities: 390000 },
    { date: new Date(2026, 0, 1), netWorth: netWorth, assets: totalAssets, liabilities: totalLiabilities },
];

const previousMonthNetWorth = history[history.length - 2]?.netWorth || netWorth;
const variation = {
    amount: netWorth - previousMonthNetWorth,
    percentage: ((netWorth - previousMonthNetWorth) / previousMonthNetWorth) * 100,
    period: 'month' as const,
};

const summary: PatrimonySummary = {
    netWorth,
    totalAssets,
    totalLiabilities,
    variation,
    composition,
    lastUpdated: new Date(2026, 0, 17),
};

export const mockPatrimonyData: PatrimonyData = {
    summary,
    assets,
    liabilities,
    history,
};
