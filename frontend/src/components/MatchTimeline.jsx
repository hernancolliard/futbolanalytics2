import React from 'react';

const MatchTimeline = ({ events, videoTime, videoDuration, onTimelineClick }) => {

  const timeStringToSeconds = (time) => {
    if (typeof time !== 'string') return 0;
    const [minutes, seconds] = time.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

  const handleTimelineClick = (e) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const timelineWidth = timeline.offsetWidth;
    const clickTime = (clickX / timelineWidth) * videoDuration;
    onTimelineClick(clickTime);
  };

  return (
    <div className="match-timeline">
      <h2>⏱ TIMELINE DEL PARTIDO</h2>
      <div className="timeline-bar" onClick={handleTimelineClick} style={{ position: 'relative' }}>
        {videoDuration > 0 && events.map((event, index) => {
          const eventTimeInSeconds = timeStringToSeconds(event.time);
          const leftPosition = (eventTimeInSeconds / videoDuration) * 100;
          return (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: `${leftPosition}%`,
                width: '2px',
                height: '100%',
                backgroundColor: event.result === '✅' ? 'green' : 'red',
                top: 0,
              }}
              title={`${event.action} - ${event.player} (${event.time})`}
            />
          );
        })}
        {videoDuration > 0 && (
            <div 
                style={{
                    position: 'absolute',
                    left: `${(videoTime / videoDuration) * 100}%`,
                    width: '3px',
                    height: '100%',
                    backgroundColor: 'blue',
                    top: 0,
                }}
            />
        )}
      </div>
    </div>
  );
};

export default MatchTimeline;
