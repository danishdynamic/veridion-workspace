// app/server.ts
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { SecurityFilter } from './middleware/security';
import { agentEngine } from './agents/workflow';
import { wsManager } from './services/ws.manager';
import { hitlQueue } from './queues/hitl.queue';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const clientId = urlParams.get('clientId') || Math.random().toString(36).substring(7);

  wsManager.register(clientId, ws);
  console.log(`Socket connection active: ${clientId}`);

  ws.on('close', () => wsManager.unregister(clientId));
});

app.post('/api/v1/orchestrate', async (req, res): Promise<any> => {
  const { query, industrySector, deploymentRegion, formInputs, clientId } = req.body;

  try {
    // 1. Input Sanitization
    const cleanQuery = SecurityFilter.sanitizeInput(query || "");
    const cleanFormInputs = SecurityFilter.sanitizeObject(formInputs || {});

    const initialState = {
      userQuery: query,
      sanitizedQuery: cleanQuery,
      industrySector: industrySector || 'General',
      deploymentRegion: deploymentRegion || 'Global',
      formInputs: cleanFormInputs,
      ragContexts: [],
      latestVersion: "",
      previousVersion: "",
      versionChanges: [],
      hasDiffs: false,
      formRecommendations: [],
      compliancePassed: false,
      summary: "",
      uiChartSpec: {},
      confidenceScore: 0,
      hitlApproved: false,
      logs: []
    };

    // 2. Real-time Node Execution via LangGraph Event Streaming
    let finalState = initialState;

    const eventStream = await agentEngine.streamEvents(initialState, { version: "v2" });

    for await (const event of eventStream) {
      if (event.event === "on_chain_end" && event.name === "LangGraph") {
        finalState = event.data.output;
      }

      // Stream intermediate step outputs directly over WebSocket
      if (clientId && event.event === "on_node_end") {
        wsManager.broadcastToClient(clientId, 'node_completed', {
          node: event.name,
          logs: event.data?.output?.logs || []
        });
      }
    }

    // 3. Evaluate HITL Gatekeeper conditions
    if (!finalState.compliancePassed) {
      await hitlQueue.add('review_alert', { clientId, state: finalState });
      return res.status(202).json({
        status: "PENDING_HITL_REVIEW",
        message: "Pipeline flagged due to compliance discrepancy. Pushed to HITL queue.",
        partialData: finalState
      });
    }

    return res.status(200).json({ status: "SUCCESS", data: finalState });

  } catch (error: any) {
    return res.status(400).json({ status: "ERROR", error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Orchestrator hub active on http://localhost:${PORT}`);
});