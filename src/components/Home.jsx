import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#000787",
    marginBottom: "20px",
  };

  const cardContainerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "1200px",
  };

  const cardStyle = {
    width: "280px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
  };

  const descriptionStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  };

  const buttonStyle = (isHovered) => ({
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: isHovered ? "#048e1d" : "#000787",
    color: "#fff",
    fontWeight: "bold",
    display: "inline-block",
    textTransform: "uppercase",
  });

  const imageStyle = {
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
  };

  const handleClick = (path) => {
    navigate(path);
    sessionStorage.setItem("newPage", JSON.stringify(true));
  };

  const cards = [
    {
      title: "Acrylic Photo",
      description: "Explore our premium quality acrylic products.",
      path: "/acrylic",
      image: "https://s.omgs.in/wp-content/uploads/2023/05/OMGS-wall-acryllic-min.jpg",
    },
    {
      title: "Clear Acrylic Photo",
      description: "Get the best transparent acrylic products.",
      path: "/clear-acrylic",
      image: "https://omgs.in/wp-content/uploads/2022/12/transparent-framed-premium-acrylic-photo00001.jpg",
    },
    {
      title: "Acrylic Fridge Magnets",
      description: "Customize fridge magnets with unique designs.",
      path: "/fridge-magnets",
      image: "https://s.omgs.in/wp-content/uploads/2023/10/3-800x800.jpg",
    },
    {
      title: "Acrylic Wall Clock",
      description: "Get the best acrylic wall clock for your home.",
      path: "/acrylic-wall-clock",
      image: "https://omgs.in/wp-content/uploads/2022/05/round.jpg",
    },
    {
      title: "Collage Acrylic Photo",
      description: "Create a beautiful collage with acrylic photo frames.",
      path: "/collage-acrylic-photo",
      image: "https://s.omgs.in/wp-content/uploads/2021/10/8-Collage-Portrait-Acrylic-Wall-Photo-min-768x768.jpg",
    },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Acrylic Image Customizer</h1>

      <div style={cardContainerStyle}>
        {cards.map((card, index) => (
          <div key={index} style={cardStyle}>
            <img src={card.image} alt="" style={imageStyle} />
            <h3>{card.title}</h3>
            <p style={descriptionStyle}>{card.description}</p>
            <button
              style={buttonStyle(hoveredButtonIndex === index)}
              onClick={() => handleClick(card.path)}
              onMouseEnter={() => setHoveredButtonIndex(index)}
              onMouseLeave={() => setHoveredButtonIndex(null)}
            >
              Customize Now
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
