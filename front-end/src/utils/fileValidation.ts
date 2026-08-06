export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".zip",
] as const;

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/zip",
  "application/x-zip-compressed",
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot).toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateProjectFile(file: File): string | null {
  const extension = getFileExtension(file.name);

  if (
    !ALLOWED_FILE_EXTENSIONS.includes(
      extension as (typeof ALLOWED_FILE_EXTENSIONS)[number],
    )
  ) {
    return `Unsupported file type "${extension || "unknown"}". Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(", ")}.`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size must not exceed 10 MB. Selected file is ${formatFileSize(file.size)}.`;
  }

  if (file.size === 0) {
    return "File is empty. Please select a valid file.";
  }

  return null;
}

export function validateProjectForm(input: {
  title: string;
  file: File | null;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = input.title.trim();

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > 255) {
    errors.title = "Title must be 255 characters or fewer.";
  }

  if (input.file) {
    const fileError = validateProjectFile(input.file);
    if (fileError) errors.file = fileError;
  }

  return errors;
}
