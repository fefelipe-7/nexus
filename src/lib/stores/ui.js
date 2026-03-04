// src/lib/stores/ui.js — versao fase 2
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal = writable(null); // null | 'novaTarefa' | 'editarTarefa' | 'novoEvento' | 'editarEvento'
export const tarefaEditando = writable(null); // objeto da tarefa sendo editada, ou null

export const painelVisivel = writable(true); // pode ser ocultado pelo usuario
export const eventoEditando = writable(null); // objeto do evento sendo editado, ou null
