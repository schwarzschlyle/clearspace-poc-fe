import React from "react";
import logo from "./assets/clearspace-logo.png";

const headerStyle: React.CSSProperties = {
  width: "100vw",
  height: "64px",
  position: "sticky",
  top: 0,
  zIndex: 1100,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
};

const leftStyle: React.CSSProperties = {
  width: "50vw",
  height: "100%",
  background: "#2c7083",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
};

const rightStyle: React.CSSProperties = {
  width: "50vw",
  height: "100%",
  background: "#e2d5cf",
};

function Header() {
  return (
    <div style={headerStyle}>
      <div style={leftStyle}>
        <img src={logo} alt="Clearspace Logo" style={{ height: "100%", marginLeft: 32 }} />
      </div>
      <div style={rightStyle}></div>
    </div>
  );
}

export default Header;
