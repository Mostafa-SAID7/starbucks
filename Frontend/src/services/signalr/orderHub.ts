import * as signalR from '@microsoft/signalr';

export interface OrderUpdate {
  orderId: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  estimatedTime?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  message?: string;
}

export interface OrderHubCallbacks {
  onOrderStatusChanged?: (update: OrderUpdate) => void;
  onOrderReady?: (orderId: string) => void;
  onOrderDelivered?: (orderId: string) => void;
  onOrderCancelled?: (orderId: string) => void;
  onDeliveryLocationUpdated?: (orderId: string, location: { latitude: number; longitude: number }) => void;
  onChatMessage?: (orderId: string, message: string, sender: string) => void;
  onInventoryUpdated?: (itemId: string, available: boolean) => void;
}

class OrderHub {
  private connection: signalR.HubConnection | null = null;
  private callbacks: OrderHubCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private offlineQueue: Array<{ method: string; args: any[] }> = [];

  constructor(private hubUrl: string = '/orderHub') {}

  async connect(token: string): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 0, 1000, 3000, 5000, 10000])
        .withHubProtocol(new signalR.JsonHubProtocol())
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupEventHandlers();

      await this.connection.start();
      console.log('SignalR connected');
      this.reconnectAttempts = 0;

      // Process offline queue
      await this.processOfflineQueue();
    } catch (error) {
      console.error('SignalR connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Order status updates
    this.connection.on('OrderStatusChanged', (update: OrderUpdate) => {
      this.callbacks.onOrderStatusChanged?.(update);
    });

    this.connection.on('OrderReady', (orderId: string) => {
      this.callbacks.onOrderReady?.(orderId);
    });

    this.connection.on('OrderDelivered', (orderId: string) => {
      this.callbacks.onOrderDelivered?.(orderId);
    });

    this.connection.on('OrderCancelled', (orderId: string) => {
      this.callbacks.onOrderCancelled?.(orderId);
    });

    // Delivery tracking
    this.connection.on('DeliveryLocationUpdated', (orderId: string, location: any) => {
      this.callbacks.onDeliveryLocationUpdated?.(orderId, location);
    });

    // Chat
    this.connection.on('ChatMessage', (orderId: string, message: string, sender: string) => {
      this.callbacks.onChatMessage?.(orderId, message, sender);
    });

    // Inventory
    this.connection.on('InventoryUpdated', (itemId: string, available: boolean) => {
      this.callbacks.onInventoryUpdated?.(itemId, available);
    });

    // Connection events
    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.reconnectAttempts = 0;
    });

    this.connection.onclose(() => {
      console.log('SignalR disconnected');
      this.handleReconnect();
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        // Reconnect logic handled by withAutomaticReconnect
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private async processOfflineQueue(): Promise<void> {
    while (this.offlineQueue.length > 0 && this.isConnected()) {
      const { method, args } = this.offlineQueue.shift()!;
      try {
        await (this.connection as any).invoke(method, ...args);
      } catch (error) {
        console.error(`Failed to invoke ${method}:`, error);
        this.offlineQueue.unshift({ method, args });
        break;
      }
    }
  }

  setCallbacks(callbacks: OrderHubCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  async subscribeToOrder(orderId: string): Promise<void> {
    if (this.isConnected()) {
      await this.connection!.invoke('SubscribeToOrder', orderId);
    } else {
      this.offlineQueue.push({ method: 'SubscribeToOrder', args: [orderId] });
    }
  }

  async unsubscribeFromOrder(orderId: string): Promise<void> {
    if (this.isConnected()) {
      await this.connection!.invoke('UnsubscribeFromOrder', orderId);
    }
  }

  async sendChatMessage(orderId: string, message: string): Promise<void> {
    if (this.isConnected()) {
      await this.connection!.invoke('SendChatMessage', orderId, message);
    } else {
      this.offlineQueue.push({ method: 'SendChatMessage', args: [orderId, message] });
    }
  }

  async updateDeliveryLocation(orderId: string, latitude: number, longitude: number): Promise<void> {
    if (this.isConnected()) {
      await this.connection!.invoke('UpdateDeliveryLocation', orderId, latitude, longitude);
    } else {
      this.offlineQueue.push({ method: 'UpdateDeliveryLocation', args: [orderId, latitude, longitude] });
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

// Singleton instance
let orderHubInstance: OrderHub | null = null;

export function getOrderHub(): OrderHub {
  if (!orderHubInstance) {
    orderHubInstance = new OrderHub();
  }
  return orderHubInstance;
}

export function createOrderHub(hubUrl?: string): OrderHub {
  return new OrderHub(hubUrl);
}
