import { getDb } from '../client.js';

export async function getAreas() {
    const db = getDb();
    const lista = await db.select(
        'select * from areas_de_vida where ativa = 1 order by ordem asc'
    );
    return lista;
}
