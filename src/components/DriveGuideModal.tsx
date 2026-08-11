"use client";

import React from "react";
import { X, HardDrive, CheckCircle2, Copy, Shield, HelpCircle, ArrowRight } from "lucide-react";

interface DriveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriveGuideModal: React.FC<DriveGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">How to Host & Stream Videos from Google Drive</h2>
            <p className="text-xs text-gray-400 mt-0.5">Follow these 3 easy steps to stream any video from your Google Drive</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h3 className="font-semibold text-sm text-gray-200">Upload Video & Set Access</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Upload your video file (MP4, MOV, WebM, MKV) to Google Drive. Right-click the file, select <span className="text-cyan-400 font-medium">Share &gt; Share</span>, and change access to <span className="text-emerald-400 font-semibold">&quot;Anyone with the link can view&quot;</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h3 className="font-semibold text-sm text-gray-200">Copy the File Link or File ID</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Click <span className="text-cyan-400 font-medium">&quot;Copy link&quot;</span>. Your link will look like:
                </p>
                <div className="mt-2 bg-slate-950 p-2.5 rounded-xl border border-white/10 text-[11px] font-mono text-cyan-300 break-all">
                  https://drive.google.com/file/d/<span className="bg-cyan-500/20 text-cyan-200 px-1 py-0.5 rounded font-bold">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs</span>/view?usp=sharing
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  The highlighted string between <code className="text-gray-300">/d/</code> and <code className="text-gray-300">/view</code> is your unique <span className="text-cyan-400 font-medium">Google Drive File ID</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h3 className="font-semibold text-sm text-gray-200">Paste in DriveStream</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Click the <span className="text-cyan-400 font-medium">&quot;+ Add Custom Video&quot;</span> button on the top navigation bar, paste the share link or File ID, and enjoy instant high-definition streaming!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Vercel Edge Proxy handles CORS & range header seeking automatically.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold glow-btn text-slate-950"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
