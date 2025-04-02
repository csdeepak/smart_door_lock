import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SystemMonitor({ esp32IP }) {
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`http://${esp32IP}/sysinfo`);
        setSystemInfo(response.data);
      } catch (error) {
        console.error('System info error:', error);
      }
    };
    fetchInfo();
  }, [esp32IP]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Device Status</h3>
      {systemInfo ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Model: <span className="font-mono">{systemInfo.model}</span></div>
          <div>IP: <span className="font-mono">{systemInfo.ip}</span></div>
          <div>WiFi: <span className="font-mono">{systemInfo.ssid}</span></div>
          <div>Signal: <span className="font-mono">Excellent</span></div>
        </div>
      ) : (
        <p className="text-yellow-500">Loading system info...</p>
      )}
    </div>
  );
}