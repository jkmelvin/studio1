"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMqttSettings } from "@/hooks/use-mqtt-settings";
import { useEffect, useState } from "react";
import { Rss, Save, TestTube2, Loader2 } from "lucide-react";
import { testConnection } from "@/lib/mqtt";

const formSchema = z.object({
  brokerUrl: z.string().url({ message: "Please enter a valid URL (e.g., wss://broker.hivemq.com:8884/mqtt)." }),
  topic: z.string().min(1, { message: "Topic cannot be empty." }),
});

export function SettingsForm() {
  const { toast } = useToast();
  const { settings, saveSettings } = useMqttSettings();
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brokerUrl: "",
      topic: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveSettings(values);
    toast({
      title: "Settings Saved",
      description: "Your MQTT configuration has been updated.",
    });
  }

  async function handleTestConnection() {
    const values = form.getValues();
    const result = formSchema.safeParse(values);
    if (!result.success) {
      form.trigger(); // show validation errors
      return;
    }
    
    setIsTesting(true);
    try {
      await testConnection(values);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the MQTT broker.",
        variant: "default",
        className: "bg-accent text-accent-foreground border-accent",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="brokerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Rss className="mr-2 h-4 w-4" />
                Broker URL
              </FormLabel>
              <FormControl>
                <Input placeholder="wss://your-mqtt-broker-url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MQTT Topic</FormLabel>
              <FormControl>
                <Input placeholder="nfc/data" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleTestConnection} disabled={isTesting}>
            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <TestTube2 className="mr-2 h-4 w-4" /> }
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
