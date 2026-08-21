import React, { useState } from 'react';
import { Upload, FileCheck, CheckCircle2, AlertTriangle, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import { triggerArtworkNotification } from '../../utils/notificationHelper';

interface ArtworkUploadModuleProps {
  job: Job;
  isEditing: boolean;
  onSaveNotification: (msg: string) => void;
  onNavigate: (module: any) => void;
  onSaveJob: (job: Job) => void;
}

export const ArtworkUploadModule: React.FC<ArtworkUploadModuleProps> = ({
  job,
  isEditing,
  onSaveNotification,
  onNavigate,
  onSaveJob,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        
        // Add new file to artwork versions
        const newArtwork: any = {
          version: `v${job.artworkVersions.length + 1}.0`,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedBy: 'Current User',
          uploadedAt: new Date().toISOString().split('T')[0],
          colorSpace: 'CMYK',
          resolutionDpi: 300,
          hasBleed: true,
          fontsEmbedded: true,
          status: 'Preflight Passed',
          previewUrl: 'https://images.unsplash.com/photo-1618557171223-95d46eb9018e?q=80&w=600&auto=format&fit=crop'
        };

        const updatedJob = {
          ...job,
          artworkVersions: [newArtwork, ...job.artworkVersions]
        };

        onSaveJob(updatedJob);

        triggerArtworkNotification(
          updatedJob,
          onSaveNotification,
          'New vector artwork uploaded and passed preflight CMYK validation!'
        );
      }, 1500);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-zinc-100 bg-zinc-950 min-h-full">
      {/* Header */}
      <div className="mirror-card p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Preflight Validation Portal - Job #{job.jobNumber}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-zinc-100 mt-0.5">{job.projectName}</h2>
        </div>

        <button
          onClick={() => {
            const updatedJob = {
              ...job,
              status: 'In Design' as const,
              currentDepartment: 'Design Studio' as const,
              stageProgress: 35
            };
            onSaveJob(updatedJob);
            onSaveNotification(`Job #${job.jobNumber} deployed to Design Department.`);
            onNavigate('Design');
          }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-lg text-xs font-black flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all border border-amber-300/30"
        >
          <span>Send to Design Department</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Dropzone */}
        <div className="lg:col-span-6 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5 mb-4">
              Upload High-Res Master Artwork (PDF/X-4, AI, EPS)
            </h3>

            <div className="border-2 border-dashed border-zinc-700/80 hover:border-amber-500 bg-zinc-950/60 hover:bg-zinc-950/80 rounded-xl p-8 text-center transition-all cursor-pointer relative group">
              <input
                type="file"
                accept=".pdf,.ai,.eps,.psd,.tiff"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-zinc-800 border border-zinc-700 text-amber-400 rounded-full shadow-md group-hover:scale-110 group-hover:border-amber-500/50 transition-transform">
                  <Upload className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">Drag & Drop master artwork file here</div>
                  <div className="text-xs text-zinc-400 mt-1">or click to browse local files</div>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Supported formats: PDF/X-4, Adobe Illustrator (.ai), EPS, Layered PSD
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center space-x-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Running automated Preflight CMYK & Resolution Inspector...</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Artwork uploaded & verified! Preflight Status: PASSED</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg text-xs space-y-1">
            <div className="font-bold text-zinc-200">Automatic Preflight Specs Required</div>
            <div className="text-[11px] text-zinc-400">
              300 DPI minimum resolution, CMYK color space, 3mm bleed margin, outlined fonts.
            </div>
          </div>
        </div>

        {/* Existing Versions & Preflight Diagnostic Log */}
        <div className="lg:col-span-6 mirror-card bg-zinc-900/90 rounded-xl border border-zinc-800/80 shadow-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-zinc-300 border-b border-zinc-800 pb-2.5">
            Uploaded Artwork Master Files & Diagnostics
          </h3>

          <div className="space-y-3">
            {job.artworkVersions.map((art, idx) => (
              <div key={idx} className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-start font-bold">
                  <div className="text-zinc-100 font-bold">{art.fileName}</div>
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] rounded font-bold">
                    {art.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                  <div>Version: <span className="font-semibold text-zinc-200">{art.version}</span></div>
                  <div>Color Space: <span className="font-semibold text-zinc-200">{art.colorSpace}</span></div>
                  <div>Resolution: <span className="font-semibold text-zinc-200">{art.resolutionDpi} DPI</span></div>
                  <div>File Size: <span className="font-semibold text-zinc-200">{art.fileSize}</span></div>
                </div>

                <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-1 text-[10px] font-bold">
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>3mm Bleed Included</span>
                  </span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Fonts Embedded & Outlined</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
