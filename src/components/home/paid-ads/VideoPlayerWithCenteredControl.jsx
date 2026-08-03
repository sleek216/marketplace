import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Stack, IconButton, alpha } from "@mui/material";
import { Volume2, VolumeX } from "lucide-react";

const VideoPlayerWithCenteredControl = ({
  video,
  playing,
  setPlaying,
  setEnded,
  height,
  isMargin,
}) => {
  const [muted, setMuted] = useState(true);

  const handleToggleMute = (e) => {
    e.stopPropagation();
    setMuted((prev) => !prev);
  };

  const handleEnded = () => {
    setPlaying(false);
    setEnded(true);
  };
  const handlePauseVideo = () => {
    setPlaying(false);
  };
  const handlePlayVideo = () => {
    setPlaying(true);
  };
  return (
    <Stack
      sx={{
        position: "relative",
        margin: isMargin && "0px 25px -110px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0px 15px 30px rgba(0, 0, 0, 0.8)"
            : "0px 15px 30px rgba(150, 150, 154, 0.40)",
        borderRadius: "10px",
        overflow: "hidden",
        height: height ?? "200px",
        backgroundColor: (theme) => theme.palette.neutral[400],
        zIndex: 1,
      }}
    >
      <ReactPlayer
        url={video}
        width="100%"
        height="100%"
        playing={playing}
        onEnded={handleEnded}
        controls={false}
        muted={muted}
        playsinline
        onPause={handlePauseVideo}
        onPlay={handlePlayVideo}
        config={{
          file: {
            attributes: {
              playsInline: true,
            },
          },
        }}
      />
      <IconButton
        onClick={handleToggleMute}
        aria-label={muted ? "Unmute advertisement" : "Mute advertisement"}
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 2,
          backgroundColor: (theme) => alpha(theme.palette.neutral[900], 0.55),
          color: (theme) => theme.palette.neutral[100],
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.neutral[900], 0.75),
          },
        }}
      >
        {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </IconButton>
    </Stack>
  );
};

export default VideoPlayerWithCenteredControl;
