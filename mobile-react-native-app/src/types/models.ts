export type Medication = { id: string; name: string; dosage: string; schedule: string; instructions: string };
export type Appointment = { id: string; title: string; dateAndTime: string; location: string };
export type CareMessage = { id: string; sender: string; subject: string; body: string };
export type HealthLog = { id: string; symptom: string; notes: string; recordedAt: Date };
export type Settings = { theme: 'light' | 'dark' | 'system'; textScale: number; reducedMotion: boolean; staticAlerts: boolean; hapticReminders: boolean; largeTouchTargets: boolean };
