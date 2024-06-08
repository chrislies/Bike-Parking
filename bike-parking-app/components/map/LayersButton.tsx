import React, { useState } from "react";

interface LayersButtonProps {
  setCurrentLayer: (layer: string) => void;
}

const LayersButton: React.FC<LayersButtonProps> = ({ setCurrentLayer }) => {
  return (
    <div className="layer-control-buttons bg-white">
      <button onClick={() => setCurrentLayer("street")}>Street Layer</button>
      <button onClick={() => setCurrentLayer("satellite")}>
        Satellite Layer
      </button>
    </div>
  );
};

export default LayersButton;
