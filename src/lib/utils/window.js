// src/lib/utils/window.js
import { getCurrentWindow } from '@tauri-apps/api/window';
import { primaryMonitor } from '@tauri-apps/api/window';
import { getDb } from '$lib/db/client.js';

const CHAVES = {
    width: 'window_width',
    height: 'window_height',
    x: 'window_x',
    y: 'window_y',
    maximized: 'window_maximized',
};

// calcula o tamanho padrao baseado no monitor
async function calcularTamanhopadrao() {
    try {
        const monitor = await primaryMonitor();
        if (!monitor) return { width: 1280, height: 800 };

        const { width: mw, height: mh } = monitor.size;

        const width = Math.min(Math.max(Math.round(mw * 0.75), 900), 1440);
        const height = Math.min(Math.max(Math.round(mh * 0.85), 600), 960);

        return { width, height };
    } catch {
        return { width: 1280, height: 800 };
    }
}

// lê os valores salvos do banco
async function lerEstadoSalvo() {
    const db = getDb();
    try {
        const rows = await db.select(
            `select chave, valor from config where chave in (?, ?, ?, ?, ?)`,
            Object.values(CHAVES)
        );
        const mapa = {};
        for (const row of rows) mapa[row.chave] = row.valor;
        return mapa;
    } catch {
        return {};
    }
}

// salva o estado atual no banco
async function salvarEstado(campos) {
    const db = getDb();
    for (const [chave, valor] of Object.entries(campos)) {
        await db.execute(
            `update config set valor = ?, updated_at = datetime('now') where chave = ?`,
            [String(valor), chave]
        );
    }
}

// aplica o estado salvo (ou padrao) na janela
// chamado uma vez no onMount do App.svelte
export async function restaurarJanela() {
    const win = getCurrentWindow();
    const salvo = await lerEstadoSalvo();
    const padrao = await calcularTamanhopadrao();

    const w = parseInt(salvo[CHAVES.width]) || padrao.width;
    const h = parseInt(salvo[CHAVES.height]) || padrao.height;
    const maximized = salvo[CHAVES.maximized] === '1';

    if (maximized) {
        await win.maximize();
        await win.show();
        return;
    }

    // valida se as dimensoes salvas fazem sentido
    const widthValido = w >= 900 && w <= 3840;
    const heightValido = h >= 600 && h <= 2160;

    const finalW = widthValido ? w : padrao.width;
    const finalH = heightValido ? h : padrao.height;

    await win.setSize({ type: 'Physical', width: finalW, height: finalH });

    // posicao
    const x = parseInt(salvo[CHAVES.x]);
    const y = parseInt(salvo[CHAVES.y]);
    const posicaoValida = !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0;

    if (posicaoValida) {
        await win.setPosition({ type: 'Physical', x, y });
    } else {
        await win.center();
    }

    await win.show();
}

// inicia o listener que persiste mudancas
// chamado uma vez no onMount do App.svelte, apos restaurarJanela
export async function iniciarPersistenciaJanela() {
    const win = getCurrentWindow();

    let debounceTimer = null;

    async function persistir() {
        try {
            const maximized = await win.isMaximized();

            if (maximized) {
                await salvarEstado({ [CHAVES.maximized]: '1' });
                return;
            }

            const { width, height } = await win.innerSize();
            const { x, y } = await win.outerPosition();

            await salvarEstado({
                [CHAVES.width]: width,
                [CHAVES.height]: height,
                [CHAVES.x]: x,
                [CHAVES.y]: y,
                [CHAVES.maximized]: '0',
            });
        } catch {
            // silencioso — nao travar o app por falha de persistencia
        }
    }

    function agendarPersistencia() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(persistir, 500); // debounce 500ms
    }

    // escuta redimensionamento e movimento
    await win.onResized(agendarPersistencia);
    await win.onMoved(agendarPersistencia);
}
