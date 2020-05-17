import React from "react";
import "./ToolBar.css";
const backIcon = require("../../assets/backIcon.png");

const Toolbar = ({ goBack, dir, jumpTo }) => {
  const selectDir = (index) => {
    let tempDir = [...dir];
    tempDir.splice(index + 1);
    jumpTo(tempDir);
  };

  let topLevel = dir.length === 1 ? true : false;
  return (
    <div className="toolbar-container">
      <div className="back-btn-container">
        <img
          src={backIcon}
          alt="back-icon"
          onClick={!topLevel ? goBack : null}
          className={"back-btn" + (!topLevel ? "" : " disable")}
        />{" "}
      </div>
      <div className="nav-bar">
        {dir.map((d, index) => (
          <DirSelectable
            key={`entry-${index + 1}`}
            selectDir={() => selectDir(index)}
            dir={d}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;

const DirSelectable = ({ selectDir, dir }) => {
  return (
    <div className="dir-selectable" onClick={selectDir}>
      {dir}
    </div>
  );
};
