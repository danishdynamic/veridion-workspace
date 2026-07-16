import axios from 'axios';

export interface RAGSearchPayload {
  query: str;
  industry_sector?: string;
  deployment_region?: string;
  limit?: number;
}

export class FastApiClient {
  private baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';

  async queryVectorMatrix(payload: RAGSearchPayload): Promise<any[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/retrieve/query`, {
        query: payload.query,
        industry_sector: payload.industry_sector,
        deployment_region: payload.deployment_region,
        limit: payload.limit
      });
      return response.data;
    } catch (error: any) {
      console.error("FastAPI context bridge error:", error.message);
      throw new Error(`Advanced RAG service unavailable: ${error.message}`);
    }
  }
}
export const fastApiClient = new FastApiClient();