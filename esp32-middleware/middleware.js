let activeClients = 0;

wss.on('connection', (ws) => {
  console.log('React dashboard connected');
  activeClients++;

  let isConnected = true;

  // Polling for Face Recognition
  const recognitionInterval = setInterval(async () => {
    if (isConnected && activeClients > 0) {
      try {
        // Set a timeout of 3 seconds to avoid hanging
        const response = await axios.get(`http://${ESP32_IP}/recognize`, {
          timeout: 3000, // 3 seconds timeout
        });

        // Send recognition data to the connected client
        ws.send(
          JSON.stringify({
            type: 'face_recognition',
            data: response.data,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error('Polling error:', error.message);
        ws.send(
          JSON.stringify({
            type: 'face_recognition',
            error: 'Error fetching recognition data',
            timestamp: new Date().toISOString(),
          })
        );
      }
    }
  }, 1000); // Poll every 1 second

  // Handle Client Disconnection
  ws.on('close', () => {
    isConnected = false;
    activeClients--;
    clearInterval(recognitionInterval);

    console.log('React dashboard disconnected');
    if (activeClients === 0) {
      console.log('No active clients, stopping polling...');
    }
  });
});
