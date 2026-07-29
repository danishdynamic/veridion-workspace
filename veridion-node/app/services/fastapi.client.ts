// app/services/fastapi.client.ts
import axios from 'axios';

export interface RAGSearchPayload {
  query: string;
  industry_sector?: string;
  deployment_region?: string;
  limit?: number;
}

export interface VersionComparePayload {
  document_id?: string;
  version_a_id: string;
  version_b_id: string;
  section_id?: string;
}

export interface ClauseChange {
  clause_number: string | null;
  change_type: 'NEW' | 'MODIFIED' | 'REMOVED' | 'UNCHANGED';
  old_text: string | null;
  new_text: string | null;
  impact_assessment: string;
}

export interface VersionCompareResponse {
  version_a_id: string;
  version_b_id: string;
  has_diffs: boolean;
  changes: ClauseChange[];
}

export class FastApiClient {
  private baseUrl = process.env.FASTAPI_URL || 'http://localhost:8000';

  /**
   * Queries the FastAPI vector retrieval endpoint.
   */
  async queryVectorMatrix(payload: RAGSearchPayload): Promise<any[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/retrieve/query`, {
        query: payload.query,
        industry_sector: payload.industry_sector,
        deployment_region: payload.deployment_region,
        limit: payload.limit || 10
      });
      return response.data;
    } catch (error: any) {
      console.error("FastAPI context bridge error:", error.message);
      throw new Error(`Advanced RAG service unavailable: ${error.message}`);
    }
  }

  /**
   * Calls the FastAPI version comparison engine to compute structured clause diffs.
   */
  async compareVersions(
    versionAId: string, 
    versionBId: string, 
    documentId?: string, 
    sectionId?: string
  ): Promise<VersionCompareResponse> {
    try {
      const payload: VersionComparePayload = {
        version_a_id: versionAId,
        version_b_id: versionBId,
        ...(documentId && { document_id: documentId }),
        ...(sectionId && { section_id: sectionId }),
      };

      const response = await axios.post<VersionCompareResponse>(
        `${this.baseUrl}/api/v1/version/compare`,
        payload
      );

      return response.data;
    } catch (error: any) {
      console.error("FastAPI version comparison bridge error:", error.message);
      throw new Error(`Version comparison service unavailable: ${error.message}`);
    }
  }
}

export const fastApiClient = new FastApiClient();