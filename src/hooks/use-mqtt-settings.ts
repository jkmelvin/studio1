"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "nfc-connect-mqtt-settings";

export type MqttSettings = {
  brokerUrl: string;
  topic: string;
};

const defaultSettings: MqttSettings = {
  brokerUrl: "",
  topic: "",
};

export function useMqttSettings() {
  const [settings, setSettings] = useState<MqttSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Failed to load MQTT settings from local storage:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  const saveSettings = useCallback((newSettings: MqttSettings) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        setSettings(newSettings);
      } catch (error) {
        console.error("Failed to save MQTT settings to local storage:", error);
      }
    }
  }, []);

  return { settings, saveSettings, isLoaded };
}
