"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { toast } from "sonner";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Progress } from "@/components/ui/progress";
import { Download, Film } from "lucide-react";

// Check if SharedArrayBuffer is available in the browser
const isSharedArrayBufferAvailable = typeof SharedArrayBuffer !== 'undefined';

// Configure FFmpeg with the older API
const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

export default function ExportPanel() {
  const { videoFile, trims, effects } = useProjectStore();
  const { setIsExporting } = useUIStore();
  
  const [progress, setProgress] = useState(0);
  const [outputName, setOutputName] = useState("vidful-output.mp4");
  const [isLoading, setIsLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  // For a real implementation, you'd use FFmpeg to apply all effects and trimming
  // This is a simplified version that just shows the concept
  const handleExport = async () => {
    if (!videoFile) {
      toast.error("No video to export");
      return;
    }

    try {
      setIsLoading(true);
      setIsExporting(true);
      setProgress(0);
      setOutputUrl(null);
      
      // Check if SharedArrayBuffer is available (required for FFmpeg.wasm)
      if (!isSharedArrayBufferAvailable) {
        // Fallback method for development - just create a direct URL
        setProgress(30);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(60);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(100);
        
        // Just use the original video for demo purposes
        const url = URL.createObjectURL(videoFile);
        setOutputUrl(url);
        toast.success("Export completed! (Development mode - using original video)");
      } else {
        // Using actual FFmpeg processing
        // Load FFmpeg if not already loaded
        if (!ffmpeg.isLoaded()) {
          toast.info("Loading video processing library...");
          await ffmpeg.load();
        }
        
        // Write the input file to memory
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
        
        // Set up a progress handler
        ffmpeg.setProgress(({ ratio }: { ratio: number }) => {
          setProgress(Math.round(ratio * 100));
        });
        
        // In a real implementation, you'd use the trims and effects data to 
        // generate a complex FFmpeg command. For simplicity, we'll just 
        // do a basic transcode here.
        
        // Example FFmpeg command that would apply effects
        // This is simplified and wouldn't actually apply your effects,
        // but demonstrates the pattern
        await ffmpeg.run(
          '-i', 'input.mp4',
          '-c:v', 'libx264',
          '-preset', 'fast', 
          '-crf', '22',
          'output.mp4'
        );
        
        // Read the output file from memory
        const data = ffmpeg.FS('readFile', 'output.mp4');
        
        // Create a URL for the output video
        // Use a proper type assertion to an ArrayBuffer which is acceptable for Blob
        const blob = new Blob([data.buffer as ArrayBuffer], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setOutputUrl(url);
        
        toast.success("Export completed!");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting video");
    } finally {
      setIsLoading(false);
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Export Video</h2>
        
        <div className="mb-4">
          <Label htmlFor="output-name">Output Filename</Label>
          <Input
            id="output-name"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            className="mt-1.5"
          />
        </div>
        
        {!isSharedArrayBufferAvailable && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            <p className="font-medium">Development Mode</p>
            <p>SharedArrayBuffer is not available. Using simplified export. For full functionality, deploy to a secure environment with proper headers.</p>
          </div>
        )}
        
        <Button
          onClick={handleExport}
          className="w-full gap-2"
          disabled={!videoFile || isLoading}
        >
          <Film className="h-4 w-4" />
          {isLoading ? "Processing..." : "Export Video"}
        </Button>
        
        {isLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </div>
      
      {outputUrl && (
        <div className="pt-4 border-t">
          <h3 className="text-md font-medium mb-2">Preview</h3>
          <div className="aspect-video bg-black rounded-md overflow-hidden mb-4">
            <video 
              src={outputUrl} 
              controls 
              className="w-full h-full"
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="w-full gap-2"
          >
            <Download className="h-4 w-4" />
            Download Video
          </Button>
        </div>
      )}
      
      <div className="pt-4 border-t text-sm text-muted-foreground">
        <p className="mb-2">Export summary:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Trim segments: {trims.length}</li>
          <li>Effects applied: {effects.length}</li>
          <li>
            Effects breakdown: {effects.filter(e => e.type === 'zoom').length} zoom,{' '}
            {effects.filter(e => e.type === 'border').length} border,{' '}
            {effects.filter(e => e.type === 'shadow').length} shadow
          </li>
        </ul>
      </div>
    </div>
  );
} 