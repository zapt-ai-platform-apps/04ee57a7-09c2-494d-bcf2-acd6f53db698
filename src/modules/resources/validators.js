import { z } from 'zod';
import { createValidator } from '@/modules/core/validators';
import { coordinatesSchema } from '@/modules/map/validators';

export const resourceSchema = z.object({
  id: z.number(),
  type: z.enum(['FIRE_TRUCK', 'AMBULANCE', 'POLICE_CAR', 'HELICOPTER']),
  name: z.string(),
  status: z.enum(['AVAILABLE', 'RESPONDING', 'ON_SCENE', 'OUT_OF_SERVICE']),
  currentLocation: z.string(),
  personnel: z.number().int().positive(),
  assignedTo: z.string().nullable()
});

export const validateResource = createValidator(resourceSchema, 'Resource');

export const resourceListSchema = z.array(resourceSchema);
export const validateResourceList = createValidator(resourceListSchema, 'ResourceList');

export const resourceStatusUpdateSchema = z.object({
  status: z.enum(['AVAILABLE', 'RESPONDING', 'ON_SCENE', 'OUT_OF_SERVICE'])
});

export const validateResourceStatusUpdate = createValidator(resourceStatusUpdateSchema, 'ResourceStatusUpdate');

export const resourceLocationUpdateSchema = z.object({
  coordinates: coordinatesSchema
});

export const validateResourceLocationUpdate = createValidator(resourceLocationUpdateSchema, 'ResourceLocationUpdate');