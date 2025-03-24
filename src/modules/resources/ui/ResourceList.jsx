import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { resourcesApi } from '@/modules/resources/api';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        console.log('Fetching resources...');
        
        const fetchedResources = await resourcesApi.getResources();
        setResources(fetchedResources);
        console.log('Resources loaded successfully:', fetchedResources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        Sentry.captureException(err);
        setError('Failed to load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'RESPONDING': return 'bg-blue-100 text-blue-800';
      case 'ON_SCENE': return 'bg-purple-100 text-purple-800';
      case 'OUT_OF_SERVICE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeClass = (type) => {
    switch (type) {
      case 'FIRE_TRUCK': return 'bg-red-100 text-red-800';
      case 'AMBULANCE': return 'bg-white border border-red-500 text-red-800';
      case 'POLICE_CAR': return 'bg-blue-100 text-blue-800';
      case 'HELICOPTER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }
  
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="bg-green-600 px-4 py-2 text-white font-medium">
        Resources
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading resources...</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {resources.map(resource => (
            <li key={resource.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{resource.name}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getTypeClass(resource.type)}`}>
                      {resource.type.replace('_', ' ')}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusClass(resource.status)}`}>
                      {resource.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{resource.currentLocation}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {resource.assignedTo 
                      ? <span>Assigned to: <span className="font-medium">{resource.assignedTo}</span></span> 
                      : 'Not assigned'}
                  </p>
                </div>
                <div className="ml-4 text-sm text-gray-500">
                  Personnel: {resource.personnel}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourceList;