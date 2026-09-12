export const colors = {
  background: '#F5F8FC', surface: '#FFFFFF', text: '#10233F', secondaryText: '#40536D',
  primary: '#082B5F', teal: '#0B7F79', accent: '#2F6FED', success: '#19733C',
  emergency: '#8D153A', border: '#A9B9CA', safety: '#EAF2FF', warning: '#FFF8E6',
  successSurface: '#EAF7EE', focus: '#F4C95D',
};
export type AppColors = typeof colors;
export const darkColors: AppColors = {
  ...colors, background: '#101A26', surface: '#182536', text: '#E8EEF7',
  secondaryText: '#AFC1D6', primary: '#7DA7F7', teal: '#70D5CF', accent: '#9AB8FF',
  border: '#647991', safety: '#D9E7FF', warning: '#F6E8BE', successSurface: '#D8F0DF',
};
export const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
export const formatCurrentDate = (date: Date): string => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
export const formatDateTime = (date: Date): string => date.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
export const isSameLocalDay = (left: Date, right: Date): boolean => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
