// src/lib/stores/tarefas.js
import { writable } from 'svelte/store';
import {
    getTarefasDoDia,
    getTarefasDoIntervalo,
    getTarefasAtrasadas,
    getEstatisticasDoDia,
} from '$lib/db/queries/tarefas.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

export const tarefas = writable([]);
export const tarefasAtrasadas = writable([]);
export const estatisticasDia = writable(null);
export const carregando = writable(false);

// carrega tarefas com base na tab temporal ativa
export async function carregarTarefas(tab) {
    carregando.set(true);
    try {
        const h = hoje();
        const { inicio, fim } = getIntervalo(tab, h);

        if (tab === 'dia') {
            const [lista, atrasadas, stats] = await Promise.all([
                getTarefasDoDia(h),
                getTarefasAtrasadas(h),
                getEstatisticasDoDia(h),
            ]);
            tarefas.set(lista);
            tarefasAtrasadas.set(atrasadas);
            estatisticasDia.set(stats);
        } else {
            const lista = await getTarefasDoIntervalo(inicio, fim);
            tarefas.set(lista);
            tarefasAtrasadas.set([]);
            estatisticasDia.set(null);
        }
    } finally {
        carregando.set(false);
    }
}
