import { Appointment, CareMessage, Medication } from '../types/models';
export const medications: Medication[] = [
  { id: 'levetiracetam', name: 'Levetiracetam', dosage: '500 mg', schedule: '8:00 AM and 8:00 PM', doses: ['08:00', '20:00'], instructions: 'Take with water.' },
  { id: 'vitamin-d3', name: 'Vitamin D3', dosage: '1,000 IU', schedule: 'With breakfast', doses: ['08:00'], instructions: 'Take with food.' },
];
export const appointments: Appointment[] = [
  { id: 'physical-therapy', title: 'Physical therapy', dateAndTime: 'Sample visit • 3:30 PM', location: 'Northside Clinic • Room 204' },
  { id: 'neurology', title: 'Neurology follow-up', dateAndTime: 'Sample visit • 10:00 AM', location: 'Video visit' },
];
export const messages: CareMessage[] = [
  { id: 'maya', sender: 'Maya Johnson', subject: 'Checking in', body: 'Hope your appointment went smoothly today. I am here if you need anything.' },
  { id: 'clinic', sender: 'Northside Clinic', subject: 'Appointment reminder', body: 'Please check your appointment details before your visit.' },
];
