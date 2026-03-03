import { getDb } from '../client.js';
import { areas } from '$lib/stores/areas.js';

export async function carregarAreas() {
    const db = getDb();
    const lista = await db.select(
        'select * from areas_de_vida where ativa = 1 order by ordem asc'
    );
    areas.set(lista);
    return lista;
}
