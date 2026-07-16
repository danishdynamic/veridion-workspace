import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import  {SecurityFilter}  from './middleware/security';
import { agentEngine } from './agents/workflow';
import { wsManager } from './services/ws.manager';
import { hitlQueue } from './queues/hitl.queue';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection routing wire-up
wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const clientId = urlParams.get('clientId') || Math.random().toString(36).substring(7);

  wsManager.register(clientId, ws);
  console.log(`Socket path confirmed for downstream client instance: ${clientId}`);

  ws.on('close', () => wsManager.unregister(clientId));
});

// Central Multi-Agent Graph Engine Target Execution API Route
app.post('/api/v1/orchestrate', async (req, res): Promise<any> => {
  const { query, industrySector, deploymentRegion, formInputs, clientId } = req.body;

  try {
    // 1. Run direct prompt injection sanitization check
    const cleanQuery = SecurityFilter.sanitizeInput(query);

    // 2. Feed settings into the LangGraph state loop
    const runtimeState = await agentEngine.invoke({
      userQuery: query,
      sanitizedQuery: cleanQuery,
      industrySector: industrySector || 'General',
      deploymentRegion: deploymentRegion || 'Global',
      formInputs: formInputs || {},
      ragContexts: [],
      compliancePassed: false,
      textSummary: "",
      uiChartSpec: {},
      formErrors: [],
      hitlApproved: false,
      logs: []
    });

    // 3. Broadcast real-time execution logs if client ID is provided
    if (clientId) {
      wsManager.broadcastToClient(clientId, 'pipeline_trace', { logs: runtimeState.logs });
    }

    // 4. Evaluate human-in-the-loop triggers if data anomalies are encountered
    if (!runtimeState.compliancePassed) {
      await hitlQueue.add('review_alert', { clientId, state: runtimeState });
      return res.status(202).json({
        status: "PENDING_HITL_REVIEW",
        message: "Pipeline flagged for evaluation. Awaiting supervisor manual authorization update.",
        partialData: runtimeState
      });
    }

    return res.status(200).json({ status: "SUCCESS", data: runtimeState });

  } catch (error: any) {
    return res.status(400).json({ status: "ERROR", error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Orchestrator hub listening cleanly on network interface target: http://localhost:${PORT}`);
});