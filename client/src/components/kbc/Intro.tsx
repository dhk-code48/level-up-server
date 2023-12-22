"use client";
import React, { useState } from "react";

const KBCIntro = () => {
  const [counter, setCounter] = useState(true);

  return (
    <div className="fixed top-0 left-0 z-50 bg-black">
      {counter && (
        <video
          src="/KBCINTRO.mp4"
          className="w-screen h-screen"
          autoPlay
          muted
          onEnded={() => setCounter(false)}
        />
      )}
    </div>
  );
};

export default KBCIntro;
