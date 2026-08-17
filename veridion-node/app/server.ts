// veridion-node/app/server.ts
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

// WebSocket setup
wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const clientId = urlParams.get('clientId') || Math.random().toString(36).substring(7);
  wsManager.register(clientId, ws);
  console.log(`Socket connection active: ${clientId}`);
  ws.on('close', () => wsManager.unregister(clientId));
});

// ============================================
// CORE: Form submission / orchestration
// ============================================
app.post('/api/v1/orchestrate', async (req, res): Promise<void> => {
  const { query, industrySector, deploymentRegion, formInputs, clientId } = req.body;

  try {
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

    let finalState = initialState;
    const eventStream = await agentEngine.streamEvents(initialState, { version: "v2" });

    for await (const event of eventStream) {
      if (event.event === "on_chain_end" && event.name === "LangGraph") {
        finalState = event.data.output;
      }
      if (clientId && event.event === "on_node_end") {
        wsManager.broadcastToClient(clientId, 'node_completed', {
          node: event.name,
          logs: event.data?.output?.logs || []
        });
      }
    }

    if (!finalState.compliancePassed) {
      await hitlQueue.add('review_alert', { clientId, state: finalState });
      res.status(202).json({
        status: "PENDING_HITL_REVIEW",
        message: "Pipeline flagged due to compliance discrepancy. Pushed to HITL queue.",
        partialData: finalState
      });
      return;
    }

    res.status(200).json({ status: "SUCCESS", data: finalState });

  } catch (error: any) {
    res.status(400).json({ status: "ERROR", error: error.message });
  }
});

// ============================================
// PROXY: Document upload → FastAPI
// ============================================
app.post('/api/v1/upload', async (req, res): Promise<void> => {
  const fastapiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  try {
    // For now, redirect client to FastAPI directly
    // In production, use multer + axios to proxy multipart
    res.status(307).json({
      status: "REDIRECT",
      message: "Upload via FastAPI directly",
      endpoint: `${fastapiUrl}/api/v1/ingest/upload`
    });
  } catch (error: any) {
    res.status(500).json({ status: "ERROR", error: error.message });
  }
});

// ============================================
// PROXY: Versions & Documents
// ============================================
app.get('/api/v1/versions', async (req, res): Promise<void> => {
  res.status(200).json({ status: "SUCCESS", data: [] });
});

app.get('/api/v1/documents', async (req, res): Promise<void> => {
  res.status(200).json({ status: "SUCCESS", data: [] });
});

app.get('/api/v1/documents/versions', async (req, res): Promise<void> => {
  res.status(200).json({ status: "SUCCESS", data: [], title: req.query.title || null });
});

app.delete('/api/v1/documents/:id', async (req, res): Promise<void> => {
  res.status(200).json({ status: "SUCCESS", message: `Document ${req.params.id} deleted (stub)` });
});

app.delete('/api/v1/versions/:id', async (req, res): Promise<void> => {
  res.status(200).json({ status: "SUCCESS", message: `Version ${req.params.id} deleted (stub)` });
});

// ============================================
// HITL: Approve / Reject
// ============================================
app.post('/api/v1/hitl/approve', async (req, res): Promise<void> => {
  const { pipelineId } = req.body;
  if (!pipelineId) {
    res.status(400).json({ status: "ERROR", error: "pipelineId required" });
    return;
  }
  res.status(200).json({ status: "SUCCESS", message: `Pipeline ${pipelineId} approved`, pipelineId });
});

app.post('/api/v1/hitl/reject', async (req, res): Promise<void> => {
  const { pipelineId, reason } = req.body;
  if (!pipelineId) {
    res.status(400).json({ status: "ERROR", error: "pipelineId required" });
    return;
  }
  res.status(200).json({ status: "SUCCESS", message: `Pipeline ${pipelineId} rejected`, pipelineId, reason: reason || "No reason" });
});

// ============================================
// DASHBOARD: All stub routes (prevents 404)
// ============================================
app.get('/api/v1/dashboard', async (req, res) => res.status(200).json({ status: "SUCCESS", data: {} }));
app.get('/api/v1/dashboard/stats', async (req, res) => res.status(200).json({ status: "SUCCESS", data: { totalDocuments: 0, totalVersions: 0, totalQueries: 0 } }));
app.get('/api/v1/dashboard/industries', async (req, res) => res.status(200).json({ status: "SUCCESS", data: [] }));
app.get('/api/v1/dashboard/versions', async (req, res) => res.status(200).json({ status: "SUCCESS", data: [] }));
app.get('/api/v1/dashboard/cache', async (req, res) => res.status(200).json({ status: "SUCCESS", data: { hitRate: 0, missRate: 0 } }));
app.get('/api/v1/dashboard/agents', async (req, res) => res.status(200).json({ status: "SUCCESS", data: { successRate: 96.8, totalExecutions: 0 } }));
app.get('/api/v1/dashboard/queries', async (req, res) => res.status(200).json({ status: "SUCCESS", data: [] }));
app.get('/api/v1/dashboard/documents', async (req, res) => res.status(200).json({ status: "SUCCESS", data: [] }));
app.get('/api/v1/dashboard/system-health', async (req, res) => res.status(200).json({ status: "SUCCESS", data: { status: "healthy" } }));

// ============================================
// HEALTH
// ============================================
app.get('/health', (req, res) => res.status(200).json({ status: "healthy", service: "veridion-node" }));

// ============================================
// START
// ============================================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Veridion Node.js Orchestrator running on http://localhost:${PORT}`);
});