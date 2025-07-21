// src/components/Loader.jsx
import React from "react";
import "../styles/Loader.css";

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p>
        Caricamento... <br />
        <i>Può richiedere qualche secondo</i>
      </p>
    </div>
  );
}

export default Loader;
