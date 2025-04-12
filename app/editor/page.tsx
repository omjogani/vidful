"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import VideoUploader from "@/components/editor/VideoUploader";
import VideoPlayer from "@/components/editor/VideoPlayer";
import Timeline from "@/components/editor/Timeline";
import TrimPanel from "@/components/editor/TrimPanel";
import ZoomPanel from "@/components/editor/ZoomPanel";
import BorderPanel from "@/components/editor/BorderPanel";
import ExportPanel from "@/components/editor/ExportPanel";
import { useUIStore } from "@/lib/store/useUIStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditorPage() {
  const { activeTab, setActiveTab } = useUIStore();
  const { videoUrl } = useProjectStore();

  return (
    <main className="min-h-screen flex flex-col p-4">
      <header className="flex justify-between items-center mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">VidFul Editor</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 flex flex-col gap-4">
        {!videoUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <VideoUploader />
          </div>
        ) : (
          <>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card className="h-full overflow-hidden flex flex-col">
                  <VideoPlayer />
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="h-full p-4">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={(value) => setActiveTab(value as any)}
                    className="h-full flex flex-col"
                  >
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="trim">Trim</TabsTrigger>
                      <TabsTrigger value="zoom">Zoom</TabsTrigger>
                      <TabsTrigger value="border">Border</TabsTrigger>
                      <TabsTrigger value="export">Export</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 pt-4 overflow-auto">
                      <TabsContent value="trim" className="h-full">
                        <TrimPanel />
                      </TabsContent>
                      <TabsContent value="zoom" className="h-full">
                        <ZoomPanel />
                      </TabsContent>
                      <TabsContent value="border" className="h-full">
                        <BorderPanel />
                      </TabsContent>
                      <TabsContent value="export" className="h-full">
                        <ExportPanel />
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </div>
            </div>
            <Card className="p-4">
              <Timeline />
            </Card>
          </>
        )}
      </div>
    </main>
  );
} 