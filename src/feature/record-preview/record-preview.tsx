import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import ZoomContext from "../../context/zoom-context";
import Video from "../video/video";
import VideoSingle from "../video/video-single";
import { useBroadcastMessage } from "./hooks/useBroadcastMessage";
import MediaContext from "../../context/media-context";
import { RecordRTCPromisesHandler } from "recordrtc";
import Preview from "../video/preview";
const RecordPreviewContainer: React.FunctionComponent<RouteComponentProps> = (
  props
) => {
  const zmClient = useContext(ZoomContext);
  const { mediaStream } = useContext(MediaContext);

  useBroadcastMessage(zmClient);

  useEffect(() => {
    const setup = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.recorder = new RecordRTCPromisesHandler(stream, {
        type: "video",
        mimeType: "video/webm",
      });
    };
    setup();
  }, []);

  const [previewURL, setPreviewURL] = useState<string>();

  return (
    <div>
      {previewURL && (
        <Preview previewURL={previewURL} setPreviewURL={setPreviewURL} />
      )}

      {mediaStream?.isSupportMultipleVideos() ? (
        <Video {...props} setPreviewURL={setPreviewURL} />
      ) : (
        <VideoSingle {...props} setPreviewURL={setPreviewURL} />
      )}
    </div>
  );
};

export default RecordPreviewContainer;
