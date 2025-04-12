"use client";

import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function VideoPlayer() {
  const { 
    videoUrl, 
    currentTime, 
    duration, 
    isPlaying, 
    setCurrentTime, 
    setDuration, 
    setIsPlaying,
    effects 
  } = useProjectStore();
  
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    // If player is seeking programmatically, seek to the time
    if (playerRef.current && !isPlaying) {
      playerRef.current.seekTo(currentTime, 'seconds');
    }
  }, [currentTime, isPlaying]);

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (isPlaying) {
      setCurrentTime(playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 5);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 5);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
    }
  };

  // This will dynamically apply the zoom effect and any other effects via CSS filters and transforms
  const getVideoStyles = () => {
    const zoomEffects = effects.filter(e => e.type === 'zoom');
    const borderEffects = effects.filter(e => e.type === 'border');
    const shadowEffects = effects.filter(e => e.type === 'shadow');
    
    let transform = 'scale(1)';
    let borderStyle = '';
    let boxShadow = '';
    
    // Apply zoom effects that are active at current time
    for (const effect of zoomEffects) {
      if (currentTime >= effect.startTime && currentTime <= effect.endTime) {
        const progress = (currentTime - effect.startTime) / (effect.endTime - effect.startTime);
        const scale = 1 + (effect.parameters.intensity * progress);
        transform = `scale(${scale})`;
        break; // Only apply one zoom effect at a time
      }
    }
    
    // Apply border effects
    for (const effect of borderEffects) {
      if (currentTime >= effect.startTime && currentTime <= effect.endTime) {
        const width = effect.parameters.width || 2;
        const color = effect.parameters.color || '#ffffff';
        borderStyle = `${width}px solid ${color}`;
        break;
      }
    }
    
    // Apply shadow effects
    for (const effect of shadowEffects) {
      if (currentTime >= effect.startTime && currentTime <= effect.endTime) {
        const blur = effect.parameters.blur || 10;
        const spread = effect.parameters.spread || 0;
        const color = effect.parameters.color || 'rgba(0, 0, 0, 0.5)';
        boxShadow = `0 0 ${blur}px ${spread}px ${color}`;
        break;
      }
    }
    
    return {
      transform,
      border: borderStyle,
      boxShadow
    };
  };

  if (!videoUrl) return null;

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-black">
        <div style={getVideoStyles()} className="transition-transform">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={isPlaying}
            width="100%"
            height="100%"
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={100}
          />
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipBackward}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleSkipForward}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
} 