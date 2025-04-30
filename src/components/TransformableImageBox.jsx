// components/TransformableImageBox.jsx
import React from "react";
import "../assets/css/AcrylicPhoto.css";

const TransformableImageBox = ({ src, alt="", imageClass="", imageId=""}) => {
    return (
        <>
            <div className="img-pre">
                <div className="transform-wrapper" id='transformWrapper'>
                    <img className={imageClass} id={imageId} src={src} alt={alt} />
                </div>
            </div>

            <div className="handles">
                <svg className="handle-lines" style={{ overflow: "visible" }}>
                    <line id="line-tl-tr" stroke="#00caff" strokeWidth="1" />
                    <line id="line-tr-br" stroke="#00caff" strokeWidth="1" />
                    <line id="line-br-bl" stroke="#00caff" strokeWidth="1" />
                    <line id="line-bl-tl" stroke="#00caff" strokeWidth="1" />
                </svg>
                <div className="ap-handle tl"></div>
                <div className="ap-handle tr"></div>
                <div className="ap-handle bl"></div>
                <div className="ap-handle br"></div>
                <div className="ap-handle rotate"></div>
            </div>
        </>
    );
};

export default TransformableImageBox;
