import React, { Dispatch, SetStateAction } from "react";
import './preview.scss'

interface PreviewProps {
  previewURL: string;
  setPreviewURL: Dispatch<SetStateAction<string | undefined>>;
}

const Preview: React.FunctionComponent<PreviewProps> = ({
  previewURL,
  setPreviewURL,
}) => {
  return (
    <div className="preview">
      <video width="1440" height="649" controls>
        <source src={previewURL} type="video/webm" />
        Can't play video
      </video>

      <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
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
  );
};

export default Preview;
