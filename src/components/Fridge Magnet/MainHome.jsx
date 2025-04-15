import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/FridgeMagnet.css";

const dictionary = {
  item1: {
    image: "assets/07 FRAM.jpg",
    description: "Round Corners Acrylic Fridge Magnet",
    type: "round-corners"
  },
  item2: {
    image: "https://s.omgs.in/wp-content/uploads/2024/01/circle-shape-min-768x768.jpg",
    description: "Round Acrylic Fridge Magnet",
    type: "rounded"
  },
  item3: {
    image: "https://s.omgs.in/wp-content/uploads/2024/01/Leaf-2-shape-min-2048x2048.jpg",
    description: "Leaf Shape Acrylic Fridge Magnet",
    type: "leaf"
  },
  item4: {
    image: "https://s.omgs.in/wp-content/uploads/2024/01/square-shape-min-2048x2048.jpg",
    description: "Square Acrylic Fridge Magnets",
    type: "square"
  },
};

const MainHome = () => {
  return (
    <div className="afm-container">
      {Object.keys(dictionary).map((key, index) => (
        <div className="afm-card" key={index}>
          <img src={dictionary[key].image} alt={key} />
          <div className="afm-description">{dictionary[key].description}</div>
          <Link to={`/fridge-magnets/${dictionary[key].type}`} className="afm-customize-btn" onClick={sessionStorage.setItem("newPage", JSON.stringify(true))}>
            Shop Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainHome;
