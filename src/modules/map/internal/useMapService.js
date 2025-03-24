import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as Sentry from '@sentry/browser';
import { eventBus } from '@/modules/core/events';
import { events } from '../events';

export function useMapService(containerId, options = {}) {
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const MAPBOX_TOKEN = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN;
    
    if (!MAPBOX_TOKEN) {
      const missingTokenError = new Error('Mapbox token is missing in environment variables');
      console.error(missingTokenError);
      Sentry.captureException(missingTokenError);
      setError('Map configuration error. Please contact support.');
      return;
    }

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const map = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: options.center || [-98, 39], // Default to center of US
        zoom: options.zoom || 4,
        ...options
      });

      map.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        if (options.onLoad) options.onLoad(map);
        
        // Publish map initialized event
        eventBus.publish(events.MAP_INITIALIZED, { mapId: containerId });
      });

      // Listen for map moves to publish events
      map.on('moveend', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        eventBus.publish(events.MAP_MOVED, { 
          center: [center.lng, center.lat], 
          zoom,
          bounds: map.getBounds()
        });
      });

      mapInstance.current = map;

      return () => {
        map.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      Sentry.captureException(err);
      setError('Failed to load map. Please try refreshing the page.');
    }
  }, [containerId]);

  const addMarker = (coordinates, options = {}) => {
    if (!mapInstance.current || !mapLoaded) return null;
    
    try {
      const marker = new mapboxgl.Marker(options)
        .setLngLat(coordinates)
        .addTo(mapInstance.current);
        
      // Handle marker clicks if needed
      if (options.onClick) {
        const el = marker.getElement();
        el.addEventListener('click', () => {
          // Publish marker clicked event
          eventBus.publish(events.MARKER_CLICKED, { 
            coordinates,
            id: options.id,
            type: options.type
          });
          
          // Call the provided onClick handler
          options.onClick(coordinates, options.id, options.type);
        });
      }
      
      return marker;
    } catch (err) {
      console.error('Error adding marker:', err);
      Sentry.captureException(err);
      return null;
    }
  };

  const flyTo = (coordinates, zoom = 12) => {
    if (!mapInstance.current || !mapLoaded) return;
    
    try {
      mapInstance.current.flyTo({
        center: coordinates,
        zoom,
        essential: true
      });
    } catch (err) {
      console.error('Error in flyTo:', err);
      Sentry.captureException(err);
    }
  };
  
  return { 
    map: mapInstance.current, 
    mapLoaded, 
    error,
    addMarker,
    flyTo
  };
}