// src/lib/stores/habitos.js
import { writable } from 'svelte/store';
import { getHabitosComStatusHoje, getHabitosComRegistros, calcularStreak } from '$lib/db/queries/habitos.js';

export const habitos = writable([]);
export const streaks = writable({}); // { habitoId: numero }
export const carregandoHabitos = writable(false);

export async function carregarHabitosHoje() {
    carregandoHabitos.set(true);
    try {
        const lista = await getHabitosComStatusHoje();
        habitos.set(lista);
        await atualizarStreaks(lista.map(h => h.id));
    } finally {
        carregandoHabitos.set(false);
    }
}

export async function carregarHabitosComRegistros(dataInicio, dataFim) {
    carregandoHabitos.set(true);
    try {
        const lista = await getHabitosComRegistros(dataInicio, dataFim);
        habitos.set(lista);
        await atualizarStreaks(lista.map(h => h.id));
    } finally {
        carregandoHabitos.set(false);
    }
}

async function atualizarStreaks(ids) {
    const mapa = {};
    await Promise.all(ids.map(async id => {
        mapa[id] = await calcularStreak(id);
    }));
    streaks.set(mapa);
}
