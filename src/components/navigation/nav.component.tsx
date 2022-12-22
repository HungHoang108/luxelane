import React from "react";
import { Link } from "react-router-dom";

import "./nav.component.style.scss";

const Navigation = () => {
  return (
    <div className="nav">
      <div>
        <Link to="">Home</Link>
        <Link to="productlist">Products</Link>
        <Link to="about">About</Link>
      </div>
      <div className="nav-icon">
        <div>search</div>
        <div>light</div>
        <div>cart</div>
        <div>login</div>
      </div>
    </div>
  );
};

export default Navigation;
