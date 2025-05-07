// import React from "react";
// import { Link } from "react-router-dom";
// import "../../assets/css/CollagePhoto.css"; // Ensure correct path

// const AcrylicCollageHome = () => {
    const dictionary = {
        item1: { image: "/assets/images/COLLAGE 01 FRAM.jpg", description: "5 Pics Collage Premium Acrylic Wall Photo", type: "5-pics" },
        item2: { image: "/assets/images/COLLAGE 5 FRAM.jpg", description: "8 Collage Portrait Acrylic Wall Photo", type: "8-pics" },
        item3: { image: "/assets/images/COLLAGE 8 FRAM.jpg", description: "2 Photo Collage Acrylic Wall Photo", type: "2-pics" },
    };
//     return (
//         <div className="acol-container">
//             {Object.keys(dictionary).map((key, index) => (
//                 <Link to={`/collage/${dictionary[key].type}`} className="acol-card-link" key={index} onClick={sessionStorage.setItem("newPage", JSON.stringify(true))}>
//                     <div className="acol-card">
//                         <img src={dictionary[key].image} alt={key} />
//                         <div className="acol-description">{dictionary[key].description}</div>
//                     </div>
//                 </Link>
//             ))}
//         </div>
//     );
// };

// export default AcrylicCollageHome;


import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/FridgeMagnet.css";


const MainHome = () => {
  return (
    <div className="afm-container">
      {Object.keys(dictionary).map((key, index) => (
        <div className="afm-card" key={index}>
          <img src={dictionary[key].image} alt={key} />
          <div className="afm-description">{dictionary[key].description}</div>
          <Link to={`/collage/${dictionary[key].type}`} className="afm-customize-btn" onClick={sessionStorage.setItem("newPage", JSON.stringify(true))}>
            Shop Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainHome;
