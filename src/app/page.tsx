"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VideoCard } from "@/components/VideoCard";
import { DriveGuideModal } from "@/components/DriveGuideModal";
import { AddVideoModal } from "@/components/AddVideoModal";
import { Video } from "@/types/video";
import { Play, Sparkles, HardDrive, ShieldCheck, Zap, Film, Filter } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch("/videos.json")
      .then((res) => res.json())
      .then((data: Video[]) => setVideos(data))
      .catch((err) => console.error("Error loading videos:", err));
  }, []);

  const handleAddVideo = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const categories = ["All", ...Array.from(new Set(videos.map((v) => v.category)))];

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        onSearch={(q) => setSearchQuery(q)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 lg:px-8 border-b border-white/5">
        {/* Glowing Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Drive + Vercel Serverless Stream Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
            Stream Google Drive Videos with <span className="text-gradient">Zero Buffer Lag</span> & Custom Player UI
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl font-normal leading-relaxed">
            Host your videos free on Google Drive and serve them seamlessly on Vercel Edge. Features custom HTML5 controls, byte-range seeking, and native iframe fallback.
          </p>

          {/* Quick Feature Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-gray-300">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Google Drive Public Hosting</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Vercel Edge Proxy Handler</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bytes Range Seeking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10">
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400 mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-bold"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-400 font-medium whitespace-nowrap hidden md:block">
            Showing <span className="text-cyan-400 font-bold">{filteredVideos.length}</span> videos
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 mb-4 border border-white/10">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No videos found</h3>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or category filter</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 lg:px-8 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              D
            </div>
            <span className="font-semibold text-gray-200">DriveStream Pro</span>
            <span>—</span>
            <span>Google Drive Hosted & Vercel Deployed Video Player</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsGuideOpen(true)} className="hover:text-cyan-400 transition-colors">
              Drive Setup Guide
            </button>
            <span>•</span>
            <button onClick={() => setIsAddModalOpen(true)} className="hover:text-cyan-400 transition-colors">
              Add Video
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DriveGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVideo={handleAddVideo}
      />
    </div>
  );
}
