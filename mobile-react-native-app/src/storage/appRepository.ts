import { Account, Appointment, CareMessage, DoseLog, HealthLog, Settings, UserData } from '../types/models';
import { appointments, medications, messages } from '../utils/data';
import { localDay } from '../utils/theme';
import { PasswordHasher, PasswordRecord } from './passwords';
import { KeyValueStore } from './sqlite';

export const safeSettings: Settings = { theme: 'system', textScale: 1, reducedMotion: true, staticAlerts: true, hapticReminders: false, largeTouchTargets: true };
export const initialData = (): UserData => ({ version: 1, settings: { ...safeSettings }, doses: [], logs: [], appointments: [...appointments], messages: [...messages] });
type StoredAccount = Account & PasswordRecord;
function validEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalized) || normalized.length > 254) throw new Error('Enter a valid email address.');
  return normalized;
}
function required(value: string, label: string, max: number): string {
  const result = value.trim();
  if (!result || result.length > max) throw new Error(label + ' is required and must be ' + max + ' characters or fewer.');
  return result;
}
export function validateSettings(value: Settings): Settings {
  if (!value || !['light', 'dark', 'system'].includes(value.theme) || !Number.isFinite(value.textScale) || value.textScale < 1 || value.textScale > 2 ||
    ['reducedMotion', 'staticAlerts', 'hapticReminders', 'largeTouchTargets'].some(key => typeof value[key as keyof Settings] !== 'boolean')) {
    throw new Error('Saved settings could not be read. Your existing data has not been replaced.');
  }
  return { ...value };
}
const text = (value: unknown): value is string => typeof value === 'string';
const timestamp = (value: unknown): boolean => text(value) && Number.isFinite(Date.parse(value));
export function parseUserData(raw: string): UserData {
  const value = JSON.parse(raw) as UserData;
  if (!value || value.version !== 1 || !Array.isArray(value.doses) || !Array.isArray(value.logs) || !Array.isArray(value.appointments) || !Array.isArray(value.messages) ||
    !value.doses.every((x: DoseLog) => x && text(x.id) && text(x.medicationId) && text(x.scheduledTime) && text(x.date) && timestamp(x.takenAt)) ||
    !value.logs.every((x: HealthLog) => x && text(x.id) && text(x.symptom) && text(x.notes) && timestamp(x.recordedAt)) ||
    !value.appointments.every((x: Appointment) => x && text(x.id) && text(x.title) && text(x.dateAndTime) && text(x.location)) ||
    !value.messages.every((x: CareMessage) => x && text(x.id) && text(x.subject) && text(x.body) && text(x.sender))) {
    throw new Error('Saved data could not be read. Your existing data has not been replaced.');
  }
  return { ...value, settings: validateSettings(value.settings) };
}

