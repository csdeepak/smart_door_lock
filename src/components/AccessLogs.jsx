import React, { useState, useEffect } from 'react';

export default function AccessLogs({ esp32IP }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://${esp32IP}/access_logs`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Logs fetch error:', error);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [esp32IP]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Access Logs</h3>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-2">Time</th>
              <th className="p-2">Method</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-2">{log.time}</td>
                <td className="p-2">{log.method}</td>
                <td className={`p-2 ${
                  log.status === 'Granted' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}