import { create } from "zustand";

interface UploadState {
  selectedFile: File | null;
  uploadProgress: number;
  isUploading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
  setFile: (file: File | null) => void;
  setProgress: (progress: number) => void;
  startUpload: () => void;
  finishUpload: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  selectedFile: null,
  uploadProgress: 0,
  isUploading: false,
  uploadError: null,
  uploadSuccess: false,
  setFile: (file) => set({ selectedFile: file, uploadError: null }),
  setProgress: (uploadProgress) => set({ uploadProgress }),
  startUpload: () =>
    set({ isUploading: true, uploadError: null, uploadSuccess: false, uploadProgress: 0 }),
  finishUpload: () =>
    set({ isUploading: false, uploadSuccess: true, uploadProgress: 100 }),
  setError: (uploadError) => set({ uploadError, isUploading: false }),
  reset: () =>
    set({
      selectedFile: null,
      uploadProgress: 0,
      isUploading: false,
      uploadError: null,
      uploadSuccess: false,
    }),
}));