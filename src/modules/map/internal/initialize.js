import { eventBus } from '@/modules/core/events';
import { events as mapEvents } from '../events';
import { events as incidentEvents } from '@/modules/incidents/events';
import { events as resourceEvents } from '@/modules/resources/events';

export function initializeMap() {
  // Listen for incident events that might affect the map
  eventBus.subscribe(incidentEvents.INCIDENT_CREATED, (incident) => {
    console.log(`New incident created: ${incident.id}`);
    // Update the map with the new incident
  });
  
  // Listen for resource events that might affect the map
  eventBus.subscribe(resourceEvents.RESOURCE_LOCATION_UPDATED, ({ resourceId, coordinates }) => {
    console.log(`Resource ${resourceId} moved to ${coordinates}`);
    // Update the resource marker on the map
  });
  
  console.log('Map module initialized');
}