// app/queue/hitl.queue.ts
import { Queue, Worker } from 'bullmq';


const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');

const connectionOptions = {
  host: redisUrl.hostname || 'localhost',
  port: redisUrl.port ? parseInt(redisUrl.port, 10) : 6379,
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null 
};

// 2. Pass the config object directly into the connection field
export const hitlQueue = new Queue('veridion_hitl_pipeline', { 
  connection: connectionOptions 
});

export const createHitlWorker = (processCallback: (job: any) => Promise<any>) => {
  return new Worker('veridion_hitl_pipeline', processCallback, { 
    connection: connectionOptions 
  });
};