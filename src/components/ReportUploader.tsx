import { useState } from "react";
import { Upload, FileText, X, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  file: File;
  id: string;
}

interface ReportUploaderProps {
  onAnalyze: (files: File[]) => void;
  isAnalyzing: boolean;
}

export function ReportUploader({ onAnalyze, isAnalyzing }: ReportUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const newUploads = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2),
    }));
    setFiles((prev) => [...prev, ...newUploads]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAnalyze = () => {
    if (files.length > 0) {
      onAnalyze(files.map((f) => f.file));
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground mb-1">
          Släpp årsredovisningar här
        </p>
        <p className="text-sm text-muted-foreground">
          eller klicka för att välja PDF-filer
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {files.length} {files.length === 1 ? "fil" : "filer"} valda
          </p>
          <div className="space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground truncate max-w-xs">
                    {f.file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                  disabled={isAnalyzing}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={files.length === 0 || isAnalyzing}
        className="w-full h-12 text-base bg-gradient-hero hover:opacity-90 transition-opacity"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyserar...
          </>
        ) : (
          <>
            <Building2 className="h-5 w-5 mr-2" />
            Analysera BRF
          </>
        )}
      </Button>
    </div>
  );
}
