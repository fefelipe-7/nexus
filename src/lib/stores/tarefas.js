// src/lib/stores/tarefas.js
import { writable } from 'svelte/store';
import {
    getTarefasDoDia,
    getTarefasDoIntervalo,
    getTarefasAtrasadas,
    getEstatisticasDoDia,
    buscarTarefas,
} from '$lib/db/queries/tarefas.js';
import { hoje, getIntervalo } from '$lib/utils/dates.js';

export const tarefas = writable([]);
export const tarefasAtrasadas = writable([]);
export const tarefasSemData = writable([]);
export const estatisticasDia = writable(null);
export const carregando = writable(false);

// filtros ativos
export const filtroTexto = writable('');
export const filtroArea = writable(null);
export const filtroPrioridade = writable(null);
export const filtroStatus = writable(null);

export async function carregarTarefas(tab, filtros = {}) {
    carregando.set(true);
    try {
        const h = hoje();
        const { inicio, fim } = getIntervalo(tab, h);
        const temFiltro = filtros.texto || filtros.areaId || filtros.prioridade || filtros.status;

        if (temFiltro) {
            // com filtros ativos: busca global sem agrupar
            const resultado = await buscarTarefas({ ...filtros, dataInicio: inicio, dataFim: fim });
            tarefas.set(resultado.filter(t => t.data_prevista));
            tarefasSemData.set(resultado.filter(t => !t.data_prevista));
            tarefasAtrasadas.set([]);
            estatisticasDia.set(null);
            return;
        }

        if (tab === 'dia') {
            const [lista, atrasadas, stats, semData] = await Promise.all([
                getTarefasDoDia(h),
                getTarefasAtrasadas(h),
                getEstatisticasDoDia(h),
                buscarTarefas({ dataInicio: null, dataFim: null }),
            ]);
            tarefas.set(lista);
            tarefasAtrasadas.set(atrasadas);
            estatisticasDia.set(stats);
            tarefasSemData.set(semData.filter(t => !t.data_prevista));
        } else {
            const [lista, semData] = await Promise.all([
                getTarefasDoIntervalo(inicio, fim),
                buscarTarefas({ dataInicio: null, dataFim: null }),
            ]);
            tarefas.set(lista);
            tarefasAtrasadas.set([]);
            estatisticasDia.set(null);
            tarefasSemData.set(semData.filter(t => !t.data_prevista));
        }
    } finally {
        carregando.set(false);
    }
}
