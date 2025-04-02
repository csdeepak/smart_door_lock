import React from 'react';
import CameraFeed from './components/CameraFeed';
import AuthStatus from './components/AuthStatus';
import AccessLogs from './components/AccessLogs';

export default function App() {
  const esp32IP = '192.168.1.100'; // Replace with your ESP32 IP

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Security Access Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Camera */}
        <div className="lg:col-span-2 space-y-6">
          <CameraFeed esp32IP={esp32IP} />
        </div>
        
        {/* Right Column - Status and Logs */}
        <div className="space-y-6">
          <AuthStatus esp32IP={esp32IP} />
          <AccessLogs esp32IP={esp32IP} />
        </div>
      </div>
    </div>
  );
}