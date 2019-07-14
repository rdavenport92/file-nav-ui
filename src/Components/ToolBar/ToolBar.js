import React from "react";
import "./ToolBar.css";
const backIcon = require("../../assets/backIcon.png");

const Toolbar = ({ goBack, dir }) => {
  let topLevel = dir.length === 1 ? true : false;
  return (
    <div className="toolbar-container">
      <div className="back-btn-container">
        <img
          src={backIcon}
          onClick={!topLevel ? goBack : null}
          className={"back-btn" + (!topLevel ? "" : " disable")}
        />{" "}
      </div>
      <div className="nav-bar"> {dir}</div>
    </div>
  );
};

export default Toolbar;
