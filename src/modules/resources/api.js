import { api } from '@/modules/core/api';
import { validateResource, validateResourceList } from './validators';
import { eventBus } from '@/modules/core/events';
import { events } from './events';

// Mock data for development
const mockResources = [
  { 
    id: 101, 
    type: 'FIRE_TRUCK', 
    name: 'Engine 42', 
    status: 'RESPONDING',
    currentLocation: 'En route to 123 Main St',
    personnel: 4,
    assignedTo: 'Building Fire (ID: 1)'
  },
  { 
    id: 102, 
    type: 'AMBULANCE', 
    name: 'Ambulance 7', 
    status: 'AVAILABLE',
    currentLocation: 'General Hospital',
    personnel: 2,
    assignedTo: 'Medical Emergency (ID: 2)'
  },
  { 
    id: 103, 
    type: 'POLICE_CAR', 
    name: 'Unit 156', 
    status: 'ON_SCENE',
    currentLocation: '789 Lake St',
    personnel: 2,
    assignedTo: 'Resolved (ID: 3)'
  },
  { 
    id: 104, 
    type: 'HELICOPTER', 
    name: 'Air Support 1', 
    status: 'AVAILABLE',
    currentLocation: 'Central Helipad',
    personnel: 3,
    assignedTo: null
  },
];

export const resourcesApi = {
  getResources: async () => {
    console.log('Fetching resources from API');
    // In a real app: const result = await api.get('resources');
    // Using mock data for now
    const resources = mockResources;
    
    return validateResourceList(resources, {
      actionName: 'getResources',
      location: 'resources/api.js',
      direction: 'outgoing',
      moduleFrom: 'resources',
      moduleTo: 'client'
    });
  },
  
  getResourceById: async (id) => {
    // In a real app: const result = await api.get(`resources/${id}`);
    const resource = mockResources.find(r => r.id === id);
    if (!resource) throw new Error(`Resource with id ${id} not found`);
    
    return validateResource(resource, {
      actionName: 'getResourceById',
      location: 'resources/api.js',
      direction: 'outgoing',
      moduleFrom: 'resources',
      moduleTo: 'client'
    });
  },
  
  updateResourceStatus: async (id, status) => {
    // In a real app: const result = await api.put(`resources/${id}/status`, { status });
    const resource = mockResources.find(r => r.id === id);
    if (!resource) throw new Error(`Resource with id ${id} not found`);
    
    const updatedResource = { ...resource, status };
    
    // Publish event
    eventBus.publish(events.RESOURCE_STATUS_CHANGED, { resourceId: id, status });
    
    return validateResource(updatedResource, {
      actionName: 'updateResourceStatus',
      location: 'resources/api.js',
      direction: 'outgoing',
      moduleFrom: 'resources',
      moduleTo: 'client'
    });
  },
  
  updateResourceLocation: async (id, coordinates) => {
    // In a real app: const result = await api.put(`resources/${id}/location`, { coordinates });
    const resource = mockResources.find(r => r.id === id);
    if (!resource) throw new Error(`Resource with id ${id} not found`);
    
    // Publish event
    eventBus.publish(events.RESOURCE_LOCATION_UPDATED, { resourceId: id, coordinates });
    
    return { success: true };
  },
  
  assignResource: async (resourceId, incidentId) => {
    // In a real app: const result = await api.post(`resources/${resourceId}/assign`, { incidentId });
    const resource = mockResources.find(r => r.id === resourceId);
    if (!resource) throw new Error(`Resource with id ${resourceId} not found`);
    
    // In a real app we would update the resource's assignment
    
    // Publish event
    eventBus.publish(events.RESOURCE_ASSIGNED, { resourceId, incidentId });
    
    return { success: true };
  },
  
  clearAssignment: async (resourceId) => {
    // In a real app: const result = await api.post(`resources/${resourceId}/clear`);
    const resource = mockResources.find(r => r.id === resourceId);
    if (!resource) throw new Error(`Resource with id ${resourceId} not found`);
    
    // In a real app we would clear the resource's assignment
    
    // Publish event
    eventBus.publish(events.RESOURCE_ASSIGNMENT_CLEARED, { resourceId });
    
    return { success: true };
  },
};