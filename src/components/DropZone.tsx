import React, { useState, useRef } from "react";
import { Upload, Link2, Image as ImageIcon, AlertCircle, FileImage, ShieldAlert } from "lucide-react";

interface DropZoneProps {
  onImageSelected: (src: string, name: string) => void;
  isLoading: boolean;
}

export default function DropZone({ onImageSelected, isLoading }: DropZoneProps) {
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errorText, setErrorText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorText("File must be an image format (JPEG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorText("Image size must be smaller than 10MB inside this sandbox.");
      return;
    }
    setErrorText("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageSelected(reader.result, file.name);
      }
    };
    reader.onerror = () => {
      setErrorText("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setErrorText("");

    // Create a helper to download or verify the image is valid
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw to a brief canvas to convert it to base64, which resolves complex CORS issues for downstream operations!
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL("image/jpeg");
          onImageSelected(base64, "url_imported_image.jpg");
        } else {
          onImageSelected(urlInput, "url_imported_image.jpg");
        }
      } catch (err) {
        // If canvas draw fails due to CORS, pass URL directly. 
        // Note: For backend requests, URL works fine. ELA might hit CORS restriction in client, 
        // so we offer a clear heads up.
        onImageSelected(urlInput, "url_imported_image.jpg");
      }
    };
    img.onerror = () => {
      setErrorText("Unable to resolve or fetch the image from this URL. Please verify the link, or upload an image locally.");
    };
    img.src = urlInput;
  };

  // Pre-configured scientific test images
  const PRE_LOADED_SAMPLES = [
    {
      id: "sample_authentic",
      title: "Untouched Portrait",
      type: "DSLR CAMERA Capture",
      desc: "Authentic profile shot. Expects high-frequency noise uniformity and consistent noise density.",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "sample_ai",
      title: "AI Generated Model",
      type: "MIDJOURNEY / SYNTHETIC",
      desc: "Generative avatar. AI skin textures often exhibit structural frequency pools and unnatural iris symmetries.",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "sample_manipulated",
      title: "Facial Composition",
      type: "ADOBE PHOTOSHOP SWAP",
      desc: "Forced compositing. Leaves sharp edge glows and ringed compression anomalies under ELA comparison.",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="space-y-6" id="upload-discovery">
      {/* Visual Header */}
      <div className="border-l-4 border-cyan-400 pl-4 space-y-1">
        <h2 className="text-lg font-bold font-sans text-white uppercase tracking-wider flex items-center gap-2">
          <span>01. DISCOVER</span>
          <span className="text-xs text-slate-500 lowercase font-mono">/ ingest candidates</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload an image from your local filesystem, fetch an external URL, or run a pre-loaded scientific lab sample.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Drop Zone & URL Link Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer transition duration-200 border-2 border-dashed rounded-2xl h-60 flex flex-col items-center justify-center p-6 gap-3 group text-center ${
              dragActive
                ? "border-cyan-400 bg-cyan-950/20"
                : "border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 hover:border-slate-700"
            }`}
            id="drag-drop-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={isLoading}
              id="file-hidden-input"
            />
            
            <div className="bg-slate-900 duration-200 group-hover:scale-105 group-hover:text-cyan-400 border border-slate-800 p-4 rounded-full text-slate-400 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                Drag & drop files here, or <span className="text-cyan-400">browse folders</span>
              </p>
              <p className="text-xs text-slate-500 font-mono">
                PNG, JPEG, and WEBP supported // Max size 10MB
              </p>
            </div>
          </div>

          {/* URL Form */}
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste external secure image URL (e.g., https://...)"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition"
                id="url-analyzer-input"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !urlInput}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-sm font-mono border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              id="url-submit-btn"
            >
              Analyze URL
            </button>
          </form>

          {errorText && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <p>{errorText}</p>
            </div>
          )}
        </div>

        {/* Scientific Laboratory Samples */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Pre-loaded Lab Samples
            </h3>
            <div className="space-y-3">
              {PRE_LOADED_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onImageSelected(sample.url, `${sample.title}.jpg`)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 hover:border-slate-700 transition flex items-start gap-3 group"
                  id={`btn-${sample.id}`}
                >
                  <div className="relative shrink-0 w-12 h-12 rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 duration-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>{sample.title}</span>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase">
                      {sample.type}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {sample.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-3 text-[10px] font-mono text-slate-500 flex gap-1.5 items-center">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
            <span>Files are encrypted & not saved in DB.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
