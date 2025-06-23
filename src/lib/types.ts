export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderStatus = 'NEW' | 'FILLED' | 'CANCELED' | 'FAILED';

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number;
  status: OrderStatus;
  createdAt: Date;
}

export type LogType = 'INFO' | 'ERROR' | 'SUCCESS';

export interface Log {
  id: string;
  timestamp: Date;
  type: LogType;
  message: string;
}
