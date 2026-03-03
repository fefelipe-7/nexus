// src/lib/stores/ui.js — versao fase 2
import { writable } from 'svelte/store';

export const sidebarCollapsed = writable(false);
export const activeModal = writable(null); // null | 'novaTarefa' | 'editarTarefa'
export const tarefaEditando = writable(null); // objeto da tarefa sendo editada, ou null
