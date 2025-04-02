import React, { useState, useEffect } from 'react';

export default function AuthStatus({ esp32IP }) {
  const [status, setStatus] = useState({
    fingerprint: 'Loading...',
    rfid: 'Loading...',
    camera: 'Loading...'
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://${esp32IP}/auth_status`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Status fetch error:', error);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [esp32IP]);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'ready': return 'bg-green-500';
      case 'scanning': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Authentication Status</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.fingerprint)}`}></div>
          <span>Fingerprint: {status.fingerprint}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.rfid)}`}></div>
          <span>RFID: {status.rfid}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status.camera)}`}></div>
          <span>Camera: {status.camera}</span>
        </div>
      </div>
    </div>
  );
}