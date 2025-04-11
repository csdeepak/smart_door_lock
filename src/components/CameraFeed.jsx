import React, { useEffect, useState } from 'react';

export default function CameraFeed({ esp32IP }) {
  const [status, setStatus] = useState('Waiting for Face Scan...');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://${esp32IP}/auth_status`);
        const data = await response.json();
        setStatus(
          data.camera === 'scanning'
            ? '🟡 Scanning...'
            : data.camera === 'verified'
            ? '✅ Face Scan Complete'
            : '⏳ Waiting for Face Scan...'
        );
      } catch (error) {
        setStatus('❌ Camera status unavailable');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [esp32IP]);

  return (
    <div className="bg-black rounded-lg overflow-hidden relative">
      {/* Camera Feed */}
      <div className="aspect-video">
        <img
          src="http://192.168.125.55:81/stream" // ✅ Stream directly from ESP32-CAM
          alt="Live Camera Feed"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="%23333"><text x="400" y="300" font-family="Arial" font-size="24" fill="white" text-anchor="middle">CAMERA OFFLINE</text></svg>';
          }}
        />
      </div>

      {/* Status Indicator */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center p-2">
        {status}
      </div>
    </div>
  );
}
