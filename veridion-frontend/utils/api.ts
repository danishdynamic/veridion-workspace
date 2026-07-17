import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface OrchestratePayload {
  query: string;
  industrySector: string;
  deploymentRegion: string;
  clientId: string;
  formInputs?: Record<string, any>;
}

// Add to your existing utils/api.ts

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const documentApi = {
  // 1. Ingests raw files directly into the RAG vector store
  upload: async (file: File, sector: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('industrySector', sector);

    const { data } = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // Returns docId and initial version metadata
  },

  // 2. Chat conversational loop interaction with explicit document contexts
  queryContext: async (documentId: string, query: string) => {
    const { data } = await apiClient.post('/documents/query', { documentId, query });
    return data; // Returns text answer + chunk source array
  },

  // 3. Fetch version history tree for a specific document track
  getVersionHistory: async (documentId: string) => {
    const { data } = await apiClient.get(`/documents/${documentId}/versions`);
    return data;
  }
};

export const agentApi = {
  // Dispatches a prompt query to the central multi-agent network
  orchestrate: async (payload: OrchestratePayload) => {
    const { data } = await apiClient.post('/orchestrate', payload);
    return data;
  },

  // (Optional extension for tomorrow) Fetches operational records for dashboard analytics
  getAnalytics: async () => {
    const { data } = await apiClient.get('/analytics');
    return data;
  }
};