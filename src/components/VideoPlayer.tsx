"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture2,
  RotateCcw,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { Video } from "@/types/video";

interface VideoPlayerProps {
  video: Video;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const [playerMode, setPlayerMode] = useState<"custom" | "embed">("custom");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Construct Google Drive Proxied Stream URL
  const streamUrl = `/api/stream/${video.driveFileId}${
    video.fallbackUrl ? `?fallbackUrl=${encodeURIComponent(video.fallbackUrl)}` : ""
  }`;

  // Google Drive Embed Iframe URL
  const embedUrl = `https://drive.google.com/file/d/${video.driveFileId}/preview`;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Skip Forward/Backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  // Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  // Playback Rate Change
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
  };

  // Controls Visibility Timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (playerMode !== "custom") return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(5);
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyP":
          e.preventDefault();
          togglePiP();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, playerMode]);

  // Sync Buffer Progress
  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Player Top Mode Bar & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 glass-panel rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            Playback Engine:
          </span>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setPlayerMode("custom")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                playerMode === "custom"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Custom HTML5 Player (Proxied Stream)</span>
            </button>

            <button
              onClick={() => setPlayerMode("embed")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                playerMode === "embed"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Google Drive Iframe Embed</span>
            </button>
          </div>
        </div>

        <a
          href={`https://drive.google.com/file/d/${video.driveFileId}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 hover:underline"
        >
          <span>Open in Google Drive</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Embed Mode Explanation Banner & Quick Loader */}
      {playerMode === "embed" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Notice:</strong> Google Drive blocks iframe embedding on external sites for certain files (<code className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono">frame-ancestors &apos;none&apos;</code>). Switch to <strong>Custom HTML5 Player</strong> to stream directly!
            </span>
          </div>
          <button
            onClick={() => setPlayerMode("custom")}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border border-cyan-400 shadow-md text-xs whitespace-nowrap"
          >
            Switch to Custom Player Engine
          </button>
        </div>
      )}

      {/* Main Player Display Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group select-none"
      >
        {playerMode === "embed" ? (
          /* Mode 1: Google Drive Iframe Embed */
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        ) : (
          /* Mode 2: Custom HTML5 Player */
          <>
            <video
              ref={videoRef}
              src={streamUrl}
              poster={video.thumbnail}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onDurationChange={() => videoRef.current && setDuration(videoRef.current.duration)}
              onProgress={handleProgress}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onPlaying={() => {
                setIsLoading(false);
                setIsPlaying(true);
                setHasError(false);
              }}
              onPause={() => setIsPlaying(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
            />

            {/* Loading Indicator Overlay */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 pointer-events-none">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <span className="text-xs font-semibold text-cyan-200 tracking-wider uppercase">
                  Buffering Stream...
                </span>
              </div>
            )}

            {/* Error Overlay with Fallback Options */}
            {hasError && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center gap-4 z-20">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Stream Loading Alert</h4>
                  <p className="text-xs text-gray-300 max-w-md mt-1 leading-relaxed">
                    Google Drive direct stream link was protected or quota-restricted. You can switch to the Google Drive Embed option or open it directly.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      if (videoRef.current) videoRef.current.load();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    Retry Stream
                  </button>

                  <button
                    onClick={() => setPlayerMode("embed")}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 transition-all"
                  >
                    Switch to Drive Iframe Embed
                  </button>
                </div>
              </div>
            )}

            {/* Player Controls Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4 lg:p-6 transition-opacity duration-300 z-10 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top Controls: Title & Status */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-xs font-semibold text-gray-200 line-clamp-1 max-w-xs md:max-w-md">
                    {video.title}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span>Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">Space</kbd> Play/Pause</span>
                  <span>•</span>
                  <span><kbd className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">F</kbd> Fullscreen</span>
                </div>
              </div>

              {/* Center Large Play Button */}
              <div className="flex items-center justify-center pointer-events-none">
                {!isPlaying && !isLoading && !hasError && (
                  <button
                    onClick={togglePlay}
                    className="pointer-events-auto w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-110 transition-all duration-300"
                  >
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </button>
                )}
              </div>

              {/* Bottom Controls Bar */}
              <div className="flex flex-col gap-2.5">
                {/* Timeline Seekbar & Buffer Bar */}
                <div className="relative w-full group/seek flex items-center">
                  {/* Loaded Buffer Bar Background */}
                  <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className="h-full bg-white/40 transition-all"
                      style={{ width: `${duration > 0 ? (buffered / duration) * 100 : 0}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-cyan-400 rounded-full"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="player-seekbar relative z-10 opacity-0 group-hover/seek:opacity-100 transition-opacity"
                  />
                </div>

                {/* Bottom Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    {/* Play / Pause Toggle */}
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-all"
                      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Skip -10s / +10s */}
                    <button
                      onClick={() => skip(-10)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all hidden sm:block"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => skip(10)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all hidden sm:block"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-all"
                        title={isMuted ? "Unmute (M)" : "Mute (M)"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>

                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-cyan-400 hidden sm:block"
                      />
                    </div>

                    {/* Timer Display */}
                    <span className="text-xs font-mono text-gray-300 tracking-wider">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Side Options */}
                  <div className="flex items-center gap-2">
                    {/* Playback Speed Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="px-2.5 py-1 rounded-xl hover:bg-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-all border border-white/10"
                      >
                        {playbackRate}x
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute bottom-10 right-0 bg-slate-900/95 border border-white/15 rounded-xl py-1 w-24 shadow-xl backdrop-blur-md z-30">
                          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                                playbackRate === rate
                                  ? "text-cyan-400 font-bold bg-cyan-500/10"
                                  : "text-gray-300 hover:bg-white/10"
                              }`}
                            >
                              <span>{rate}x</span>
                              {playbackRate === rate && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Picture in Picture */}
                    <button
                      onClick={togglePiP}
                      className="p-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-all hidden sm:block"
                      title="Picture in Picture (P)"
                    >
                      <PictureInPicture2 className="w-5 h-5" />
                    </button>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white transition-all"
                      title="Fullscreen (F)"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
