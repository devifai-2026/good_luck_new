import io, { Socket } from "socket.io-client";
import { URLs, enviornment } from "../services/constants";
import { call } from "redux-saga/effects";

// Define the possible environment types

class WSService {
  private socket: Socket | null = null;
  socketInitialized: boolean = false;
  public socketId: string = "";

  // Initialize the socket connection
  initializeSocket = async (callBack?: any): Promise<void> => {
    try {
      this.socket = io(URLs[enviornment].socketURL, {
        transports: ["websocket"],
        reconnectionAttempts: 10, // Try reconnecting 10 times
        reconnectionDelay: 5000, // Wait 5 seconds before reconnecting
      });

      this.socket.on("connect_error", (error: any) => {
        this.socketInitialized = false;
        console.log("Socket connect_error", error);
      });

      this.socket.on("connect", () => {
        // Log the socket ID
        this.socketInitialized = true;
        if (this.socket?.id) {
          this.socketId = this.socket?.id;
          if (callBack) {
            // console.log("got it");
            callBack();
          }
        }
        console.log("connected", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        this.socketInitialized = false;
        this.socketId = "";
        console.log("=== Socket Disconnected ===");
      });

      this.socket.on("error", (data: any) => {
        console.log("Socket Error", data);
      });
    } catch (error) {
      this.socketInitialized = false;
      console.log("Socket is not initialized", error);
    }
  };

  isConnected = (): boolean => {
    return this.socketInitialized;
  };

  // Emit events with data
  emit(event: string, data: any = {}): void {
    if (this.socket) {
      this.socket.emit(event, data);
      console.log(event, data);
    } else {
      this.socketInitialized = false;
      console.log("Socket is not initialized while emitting.");
    }
  }

  // Listen to events
  on(event: string, cb: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, cb);
      // console.log(event);
    } else {
      this.socketInitialized = false;
      console.log("Socket is not initialized while listening.");
    }
  }

  // Remove a listener for a specific event
  removeListener(listenerName: string): void {
    if (this.socket) {
      this.socket.removeListener(listenerName);
    } else {
      this.socketInitialized = false;
      console.log("Socket is not initialized while removing.");
    }
  }

  disConnect(callBack?: any) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.socketInitialized = false;
      this.socketId = "";
      if (callBack) {
        console.log("got it");
        callBack();
      }
      console.log("=== Socket Disconnected ===");
    } else {
      console.log("Socket is already disconnected.");
    }
  }
}

const socketServices = new WSService();

export default socketServices;
