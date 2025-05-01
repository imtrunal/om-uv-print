// components/TransformableImageBox.jsx
import React from "react";
import "../assets/css/AcrylicPhoto.css";

const TransformableImageBox = ({ prefix = "", src, alt = "", imageClass = "", imageId = "" ,shape=""}) => {
    return (
        <>
            <div className={`${prefix}img-pre ${shape}`}>
                <div className={`${prefix}transform-wrapper`} id={`${prefix}transformWrapper`}>
                    <img className={imageClass} id={imageId} src={src} alt={alt} />
                </div>
            </div>

            <div className={`${prefix}handles`}>
                <svg className={`${prefix}handle-lines`} style={{ overflow: "visible" }}>
                    <line id={`${prefix}line-tl-tr`} stroke="#00caff" strokeWidth="1" />
                    <line id={`${prefix}line-tr-br`} stroke="#00caff" strokeWidth="1" />
                    <line id={`${prefix}line-br-bl`} stroke="#00caff" strokeWidth="1" />
                    <line id={`${prefix}line-bl-tl`} stroke="#00caff" strokeWidth="1" />
                </svg>
                <div className={`${prefix}handle tl`}></div>
                <div className={`${prefix}handle tr`}></div>
                <div className={`${prefix}handle bl`}></div>
                <div className={`${prefix}handle br`}></div>
                <div className={`${prefix}handle rotate`}></div>
            </div>
        </>
    );
};

export default TransformableImageBox;
