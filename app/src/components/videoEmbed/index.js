import React from 'react';
import './videoEmbed.scss';

function VideoEmbed(youtubeID) {
  return (
    <div
      className="video-container"
    >
      <iframe
        title={youtubeID}
        className="video-frame"
        src={`https://www.youtube.com/embed/${youtubeID}`}
        frameBorder="0"
      />
    </div>
  );
}

export default VideoEmbed;
