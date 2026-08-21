import React, { useState } from 'react';
import { FileText, Download, Cloud, ExternalLink, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadSopToGoogleDrive } from '../utils/googleDriveUploader';

interface SopDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SopDownloadModal: React.FC<SopDownloadModalProps> = ({ isOpen, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [driveLink, setDriveLink] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveToDrive = async () => {
    setIsUploading(true);
    setErrorMsg(null);
    setUploadStatus('Initiating Google Drive authentication...');
    try {
      const result = await uploadSopToGoogleDrive((status) => {
        setUploadStatus(status);
      });
      setDriveLink(result.webViewLink);
      setUploadStatus('Successfully saved to Google Drive!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload to Google Drive. Please ensure popups are allowed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">BrandFlow Pro ERP SOP Document</h3>
              <p className="text-xs text-zinc-400">Standard Operating Procedure Manual (DOCX / Drive)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs space-y-2">
            <div className="flex justify-between items-center text-zinc-300">
              <span className="font-semibold text-white">Document ID:</span>
              <span className="font-mono text-amber-400">SOP-BFP-2026-001</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="font-semibold text-white">Format:</span>
              <span className="text-zinc-300">Microsoft Word (.docx)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="font-semibold text-white">Coverage:</span>
              <span className="text-zinc-300">Quote, Pre-Press, Press Floor & QC</span>
            </div>
          </div>

          {/* Status Messages */}
          {uploadStatus && !errorMsg && (
            <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg flex items-center gap-2 text-xs text-blue-200">
              {isUploading ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{uploadStatus}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg flex items-start gap-2 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drive Link if already uploaded */}
          {driveLink && (
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-950/40 border border-emerald-600/50 hover:border-emerald-500 rounded-lg flex items-center justify-between text-xs text-emerald-300 transition-all font-semibold"
            >
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Open in Google Drive</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="/BrandFlow_Pro_Standard_Operating_Procedure.docx"
              download="BrandFlow_Pro_Standard_Operating_Procedure.docx"
              className="py-2.5 px-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Direct Download (.docx)</span>
            </a>

            <button
              onClick={handleSaveToDrive}
              disabled={isUploading}
              className="py-2.5 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4 text-blue-200" />
              )}
              <span>Save to Google Drive</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
