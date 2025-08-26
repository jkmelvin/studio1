"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PenSquare } from "lucide-react";

type Status = "idle" | "writing" | "success" | "error" | "unsupported";

export function NfcWriter() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [text, setText] = useState("");

  const handleWrite = async () => {
    if (!text) {
      toast({
        title: "Input Required",
        description: "Please enter some text to write.",
        variant: "destructive",
      });
      return;
    }
    
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      setStatus("unsupported");
      toast({
        title: "Unsupported Browser",
        description: "Web NFC is not available. Please use Chrome on Android.",
        variant: "destructive",
      });
      return;
    }

    try {
      setStatus("writing");
      const ndef = new NDEFReader();
      await ndef.write(text);
      setStatus("success");
      toast({
        title: "Write Successful!",
        description: "Your message has been written to the NFC tag.",
        variant: "default",
        className: "bg-accent text-accent-foreground border-accent",
      });
    } catch (error) {
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "NFC Write Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
        // After a moment, revert to idle to allow another write
        setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter data to write to the tag..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        disabled={status === "writing" || status === "unsupported"}
      />
      <Button onClick={handleWrite} disabled={status === "writing" || status === "unsupported"} className="w-full">
        {status === "writing" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PenSquare className="mr-2 h-4 w-4" />
        )}
        {status === "writing" ? "Waiting for Tag..." : "Write to Tag"}
      </Button>

      <p className="text-sm text-muted-foreground h-5">
        {status === "idle" && "Click 'Write to Tag' and bring an NFC tag near your device."}
        {status === "writing" && "Bring an NFC tag close to write the data."}
        {status === "success" && "Successfully wrote to tag! Ready for next write."}
        {status === "error" && "An error occurred. Please try again."}
        {status === "unsupported" && "Web NFC is not supported on this device/browser."}
      </p>
    </div>
  );
}
