import React from "react";
import "../Dir.css";

const Folder = ({ navigate, dir }) => {
  const folderIcon = require("../../../assets/folder.png");
  return (
    <div
      className="dir"
      onClick={() => {
        navigate(dir);
      }}
    >
      <img src={folderIcon} className="dir-icon" />
      {`${dir}`}
    </div>
  );
};

export default Folder;
