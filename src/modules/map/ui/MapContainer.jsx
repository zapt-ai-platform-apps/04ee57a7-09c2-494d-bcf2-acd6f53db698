import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import mapboxgl from 'mapbox-gl';
import { useMapService } from '@/modules/map/internal/useMapService';
import { mapApi } from '@/modules/map/api';

const MapContainer = ({ className }) => {
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { map, mapLoaded, error, addMarker } = useMapService('map-container', {
    center: [-98, 39], // Center of the USA
    zoom: 4
  });

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        
        // Fetch incidents and resources
        const fetchedIncidents = await mapApi.getIncidentLocations();
        const fetchedResources = await mapApi.getResourceLocations();
        
        setIncidents(fetchedIncidents);
        setResources(fetchedResources);
      } catch (err) {
        console.error('Error fetching map data:', err);
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Add markers when map is loaded and data is available
  useEffect(() => {
    if (mapLoaded && incidents.length > 0) {
      console.log('Adding incident markers to map');
      incidents.forEach(incident => {
        const markerElement = document.createElement('div');
        markerElement.className = 'incident-marker';
        markerElement.style.backgroundColor = getIncidentColor(incident.severity);
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';
        
        const marker = addMarker(incident.coordinates, { 
          element: markerElement,
          id: incident.id,
          type: 'incident',
          onClick: (coords, id) => {
            console.log(`Incident ${id} clicked at ${coords}`);
          }
        });
        
        // Add popup to marker
        if (marker) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-bold">${incident.title}</h3>
             <p>Type: ${incident.type}</p>
             <p>Severity: ${incident.severity}</p>`
          );
          
          marker.setPopup(popup);
        }
      });
    }
  }, [mapLoaded, incidents, addMarker]);
  
  useEffect(() => {
    if (mapLoaded && resources.length > 0) {
      console.log('Adding resource markers to map');
      resources.forEach(resource => {
        const markerElement = document.createElement('div');
        markerElement.className = 'resource-marker';
        markerElement.style.backgroundColor = getResourceColor(resource.type);
        markerElement.style.width = '15px';
        markerElement.style.height = '15px';
        markerElement.style.borderRadius = '3px';
        
        const marker = addMarker(resource.coordinates, { 
          element: markerElement,
          id: resource.id,
          type: 'resource',
          onClick: (coords, id) => {
            console.log(`Resource ${id} clicked at ${coords}`);
          }
        });
        
        // Add popup to marker
        if (marker) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-bold">${resource.name}</h3>
             <p>Type: ${resource.type.replace('_', ' ')}</p>
             <p>Status: ${resource.status.replace('_', ' ')}</p>`
          );
          
          marker.setPopup(popup);
        }
      });
    }
  }, [mapLoaded, resources, addMarker]);
  
  const getIncidentColor = (severity) => {
    switch (severity) {
      case 'HIGH': return '#FF0000'; // Red
      case 'MEDIUM': return '#FFA500'; // Orange
      case 'LOW': return '#FFFF00'; // Yellow
      default: return '#FFFFFF'; // White
    }
  };
  
  const getResourceColor = (type) => {
    switch (type) {
      case 'FIRE_TRUCK': return '#FF0000'; // Red
      case 'AMBULANCE': return '#FFFFFF'; // White
      case 'POLICE_CAR': return '#0000FF'; // Blue
      default: return '#000000'; // Black
    }
  };
  
  if (error) {
    return <div className="error-message p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }
  
  return (
    <div className={`relative ${className}`}>
      <div id="map-container" className="h-full w-full rounded-md"></div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="text-lg font-semibold text-gray-700">Loading map data...</div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;