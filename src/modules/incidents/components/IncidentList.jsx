import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        console.log('Fetching incidents...');
        
        // Mock data for development - in a real app, we'd fetch from an API
        const mockIncidents = [
          { 
            id: 1, 
            type: 'FIRE', 
            severity: 'HIGH', 
            status: 'ACTIVE',
            location: '123 Main St, New York, NY',
            createdAt: new Date('2023-10-15T14:30:00'),
            description: 'Building fire, multiple floors involved',
            assignedUnits: ['Engine 42', 'Ladder 10', 'Battalion 1']
          },
          { 
            id: 2, 
            type: 'MEDICAL', 
            severity: 'MEDIUM', 
            status: 'ACTIVE',
            location: '456 Park Ave, Los Angeles, CA',
            createdAt: new Date('2023-10-15T15:15:00'),
            description: 'Patient with difficulty breathing',
            assignedUnits: ['Ambulance 7', 'Engine 12']
          },
          { 
            id: 3, 
            type: 'POLICE', 
            severity: 'LOW', 
            status: 'RESOLVED',
            location: '789 Lake St, Chicago, IL',
            createdAt: new Date('2023-10-15T10:45:00'),
            description: 'Traffic stop, routine investigation',
            assignedUnits: ['Unit 156']
          },
        ];
        
        setIncidents(mockIncidents);
        console.log('Incidents loaded successfully:', mockIncidents);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        Sentry.captureException(err);
        setError('Failed to load incidents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800';
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }
  
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="bg-blue-600 px-4 py-2 text-white font-medium">
        Incidents
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading incidents...</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {incidents.map(incident => (
            <li key={incident.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{incident.type}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getSeverityClass(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusClass(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{incident.location}</p>
                  <p className="mt-1 text-sm text-gray-500">{incident.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {incident.assignedUnits.map(unit => (
                      <span key={unit} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                        {unit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 text-sm text-gray-500">
                  {format(incident.createdAt, 'MMM d, h:mm a')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncidentList;