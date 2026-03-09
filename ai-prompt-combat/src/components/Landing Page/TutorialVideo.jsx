import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

const YOUTUBE_VIDEO_ID = "lvHu5CPpnq";

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const loadYouTubeAPI = () =>
  new Promise((resolve) => {
    if (window.YT?.Player) return resolve();

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = resolve;
  });

const TutorialVideo = () => {
  const playerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadYouTubeAPI().then(() => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: (e) => {
            const p = e.target;
            p.mute();
            p.playVideo();

            setDuration(p.getDuration());
          },

          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);

            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => playerRef.current?.destroy();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;

      setCurrentTime(p.getCurrentTime());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;

    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;

    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const seekVideo = (e) => {
    const p = playerRef.current;
    if (!p) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;

    p.seekTo(time, true);
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    const el = document.querySelector(".video-wrapper");

    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <section className="py-24 bg-dark">
      <div className="container mx-auto px-6">

        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 mb-4">
            <Film size={18} className="text-primary" />
            <span className="text-primary font-bold uppercase text-sm">
              Watch & Learn
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white">
            How the <span className="text-primary">Competition</span> Works
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">

          <div className="video-wrapper relative rounded-xl overflow-hidden border border-white/10">

            <div className="aspect-video bg-black">
              <div id="yt-player" className="w-full h-full" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/80">

              <button onClick={togglePlay} className="text-primary">
                {playing ? <Pause size={20}/> : <Play size={20}/>}
              </button>

              <div
                ref={progressRef}
                onClick={seekVideo}
                className="flex-1 h-1 bg-white/20 rounded cursor-pointer"
              >
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`
                  }}
                />
              </div>

              <span className="text-xs text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button onClick={toggleMute} className="text-primary">
                {muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
              </button>

              <button onClick={toggleFullscreen} className="text-primary">
                <Maximize size={18}/>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TutorialVideo;
