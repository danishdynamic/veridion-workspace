'use client';

import { useEffect, useRef } from 'react';
import { useAgentStore } from '../store/store';

export const useAgentWebSocket = () => {
  // 1. Remove setPartialState since it isn't in our store, and grab the compliance increment action
  const { clientId, addLog, setStatus, incrementCompliancePasses } = useAgentStore();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Prevent initializing if clientId hasn't loaded yet or if a connection is active
    if (!clientId || clientId === 'client_init' || socketRef.current) return;

    const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    // Connect to the Node.js Express server with the client's session ID
    const ws = new WebSocket(`${WS_BASE_URL}?clientId=${clientId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`📡 WebSocket trace stream attached cleanly for session: ${clientId}`);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        // 2. Handle live agent execution logs
        if (payload.channel === 'pipeline_trace' && payload.data?.log) {
          addLog(payload.data.log);
        }

        // 3. Handle real-time state transitions and update real dashboard metrics
        if (payload.channel === 'state_update') {
          const incomingStatus = payload.data?.status;

          if (incomingStatus) {
            // Map incoming backend statuses cleanly to our store's allowed types
            if (incomingStatus === 'PENDING_HITL_REVIEW' || incomingStatus === 'HITL') {
              setStatus('HITL');
            } else if (incomingStatus === 'SUCCESS') {
              setStatus('IDLE');
              incrementCompliancePasses(); // This ticks up your green dashboard card count live!
            } else if (incomingStatus === 'RUNNING') {
              setStatus('RUNNING');
            } else {
              setStatus('IDLE');
            }
          }
        }
      } catch (err) {
        console.error('❌ Failed to parse incoming socket trace frame:', err);
      }
    };

    ws.onerror = () => {
      console.error(`🚨 WebSocket connection failed at URL: ${ws.url}. Verify your Node.js backend is running.`);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket trace stream detached cleanly.');
      socketRef.current = null;
    };

    // Clean up connection when the user closes the app or navigates away
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [clientId, addLog, setStatus, incrementCompliancePasses]); // Added correct dependencies here
};