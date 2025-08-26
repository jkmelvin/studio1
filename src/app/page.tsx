"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nfc, PenSquare, ScanLine, Settings as SettingsIcon } from "lucide-react";
import { NfcReader } from "@/components/nfc-reader";
import { NfcWriter } from "@/components/nfc-writer";
import { SettingsForm } from "@/components/settings-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-4">
            <Nfc className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              NFC Connect
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Read, write, and relay NFC data with ease.
          </p>
        </header>

        <Tabs defaultValue="read" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="read">
              <ScanLine className="mr-2 h-4 w-4" />
              Read
            </TabsTrigger>
            <TabsTrigger value="write">
              <PenSquare className="mr-2 h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="read">
            <Card>
              <CardHeader>
                <CardTitle>Read NFC Tag</CardTitle>
                <CardDescription>
                  Scan an NFC tag to view its contents and send data to your MQTT broker.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NfcReader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="write">
            <Card>
              <CardHeader>
                <CardTitle>Write to NFC Tag</CardTitle>
                <CardDescription>
                  Enter text below and tap "Write to Tag" to write data to an NFC tag.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NfcWriter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>MQTT Settings</CardTitle>
                <CardDescription>
                  Configure your MQTT broker to relay NFC data. Settings are saved in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
