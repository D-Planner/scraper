import React from 'react';
import './videoEmbed.scss';
import LoadingWheel from '../loadingWheel';

class VideoEmbed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  doneLoading() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <div
        className="video-container"
      >
        {this.state.loading === true ? <LoadingWheel /> : null}
        <iframe
          title={this.props.youtubeID}
          id="video-frame"
          src={`https://www.youtube.com/embed/${this.props.youtubeID}`}
          frameBorder="0"
          width="100%"
          height="100%"
          // allowFullScreen="0"
          // mozallowfullscreen="mozallowfullscreen"
          // msallowfullscreen="msallowfullscreen"
          // oallowfullscreen="oallowfullscreen"
          // webkitallowfullscreen="webkitallowfullscreen"
          onLoad={() => this.doneLoading()}
        />
      </div>
    );
  }
}

export default VideoEmbed;
