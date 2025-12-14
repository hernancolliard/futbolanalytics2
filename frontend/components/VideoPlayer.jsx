import React from 'react';

const VideoPlayer = () => {
  return (
    <div className="video-player">
      <h2>🎥 VIDEO</h2>
      <div className="video-placeholder" style={{
        height: '250px',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        Reproductor
      </div>
      <div className="button-group">
        <button>⏯</button>
        <button>⏪</button>
        <button>⏩</button>
        <button>x0.5</button>
        <button>x1</button>
        <button>x1.5</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
