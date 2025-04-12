import { create } from 'zustand';

type VideoEffect = {
  id: string;
  type: 'zoom' | 'border' | 'shadow';
  startTime: number;
  endTime: number;
  parameters: Record<string, any>;
};

type Trim = {
  id: string;
  startTime: number;
  endTime: number;
};

interface ProjectState {
  videoFile: File | null;
  videoUrl: string | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  trims: Trim[];
  effects: VideoEffect[];
  selectedEffectId: string | null;
  
  // Actions
  setVideoFile: (file: File | null) => void;
  setVideoUrl: (url: string | null) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addTrim: (trim: Omit<Trim, 'id'>) => void;
  removeTrim: (id: string) => void;
  updateTrim: (id: string, updates: Partial<Omit<Trim, 'id'>>) => void;
  addEffect: (effect: Omit<VideoEffect, 'id'>) => void;
  removeEffect: (id: string) => void;
  updateEffect: (id: string, updates: Partial<Omit<VideoEffect, 'id'>>) => void;
  setSelectedEffectId: (id: string | null) => void;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useProjectStore = create<ProjectState>((set) => ({
  videoFile: null,
  videoUrl: null,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  trims: [],
  effects: [],
  selectedEffectId: null,
  
  setVideoFile: (file) => set({ videoFile: file }),
  setVideoUrl: (url) => set({ videoUrl: url }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  addTrim: (trim) => set((state) => ({
    trims: [...state.trims, { ...trim, id: generateId() }]
  })),
  
  removeTrim: (id) => set((state) => ({
    trims: state.trims.filter(trim => trim.id !== id)
  })),
  
  updateTrim: (id, updates) => set((state) => ({
    trims: state.trims.map(trim => 
      trim.id === id ? { ...trim, ...updates } : trim
    )
  })),
  
  addEffect: (effect) => set((state) => ({
    effects: [...state.effects, { ...effect, id: generateId() }]
  })),
  
  removeEffect: (id) => set((state) => ({
    effects: state.effects.filter(effect => effect.id !== id),
    selectedEffectId: state.selectedEffectId === id ? null : state.selectedEffectId
  })),
  
  updateEffect: (id, updates) => set((state) => ({
    effects: state.effects.map(effect => 
      effect.id === id ? { ...effect, ...updates } : effect
    )
  })),
  
  setSelectedEffectId: (id) => set({ selectedEffectId: id }),
  
  reset: () => set({
    videoFile: null,
    videoUrl: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    trims: [],
    effects: [],
    selectedEffectId: null
  })
})); 