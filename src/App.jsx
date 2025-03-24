import React, { useEffect } from 'react';
import { Dashboard } from '@/modules/dashboard';
import { initializeModules } from '@/modules';

export default function App() {
  useEffect(() => {
    initializeModules().catch(err => {
      console.error('Failed to initialize modules:', err);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Dashboard />
    </div>
  );
}