"use client";
import "./logo.css";
import React from "react";

const KBCLogo = () => {
  return (
    <div className="logo">
      <div className="rings">
        {Array.from({ length: 18 }, (_, i) => (
          <div className="ring" key={i}>
            <div className="rin"></div>
          </div>
        ))}
        <div className="border">
          {Array.from({ length: 6 }, (_, j) => (
            <div className="rs" key={j}>
              &#8377;
            </div>
          ))}
        </div>
      </div>
      <div className="diamond"></div>
      <div className="diamond"></div>
      <div className="diamond"></div>
      <div className="diamond"></div>
      <div className="mainHeading">Chocolate</div>
      <div className="subHeading1">
        <div className="char">K</div>
        <div className="char">A</div>
        <div className="char">U</div>
        <div className="char">N</div>
        <div className="char">&nbsp;</div>
        <div className="char">B</div>
        <div className="char">A</div>
        <div className="char">N</div>
        <div className="char">E</div>
        <div className="char">G</div>
        <div className="char">A</div>
      </div>
      <div className="subHeading2">
        <div className="char">K</div>
        <div className="char">A</div>
        <div className="char">U</div>
        <div className="char">N</div>
        <div className="char">&nbsp;</div>
        <div className="char">B</div>
        <div className="char">A</div>
        <div className="char">N</div>
        <div className="char">E</div>
        <div className="char">G</div>
        <div className="char">A</div>
      </div>
    </div>
  );
};

export default KBCLogo;
