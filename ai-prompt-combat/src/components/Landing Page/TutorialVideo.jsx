import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

// YouTube video: https://youtu.be/lvHu5CPpnqc
const YOUTUBE_VIDEO_ID = "lvHu5CPpnqc";

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const loadYouTubeAPI = () =>
  new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
    window.onYouTubeIframeAPIReady = () => resolve();
  });

const TutorialVideo = () => {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progressDrag, setProgressDrag] = useState(false);

  useEffect(() => {
    if (!playerContainerRef.current || !YOUTUBE_VIDEO_ID) return;
    loadYouTubeAPI().then(() => {
      playerRef.current = new window.YT.Player("yt-tutorial-player", {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady(e) {
            setReady(true);
            setDuration(e.target.getDuration());
            e.target.mute();
            e.target.playVideo();
            setPlaying(true);
            setMuted(true);
          },
        },
      });
    });

    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!ready || !playerRef.current?.getCurrentTime || progressDrag) return;
    const poll = () => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const t = p.getCurrentTime();
      if (Number.isFinite(t)) setCurrentTime(t);
      if (p.getDuration && Number.isFinite(p.getDuration())) setDuration(p.getDuration());
      if (window.YT?.PlayerState?.ENDED !== undefined && p.getPlayerState() === window.YT.PlayerState.ENDED) {
        setPlaying(false);
      }
    };
    poll();
    const intervalId = setInterval(poll, 250);
    return () => clearInterval(intervalId);
  }, [ready, progressDrag]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p?.getPlayerState) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
      setPlaying(false);
    } else {
      p.playVideo();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p?.mute) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const handleProgressClick = (e) => {
    const p = playerRef.current;
    if (!p?.seekTo || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const t = Math.max(0, Math.min(duration, x * duration));
    p.seekTo(t, true);
    setCurrentTime(t);
  };

  const handleProgressMouseDown = () => setProgressDrag(true);
  useEffect(() => {
    if (!progressDrag) return;
    const onMouseUp = () => setProgressDrag(false);
    const onMove = (e) => {
      const p = playerRef.current;
      const bar = document.querySelector(".tutorial-video-wrapper .progress-bar");
      if (!p?.seekTo || !duration || !bar) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const t = x * duration;
      p.seekTo(t, true);
      setCurrentTime(t);
    };
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [progressDrag, duration]);

  const toggleFullscreen = () => {
    const wrapper = document.querySelector(".tutorial-video-wrapper");
    if (!wrapper) return;
    if (!document.fullscreenElement) wrapper.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <section id="tutorial" className="relative py-24 bg-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[200px] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Film size={18} className="text-primary" />
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">
              Watch & Learn
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            How the <span className="text-primary">Competition</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg"
          >
            Watch this short tutorial to understand the event flow, rounds, and how to participate from start to finish.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="tutorial-video-wrapper video-wrapper relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_0_60px_-15px_rgba(212,175,55,0.15)]">
            <div className="aspect-video w-full relative bg-black">
              <div
                ref={playerContainerRef}
                id="yt-tutorial-player"
                className="absolute inset-0 w-full h-full [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
              />
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={togglePlay}
                onKeyDown={(e) => e.key === " " && togglePlay()}
                role="button"
                tabIndex={0}
                aria-label="Play or pause"
              />
              {/* Custom controls bar - theme matched */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-t from-black/95 to-black/70 border-t border-primary/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div
                  className="progress-bar flex-1 h-1.5 rounded-full bg-white/20 cursor-pointer overflow-hidden min-w-0"
                  onClick={handleProgressClick}
                  onMouseDown={handleProgressMouseDown}
                  role="progressbar"
                  aria-valuenow={duration ? (currentTime / duration) * 100 : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-150"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 tabular-nums shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TutorialVideo;
