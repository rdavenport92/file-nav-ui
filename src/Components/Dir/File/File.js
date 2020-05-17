import React from "react";
import "../Dir.css";

const File = ({ openFile, file }) => {
  const fileIcon = require("../../../assets/file.png");
  return (
    <div className="dir-container">
      <div
        className="dir"
        onClick={() => {
          openFile(file);
        }}
      >
        <img src={fileIcon} className="dir-icon" alt="file-icon" />
        {`${file}`}
      </div>
    </div>
  );
};

export default File;
