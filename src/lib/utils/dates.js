// src/lib/utils/dates.js

// retorna hoje no formato ISO 'YYYY-MM-DD'
export function hoje() {
    return new Date().toISOString().slice(0, 10);
}

// formata uma data ISO para exibicao
// ex: '2026-03-01' -> 'domingo, 1 de marco'
export function formatarData(iso, opcoes = {}) {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-').map(Number);
    const d = new Date(ano, mes - 1, dia);

    if (opcoes.curto) {
        return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    }
    return d.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
}

// retorna o label amigavel para uma data em relacao a hoje
// ex: 'hoje', 'amanha', 'ontem', '15 de marco'
export function labelRelativo(iso) {
    if (!iso) return '';
    const h = hoje();
    if (iso === h) return 'hoje';

    const [ah, mh, dh] = h.split('-').map(Number);
    const [ai, mi, di] = iso.split('-').map(Number);
    const diffMs = new Date(ai, mi - 1, di) - new Date(ah, mh - 1, dh);
    const diffDias = Math.round(diffMs / 86400000);

    if (diffDias === 1) return 'amanha';
    if (diffDias === -1) return 'ontem';
    if (diffDias > 1 && diffDias <= 6) {
        return new Date(ai, mi - 1, di).toLocaleDateString('pt-BR', { weekday: 'long' });
    }
    return formatarData(iso, { curto: true });
}

// retorna o intervalo ISO de datas para cada tab temporal
// base: data ISO de referencia (geralmente hoje)
export function getIntervalo(tab, base) {
    const [ano, mes, dia] = base.split('-').map(Number);
    const ref = new Date(ano, mes - 1, dia);

    switch (tab) {
        case 'dia':
            return { inicio: base, fim: base };

        case 'semana': {
            const diaSemana = ref.getDay(); // 0 = domingo
            const inicioSemana = new Date(ref);
            inicioSemana.setDate(ref.getDate() - diaSemana);
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            return {
                inicio: toISO(inicioSemana),
                fim: toISO(fimSemana)
            };
        }

        case 'mes': {
            const inicioMes = new Date(ano, mes - 1, 1);
            const fimMes = new Date(ano, mes, 0);
            return {
                inicio: toISO(inicioMes),
                fim: toISO(fimMes)
            };
        }

        case 'trimestre': {
            const trimestre = Math.floor((mes - 1) / 3);
            const inicioTrim = new Date(ano, trimestre * 3, 1);
            const fimTrim = new Date(ano, trimestre * 3 + 3, 0);
            return {
                inicio: toISO(inicioTrim),
                fim: toISO(fimTrim)
            };
        }

        case 'semestre': {
            const semestre = mes <= 6 ? 0 : 1;
            const inicioSem = new Date(ano, semestre * 6, 1);
            const fimSem = new Date(ano, semestre * 6 + 6, 0);
            return {
                inicio: toISO(inicioSem),
                fim: toISO(fimSem)
            };
        }

        case 'ano':
            return {
                inicio: `${ano}-01-01`,
                fim: `${ano}-12-31`
            };

        default:
            return { inicio: base, fim: base };
    }
}

// retorna o titulo do periodo para exibicao no dashboard
export function tituloPeriodo(tab, base) {
    const [ano, mes] = base.split('-').map(Number);
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    switch (tab) {
        case 'dia': return formatarData(base);
        case 'semana': return `semana de ${formatarData(base, { curto: true })}`;
        case 'mes': return `${meses[mes - 1]} de ${ano}`;
        case 'trimestre': return `${Math.floor((mes - 1) / 3) + 1}o trimestre de ${ano}`;
        case 'semestre': return `${mes <= 6 ? '1o' : '2o'} semestre de ${ano}`;
        case 'ano': return `${ano}`;
        default: return '';
    }
}

// helper interno
function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// retorna a saudacao correta baseada na hora atual
export function saudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return 'bom dia';
    if (hora < 18) return 'boa tarde';
    return 'boa noite';
}
