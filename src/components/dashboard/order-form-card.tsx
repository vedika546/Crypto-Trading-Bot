"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from 'lucide-react';
import type { OrderSide, OrderType } from "@/lib/types";

const formSchema = z.object({
  symbol: z.string().min(3, "Symbol is required").toUpperCase(),
  type: z.enum(["MARKET", "LIMIT"]),
  side: z.enum(["BUY", "SELL"]),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  price: z.coerce.number().optional(),
}).refine(data => {
    if (data.type === 'LIMIT') {
      return data.price && data.price > 0;
    }
    return true;
}, {
    message: "Price is required for Limit orders.",
    path: ["price"],
});

type OrderFormCardProps = {
  placeOrder: (order: { symbol: string; type: OrderType; side: OrderSide; quantity: number; price?: number }) => void;
  isApiConnected: boolean;
};

export function OrderFormCard({ placeOrder, isApiConnected }: OrderFormCardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { symbol: "BTCUSDT", type: "MARKET", side: "BUY", quantity: 0.001 },
  });

  const orderType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    placeOrder(values);
    form.reset({ ...values, quantity: 0.001, price: undefined });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Place Order
        </CardTitle>
        <CardDescription>
          Create a new market or limit order.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <fieldset disabled={!isApiConnected} className="group">
            <CardContent className="space-y-4">
              <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BTCUSDT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-2">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="MARKET" id="market" /></FormControl>
                            <Label htmlFor="market">Market</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="LIMIT" id="limit" /></FormControl>
                            <Label htmlFor="limit">Limit</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="side"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Side</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-2">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="BUY" id="buy" /></FormControl>
                            <Label htmlFor="buy">Buy</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="SELL" id="sell" /></FormControl>
                            <Label htmlFor="sell">Sell</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="0.001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {orderType === "LIMIT" && (
                   <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="Limit Price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Place Order</Button>
            </CardFooter>
            {!isApiConnected && (
                <p className="text-center text-xs text-muted-foreground -mt-4 mb-4 px-6">Connect API to place orders.</p>
            )}
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
