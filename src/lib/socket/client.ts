import { io, Socket } from "socket.io-client";
import { config } from "../config/env";

let socketInstance: Socket | null = null;

/**
 * Get or create socket connection
 * This is a singleton pattern to ensure only one connection
 */
export const getSocket = (): Socket => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(config.SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ["websocket", "polling"],
  });

  return socketInstance;
};

/**
 * Connect with authentication
 * This should be called after successful login
 */
export const connectSocket = (
  token: string,
  tenantId: string,
  storeId: string
): Socket => {
  const socket = getSocket();

  // Attach auth information
  socket.auth = {
    token,
    tenantId,
    storeId,
  };

  // Re-authenticate on reconnect
  socket.on("reconnect", () => {
    socket.emit("authenticate", { token, tenantId, storeId });
  });

  return socket;
};

/**
 * Join room for specific store
 */
export const joinStoreRoom = (tenantId: string, storeId: string): Socket => {
  const socket = getSocket();
  const room = `tenant:${tenantId}:store:${storeId}`;
  socket.emit("join", { room });
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

/**
 * Get current socket instance (or null if not connected)
 */
export const getCurrentSocket = (): Socket | null => {
  return socketInstance;
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socketInstance?.connected ?? false;
};
