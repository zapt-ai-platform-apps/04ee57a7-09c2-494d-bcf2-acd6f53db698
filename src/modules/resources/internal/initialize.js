import { eventBus } from '@/modules/core/events';
import { events as resourceEvents } from '../events';
import { events as incidentEvents } from '@/modules/incidents/events';

export function initializeResources() {
  // Listen for incident events that might affect resources
  eventBus.subscribe(incidentEvents.INCIDENT_CLOSED, (incident) => {
    console.log(`Incident ${incident.id} closed`);
    // Update resources that were assigned to this incident
  });
  
  console.log('Resources module initialized');
}