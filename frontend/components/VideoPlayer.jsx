import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';

const VideoPlayer = forwardRef(({ onTimeUpdate, onDurationChange, tool, color, size: drawingSize, playlist, onPlaylistClear }, ref) => {
  const videoRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        const updateSize = () => {
            setSize({ width: video.clientWidth, height: video.clientHeight });
        };
        video.addEventListener('loadedmetadata', updateSize);
        window.addEventListener('resize', updateSize);
        updateSize(); // Initial size
        return () => {
            video.removeEventListener('loadedmetadata', updateSize);
            window.removeEventListener('resize', updateSize);
        };
    }
  }, []);

  // Effect to handle playlist changes
  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setCurrentClipIndex(0);
      const firstClipTime = playlist[0].timestamp;
      if (videoRef.current && !isNaN(firstClipTime)) {
        videoRef.current.currentTime = firstClipTime;
        videoRef.current.pause();
      }
    }
  }, [playlist]);

  // Effect to handle navigation within the playlist
  useEffect(() => {
    if (playlist && playlist.length > 0 && videoRef.current) {
      const clipTime = playlist[currentClipIndex].timestamp;
      if (!isNaN(clipTime)) {
        videoRef.current.currentTime = clipTime;
        videoRef.current.pause();
      }
    }
  }, [currentClipIndex, playlist]);


  useImperativeHandle(ref, () => ({
    seek(time) {
      videoRef.current.currentTime = time;
    }
  }));

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleRewind = () => {
    videoRef.current.currentTime -= 5; // Rewind 5 seconds
  };

  const handleFastForward = () => {
    videoRef.current.currentTime += 5; // Fast-forward 5 seconds
  };

  const handlePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
  };

  const handleNextClip = () => {
    setCurrentClipIndex(prevIndex => Math.min(prevIndex + 1, playlist.length - 1));
  };

  const handlePrevClip = () => {
    setCurrentClipIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="video-player" style={{ position: 'relative' }}>
      <h2>🎥 VIDEO</h2>
      <video 
        ref={videoRef}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        controls 
        width="100%"
        style={{ borderRadius: '4px', marginBottom: '1rem' }}
        onTimeUpdate={() => onTimeUpdate(videoRef.current.currentTime)}
        onLoadedMetadata={() => {
            onDurationChange(videoRef.current.duration);
            const video = videoRef.current;
            if(video) {
                setSize({ width: video.clientWidth, height: video.clientHeight });
            }
        }}
      />
      <DrawingCanvas 
        width={size.width} 
        height={size.height} 
        tool={tool}
        color={color}
        size={drawingSize}
      />
      {playlist && (
        <div className="playlist-controls">
          <p>Reproduciendo lista de clips: {currentClipIndex + 1} de {playlist.length}</p>
          <button onClick={handlePrevClip} disabled={currentClipIndex === 0}>Anterior</button>
          <button onClick={handleNextClip} disabled={currentClipIndex === playlist.length - 1}>Siguiente</button>
          <button onClick={onPlaylistClear}>Limpiar Lista</button>
        </div>
      )}
      <div className="button-group">
        <button onClick={handlePlayPause}>⏯</button>
        <button onClick={handleRewind}>⏪</button>
        <button onClick={handleFastForward}>⏩</button>
        <button onClick={() => handlePlaybackRate(0.5)}>x0.5</button>
        <button onClick={() => handlePlaybackRate(1)}>x1</button>
        <button onClick={() => handlePlaybackRate(1.5)}>x1.5</button>
      </div>
    </div>
  );
});

export default VideoPlayer;




