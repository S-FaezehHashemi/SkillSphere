import { FileUp, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  ALLOWED_FILE_EXTENSIONS,
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
  validateProjectFile,
} from "../../utils/fileValidation";

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export default function FileUploadZone({
  file,
  onFileChange,
  error,
  disabled = false,
}: FileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = ALLOWED_FILE_EXTENSIONS.join(",");

  const handleFile = useCallback(
    (selected: File | null) => {
      setLocalError(null);
      if (!selected) {
        onFileChange(null);
        return;
      }

      const validationError = validateProjectFile(selected);
      if (validationError) {
        setLocalError(validationError);
        onFileChange(null);
        return;
      }

      onFileChange(selected);
    },
    [onFileChange],
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;

    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }

  const displayError = error ?? localError;

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload project file"
        className={[
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          disabled ? "cursor-not-allowed opacity-60" : "",
          dragging
            ? "border-accent bg-accent/10"
            : displayError
              ? "border-red-500/50 bg-red-500/5"
              : "border-gray-700 bg-surface-elevated/50 hover:border-gray-600 hover:bg-surface-elevated",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <FileUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-white">{file.name}</p>
              <p className="mt-1 text-sm text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 text-gray-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-white">
                Drag & drop your file here
              </p>
              <p className="mt-1 text-sm text-gray-400">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG, ZIP · max {formatFileSize(MAX_FILE_SIZE_BYTES)}
            </p>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
