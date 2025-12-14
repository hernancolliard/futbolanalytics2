import React, { useRef } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);

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
    <div className="video-player">
      <h2>🎥 VIDEO</h2>
      <video 
        ref={videoRef}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        controls 
        width="100%"
        style={{ borderRadius: '4px', marginBottom: '1rem' }}
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
};

export default VideoPlayer;
