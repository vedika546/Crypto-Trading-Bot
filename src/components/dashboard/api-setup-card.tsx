"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldAlert } from 'lucide-react';

const formSchema = z.object({
  apiKey: z.string().min(10, "API Key must be at least 10 characters long."),
  apiSecret: z.string().min(10, "API Secret must be at least 10 characters long."),
});

type ApiSetupCardProps = {
  setApiCredentials: (key: string, secret: string) => void;
  isApiConnected: boolean;
  apiKey: string;
};

export function ApiSetupCard({ setApiCredentials, isApiConnected, apiKey }: ApiSetupCardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { apiKey: "", apiSecret: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setApiCredentials(values.apiKey, values.apiSecret);
    form.reset();
  }
  
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "....";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          API Setup
        </CardTitle>
        <CardDescription>
          Enter your Binance Testnet API credentials.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {isApiConnected ? (
               <div className="flex items-center justify-between p-3 rounded-md bg-accent/10 border border-accent/20">
                <div>
                  <p className="text-sm font-medium">API Connected</p>
                  <p className="text-xs text-muted-foreground">{maskApiKey(apiKey)}</p>
                </div>
                <Badge variant="outline" className="text-accent border-accent">Connected</Badge>
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Your API Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your API Secret" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          {!isApiConnected && (
            <CardFooter className="flex-col items-start gap-4">
              <Button type="submit">Save & Connect</Button>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Your keys are stored in your browser's local storage and are never sent to our servers. Use testnet keys only.</p>
              </div>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