export class AppRepository {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private store: KeyValueStore, private hasher: PasswordHasher, private now: () => Date = () => new Date()) {}
  // Serialize writes so rapid taps cannot overwrite another completed operation.
  private exclusive<T>(work: () => Promise<T>): Promise<T> {
    const result = this.queue.then(work);
    this.queue = result.catch(() => undefined);
    return result;
  }
  private async accounts(): Promise<StoredAccount[]> {
    const raw = await this.store.get('accounts-v1');
    if (!raw) return [];
    const accounts = JSON.parse(raw) as StoredAccount[];
    if (!Array.isArray(accounts) || !accounts.every(x => x && text(x.email) && text(x.fullName) && /^[a-f0-9]{32}$/.test(x.salt) && /^[a-f0-9]{64}$/.test(x.hash))) {
      throw new Error('Saved accounts could not be read. No account data was changed.');
    }
    return accounts;
  }
  async register(fullName: string, email: string, password: string): Promise<Account> {
    const account = { fullName: required(fullName, 'Full name', 100), email: validEmail(email) };
    if (password.length < 8 || password.length > 128) throw new Error('Use a password with 8 to 128 characters.');
    return this.exclusive(async () => {
      const accounts = await this.accounts();
      if (accounts.some(x => x.email === account.email)) throw new Error('An account with this email already exists.');
      const hash = await this.hasher.create(password);
      await this.store.set('accounts-v1', JSON.stringify([...accounts, { ...account, ...hash }]));
      return account;
    });
  }
  async authenticate(email: string, password: string): Promise<Account> {
    const key = validEmail(email);
    if (!password || password.length > 128) throw new Error('Enter your password.');
    await this.queue;
    const account = (await this.accounts()).find(x => x.email === key);
    if (!account || !await this.hasher.verify(password, account)) throw new Error('Email or password is incorrect.');
    return { email: account.email, fullName: account.fullName };
  }
  async load(email: string): Promise<UserData> {
    const raw = await this.store.get('user-v1:' + validEmail(email));
    return raw ? parseUserData(raw) : initialData();
  }
  private update(email: string, change: (data: UserData) => UserData): Promise<UserData> {
    return this.exclusive(async () => {
      const next = change(await this.load(email));
      await this.store.set('user-v1:' + validEmail(email), JSON.stringify(next));
      return next;
    });
  }
  saveSettings(email: string, settings: Settings): Promise<UserData> {
    const checked = validateSettings(settings);
    return this.update(email, data => ({ ...data, settings: checked }));
  }
  markDose(email: string, medicationId: string, scheduledTime: string): Promise<UserData> {
    if (!medications.find(x => x.id === medicationId)?.doses.includes(scheduledTime)) return Promise.reject(new Error('Choose a scheduled dose.'));
    return this.update(email, data => {
      const now = this.now(); const date = localDay(now);
      const id = medicationId + ':' + date + ':' + scheduledTime;
      if (data.doses.some(x => x.id === id)) throw new Error('This dose is already logged for today.');
      return { ...data, doses: [{ id, medicationId, scheduledTime, date, takenAt: now.toISOString() }, ...data.doses] };
    });
  }
  addLog(email: string, symptom: string, notes: string): Promise<UserData> {
    const cleaned = required(symptom, 'Symptom', 120);
    if (notes.length > 2000) return Promise.reject(new Error('Keep notes to 2,000 characters or fewer.'));
    return this.update(email, data => {
      const recordedAt = this.now().toISOString();
      return { ...data, logs: [{ id: recordedAt + ':' + data.logs.length, symptom: cleaned, notes: notes.trim(), recordedAt }, ...data.logs] };
    });
  }
  addAppointment(email: string, title: string, dateAndTime: string, location: string): Promise<UserData> {
    const cleaned = required(title, 'Appointment name', 120);
    // Require an unambiguous local date and time, and reject normalized dates such as February 30.
    const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(dateAndTime.trim());
    const date = new Date(dateAndTime.trim().replace(' ', 'T'));
    if (!match || !Number.isFinite(date.getTime()) || localDay(date) !== dateAndTime.trim().slice(0, 10) || date.getHours() !== Number(match[4]) || date.getMinutes() !== Number(match[5]) || date <= this.now()) {
      return Promise.reject(new Error('Enter a future local date and time as YYYY-MM-DD HH:mm.'));
    }
    const place = required(location, 'Location', 200);
    return this.update(email, data => ({ ...data, appointments: [...data.appointments, { id: this.now().toISOString() + ':' + data.appointments.length, title: cleaned, dateAndTime: date.toISOString(), location: place }] }));
  }
  addMessage(email: string, subject: string, body: string): Promise<UserData> {
    const cleanSubject = required(subject, 'Subject', 120); const cleanBody = required(body, 'Message', 2000);
    return this.update(email, data => {
      const createdAt = this.now().toISOString();
      return { ...data, messages: [{ id: createdAt + ':' + data.messages.length, sender: 'You • local draft', subject: cleanSubject, body: cleanBody, createdAt, localOnly: true }, ...data.messages] };
    });
  }
}
