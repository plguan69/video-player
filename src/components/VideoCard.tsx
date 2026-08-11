"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Eye, HardDrive, Sparkles } from "lucide-react";
import { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link href={`/watch/${video.id}`} className="group block">
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300">
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Quality Tag */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{video.quality}</span>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{video.duration}</span>
          </div>

          {/* Play Icon Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 transform scale-75 group-hover:scale-100 transition-all duration-300">
              <Play className="w-6 h-6 fill-slate-950 ml-1" />
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                {video.category}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-gray-500" />
                Drive File
              </span>
            </div>

            <h3 className="font-bold text-sm text-gray-100 line-clamp-2 group-hover:text-cyan-400 transition-colors leading-snug">
              {video.title}
            </h3>

            <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
              {video.description}
            </p>
          </div>

          {/* Author & Stats */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-800">
                <Image
                  src={video.author.avatar}
                  alt={video.author.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="font-medium text-gray-300 text-[11px]">{video.author.name}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-500" />
                {video.views}
              </span>
              <span>•</span>
              <span>{video.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
