import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/CollagePhoto.css"; // Ensure correct path

const AcrylicCollageHome = () => {
    const dictionary = {
        item1: { image: "https://s.omgs.in/wp-content/uploads/2021/10/5-pics-acrylic-print-min-500x500.jpg", description: "5 Pics Collage Premium Acrylic Wall Photo", type: "5-pics" },
        item2: { image: "https://s.omgs.in/wp-content/uploads/2021/10/8-Collage-Portrait-Acrylic-Wall-Photo-min-500x500.jpg", description: "8 Collage Portrait Acrylic Wall Photo", type: "8-pics" },
        item3: { image: "https://s.omgs.in/wp-content/uploads/2021/10/2-Photo-Collage-Acrylic-min-500x500.jpg", description: "2 Photo Collage Acrylic Wall Photo", type: "2-pics" },
    };
    return (
        <div className="acol-container">
            {Object.keys(dictionary).map((key, index) => (
                <Link to={`/collage/${dictionary[key].type}`} className="acol-card-link" key={index} onClick={sessionStorage.setItem("newPage", JSON.stringify(true))}>
                    <div className="acol-card">
                        <img src={dictionary[key].image} alt={key} />
                        <div className="acol-description">{dictionary[key].description}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default AcrylicCollageHome;
