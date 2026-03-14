"use client";

import { FileUp, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MAX_FILE_BYTES } from "@/lib/validators/resume";
import { formatFileSize } from "@/lib/utils/file";

interface FileDropzoneProps {
  file: File | null;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onError?: (message: string) => void;
}

function getDropErrorMessage() {
  return "Please upload a single PDF or DOCX file that is 5 MB or smaller.";
}

export function FileDropzone({
  file,
  disabled,
  onFileSelect,
  onError
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"]
    },
    disabled,
    maxFiles: 1,
    maxSize: MAX_FILE_BYTES,
    multiple: false,
    onDropAccepted: (acceptedFiles) => {
      onFileSelect(acceptedFiles[0] ?? null);
    },
    onDropRejected: () => {
      onError?.(getDropErrorMessage());
    }
  });

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        data-click-reactive="true"
        className={`click-reactive cursor-pointer border-dashed p-8 transition ${
          isDragActive
            ? "border-brand-teal bg-cyan-50/70 dark:bg-cyan-500/10"
            : "hover:border-brand-teal/30 hover:bg-brand-sand/40 dark:hover:bg-white/5"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-ink text-white dark:bg-white dark:text-slate-950">
            <FileUp className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl">
            {isDragActive ? "Drop your resume here" : "Drag and drop your resume"}
          </h3>
          <p className="mt-3 max-w-md">
            Upload a PDF or DOCX resume for structured AI analysis. If parsing ever
            fails, you can paste the text manually below.
          </p>
          <div className="mt-5 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-semibold text-brand-ink dark:bg-white/5 dark:text-white">
            Supported: PDF, DOCX · Max size: 5 MB
          </div>
        </div>
      </Card>

      {file ? (
        <Card className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-sand text-brand-ink dark:bg-white/10 dark:text-white">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-ink dark:text-white">
                {file.name}
              </p>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<X className="size-4" />}
            onClick={() => onFileSelect(null)}
          >
            Remove
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
