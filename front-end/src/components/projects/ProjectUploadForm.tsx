import { Loader2 } from "lucide-react";
import { useState } from "react";
import { createProject } from "../../api/projects";
import { parseApiErrors } from "../../utils/authErrors";
import { logActivity } from "../../utils/activityLog";
import { validateProjectForm } from "../../utils/fileValidation";
import FileUploadZone from "./FileUploadZone";

interface ProjectUploadFormProps {
  onSuccess: () => void;
}

export default function ProjectUploadForm({ onSuccess }: ProjectUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateProjectForm({ title, file });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const trimmedTitle = title.trim();
      await createProject({ title: trimmedTitle, description, tags, file });
      logActivity({
        type: "upload",
        message: `Uploaded project "${trimmedTitle}"`,
      });
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
      onSuccess();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setApiError(parsed.message);
      const nextErrors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(parsed.fieldErrors)) {
        if (messages[0]) nextErrors[field] = messages[0];
      }
      if (parsed.fieldErrors.file_path?.[0]) {
        nextErrors.file = parsed.fieldErrors.file_path[0];
      }
      setErrors(nextErrors);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="upload"
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-800 bg-surface-card p-5 md:p-6"
    >
      <h2 className="text-lg font-semibold text-white">Upload new project</h2>
      <p className="mt-1 text-sm text-gray-400">
        Add metadata and optionally attach a file
      </p>

      {apiError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {apiError}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="project-title"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            placeholder="My awesome project"
            className="w-full rounded-lg border border-gray-700 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Brief description of your project..."
            className="w-full resize-y rounded-lg border border-gray-700 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="project-tags"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Tags
          </label>
          <input
            id="project-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="python, django, api"
            className="w-full rounded-lg border border-gray-700 bg-surface-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-gray-500">Comma-separated</p>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-300">
            File attachment
          </span>
          <FileUploadZone
            file={file}
            onFileChange={setFile}
            error={errors.file}
            disabled={submitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Uploading..." : "Upload project"}
      </button>
    </form>
  );
}
