"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Search, HardDrive, Info, PlusCircle, Sparkles } from "lucide-react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onOpenGuide?: () => void;
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenGuide, onOpenAddModal }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                DriveStream
              </span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Google Drive Video Player</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search videos by title, category, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900/80 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGuide}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drive Setup Guide</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-900 glow-btn transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Video</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Vercel Edge Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
