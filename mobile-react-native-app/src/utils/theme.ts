export const colors = {
  background: '#F5F8FC', surface: '#FFFFFF', text: '#10233F', secondaryText: '#40536D',
  primary: '#082B5F', teal: '#0B7F79', accent: '#2F6FED', success: '#19733C',
  emergency: '#8D153A', border: '#7D91A8', safety: '#EAF2FF', warning: '#FFF8E6',
};
export const darkColors = {
  ...colors, background: '#101A26', surface: '#182536', text: '#E8EEF7',
  secondaryText: '#AFC1D6', primary: '#9FC5FF', teal: '#66D4C8',
  border: '#73859B', safety: '#21374D', warning: '#40361E',
};
export const formatTime = (date: string | Date): string => new Date(date).toLocaleString([], {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});
export function localDay(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
