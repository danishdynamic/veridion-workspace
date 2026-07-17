// app/services/ws.manager.ts
import { WebSocket } from 'ws';

export class WebSocketManager {
  private activePool = new Map<string, WebSocket>();

  public register(clientId: string, ws: WebSocket) {
    this.activePool.set(clientId, ws);
  }

  public unregister(clientId: string) {
    this.activePool.delete(clientId);
  }

  public broadcastToClient(clientId: string, channel: string, data: any) {
    const ws = this.activePool.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ channel, data }));
    }
  }
}
export const wsManager = new WebSocketManager();