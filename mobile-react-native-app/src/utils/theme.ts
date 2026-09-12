export const colors = { background: '#F5F8FC', surface: '#FFFFFF', text: '#10233F', secondaryText: '#40536D', primary: '#082B5F', teal: '#0B7F79', accent: '#2F6FED', success: '#19733C', emergency: '#8D153A', border: '#D6E0EB', safety: '#EAF2FF', warning: '#FFF8E6' };
export const darkColors = { ...colors, background: '#101A26', surface: '#182536', text: '#E8EEF7', secondaryText: '#AFC1D6', border: '#34465C' };
export const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
