import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoControllerOptions {
  fps: number;
}

export function useVideoController({ fps }: UseVideoControllerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  // Tracks when the video element is mounted so the sync effect re-runs
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  // Ref callback: fires when the <video> mounts/unmounts in the DOM
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current =
      node;
    setVideoElement(node);
  }, []);

  // Sync playback rate to video element
  useEffect(() => {
    if (videoElement) {
      videoElement.playbackRate = playbackRate;
    }
  }, [playbackRate, videoElement]);

  // Attach event listeners + time sync
  useEffect(() => {
    if (!videoElement) return;

    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
      setCurrentTime(videoElement.currentTime);
    };

    // If metadata is already loaded (e.g. from cache), read it now
    if (videoElement.readyState >= 1) {
      onLoadedMetadata();
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
    videoElement.addEventListener("play", onPlay);
    videoElement.addEventListener("pause", onPause);
    videoElement.addEventListener("ended", onEnded);

    // requestVideoFrameCallback is not in TS types by default
    const videoAny = videoElement as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };

    // Use requestVideoFrameCallback if available
    if (videoAny.requestVideoFrameCallback) {
      let handle: number;
      const rvfc = videoAny.requestVideoFrameCallback.bind(videoAny);
      const onFrame = () => {
        setCurrentTime(videoElement.currentTime);
        handle = rvfc(onFrame);
      };
      handle = rvfc(onFrame);

      return () => {
        videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
        videoElement.removeEventListener("play", onPlay);
        videoElement.removeEventListener("pause", onPause);
        videoElement.removeEventListener("ended", onEnded);
        videoAny.cancelVideoFrameCallback?.(handle);
      };
    }

    // Fallback: timeupdate
    const onTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    videoElement.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      videoElement.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoElement.removeEventListener("play", onPlay);
      videoElement.removeEventListener("pause", onPause);
      videoElement.removeEventListener("ended", onEnded);
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoElement]);

  const seek = useCallback((t: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(t, video.duration || 0));
    video.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const stepFrames = useCallback(
    (n: number) => {
      const video = videoRef.current;
      if (!video) return;
      const frameDuration = 1 / fps;
      const newTime = Math.max(
        0,
        Math.min(video.currentTime + n * frameDuration, video.duration),
      );
      video.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [fps],
  );

  const stepSeconds = useCallback((n: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(
      0,
      Math.min(video.currentTime + n, video.duration),
    );
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const play = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  return {
    videoRef: setVideoRef,
    currentTime,
    duration,
    playbackRate,
    setPlaybackRate,
    isPlaying,
    seek,
    stepFrames,
    stepSeconds,
    play,
    pause,
    togglePlayPause,
  };
}
