interface VideoPlayerProps {
  videoRef: (node: HTMLVideoElement | null) => void;
  src: string;
}

export function VideoPlayer({ videoRef, src }: VideoPlayerProps) {
  return (
    // biome-ignore lint/a11y/useMediaCaption: user-provided video, captions not applicable
    <video
      ref={videoRef}
      src={src}
      className="w-full max-h-[50vh] rounded-lg bg-black object-contain md:max-h-[60vh]"
      playsInline
    />
  );
}
