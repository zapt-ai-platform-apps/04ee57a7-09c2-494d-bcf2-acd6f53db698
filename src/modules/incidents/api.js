import { api } from '@/modules/core/api';
import { validateIncident, validateIncidentList } from './validators';
import { eventBus } from '@/modules/core/events';
import { events } from './events';

// Mock incidents for development
const mockIncidents = [
  { 
    id: 1, 
    type: 'FIRE', 
    severity: 'HIGH', 
    status: 'ACTIVE',
    location: '123 Main St, New York, NY',
    createdAt: new Date('2023-10-15T14:30:00'),
    description: 'Building fire, multiple floors involved',
    assignedUnits: ['Engine 42', 'Ladder 10', 'Battalion 1']
  },
  { 
    id: 2, 
    type: 'MEDICAL', 
    severity: 'MEDIUM', 
    status: 'ACTIVE',
    location: '456 Park Ave, Los Angeles, CA',
    createdAt: new Date('2023-10-15T15:15:00'),
    description: 'Patient with difficulty breathing',
    assignedUnits: ['Ambulance 7', 'Engine 12']
  },
  { 
    id: 3, 
    type: 'POLICE', 
    severity: 'LOW', 
    status: 'RESOLVED',
    location: '789 Lake St, Chicago, IL',
    createdAt: new Date('2023-10-15T10:45:00'),
    description: 'Traffic stop, routine investigation',
    assignedUnits: ['Unit 156']
  },
];

export const incidentsApi = {
  getIncidents: async () => {
    // In a real app, this would be: const incidents = await api.get('incidents');
    console.log('Fetching incidents from API');
    // For now, we use mock data
    const incidents = mockIncidents;
    
    return validateIncidentList(incidents, {
      actionName: 'getIncidents',
      location: 'incidents/api.js',
      direction: 'outgoing',
      moduleFrom: 'incidents',
      moduleTo: 'client'
    });
  },
  
  getIncidentById: async (id) => {
    // In a real app: const incident = await api.get(`incidents/${id}`);
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) throw new Error(`Incident with id ${id} not found`);
    
    return validateIncident(incident, {
      actionName: 'getIncidentById',
      location: 'incidents/api.js',
      direction: 'outgoing',
      moduleFrom: 'incidents',
      moduleTo: 'client'
    });
  },
  
  createIncident: async (incidentData) => {
    // Validate incoming data
    validateIncident(incidentData, {
      actionName: 'createIncident',
      location: 'incidents/api.js',
      direction: 'incoming',
      moduleFrom: 'client',
      moduleTo: 'incidents'
    });
    
    // In a real app: const result = await api.post('incidents', incidentData);
    const result = { ...incidentData, id: Date.now() };
    
    // Publish event
    eventBus.publish(events.INCIDENT_CREATED, result);
    
    return validateIncident(result, {
      actionName: 'createIncident',
      location: 'incidents/api.js',
      direction: 'outgoing',
      moduleFrom: 'incidents',
      moduleTo: 'client'
    });
  },
  
  updateIncident: async (id, incidentData) => {
    // In a real app: const result = await api.put(`incidents/${id}`, incidentData);
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) throw new Error(`Incident with id ${id} not found`);
    
    const updatedIncident = { ...incident, ...incidentData };
    
    // Publish event
    eventBus.publish(events.INCIDENT_UPDATED, updatedIncident);
    
    return validateIncident(updatedIncident, {
      actionName: 'updateIncident',
      location: 'incidents/api.js',
      direction: 'outgoing',
      moduleFrom: 'incidents',
      moduleTo: 'client'
    });
  },
  
  closeIncident: async (id) => {
    // In a real app: const result = await api.put(`incidents/${id}/close`);
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) throw new Error(`Incident with id ${id} not found`);
    
    const closedIncident = { ...incident, status: 'RESOLVED' };
    
    // Publish event
    eventBus.publish(events.INCIDENT_CLOSED, closedIncident);
    
    return validateIncident(closedIncident, {
      actionName: 'closeIncident',
      location: 'incidents/api.js',
      direction: 'outgoing',
      moduleFrom: 'incidents',
      moduleTo: 'client'
    });
  },
  
  assignResource: async (incidentId, resourceId) => {
    // In a real app: const result = await api.post(`incidents/${incidentId}/resources`, { resourceId });
    // This is a simplified mock implementation
    const incident = mockIncidents.find(inc => inc.id === incidentId);
    if (!incident) throw new Error(`Incident with id ${incidentId} not found`);
    
    // Publish event
    eventBus.publish(events.RESOURCE_ASSIGNED, { incidentId, resourceId });
    
    return { success: true };
  },
  
  removeResource: async (incidentId, resourceId) => {
    // In a real app: const result = await api.delete(`incidents/${incidentId}/resources/${resourceId}`);
    // This is a simplified mock implementation
    const incident = mockIncidents.find(inc => inc.id === incidentId);
    if (!incident) throw new Error(`Incident with id ${incidentId} not found`);
    
    // Publish event
    eventBus.publish(events.RESOURCE_REMOVED, { incidentId, resourceId });
    
    return { success: true };
  },
};