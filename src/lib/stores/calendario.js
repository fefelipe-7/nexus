import { writable } from 'svelte/store';
import { getEventosDoIntervalo, getProximosEventos } from '$lib/db/queries/eventos.js';
import { getIntervalo, hoje } from '$lib/utils/dates.js';

export const eventos = writable([]);
export const proximosEventos = writable([]);
export const carregandoEventos = writable(false);

// view do calendario: 'semana' ou 'mes'
export const viewCalendario = writable('semana');

// data de referencia do calendario (navegar entre semanas/meses)
export const dataReferencia = writable(hoje());

export async function carregarEventos(dataRef, view) {
    carregandoEventos.set(true);
    try {
        const tab = view === 'semana' ? 'semana' : 'mes';
        const { inicio, fim } = getIntervalo(tab, dataRef);
        const lista = await getEventosDoIntervalo(inicio, fim);
        eventos.set(lista);
    } finally {
        carregandoEventos.set(false);
    }
}

export async function carregarProximosEventos() {
    const lista = await getProximosEventos(8);
    proximosEventos.set(lista);
}
