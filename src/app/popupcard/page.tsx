"use client";
import React from "react";
import "./popupcard.css";

const PopupCard = ({ title, message, onClose }: { title: string; message: string; onClose: () => void }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="popup-close" onClick={onClose}>X</button>
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <button className="popup-ok" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default PopupCard;