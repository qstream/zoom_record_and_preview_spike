import React, { useState, useContext, useRef } from "react";
import classnames from "classnames";
import { RouteComponentProps } from "react-router-dom";
import ZoomContext from "../../context/zoom-context";
import ZoomMediaContext from "../../context/media-context";
import VideoFooter from "./components/video-footer";
import { useCanvasDimension } from "./hooks/useCanvasDimension";
import { useGalleryLayout } from "./hooks/useGalleryLayout";
import { usePagination } from "./hooks/usePagination";
import "./video.scss";
import Preview from "./preview";

const VideoContainer: React.FunctionComponent<RouteComponentProps> = (
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

  const [previewURL, setPreviewURL] = useState<string>();

  return (
    <div className="viewport">
      {previewURL && (
        <Preview previewURL={previewURL} setPreviewURL={setPreviewURL}/>
      )}
      <div className={classnames("video-container")}>
        <canvas
          className="video-canvas"
          id="video-canvas"
          width="800"
          height="600"
          ref={videoRef}
        />
      </div>
      <VideoFooter className="video-operations" setPreviewURL={setPreviewURL} />
    </div>
  );
};

export default VideoContainer;
