import ReactPlayer from "react-player";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Loader,
  Settings,
  RotateCcw,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate = () => {}, // Default no-op function
  progressData = {}, // Default empty object
  onNext = () => {}, // Callback for next video
  onPrevious = () => {}, // Callback for previous video
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false); // Settings menu visibility

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayAndPause = () => setPlaying(!playing);

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleRewind = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime - 10);
  };

  const handleForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 10);
  };

  const handleToggleMute = () => setMuted(!muted);

  const handleSeekChange = (newValue) => {
    setPlayed(newValue[0]);
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current.seekTo(played);
  };

  const handleVolumeChange = (newValue) => setVolume(newValue[0] / 100);

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    return hh ? `${hh}:${mm.toString().padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    playerRef.current.setPlaybackRate(rate);
  };

  const toggleSettings = () => setShowSettings(!showSettings);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played, onProgressUpdate, progressData]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-black rounded-lg overflow-hidden shadow-xl transition-all duration-300 ease-in-out ${
        isFullScreen ? "w-screen h-screen" : ""
      }`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <Loader className="animate-spin text-white h-12 w-12" />
        </div>
      )}
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onBuffer={() => setLoading(true)}
        onBufferEnd={() => setLoading(false)}
      />
      {/* Settings Icon */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleSettings}
          variant="ghost"
          size="icon"
          className="!bg-transparent hover:bg-gray-700 text-white"
        >
          <Settings className="h-6 w-6" />
        </Button>
        {showSettings && (
          <div className="absolute top-10 right-0 bg-gray-900 bg-opacity-90 text-white p-4 rounded shadow-lg w-48">
            <div className="flex flex-col space-y-2">
              <span className="font-semibold">Playback Speed</span>
              <Button
                onClick={() => changePlaybackRate(1.0)}
                variant="ghost"
                size="sm"
                className={`${
                  playbackRate === 1.0 ? "font-bold bg-gray-700" : ""
                }`}
              >
                Normal (1x)
              </Button>
              <Button
                onClick={() => changePlaybackRate(1.5)}
                variant="ghost"
                size="sm"
                className={`${
                  playbackRate === 1.5 ? "font-bold bg-gray-700" : ""
                }`}
              >
                1.5x
              </Button>
              <Button
                onClick={() => changePlaybackRate(2.0)}
                variant="ghost"
                size="sm"
                className={`${
                  playbackRate === 2.0 ? "font-bold bg-gray-700" : ""
                }`}
              >
                2x
              </Button>
              <Button
                onClick={() => alert("Subtitles toggled")}
                variant="ghost"
                size="sm"
              >
                Subtitles
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 opacity-100">
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-4"
          />
          <div className="flex items-center justify-between">
            <Button
              onClick={onPrevious}
              variant="ghost"
              size="icon"
              className="!bg-transparent hover:bg-gray-700 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRewind}
                variant="ghost"
                size="icon"
                className="!bg-transparent hover:bg-gray-700 text-white"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handlePlayAndPause}
                variant="ghost"
                size="icon"
                className="!bg-transparent hover:bg-gray-700 text-white"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleForward}
                variant="ghost"
                size="icon"
                className="!bg-transparent hover:bg-gray-700 text-white"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                variant="ghost"
                size="icon"
                className="!bg-transparent hover:bg-gray-700 text-white"
              >
                {muted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            <Button
              onClick={onNext}
              variant="ghost"
              size="icon"
              className="!bg-transparent hover:bg-gray-700 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleFullScreen}
              variant="ghost"
              size="icon"
              className="!bg-transparent hover:bg-gray-700 text-white"
            >
              {isFullScreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
