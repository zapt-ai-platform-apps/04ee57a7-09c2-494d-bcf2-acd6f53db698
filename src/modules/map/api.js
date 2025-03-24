import { api } from '../core/api';

export const mapApi = {
  getIncidentLocations: () => api.get('map/incidents'),
  getResourceLocations: () => api.get('map/resources'),
  updateResourceLocation: (resourceId, coordinates) => 
    api.post(`map/resources/${resourceId}/location`, { coordinates }),
  getMapLayers: () => api.get('map/layers'),
};