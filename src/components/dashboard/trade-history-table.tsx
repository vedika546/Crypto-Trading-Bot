"use client";

import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookText, ShoppingBag } from 'lucide-react';

type TradeHistoryTableProps = {
  orders: Order[];
};

export function TradeHistoryTable({ orders }: TradeHistoryTableProps) {
  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'FILLED': return 'bg-accent/20 text-accent-foreground border-accent/20';
      case 'NEW': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'CANCELED': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      case 'FAILED': return 'bg-destructive/20 text-destructive border-destructive/20';
      default: return '';
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-2 pt-4">
        <CardTitle className="flex items-center gap-2">
            <BookText className="h-5 w-5" />
            Recent Trades
        </CardTitle>
        <CardDescription>A log of your recent market and limit orders.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.symbol}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        order.side === 'BUY' ? 'text-green-500 border-green-500/50' : 'text-red-500 border-red-500/50'
                      )}>
                        {order.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.quantity}</TableCell>
                    <TableCell className="text-right">{order.price ? `$${order.price.toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getStatusClass(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ShoppingBag className="h-8 w-8" />
                        <p>No orders placed yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
