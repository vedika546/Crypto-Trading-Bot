"use client";

import { ApiSetupCard } from "@/components/dashboard/api-setup-card";
import { OrderFormCard } from "@/components/dashboard/order-form-card";
import { LogsView } from "@/components/dashboard/logs-view";
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table";
import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBinance } from "@/hooks/use-binance";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { 
    apiKey, 
    isApiConnected, 
    setApiCredentials, 
    placeOrder, 
    orders, 
    logs 
  } = useBinance();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 lg:gap-8">
            <ApiSetupCard setApiCredentials={setApiCredentials} isApiConnected={isApiConnected} apiKey={apiKey} />
            <OrderFormCard placeOrder={placeOrder} isApiConnected={isApiConnected} />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardContent className="p-2 md:p-4">
                <Tabs defaultValue="history">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Trade History</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history">
                    <TradeHistoryTable orders={orders} />
                  </TabsContent>
                  <TabsContent value="logs">
                    <LogsView logs={logs} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
