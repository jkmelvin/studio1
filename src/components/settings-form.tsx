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
import { useEffect } from "react";
import { Rss, Save } from "lucide-react";

const formSchema = z.object({
  brokerUrl: z.string().url({ message: "Please enter a valid URL (e.g., wss://broker.hivemq.com:8884/mqtt)." }),
  topic: z.string().min(1, { message: "Topic cannot be empty." }),
});

export function SettingsForm() {
  const { toast } = useToast();
  const { settings, saveSettings } = useMqttSettings();

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
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
