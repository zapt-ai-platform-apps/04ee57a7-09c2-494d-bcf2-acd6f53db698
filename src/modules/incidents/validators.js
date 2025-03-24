import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

export const incidentSchema = z.object({
  id: z.number(),
  type: z.enum(['FIRE', 'MEDICAL', 'POLICE']),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  status: z.enum(['ACTIVE', 'PENDING', 'RESOLVED']),
  location: z.string(),
  createdAt: z.date(),
  description: z.string(),
  assignedUnits: z.array(z.string())
});

export const validateIncident = createValidator(incidentSchema, 'Incident');

export const incidentListSchema = z.array(incidentSchema);
export const validateIncidentList = createValidator(incidentListSchema, 'IncidentList');