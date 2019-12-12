import React from 'react';
import './videoEmbed.scss';

function VideoEmbed(props) {
  return (
    <div
      className="video-container"
    >
      <iframe
        title={props.youtubeID}
        className="video-frame"
        src={`https://www.youtube.com/embed/${props.youtubeID}`}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export default VideoEmbed;
