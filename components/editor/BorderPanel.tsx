"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Plus, Trash2, Square, Cloud } from "lucide-react";
import { toast } from "sonner";

export default function BorderPanel() {
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
  const [effectTab, setEffectTab] = useState<"border" | "shadow">("border");
  
  // Border parameters
  const [borderWidth, setBorderWidth] = useState(4);
  const [borderColor, setBorderColor] = useState("#ffffff");
  
  // Shadow parameters
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowSpread, setShadowSpread] = useState(5);
  const [shadowColor, setShadowColor] = useState("rgba(0, 0, 0, 0.5)");

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

  const handleAddEffect = () => {
    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    if (effectTab === "border") {
      // Add a border effect
      addEffect({
        type: 'border',
        startTime,
        endTime,
        parameters: {
          width: borderWidth,
          color: borderColor,
        },
      });
      toast.success("Border effect added");
    } else {
      // Add a shadow effect
      addEffect({
        type: 'shadow',
        startTime,
        endTime,
        parameters: {
          blur: shadowBlur,
          spread: shadowSpread,
          color: shadowColor,
        },
      });
      toast.success("Shadow effect added");
    }
    
    // Reset times for next effect
    setStartTime(0);
    setEndTime(duration);
  };

  // Format time for display and input
  const formatTimeForInput = (time: number) => {
    return time.toFixed(2);
  };

  // Filter effects by type
  const borderEffects = effects.filter(effect => effect.type === 'border');
  const shadowEffects = effects.filter(effect => effect.type === 'shadow');

  return (
    <div className="space-y-6">
      <div>
        <Tabs value={effectTab} onValueChange={(value) => setEffectTab(value as any)}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="border">Border</TabsTrigger>
            <TabsTrigger value="shadow">Shadow</TabsTrigger>
          </TabsList>
          
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="effect-start-time">Start Time</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="effect-start-time"
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
                <Label htmlFor="effect-end-time">End Time</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="effect-end-time"
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
            
            <TabsContent value="border" className="space-y-4 pt-2">
              <div>
                <Label htmlFor="border-width">Border Width: {borderWidth}px</Label>
                <Slider
                  id="border-width"
                  value={[borderWidth]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => setBorderWidth(value[0])}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="border-color">Border Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="border-color"
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-16 p-1 h-10"
                  />
                  <Input
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shadow" className="space-y-4 pt-2">
              <div>
                <Label htmlFor="shadow-blur">Shadow Blur: {shadowBlur}px</Label>
                <Slider
                  id="shadow-blur"
                  value={[shadowBlur]}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={(value) => setShadowBlur(value[0])}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="shadow-spread">Shadow Spread: {shadowSpread}px</Label>
                <Slider
                  id="shadow-spread"
                  value={[shadowSpread]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => setShadowSpread(value[0])}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="shadow-color">Shadow Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="shadow-color"
                    type="color"
                    value={shadowColor.startsWith('rgba') ? '#000000' : shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-16 p-1 h-10"
                  />
                  <Input
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="flex-1"
                    placeholder="rgba(0, 0, 0, 0.5)"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
          
          <Button
            onClick={handleAddEffect}
            className="w-full mt-2 gap-2"
          >
            <Plus className="h-4 w-4" /> Add {effectTab === "border" ? "Border" : "Shadow"} Effect
          </Button>
        </Tabs>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Applied Effects</h2>
        {borderEffects.length === 0 && shadowEffects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No border or shadow effects added yet</p>
        ) : (
          <div className="space-y-2">
            {borderEffects.map((effect) => (
              <div key={effect.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Square className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">
                  Border: {formatTimeForInput(effect.startTime)}s - {formatTimeForInput(effect.endTime)}s
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: effect.parameters.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {effect.parameters.width}px
                    </span>
                  </div>
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
            
            {shadowEffects.map((effect) => (
              <div key={effect.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">
                  Shadow: {formatTimeForInput(effect.startTime)}s - {formatTimeForInput(effect.endTime)}s
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: effect.parameters.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Blur: {effect.parameters.blur}px, Spread: {effect.parameters.spread}px
                    </span>
                  </div>
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