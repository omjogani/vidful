"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Plus, Trash2, ZoomIn } from "lucide-react";
import { toast } from "sonner";

export default function ZoomPanel() {
  const {
    duration,
    currentTime,
    effects,
    addEffect,
    removeEffect,
    updateEffect,
  } = useProjectStore();

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);
  const [intensity, setIntensity] = useState(0.2); // 0.2 means 20% zoom

  const handleSetStartTime = () => {
    setStartTime(currentTime);
    if (currentTime >= endTime) {
      setEndTime(Math.min(currentTime + 3, duration));
    }
  };

  const handleSetEndTime = () => {
    setEndTime(currentTime);
    if (currentTime <= startTime) {
      setStartTime(Math.max(currentTime - 3, 0));
    }
  };

  const handleAddZoomEffect = () => {
    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    // Add a zoom effect
    addEffect({
      type: 'zoom',
      startTime,
      endTime,
      parameters: {
        intensity,
      },
    });

    toast.success("Zoom effect added");
    
    // Reset for next effect
    setStartTime(0);
    setEndTime(duration);
    setIntensity(0.2);
  };

  // Format time for display and input
  const formatTimeForInput = (time: number) => {
    return time.toFixed(2);
  };

  // Filter only zoom effects
  const zoomEffects = effects.filter(effect => effect.type === 'zoom');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Add Zoom Effect</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="zoom-start-time">Start Time</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="zoom-start-time"
                type="number"
                min={0}
                max={duration}
                step={0.01}
                value={formatTimeForInput(startTime)}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetStartTime}
              >
                Set
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="zoom-end-time">End Time</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="zoom-end-time"
                type="number"
                min={0}
                max={duration}
                step={0.01}
                value={formatTimeForInput(endTime)}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetEndTime}
              >
                Set
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="zoom-intensity">Zoom Intensity: {Math.round(intensity * 100)}%</Label>
          <Slider
            id="zoom-intensity"
            value={[intensity]}
            min={0.05}
            max={0.5}
            step={0.05}
            onValueChange={(value) => setIntensity(value[0])}
            className="mt-1.5"
          />
        </div>
        
        <Button
          onClick={handleAddZoomEffect}
          className="w-full mt-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Zoom Effect
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Zoom Effects</h2>
        {zoomEffects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No zoom effects added yet</p>
        ) : (
          <div className="space-y-2">
            {zoomEffects.map((effect) => (
              <div key={effect.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">
                  {formatTimeForInput(effect.startTime)}s - {formatTimeForInput(effect.endTime)}s
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({Math.round(effect.parameters.intensity * 100)}% zoom)
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEffect(effect.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 