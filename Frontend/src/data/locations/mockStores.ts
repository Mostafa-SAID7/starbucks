import type { Location } from '@/types';

export const mockStores: Location[] = [
  {
    id: '1',
    name: 'Downtown Store',
    address: '123 Main St, Downtown',
    city: 'Cairo',
    phone: '+20-1234567890',
    hours: {
      Monday: '09:00-22:00',
      Tuesday: '09:00-22:00',
      Wednesday: '09:00-22:00',
      Thursday: '09:00-22:00',
      Friday: '09:00-22:00',
      Saturday: '09:00-22:00',
      Sunday: '09:00-22:00'
    },
    latitude: 30.0444,
    longitude: 31.2357
  },
  {
    id: '2',
    name: 'Mall Store',
    address: '456 Mall Ave, Shopping Center',
    city: 'Cairo',
    phone: '+20-0987654321',
    hours: {
      Monday: '10:00-23:00',
      Tuesday: '10:00-23:00',
      Wednesday: '10:00-23:00',
      Thursday: '10:00-23:00',
      Friday: '10:00-23:00',
      Saturday: '10:00-23:00',
      Sunday: '10:00-23:00'
    },
    latitude: 30.0555,
    longitude: 31.2468
  }
];
