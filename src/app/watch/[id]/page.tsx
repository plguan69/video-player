"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoCard } from "@/components/VideoCard";
import { DriveGuideModal } from "@/components/DriveGuideModal";
import { AddVideoModal } from "@/components/AddVideoModal";
import { Video } from "@/types/video";
import { ArrowLeft, HardDrive, Copy, Check, ExternalLink, Eye, Clock, Sparkles, Share2 } from "lucide-react";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [video, setVideo] = useState<Video | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch("/videos.json")
      .then((res) => res.json())
      .then((data: Video[]) => {
        setAllVideos(data);
        const found = data.find((v) => v.id === id);
        if (found) {
          setVideo(found);
        } else {
          // If not in default JSON, create dynamic placeholder for custom id
          setVideo({
            id,
            title: `Custom Stream: ${id}`,
            description: "Custom video loaded from Google Drive player.",
            driveFileId: id,
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
            duration: "HD Video",
            category: "Google Drive Stream",
            views: "1",
            uploadDate: "Now",
            quality: "HD",
            author: {
              name: "Drive Streamer",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            },
          });
        }
      })
      .catch((err) => console.error("Error fetching video catalog:", err));
  }, [id]);

  const copyDriveId = () => {
    if (!video) return;
    navigator.clipboard.writeText(video.driveFileId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddVideo = (newVideo: Video) => {
    setAllVideos((prev) => [newVideo, ...prev]);
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const relatedVideos = allVideos.filter((v) => v.id !== video.id);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans">
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Video Library</span>
          </Link>
        </div>

        {/* Main Grid: Player on left, Related on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Custom Video Player Component */}
            <VideoPlayer video={video} />

            {/* Video Meta & Details Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                    {video.category}
                  </span>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {video.quality}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
                  {video.title}
                </h1>
              </div>

              {/* Author & Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-white/20">
                    <Image
                      src={video.author.avatar}
                      alt={video.author.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{video.author.name}</div>
                    <div className="text-[11px] text-gray-400">Content Creator</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    {video.views} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {video.uploadDate}
                  </span>
                </div>
              </div>

              {/* Google Drive Specific Metadata Panel */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 bg-slate-950/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-200">Google Drive Source File ID</div>
                    <div className="text-xs font-mono text-cyan-300 break-all">{video.driveFileId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={copyDriveId}
                    className="flex-1 md:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy File ID</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://drive.google.com/file/d/${video.driveFileId}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Open Drive File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>More Videos from Drive</span>
            </h2>

            <div className="space-y-4">
              {relatedVideos.map((relVideo) => (
                <VideoCard key={relVideo.id} video={relVideo} />
              ))}
            </div>
          </div>
        </div>
      </main>

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
