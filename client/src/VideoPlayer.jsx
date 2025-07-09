import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';

export const VideoJS = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'video-js');
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        ...options,
        html5: {
          ...options.html5,
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
      });

      player.httpSourceSelector({
        default: 'auto',
      });

      player.ready(() => {
        onReady && onReady(player);
      });
      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
