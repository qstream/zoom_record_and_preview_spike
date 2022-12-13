import React, { useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import ZoomContext from "../../context/zoom-context";
import Video from "../video/video";
import VideoSingle from "../video/video-single";
import { useBroadcastMessage } from "./hooks/useBroadcastMessage";
import MediaContext from "../../context/media-context";
const RecordPreviewContainer: React.FunctionComponent<RouteComponentProps> = (
  props
) => {
  const zmClient = useContext(ZoomContext);
  const { mediaStream } = useContext(MediaContext);

  useBroadcastMessage(zmClient);

  return (
    <div>
      {mediaStream?.isSupportMultipleVideos() ? (
        <Video {...props} />
      ) : (
        <VideoSingle {...props} />
      )}
    </div>
  );
};

export default RecordPreviewContainer;
