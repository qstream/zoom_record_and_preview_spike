import React, { useContext, useRef, useState, useCallback, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { VideoQuality } from '@zoom/videosdk';
import classnames from 'classnames';
import ZoomContext from '../../context/zoom-context';
import ZoomMediaContext from '../../context/media-context';
import Avatar from './components/avatar';
import VideoFooter from './components/video-footer';
import { useParticipantsChange } from './hooks/useParticipantsChange';
import { useCanvasDimension } from './hooks/useCanvasDimension';
import { useMount } from '../../hooks';
import { Participant } from '../../index-types';
import './video.scss';
import { isAndroidBrowser, isSupportOffscreenCanvas } from '../../utils/platform';
import { SELF_VIDEO_ID } from './video-constants';
import { useLocalVolume } from './hooks/useLocalVolume';

const isUseVideoElementToDrawSelfVideo = isAndroidBrowser() || isSupportOffscreenCanvas();

interface VideoContainerProps extends RouteComponentProps {
  setPreviewURL?: Dispatch<SetStateAction<string | undefined>>,
}

const VideoContainer: React.FunctionComponent<VideoContainerProps> = (props) => {
  const zmClient = useContext(ZoomContext);
  const {
    mediaStream,
    video: { decode: isVideoDecodeReady }
  } = useContext(ZoomMediaContext);
  const videoRef = useRef<HTMLCanvasElement | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const previousActiveUser = useRef<Participant>();
  const canvasDimension = useCanvasDimension(mediaStream, videoRef);
  const { userVolumeList, setLocalVolume } = useLocalVolume();

  useParticipantsChange(zmClient, (payload) => {
    setParticipants(payload);
  });
  const onActiveVideoChange = useCallback((payload) => {
    const { userId } = payload;
    setActiveVideo(userId);
  }, []);
  useEffect(() => {
    zmClient.on('video-active-change', onActiveVideoChange);
    return () => {
      zmClient.off('video-active-change', onActiveVideoChange);
    };
  }, [zmClient, onActiveVideoChange]);

  const activeUser = useMemo(
    () => participants.find((user) => user.userId === activeVideo),
    [participants, activeVideo]
  );
  const isCurrentUserStartedVideo = zmClient.getCurrentUserInfo()?.bVideoOn;
  useEffect(() => {
    if (mediaStream && videoRef.current && isVideoDecodeReady) {
      if (activeUser?.bVideoOn !== previousActiveUser.current?.bVideoOn) {
        if (activeUser?.bVideoOn) {
          mediaStream.renderVideo(
            videoRef.current,
            activeUser.userId,
            canvasDimension.width,
            canvasDimension.height,
            0,
            0,
            VideoQuality.Video_360P as any
          );
        } else {
          if (previousActiveUser.current?.bVideoOn) {
            mediaStream.stopRenderVideo(videoRef.current, previousActiveUser.current?.userId);
          }
        }
      }
      if (
        activeUser?.bVideoOn &&
        previousActiveUser.current?.bVideoOn &&
        activeUser.userId !== previousActiveUser.current.userId
      ) {
        mediaStream.stopRenderVideo(videoRef.current, previousActiveUser.current?.userId);
        mediaStream.renderVideo(
          videoRef.current,
          activeUser.userId,
          canvasDimension.width,
          canvasDimension.height,
          0,
          0,
          VideoQuality.Video_360P as any
        );
      }
      previousActiveUser.current = activeUser;
    }
  }, [mediaStream, activeUser, isVideoDecodeReady, canvasDimension]);
  useMount(() => {
    if (mediaStream) {
      setActiveVideo(mediaStream.getActiveVideoId());
    }
  });

  return (
    <div className="viewport">
      <div
        className={classnames('video-container')}
      >
        <canvas className="video-canvas" id="video-canvas" width="800" height="600" ref={videoRef} />
        {isUseVideoElementToDrawSelfVideo ? (
          <video
            id={SELF_VIDEO_ID}
            className={classnames('self-video', {
              'single-self-video': participants.length === 1,
              'self-video-show': isCurrentUserStartedVideo
            })}
          />
        ) : (
          <canvas
            id={SELF_VIDEO_ID}
            width="254"
            height="143"
            className={classnames('self-video', {
              'single-self-video': participants.length === 1,
              'self-video-show': isCurrentUserStartedVideo
            })}
          />
        )}
        {activeUser && (
          <Avatar
            participant={activeUser}
            isActive={false}
            className="single-view-avatar"
            volume={userVolumeList.find((u) => u.userId === activeUser.userId)?.volume}
            setLocalVolume={setLocalVolume}
          />
        )}
      </div>
      <VideoFooter className="video-operations" setPreviewURL={props.setPreviewURL} />
    </div>
  );
};

export default VideoContainer;
