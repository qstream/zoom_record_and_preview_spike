import React, { useState, useContext, useRef, useEffect } from "react";
import classnames from "classnames";
import { RouteComponentProps } from "react-router-dom";
import ZoomContext from "../../context/zoom-context";
import ZoomMediaContext from "../../context/media-context";
import VideoFooter from "./components/video-footer";
import { useCanvasDimension } from "./hooks/useCanvasDimension";
import { useGalleryLayout } from "./hooks/useGalleryLayout";
import { usePagination } from "./hooks/usePagination";
import "./video.scss";
import { RecordRTCPromisesHandler } from "recordrtc";

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
    <div className="viewport">
      {previewURL && (
        <div className='preview'>
          <video width="800" height="600" controls>
            <source src={previewURL} type="video/webm" />
            Can't play video
          </video>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "50px" }}
          >
            <span>What to do with the recording?</span>
            <button
              onClick={() => {
                alert("assume we send remove recording request to zoom");
                window.recorder.destroy();
                setPreviewURL(undefined);
              }}
            >
              Remove
            </button>
            <button
              onClick={() => {
                alert("assume the vid was used as an answer");
                window.recorder.destroy();
                setPreviewURL(undefined);
              }}
            >
              Keep
            </button>
          </div>
        </div>
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
