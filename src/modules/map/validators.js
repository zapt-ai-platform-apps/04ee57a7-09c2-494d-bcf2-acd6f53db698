import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';

export const coordinatesSchema = z.tuple([z.number(), z.number()]);

export const mapIncidentSchema = z.object({
  id: z.number(),
  type: z.enum(['FIRE', 'MEDICAL', 'POLICE']),
  coordinates: coordinatesSchema,
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  title: z.string()
});

export const validateMapIncident = createValidator(mapIncidentSchema, 'MapIncident');

export const mapResourceSchema = z.object({
  id: z.number(),
  type: z.enum(['FIRE_TRUCK', 'AMBULANCE', 'POLICE_CAR', 'HELICOPTER']),
  coordinates: coordinatesSchema,
  status: z.enum(['AVAILABLE', 'RESPONDING', 'ON_SCENE', 'OUT_OF_SERVICE']),
  name: z.string()
});

export const validateMapResource = createValidator(mapResourceSchema, 'MapResource');

export const mapIncidentsSchema = z.array(mapIncidentSchema);
export const validateMapIncidents = createValidator(mapIncidentsSchema, 'MapIncidents');

export const mapResourcesSchema = z.array(mapResourceSchema);
export const validateMapResources = createValidator(mapResourcesSchema, 'MapResources');