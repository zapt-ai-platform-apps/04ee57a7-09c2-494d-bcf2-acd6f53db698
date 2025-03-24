import { initializeIncidents } from './incidents/internal/initialize';
import { initializeMap } from './map/internal/initialize';
import { initializeResources } from './resources/internal/initialize';

export async function initializeModules() {
  // Initialize all modules in parallel
  await Promise.all([
    initializeIncidents(),
    initializeMap(),
    initializeResources()
  ]);
  
  console.log('All modules initialized');
}