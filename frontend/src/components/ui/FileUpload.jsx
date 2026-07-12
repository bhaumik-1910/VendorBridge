import { useRef, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

export default function FileUpload({
  label = 'Upload file',
  hint = 'PDF, DOC, XLS, or images up to 10MB',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
  multiple = false,
  files = [],
  onFilesChange,
  onUpload,
  uploading = false,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    if (multiple) onFilesChange?.([...files, ...picked]);
    else onFilesChange?.([picked[0]]);
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-emerald-brand bg-emerald-brand/5' : 'border-border hover:border-emerald-brand/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
        <p className="text-sm text-foreground-subtle">
          Drag & drop or <span className="text-emerald-brand font-medium">browse</span>
        </p>
        <p className="text-xs text-foreground-subtle mt-1">{hint}</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-foreground-subtle shrink-0" />
                <span className="text-sm text-foreground truncate">{file.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {onUpload && (
                  <button
                    type="button"
                    onClick={() => onUpload(file)}
                    disabled={uploading}
                    className="text-xs font-medium text-emerald-brand hover:underline px-2"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onFilesChange?.(files.filter((_, idx) => idx !== i))}
                  className="p-1 hover:bg-surface-inset rounded"
                >
                  <X className="w-3.5 h-3.5 text-foreground-subtle" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
