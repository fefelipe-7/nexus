// src/lib/stores/metas.js
import { writable } from 'svelte/store';
import { getMetas, getMetaComSubmetas } from '$lib/db/queries/metas.js';

export const metas = writable([]);
export const metaAtiva = writable(null); // meta aberta no detalhe
export const carregandoMetas = writable(false);

export async function carregarMetas(filtros = {}) {
    carregandoMetas.set(true);
    try {
        const lista = await getMetas(filtros);
        metas.set(lista);
    } finally {
        carregandoMetas.set(false);
    }
}

export async function abrirMeta(id) {
    const meta = await getMetaComSubmetas(id);
    metaAtiva.set(meta);
}
