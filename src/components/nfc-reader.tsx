"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMqttSettings } from "@/hooks/use-mqtt-settings";
import { publish } from "@/lib/mqtt";
import { Loader2, ScanLine } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

type Status = "idle" | "scanning" | "success" | "error" | "unsupported";
type LogEntry = {
  type: "info" | "error" | "data" | "success";
  message: string;
  timestamp: string;
};

export function NfcReader() {
  const { toast } = useToast();
  const { settings } = useMqttSettings();
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [controller, setController] = useState<AbortController | null>(null);

  const addLog = (type: LogEntry["type"], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [{ type, message, timestamp }, ...prevLogs]);
  };

  const handleRead = useCallback(async () => {
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      setStatus("unsupported");
      addLog("error", "Web NFC is not supported on this browser.");
      toast({
        title: "Unsupported Browser",
        description: "Web NFC is not available. Please use Chrome on Android.",
        variant: "destructive",
      });
      return;
    }

    if (status === "scanning") {
      addLog("info", "Scan already in progress.");
      return;
    }

    try {
      const newController = new AbortController();
      setController(newController);
      const ndef = new NDEFReader();

      addLog("info", "Starting NFC scan...");
      setStatus("scanning");

      ndef.addEventListener("reading", (event) => {
        const { serialNumber } = event;
        const decoder = new TextDecoder();
        
        setStatus("success");
        addLog("success", `Tag found! Serial: ${serialNumber}`);

        for (const record of event.message.records) {
          const decodedData = decoder.decode(record.data);
          addLog("data", `Record type: ${record.recordType}, Data: "${decodedData}"`);
          
          if (settings.brokerUrl && settings.topic) {
            publish(settings, decodedData)
              .then(() => addLog("info", `Data sent to MQTT topic: ${settings.topic}`))
              .catch((err) => addLog("error", `MQTT publish failed: ${err.message}`));
          } else {
            addLog("error", "MQTT settings not configured. Data not sent.");
          }
        }
        
        toast({
          title: "NFC Tag Read Successfully!",
          description: `Serial Number: ${serialNumber}`,
          variant: "default",
          className: "bg-accent text-accent-foreground border-accent",
        });
      });

      ndef.addEventListener("readingerror", () => {
        setStatus("error");
        addLog("error", "Cannot read data from the NFC tag. Try again.");
        toast({
          title: "Read Error",
          description: "Could not read the NFC tag.",
          variant: "destructive",
        });
      });
      
      await ndef.scan({ signal: newController.signal });

    } catch (error) {
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog("error", `Scan failed: ${errorMessage}`);
      toast({
        title: "NFC Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [status, settings, toast]);

  const stopScan = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setStatus("idle");
      addLog("info", "Scan stopped by user.");
    }
  };

  useEffect(() => {
    return () => {
      if(controller) {
        controller.abort();
      }
    }
  }, [controller]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleRead} disabled={status === "scanning" || status === "unsupported"} className="w-full sm:w-auto">
          {status === "scanning" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanLine className="mr-2 h-4 w-4" />
          )}
          {status === "scanning" ? "Scanning..." : "Start Scanning"}
        </Button>
        {status === "scanning" && (
           <Button onClick={stopScan} variant="destructive" className="w-full sm:w-auto">
             Stop Scan
           </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground h-5">
        {status === "idle" && "Click 'Start Scanning' and bring an NFC tag near your device."}
        {status === "scanning" && "Waiting for an NFC tag..."}
        {status === "success" && "Tag read successfully! Scan again or check the log below."}
        {status === "error" && "An error occurred. Check the log and try again."}
        {status === "unsupported" && "Web NFC is not supported on this device/browser."}
      </p>

      <ScrollArea className="h-64 w-full rounded-md border p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Logs will appear here...
          </div>
        ) : (
          <div className="flex flex-col-reverse">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span className="text-muted-foreground">{log.timestamp}</span>
                <Badge variant={log.type === 'error' ? 'destructive' : 'secondary'} className={log.type === 'success' ? 'bg-accent text-accent-foreground' : ''}>
                  {log.type.toUpperCase()}
                </Badge>
                <span className="flex-1 break-words whitespace-pre-wrap">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
