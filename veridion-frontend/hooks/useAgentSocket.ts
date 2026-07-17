import { useEffect } from 'react';
import { useAgentStore } from '../store/store';

export const useAgentWebSocket = () => {
  const { clientId, addLog } = useAgentStore();

  useEffect(() => {
    if (!clientId) return;

    // Connect directly to our Express WS port
    const ws = new WebSocket(`ws://localhost:3001?clientId=${clientId}`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.channel === 'pipeline_trace' && payload.data?.logs) {
          // If the backend passes down an array of updated logs
          payload.data.logs.forEach((log: any) => addLog(log));
        }
      } catch (err) {
        console.error('Failed to parse incoming socket trace frame:', err);
      }
    };

    ws.onerror = (error) => console.error('WebSocket connection error:', error);
    ws.onclose = () => console.log('WebSocket stream detached cleanly.');

    return () => ws.close();
  }, [clientId, addLog]);
};