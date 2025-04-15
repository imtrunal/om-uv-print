import React, { useEffect, useState } from "react";
import "../../assets/css/FridgeMagnet.css"; // Make sure this file exists
import { FaCameraRetro, FaShareAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../../utils/ShareService";
import useCartStore from "../../manage/CartStore";
import axios from "axios";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";

const CustomizePage = () => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const { addCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  useEffect(() => {
    const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

    if (newPage) {
      sessionStorage.setItem("newPage", JSON.stringify(false));
      window.location.reload();
    }
    const scriptHtml2Canvas = document.createElement("script");
    scriptHtml2Canvas.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    scriptHtml2Canvas.defer = true;
    document.body.appendChild(scriptHtml2Canvas);

    // Load main.js after html2canvas is loaded
    scriptHtml2Canvas.onload = () => {
      const scriptMain = document.createElement("script");
      scriptMain.src = "/js/FridgeMagnet.js";
      scriptMain.defer = true;
      scriptMain.type = "module";
      document.body.appendChild(scriptMain);

      return () => {
        document.body.removeChild(scriptMain);
        document.body.removeChild(scriptHtml2Canvas);
      };
    };
  }, []);

  const handleAddToCart = async () => {
    setCartLoading(true);

    try {

      const formData = await window.shareImage();
      console.log("FormData:", [...formData.entries()]);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        toast.error("User is not authenticated.");
        return;
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        formData,
        { headers }
      );

      if (response.data?.success) {
        const newCartItem = response.data.data;

        addCart({
          id: newCartItem._id,
          name: newCartItem.name,
        });

        toast.success(`${newCartItem.name} added to cart!`);
      } else {
        toast.error("Failed to add product to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const formData = await window.shareImage();
        console.log("FormData:", [...formData.entries()]);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User is not authenticated");
          reject("User is not authenticated.");
          return;
        }

        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/send-email`,
          formData,
          { headers }
        );

        if (response.data?.success) {
          resolve("Product share successfully!");
          setLoading(false);
        } else {
          reject("Failed to share product.");
        }
      } catch (error) {
        console.error("Error sharing product:", error);
        reject("Failed to share product. Please try again.");
      }
    });

    toast.promise(promise, {
      loading: "Sharing product...",
      success: (message) => message,
      error: (errMsg) => errMsg,
    });

  };
  return (
    <div className={`afm-image-customization-page ${type ? `afm-${type}` : ''}`}>
      <div className="afm-page-container">
        <div className="afm-left">
          <div className="afm-upload-box" id="uploadBox">
            <img id="afm-previewImage" alt="Click to upload" style={{ display: "none" }} />
            <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp, image/jpg" style={{ display: "none" }} />
            <p id="afm-placeholderText">
              <FaCameraRetro />
            </p>
          </div>
        </div>
        <div className="afm-right">
          <div className="afm-row">
            <button className="btn2 afm-upload">
              <i className="fa-solid fa-upload"></i> Change Photo
            </button>
            <button className="afm-upload-btn" id="afm-addTextBtn">
              <i className="fa-solid fa-pen-to-square"></i> Add Text
            </button>
          </div>
          <h3>Size:</h3>
          <div className="afm-row">
            <button className="afm-size-btn afm-active" data-ratio="3/3">
              3x3
            </button>
            <button className="afm-size-btn" data-ratio="4/4">
              4x4
            </button>
          </div>
          <h3>Thickness:</h3>
          <div className="afm-row">
            <button className="afm-thickness-btn afm-active">5 MM</button>
            <button className="afm-thickness-btn">8 MM</button>
          </div>
          <br />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn2 afm-share" id="shareBtn" onClick={handleShare} disabled={loading}>
              {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
            </button>
            <button
              className="btn2 afm-add-to-cart"
              id="cartBtn"
              onClick={() => handleAddToCart({
                container: "afm-upload-box",
                title: "Customized Acrylic Fridge Magnet",
                price: 849
              })}
              disabled={cartLoading}
            >
              {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}
            </button>
          </div>
        </div>
      </div>

      {/* ===TEXT MODAL=== */}
      <div
        id="afm-textModal"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Customize Text</h3>
          <label htmlFor="modalTextInput">Enter Text:</label>
          <input
            type="text"
            id="modalTextInput"
            placeholder="Enter text"
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label htmlFor="textColor">Text Color:</label>
          <input
            type="color"
            id="textColor"
            defaultValue="#000000"
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label htmlFor="fontStyleSelect">Select Font Style:</label>
          <select
            id="fontStyleSelect"
            style={{ width: "100%", marginBottom: "10px" }}
          >
            <option value="Arial" style={{ fontFamily: "Arial" }}>
              Arial
            </option>
            <option value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>
              Times New Roman
            </option>
            <option value="Courier New" style={{ fontFamily: "Courier New" }}>
              Courier New
            </option>
            <option value="Verdana" style={{ fontFamily: "Verdana" }}>
              Verdana
            </option>
            <option value="cursive" style={{ fontFamily: "cursive" }}>
              Cursive
            </option>
            <option value="fantasy" style={{ fontFamily: "fantasy" }}>
              Fantasy
            </option>
            <option value="monospace" style={{ fontFamily: "monospace" }}>
              Monospace
            </option>
            <option value="Lucida Console" style={{ fontFamily: "Lucida Console" }}>
              Lucida Console
            </option>
            <option value="Lucida Sans Unicode" style={{ fontFamily: "Lucida Sans Unicode" }}>
              Lucida Sans Unicode
            </option>
            <option value="Impact" style={{ fontFamily: "Impact" }}>
              Impact
            </option>
            <option value="Georgia" style={{ fontFamily: "Georgia" }}>
              Georgia
            </option>
          </select>

          <button style={{
            backgroundColor: "#048e1d",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginRight: "10px",
          }} id="afm-addTextModalBtn">Add Text</button>
          <button style={{
            backgroundColor: "#ff4d4d",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }} onClick={() => (document.getElementById("afm-textModal").style.display = "none")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
