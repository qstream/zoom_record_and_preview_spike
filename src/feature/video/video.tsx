import React, { useContext, useRef, Dispatch, SetStateAction } from "react";
import classnames from "classnames";
import { RouteComponentProps } from "react-router-dom";
import ZoomContext from "../../context/zoom-context";
import ZoomMediaContext from "../../context/media-context";
import VideoFooter from "./components/video-footer";
import { useCanvasDimension } from "./hooks/useCanvasDimension";
import { useGalleryLayout } from "./hooks/useGalleryLayout";
import { usePagination } from "./hooks/usePagination";
import "./video.scss";

interface VideoContainerProps extends RouteComponentProps {
  setPreviewURL?: Dispatch<SetStateAction<string | undefined>>,
}

const VideoContainer: React.FunctionComponent<VideoContainerProps> = (
  props
) => {
  const zmClient = useContext(ZoomContext);
  const {
    mediaStream,
    video: { decode: isVideoDecodeReady },
  } = useContext(ZoomMediaContext);
  const videoRef = useRef<HTMLCanvasElement | null>(null);
  const canvasDimension = useCanvasDimension(mediaStream, videoRef);
  const { page, pageSize, totalPage, totalSize } = usePagination(
    zmClient,
    canvasDimension
  );
  useGalleryLayout(
    zmClient,
    mediaStream,
    isVideoDecodeReady,
    videoRef,
    canvasDimension,
    {
      page,
      pageSize,
      totalPage,
      totalSize,
    }
  );


  return (
    <div className="viewport">
      <div className={classnames("video-container")}>
        <canvas
          className="video-canvas"
          id="video-canvas"
          width="800"
          height="600"
          ref={videoRef}
        />
      </div>
      <VideoFooter className="video-operations" setPreviewURL={props.setPreviewURL} />
    </div>
  );
};

export default VideoContainer;
