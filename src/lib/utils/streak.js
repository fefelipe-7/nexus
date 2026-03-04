// src/lib/utils/streak.js

// calcula o streak dado o habito e seus registros ordenados por data desc
export function calcularStreakLocal(habito, registros, hoje) {
    const { frequencia_tipo, frequencia_alvo, graca_ativa } = habito;

    if (registros.length === 0) return 0;

    // para habitos diarios
    if (frequencia_tipo === 'diaria') {
        return calcularStreakDiario(registros, hoje, graca_ativa === 1);
    }

    // para habitos com periodo maior
    return calcularStreakPeriodico(frequencia_tipo, frequencia_alvo, registros, hoje, graca_ativa === 1);
}

function calcularStreakDiario(registros, hoje, comGraca) {
    // converte registros para um Set de datas concluidas
    const concluidos = new Set(
        registros.filter(r => r.concluido).map(r => r.data)
    );

    let streak = 0;
    let falhasNaSemana = 0;
    let dataAtual = parseISO(hoje);

    // verifica se hoje foi concluido ou ainda esta aberto
    const hojeConcluido = concluidos.has(hoje);
    const hojePassou = new Date().getHours() >= 23; // considera dia fechado apos 23h

    if (!hojeConcluido && !hojePassou) {
        // dia atual ainda em andamento — nao conta como falha ainda
        dataAtual = addDias(dataAtual, -1);
    } else if (!hojeConcluido && hojePassou) {
        // dia passou e nao foi concluido
        if (!comGraca) return 0;
        falhasNaSemana++;
        if (falhasNaSemana > 1) return 0;
        dataAtual = addDias(dataAtual, -1);
    }

    // retroage dia a dia
    while (true) {
        const iso = toISO(dataAtual);

        // reseta falhas ao iniciar nova semana (domingo)
        if (dataAtual.getDay() === 0) falhasNaSemana = 0;

        if (concluidos.has(iso)) {
            streak++;
        } else {
            if (!comGraca || falhasNaSemana >= 1) break;
            falhasNaSemana++;
            streak++;
        }

        dataAtual = addDias(dataAtual, -1);

        // para de voltar apos 365 dias
        const diff = parseISO(hoje) - dataAtual;
        if (diff > 365 * 86400000) break;
    }

    return streak;
}

function calcularStreakPeriodico(tipo, alvo, registros, hoje, comGraca) {
    // agrupa check-ins por periodo
    const checkinsPorPeriodo = agruparPorPeriodo(registros, tipo);
    const periodos = Object.keys(checkinsPorPeriodo).sort().reverse();

    if (periodos.length === 0) return 0;

    let streak = 0;
    let falhasPermitidas = comGraca && (tipo === 'semanal') ? 1 : 0;
    let falhasUsadas = 0;

    const periodoAtual = getPeriodoAtual(tipo, hoje);

    for (const periodo of periodos) {
        const count = checkinsPorPeriodo[periodo];

        // periodo atual ainda aberto — nao conta como falha
        if (periodo === periodoAtual) {
            if (count >= alvo) streak++;
            // se nao atingiu ainda, continua mas nao adiciona ao streak
            continue;
        }

        if (count >= alvo) {
            streak++;
        } else {
            if (falhasUsadas < falhasPermitidas) {
                falhasUsadas++;
                // conta como graca mas nao incrementa streak
            } else {
                break;
            }
        }
    }

    return streak;
}

function agruparPorPeriodo(registros, tipo) {
    const mapa = {};
    for (const r of registros) {
        if (!r.concluido) continue;
        const chave = getPeriodoDaData(tipo, r.data);
        mapa[chave] = (mapa[chave] ?? 0) + 1;
    }
    return mapa;
}

function getPeriodoDaData(tipo, iso) {
    const [ano, mes, dia] = iso.split('-').map(Number);

    switch (tipo) {
        case 'semanal': {
            const d = new Date(ano, mes - 1, dia);
            const domingo = new Date(d);
            domingo.setDate(d.getDate() - d.getDay());
            return toISO(domingo); // inicio da semana como chave
        }
        case 'mensal': return `${ano}-${String(mes).padStart(2, '0')}`;
        case 'trimestral': return `${ano}-T${Math.ceil(mes / 3)}`;
        case 'semestral': return `${ano}-S${mes <= 6 ? 1 : 2}`;
        case 'anual': return `${ano}`;
        default: return iso;
    }
}

function getPeriodoAtual(tipo, hoje) {
    return getPeriodoDaData(tipo, hoje);
}

// helpers de data
function parseISO(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function addDias(date, dias) {
    const d = new Date(date);
    d.setDate(d.getDate() + dias);
    return d;
}

function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
