import React, { useEffect, useState } from 'react';

export default function CameraFeed({ esp32IP }) {
  const [status, setStatus] = useState('Waiting for Face Scan...');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // WebSocket connection to receive face recognition updates
    const socket = new WebSocket('ws://localhost:3001');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'face_recognition') {
        setStatus(
          message.data.status === 'Success'
            ? '✅ Face Recognized!'
            : '❌ No Face Detected'
        );
      }
    };
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="bg-black rounded-lg overflow-hidden relative">
      {/* Camera Feed */}
      <div className="aspect-video">
        <img
          src="http://localhost:3001/camera-feed"
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
