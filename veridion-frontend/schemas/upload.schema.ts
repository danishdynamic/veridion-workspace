import { z } from "zod";

const ACCEPTED_FILE_TYPES = ["application/pdf", "text/plain"];

export const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  versionTag: z.string().min(1, "Version is required"),
  sector: z.string().min(1, "Sector is required"),
  region: z.string().min(1, "Region is required"),
  file: z
    .custom<File>((val) => val instanceof File, "File is required")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only .pdf and .txt files are supported"
    ),
});

export type UploadFormData = z.infer<typeof uploadSchema>;