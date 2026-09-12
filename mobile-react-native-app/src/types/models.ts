export type Settings = {
  theme: 'light' | 'dark' | 'system';
  textScale: number;
  reducedMotion: boolean;
  staticAlerts: boolean;
  hapticReminders: boolean;
  largeTouchTargets: boolean;
};
export type Medication = { id: string; name: string; dosage: string; schedule: string; instructions: string; doses: string[] };
export type Appointment = { id: string; title: string; dateAndTime: string; location: string };
export type CareMessage = { id: string; sender: string; subject: string; body: string; createdAt?: string; localOnly?: boolean };
export type HealthLog = { id: string; symptom: string; notes: string; recordedAt: string };
export type DoseLog = { id: string; medicationId: string; scheduledTime: string; date: string; takenAt: string };
export type Account = { email: string; fullName: string };
export type UserData = { version: 1; settings: Settings; doses: DoseLog[]; logs: HealthLog[]; appointments: Appointment[]; messages: CareMessage[] };
