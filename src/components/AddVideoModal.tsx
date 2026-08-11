"use client";

import React, { useState } from "react";
import { X, PlusCircle, HardDrive, Link as LinkIcon, Sparkles } from "lucide-react";
import { Video } from "@/types/video";

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: Video) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onAddVideo }) => {
  const [driveInput, setDriveInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom Drive Upload");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  if (!isOpen) return null;

  // Extract file ID from full share link or raw ID
  const extractFileId = (input: string) => {
    const match = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
    const idMatch = input.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) return idMatch[1];
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileId = extractFileId(driveInput);
    if (!fileId) return;

    const slug = `custom-${Date.now()}`;
    const newVideo: Video = {
      id: slug,
      title: title.trim() || `Google Drive Video (${fileId.substring(0, 8)}...)`,
      description: description.trim() || "User added Google Drive video stream.",
      driveFileId: fileId,
      thumbnail:
        thumbnailUrl.trim() ||
        `https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80`,
      duration: "Drive Stream",
      category,
      views: "1",
      uploadDate: "Just now",
      quality: "HD Stream",
      author: {
        name: "My Drive Collection",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      },
    };

    onAddVideo(newVideo);
    // Reset form
    setDriveInput("");
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add Google Drive Video</h2>
            <p className="text-xs text-gray-400">Stream your own Google Drive file directly on DriveStream</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Drive Link or File ID *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://drive.google.com/file/d/1BxiMVs.../view or file ID"
              value={driveInput}
              onChange={(e) => setDriveInput(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Video Title</label>
            <input
              type="text"
              placeholder="e.g. My Presentation / Project Reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Short description of your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Custom Drive Upload">Drive Upload</option>
                <option value="Presentation">Presentation</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Film & Video">Film & Video</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Custom Thumbnail URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold glow-btn text-slate-950 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Stream List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
