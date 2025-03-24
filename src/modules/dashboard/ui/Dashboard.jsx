import React from 'react';
import MapContainer from '@/modules/map/ui/MapContainer';
import IncidentList from '@/modules/incidents/ui/IncidentList';
import ResourceList from '@/modules/resources/ui/ResourceList';

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SitAw - Situational Awareness Tool</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm cursor-pointer">
              New Incident
            </button>
            <div className="text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MapContainer className="h-[600px] mb-4 shadow-lg" />
          </div>
          
          <div className="flex flex-col gap-4">
            <IncidentList />
            <ResourceList />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600 shadow-inner">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="underline">
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;