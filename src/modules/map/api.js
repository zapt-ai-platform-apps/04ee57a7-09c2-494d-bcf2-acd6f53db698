import { api } from '@/modules/core/api';
import { validateMapIncidents, validateMapResources } from './validators';

// Mock data for development
const mockIncidents = [
  { id: 1, type: 'FIRE', coordinates: [-74.006, 40.7128], severity: 'HIGH', title: 'Building Fire' },
  { id: 2, type: 'MEDICAL', coordinates: [-118.2437, 34.0522], severity: 'MEDIUM', title: 'Medical Emergency' },
  { id: 3, type: 'POLICE', coordinates: [-87.6298, 41.8781], severity: 'LOW', title: 'Traffic Stop' },
];

const mockResources = [
  { id: 101, type: 'FIRE_TRUCK', coordinates: [-74.01, 40.72], status: 'RESPONDING', name: 'Engine 42' },
  { id: 102, type: 'AMBULANCE', coordinates: [-118.25, 34.06], status: 'AVAILABLE', name: 'Ambulance 7' },
  { id: 103, type: 'POLICE_CAR', coordinates: [-87.63, 41.88], status: 'ON_SCENE', name: 'Unit 156' },
];

export const mapApi = {
  getIncidentLocations: async () => {
    console.log('Fetching incident locations from API');
    // In a real app: const result = await api.get('map/incidents');
    // Using mock data for now
    const incidents = mockIncidents;
    
    return validateMapIncidents(incidents, {
      actionName: 'getIncidentLocations',
      location: 'map/api.js',
      direction: 'outgoing',
      moduleFrom: 'map',
      moduleTo: 'client'
    });
  },
  
  getResourceLocations: async () => {
    console.log('Fetching resource locations from API');
    // In a real app: const result = await api.get('map/resources');
    // Using mock data for now
    const resources = mockResources;
    
    return validateMapResources(resources, {
      actionName: 'getResourceLocations',
      location: 'map/api.js',
      direction: 'outgoing',
      moduleFrom: 'map',
      moduleTo: 'client'
    });
  },
  
  updateResourceLocation: async (resourceId, coordinates) => {
    // In a real app: const result = await api.post(`map/resources/${resourceId}/location`, { coordinates });
    // Simplified mock implementation
    console.log(`Updating resource ${resourceId} location to ${coordinates}`);
    return { success: true };
  },
  
  getMapLayers: async () => {
    // In a real app: const result = await api.get('map/layers');
    // Simplified mock implementation
    return [
      { id: 'incidents', name: 'Incidents', visible: true },
      { id: 'resources', name: 'Resources', visible: true }
    ];
  },
};