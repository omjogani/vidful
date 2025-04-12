"use client";

import { useRef, useEffect, useState } from "react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Slider } from "@/components/ui/slider";

export default function Timeline() {
  const {
    duration,
    currentTime,
    setCurrentTime,
    trims,
    effects,
  } = useProjectStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineWidth, setTimelineWidth] = useState(0);

  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth);
      }
    };

    updateTimelineWidth();
    window.addEventListener("resize", updateTimelineWidth);
    return () => window.removeEventListener("resize", updateTimelineWidth);
  }, []);

  // Format time as MM:SS.ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  // Get position on timeline for a given time
  const getPositionFromTime = (time: number) => {
    return (time / duration) * 100;
  };

  return (
    <div className="flex flex-col gap-2" ref={timelineRef}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="relative h-10">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration}
          step={0.01}
          onValueChange={(value) => setCurrentTime(value[0])}
          className="absolute inset-0"
        />

        {/* Timeline markers for trims */}
        {trims.map((trim) => (
          <div
            key={trim.id}
            className="absolute top-0 h-full bg-yellow-500/30 z-10 pointer-events-none"
            style={{
              left: `${getPositionFromTime(trim.startTime)}%`,
              width: `${
                getPositionFromTime(trim.endTime) -
                getPositionFromTime(trim.startTime)
              }%`,
            }}
          />
        ))}

        {/* Timeline markers for effects */}
        {effects.map((effect) => {
          // Different colors for different effect types
          const effectColors = {
            zoom: "bg-blue-500/30",
            border: "bg-green-500/30",
            shadow: "bg-purple-500/30",
          };

          return (
            <div
              key={effect.id}
              className={`absolute bottom-0 h-2 ${
                effectColors[effect.type]
              } z-10 pointer-events-none rounded-full`}
              style={{
                left: `${getPositionFromTime(effect.startTime)}%`,
                width: `${
                  getPositionFromTime(effect.endTime) -
                  getPositionFromTime(effect.startTime)
                }%`,
              }}
            />
          );
        })}

        {/* Current time position marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-primary z-20 pointer-events-none"
          style={{
            left: `${getPositionFromTime(currentTime)}%`,
          }}
        />
      </div>
    </div>
  );
} 