import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
];

export const documentUploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  versionTag: z.string().min(1, "Version tag is required (e.g. 2024, v1.0)"),
  sector: z.string().min(1, "Sector is required"),
  region: z.string().min(1, "Region is required"),
  file: z
    .custom<File>((val) => val instanceof File, "Document file is required")
    .refine((file) => file && file.size <= MAX_FILE_SIZE, "Max file size is 10MB.")
    .refine(
      (file) => file && ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .pdf and .txt files are supported."
    ),
});

export type DocumentUploadSchemaType = z.infer<typeof documentUploadSchema>;