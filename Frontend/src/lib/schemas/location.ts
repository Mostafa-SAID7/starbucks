import { z } from 'zod';
import { LocalizedTextSchema, CoordinatesSchema } from './common';

/**
 * Store location and branch validation schemas
 */

export const OperatingHoursSchema = z.object({
  open: z.string(),
  close: z.string(),
});

export const LocationSchema = z.object({
  id: z.string().optional(),
  name: z.union([z.string(), LocalizedTextSchema]),
  address: z.union([z.string(), LocalizedTextSchema]).optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
  slug: z.string().optional(),
  count: z.number().optional(),
  coordinates: CoordinatesSchema.optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  operatingHours: z.record(z.string(), OperatingHoursSchema).optional(),
  hours: z.record(z.string(), z.string()).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  hasWifi: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasDriveThru: z.boolean().optional(),
  isWheelchairAccessible: z.boolean().optional(),
});

export type Location = z.infer<typeof LocationSchema>;
export type OperatingHours = z.infer<typeof OperatingHoursSchema>;
