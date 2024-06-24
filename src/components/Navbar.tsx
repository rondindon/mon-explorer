import React from "react"
import logo from "../assets/header-logo.png";

interface NavbarProps {
  onTitleClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onTitleClick }) => {
  return (
    <header>
      <img src={logo} alt="logo"/>
      <h1 className="title" onClick={onTitleClick}>MonExplorer</h1>
    </header>
  );
};

export default Navbar;