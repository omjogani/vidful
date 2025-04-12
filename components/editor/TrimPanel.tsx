"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Scissors, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TrimPanel() {
  const {
    duration,
    currentTime,
    trims,
    addTrim,
    removeTrim,
    updateTrim,
  } = useProjectStore();

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);

  const handleSetStartTime = () => {
    setStartTime(currentTime);
    if (currentTime >= endTime) {
      setEndTime(Math.min(currentTime + 5, duration));
    }
  };

  const handleSetEndTime = () => {
    setEndTime(currentTime);
    if (currentTime <= startTime) {
      setStartTime(Math.max(currentTime - 5, 0));
    }
  };

  const handleAddTrim = () => {
    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    addTrim({
      startTime,
      endTime,
    });

    toast.success("Trim segment added");
    
    // Reset for next trim
    setStartTime(0);
    setEndTime(duration);
  };

  // Format time for display and input
  const formatTimeForInput = (time: number) => {
    return time.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Add Trim Segment</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="start-time"
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
            <Label htmlFor="end-time">End Time</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="end-time"
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
        <Button
          onClick={handleAddTrim}
          className="w-full mt-2 gap-2"
        >
          <Plus className="h-4 w-4" /> Add Trim Segment
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Trim Segments</h2>
        {trims.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trim segments added yet</p>
        ) : (
          <div className="space-y-2">
            {trims.map((trim) => (
              <div key={trim.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">
                  {formatTimeForInput(trim.startTime)}s - {formatTimeForInput(trim.endTime)}s
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTrim(trim.id)}
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