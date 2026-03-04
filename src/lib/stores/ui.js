// src/lib/stores/ui.js — versao fase 2
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal = writable(null); // null | 'novaTarefa' | 'editarTarefa' | 'novoEvento' | 'editarEvento'
export const tarefaEditando = writable(null);
export const eventoEditando = writable(null);
export const metaEditando = writable(null); // novo
export const habitoEditando = writable(null); // novo
export const painelVisivel = writable(true);
// pode ser ocultado pelo usuario
