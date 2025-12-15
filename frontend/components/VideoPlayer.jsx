import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';

const VideoPlayer = forwardRef(({ onTimeUpdate, onDurationChange, tool, color, size: drawingSize }, ref) => {
  const videoRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

