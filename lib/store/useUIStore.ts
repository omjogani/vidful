import { create } from 'zustand';

interface UIState {
  activeTab: 'trim' | 'zoom' | 'border' | 'export';
  isUploading: boolean;
  isProcessing: boolean;
  isExporting: boolean;
  showTimeline: boolean;
  showControls: boolean;
  
  // Actions
  setActiveTab: (tab: UIState['activeTab']) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsExporting: (isExporting: boolean) => void;
  setShowTimeline: (show: boolean) => void;
  setShowControls: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'trim',
  isUploading: false,
  isProcessing: false,
  isExporting: false,
  showTimeline: true,
  showControls: true,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIsExporting: (isExporting) => set({ isExporting }),
  setShowTimeline: (show) => set({ showTimeline: show }),
  setShowControls: (show) => set({ showControls: show }),
})); 