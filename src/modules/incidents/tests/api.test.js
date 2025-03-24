import { describe, it, expect, vi } from 'vitest';
import { incidentsApi } from '../api';
import { eventBus } from '@/modules/core/events';
import { events } from '../events';

// Mock eventBus
vi.mock('@/modules/core/events', () => ({
  eventBus: {
    publish: vi.fn()
  }
}));

describe('incidents API', () => {
  it('gets incidents with proper validation', async () => {
    const incidents = await incidentsApi.getIncidents();
    
    expect(Array.isArray(incidents)).toBe(true);
    expect(incidents.length).toBeGreaterThan(0);
    
    const incident = incidents[0];
    expect(incident).toHaveProperty('id');
    expect(incident).toHaveProperty('type');
    expect(incident).toHaveProperty('severity');
    expect(incident).toHaveProperty('status');
    expect(incident).toHaveProperty('location');
    expect(incident).toHaveProperty('createdAt');
    expect(incident).toHaveProperty('description');
    expect(incident).toHaveProperty('assignedUnits');
  });
  
  it('gets incident by id with proper validation', async () => {
    const incident = await incidentsApi.getIncidentById(1);
    
    expect(incident).toHaveProperty('id', 1);
    expect(incident).toHaveProperty('type');
    expect(incident).toHaveProperty('severity');
    expect(incident).toHaveProperty('status');
  });
  
  it('creates an incident and publishes event', async () => {
    const newIncident = {
      id: 4,
      type: 'FIRE',
      severity: 'MEDIUM',
      status: 'ACTIVE',
      location: 'Test Location',
      createdAt: new Date(),
      description: 'Test Description',
      assignedUnits: []
    };
    
    const result = await incidentsApi.createIncident(newIncident);
    
    expect(result).toHaveProperty('id');
    expect(result.type).toBe('FIRE');
    expect(result.severity).toBe('MEDIUM');
    
    expect(eventBus.publish).toHaveBeenCalledWith(events.INCIDENT_CREATED, expect.objectContaining({
      type: 'FIRE',
      severity: 'MEDIUM'
    }));
  });
  
  it('closes an incident and publishes event', async () => {
    const result = await incidentsApi.closeIncident(1);
    
    expect(result).toHaveProperty('status', 'RESOLVED');
    expect(eventBus.publish).toHaveBeenCalledWith(events.INCIDENT_CLOSED, expect.any(Object));
  });
});