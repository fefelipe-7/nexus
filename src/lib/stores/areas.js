import { writable } from 'svelte/store';
import { getAreas } from '$lib/db/queries/areas.js';

export const areas = writable([]);

export async function carregarAreas() {
    const lista = await getAreas();
    areas.set(lista);
    return lista;
}
