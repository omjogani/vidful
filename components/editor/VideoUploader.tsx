"use client";

import { ChangeEvent, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video } from "lucide-react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { toast } from "sonner";

export default function VideoUploader() {
  const { setVideoFile, setVideoUrl } = useProjectStore();
  const { setIsUploading } = useUIStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    setIsUploading(true);
    
    // Create a URL for the video file
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    
    toast.success('Video uploaded successfully');
    setIsUploading(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className={`w-full max-w-lg transition-all ${isDragging ? 'scale-105 ring-2 ring-primary' : ''}`}>
      <CardContent>
        <div 
          className="flex flex-col items-center justify-center gap-4 p-10 text-center border-2 border-dashed rounded-lg border-muted-foreground/25"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Video className="w-16 h-16 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Upload a video</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop a video file here, or click to select
            </p>
          </div>
          <label htmlFor="video-upload">
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Select Video
            </Button>
            <input 
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
} 