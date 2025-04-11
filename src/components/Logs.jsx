// Logs.jsx
import React, { useEffect, useState } from 'react';

export default function Logs({ esp32IP }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://${esp32IP}/access_logs`);
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [esp32IP]);

  const filteredLogs = logs.filter((log) =>
    filter === 'all' ? true : log.method.toLowerCase() === filter
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Detailed Logs</h3>
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white rounded p-1"
        >
          <option value="all">All</option>
          <option value="face">Face</option>
          <option value="fingerprint">Fingerprint</option>
          <option value="rfid">RFID</option>
        </select>
      </div>

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
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2">{log.time}</td>
                  <td className="p-2 capitalize">{log.method}</td>
                  <td className={`p-2 ${
                    log.status === 'Granted' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {log.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-2 text-center text-gray-400">No logs to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
