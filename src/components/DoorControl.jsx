import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function DoorControl({ esp32IP }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLock = async () => {
    setIsLoading(true);
    try {
      await axios.post(`http://${esp32IP}/control`, {
        command: isLocked ? 'unlock' : 'lock'
      });
      setIsLocked(!isLocked);
      toast.success(`Door ${isLocked ? 'unlocked' : 'locked'} successfully!`);
    } catch (error) {
      toast.error('Control failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Door Control</h3>
      <button
        onClick={toggleLock}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded font-bold transition-colors ${
          isLocked 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-green-600 hover:bg-green-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          'Processing...'
        ) : (
          isLocked ? '🔒 UNLOCK DOOR' : '🔓 LOCK DOOR'
        )}
      </button>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}