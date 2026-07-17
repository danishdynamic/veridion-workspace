// app/services/semantic_cache.ts
import { OpenAIEmbeddings } from "@langchain/openai";
import { Redis } from "ioredis"; // Fixed: Using constructable named export

export class SemanticCacheService {
  private redis: Redis; // Fixed: Target type changed from IORedis to Redis
  private embeddings: OpenAIEmbeddings;
  private indexName = "idx:semantic_cache";
  private similarityThreshold = 0.95; // strict match threshold

  constructor() {
    // Fixed: Initializing the constructable Redis class
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    this.embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });
    this.initializeIndex();
  }

  /**
   * Builds the Redis Vector Search Schema if it doesn't exist
   */
  private async initializeIndex() {
    try {
      await this.redis.call(
        "FT.CREATE",
        this.indexName,
        "ON", "HASH",
        "PREFIX", "1", "sem_cache:",
        "SCHEMA",
        "embedding", "VECTOR", "FLAT", "6",
        "TYPE", "FLOAT32",
        "DIM", "1536",
        "DISTANCE_METRIC", "COSINE",
        "response", "TEXT"
      );
      console.log("[Semantic Cache] Redis VSS Index initialized.");
    } catch (err: any) {
      if (err.message.includes("Index already exists")) {
        return;
      }
      console.error("[Semantic Cache] Failed to initialize index:", err.message);
    }
  }

  /**
   * Checks for a semantically identical previous execution
   */
  async get(query: string): Promise<any | null> {
    try {
      // Fixed: Defensive validation against LangChain's potential undefined array return
      const vectors = await this.embeddings.embedDocuments([query]);
      if (!vectors || !vectors[0]) return null;
      
      const float32Array = new Float32Array(vectors[0]);
      const buffer = Buffer.from(float32Array.buffer);

      // Perform a 1-Nearest-Neighbor vector query on our Redis index
      const searchResult: any = await this.redis.call(
        "FT.SEARCH",
        this.indexName,
        `*=>[KNN 1 @embedding $vec_param AS score]`,
        "PARAMS", "2", "vec_param", buffer,
        "DIALECT", "2",
        "RETURN", "2", "response", "score"
      );

      // Redis FT.SEARCH response parsing logic for array formatting
      if (searchResult && searchResult[0] > 0) {
        const fields = searchResult[2];
        if (!fields) return null;

        const scoreIndex = fields.indexOf("score");
        const responseIndex = fields.indexOf("response");

        if (scoreIndex !== -1 && responseIndex !== -1) {
          const rawScore = parseFloat(fields[scoreIndex + 1]);
          const similarityScore = 1 - rawScore; // Convert Cosine distance to similarity

          if (similarityScore >= this.similarityThreshold) {
            const cachedString = fields[responseIndex + 1];
            console.log(`[Semantic Cache] HIT! Similarity match: ${similarityScore.toFixed(4)}`);
            return JSON.parse(cachedString);
          }
        }
      }
    } catch (err: any) {
      console.error("[Semantic Cache] Lookup skipped due to error:", err.message);
    }
    return null;
  }

  /**
   * Caches a successful multi-agent state run
   */
  async set(query: string, statePayload: any): Promise<void> {
    try {
      // Fixed: Defensive validation against LangChain's potential undefined array return
      const vectors = await this.embeddings.embedDocuments([query]);
      if (!vectors || !vectors[0]) return;

      const float32Array = new Float32Array(vectors[0]);
      const buffer = Buffer.from(float32Array.buffer);
      const docId = `sem_cache:${Buffer.from(query).toString("hex").substring(0, 32)}`;

      await this.redis.hset(docId, {
        embedding: buffer,
        response: JSON.stringify(statePayload)
      });
      // Expire search caching entries after 4 hours
      await this.redis.expire(docId, 14400);
    } catch (err: any) {
      console.error("[Semantic Cache] Save skipped due to error:", err.message);
    }
  }
}

export const semanticCache = new SemanticCacheService();