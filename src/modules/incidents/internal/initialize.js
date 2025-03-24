import { eventBus } from '@/modules/core/events';
import { events as incidentEvents } from '../events';
import { events as resourceEvents } from '@/modules/resources/events';

export function initializeIncidents() {
  // Listen for resource events that might affect incidents
  eventBus.subscribe(resourceEvents.RESOURCE_ASSIGNED, ({ incidentId, resourceId }) => {
    console.log(`Resource ${resourceId} assigned to incident ${incidentId}`);
    // Handle the event (in a real implementation)
  });
  
  console.log('Incidents module initialized');
}