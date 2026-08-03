import { SocketMessage } from "@/types/agent";

type MessageHandler = (data: SocketMessage) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private listeners: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  public connect(url: string = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws") {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      console.log("[WS] Connected to Agent Orchestrator");
    };

    this.socket.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (err) {
        console.error("[WS] Failed to parse incoming socket payload", err);
      }
    };

    this.socket.onerror = (error) => {
      console.error("[WS] Error encountered:", error);
    };

    this.socket.onclose = () => {
      console.warn("[WS] Connection closed.");
      this.attemptReconnect(url);
    };
  }

  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`[WS] Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(url);
      }, this.reconnectInterval);
    }
  }

  public subscribe(handler: MessageHandler) {
    this.listeners.add(handler);
    return () => this.unsubscribe(handler);
  }

  public unsubscribe(handler: MessageHandler) {
    this.listeners.delete(handler);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

export const wsManager = new WebSocketManager();