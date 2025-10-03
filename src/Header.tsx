import React from "react";
import logo from "./assets/clearspace-logo.png";

const headerStyle: React.CSSProperties = {
  width: "100vw",
  height: "64px",
  background: "#2c7083",
  position: "sticky",
  top: 0,
  zIndex: 1100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const logoContainerStyle: React.CSSProperties = {
  position: "absolute",
  left: "50vw",
  top: 0,
  height: "100%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function Header() {
  return (
    <div style={headerStyle}>
      <div style={logoContainerStyle}>
        <img src={logo} alt="Clearspace Logo" style={{ height: "100%" }} />
      </div>
    </div>
  );
}

export default Header;
