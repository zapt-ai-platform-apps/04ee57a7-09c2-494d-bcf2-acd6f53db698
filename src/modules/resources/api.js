import { api } from '../core/api';

export const resourcesApi = {
  getResources: () => api.get('resources'),
  getResourceById: (id) => api.get(`resources/${id}`),
  updateResourceStatus: (id, status) => api.put(`resources/${id}/status`, { status }),
  updateResourceLocation: (id, coordinates) => api.put(`resources/${id}/location`, { coordinates }),
  assignResource: (resourceId, incidentId) => api.post(`resources/${resourceId}/assign`, { incidentId }),
  clearAssignment: (resourceId) => api.post(`resources/${resourceId}/clear`),
};