import { create } from "zustand";
import { DocumentVersion } from "@/types/document";
import { UploadResponse } from "@/types/upload";

interface DocumentState {
  selectedVersion: string | null;
  selectedDocument: DocumentVersion | null;
  uploadedDocument: UploadResponse | null;
  loading: boolean;
  setVersion: (version: string | null) => void;
  setDocument: (document: DocumentVersion | null) => void;
  setUploadedDocument: (uploaded: UploadResponse | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  selectedVersion: null,
  selectedDocument: null,
  uploadedDocument: null,
  loading: false,
  setVersion: (version) => set({ selectedVersion: version }),
  setDocument: (document) => set({ selectedDocument: document }),
  setUploadedDocument: (uploaded) => set({ uploadedDocument: uploaded }),
  setLoading: (loading) => set({ loading }),
  clear: () =>
    set({
      selectedVersion: null,
      selectedDocument: null,
      uploadedDocument: null,
      loading: false,
    }),
}));