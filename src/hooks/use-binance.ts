"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Order, Log, OrderSide, OrderType } from '@/lib/types';

export function useBinance() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem('binance-apiKey');
      const storedApiSecret = localStorage.getItem('binance-apiSecret');

      if (storedApiKey && storedApiSecret) {
        setApiKey(storedApiKey);
        setApiSecret(storedApiSecret);
        setIsApiConnected(true);
        addLog('INFO', 'Restored API credentials from local storage.');
      }
    } catch (error) {
        addLog('ERROR', 'Could not access local storage.');
    }
  }, []);

  const addLog = useCallback((type: Log['type'], message: string) => {
    const newLog: Log = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const setApiCredentials = useCallback((key: string, secret: string) => {
    setApiKey(key);
    setApiSecret(secret);
    setIsApiConnected(true);
    try {
      localStorage.setItem('binance-apiKey', key);
      localStorage.setItem('binance-apiSecret', secret);
    } catch (error) {
        addLog('ERROR', 'Could not access local storage.');
    }
    addLog('SUCCESS', 'API credentials saved and connected.');
    toast({
      title: "API Connected",
      description: "Your Binance Testnet API credentials have been saved.",
      variant: "default",
    });
  }, [addLog, toast]);

  const placeOrder = useCallback((orderData: { symbol: string; type: OrderType; side: OrderSide; quantity: number; price?: number }) => {
    if (!isApiConnected) {
      addLog('ERROR', 'Failed to place order: API not connected.');
      toast({
        title: "Order Failed",
        description: "Please connect to the API before placing an order.",
        variant: "destructive",
      });
      return;
    }

    addLog('INFO', `Placing ${orderData.type} ${orderData.side} order for ${orderData.quantity} ${orderData.symbol}...`);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: 'NEW',
      createdAt: new Date(),
    };
    
    setOrders(prev => [newOrder, ...prev]);

    // Simulate API response
    setTimeout(() => {
      setOrders(prevOrders => prevOrders.map(o => o.id === newOrder.id ? { ...o, status: 'FILLED' } : o));
      addLog('SUCCESS', `Order ${newOrder.id} successfully filled.`);
      toast({
        title: "Order Placed",
        description: `${orderData.symbol} ${orderData.side} order has been filled.`,
        className: 'bg-accent text-accent-foreground'
      });
    }, 1500 + Math.random() * 1000);

  }, [isApiConnected, addLog, toast]);

  return { apiKey, isApiConnected, setApiCredentials, placeOrder, orders, logs };
}
