import { api } from '../core/api';

export const incidentsApi = {
  getIncidents: () => api.get('incidents'),
  getIncidentById: (id) => api.get(`incidents/${id}`),
  createIncident: (incidentData) => api.post('incidents', incidentData),
  updateIncident: (id, incidentData) => api.put(`incidents/${id}`, incidentData),
  closeIncident: (id) => api.put(`incidents/${id}/close`),
  assignResource: (incidentId, resourceId) => 
    api.post(`incidents/${incidentId}/resources`, { resourceId }),
  removeResource: (incidentId, resourceId) => 
    api.delete(`incidents/${incidentId}/resources/${resourceId}`),
};