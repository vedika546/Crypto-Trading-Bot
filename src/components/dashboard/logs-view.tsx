"use client";

import type { Log } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Info, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";

type LogsViewProps = {
  logs: Log[];
};

export function LogsView({ logs }: LogsViewProps) {
  const getLogIcon = (type: Log['type']) => {
    switch (type) {
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getLogColor = (type: Log['type']) => {
    switch (type) {
        case 'INFO':
          return 'text-blue-500';
        case 'SUCCESS':
          return 'text-accent';
        case 'ERROR':
          return 'text-destructive';
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-2 pt-4">
        <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Activity Logs
        </CardTitle>
        <CardDescription>
            Live feed of API requests, responses, and errors.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-2 space-y-2 font-mono text-sm">
            {logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                    <span className="mt-0.5">{getLogIcon(log.type)}</span>
                    <div className="flex-1">
                        <span className="text-muted-foreground mr-2">
                            {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className={cn('font-medium', getLogColor(log.type))}>
                            [{log.type}]
                        </span>
                        <span className="ml-2">{log.message}</span>
                    </div>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-40">
                    <FileText className="h-8 w-8" />
                    <p>No log entries yet.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
