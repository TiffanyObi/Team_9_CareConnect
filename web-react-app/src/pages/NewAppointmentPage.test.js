import { describe, expect, it } from 'vitest';
import { validateAppointment } from './NewAppointmentPage';

describe('appointment validation', () => {
  it('identifies every missing required field', () => {
    expect(validateAppointment({ provider: '', date: '', time: '', type: '' })).toEqual({
      provider: 'Select a provider.',
      date: 'Enter an appointment date.',
      time: 'Enter a start time.',
      type: 'Select a visit type.',
    });
  });

  it('accepts a complete future appointment', () => {
    expect(validateAppointment({ provider: 'Dr. Maya Chen', date: '2035-06-15', time: '10:30', type: 'Medication review' })).toEqual({});
  });
});
