import React from "react"
import logo from "../assets/header-logo.png";

const Navbar: React.FC = () => {
    return (
    <header>
        <img src={logo} alt="logo"/>
        <h1 className="title">Pokemon Finder</h1>
    </header>
    )
};

export default Navbar;