"use client";

import type { Log } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Info, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const handleDownloadLogs = () => {
    if (!logs.length) return;

    const formattedLogs = logs
      .slice()
      .reverse()
      .map(log => {
        const timestamp = log.timestamp.toISOString();
        return `${timestamp} [${log.type}] ${log.message}`;
      })
      .join('\n');

    const blob = new Blob([formattedLogs], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `trade-pilot-logs-${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-2 pt-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Activity Logs
          </CardTitle>
          <CardDescription>
              Live feed of API requests, responses, and errors.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadLogs} disabled={logs.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Logs
        </Button>
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
                            {log.timestamp.toTimeString().slice(0, 8)}
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
