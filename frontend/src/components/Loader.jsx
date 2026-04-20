import React from "react";

function Loader({ message = "Loading..." }) {
  return (
    <div className="loading-text">
      <p>{message}</p>
    </div>
  );
}

export default Loader;
