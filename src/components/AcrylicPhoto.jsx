import { useEffect, useState } from "react";
import "../assets/css/AcrylicPhoto.css";
import { FaImage, FaShareAlt } from "react-icons/fa";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import useCartStore from "../manage/CartStore";
import { ImSpinner2 } from "react-icons/im";
import Footer from './../components/Layouts/Footer';
import domtoimage from 'dom-to-image-more';
import TransformableImageBox from "./TransformableImageBox";
const AcrylicPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const { addCart } = useCartStore(); // Use the hook



  function copyComputedStyles(source, target) {
    const computedStyle = getComputedStyle(source);
    for (let key of computedStyle) {
      target.style[key] = computedStyle.getPropertyValue(key);
    }

    for (let i = 0; i < source.children.length; i++) {
      copyComputedStyles(source.children[i], target.children[i]);
    }
  }

  async function shareImage() {
    return new Promise(async (resolve, reject) => {
      try {
        const imageContainer = document.querySelector('.ap-image-container');
        if (!imageContainer) {
          alert("Error: Image container not found!");
          return reject("Image container not found");
        }

        await new Promise(r => setTimeout(r, 300)); // wait for any animation or layout to finish

        const clone = imageContainer.cloneNode(true);
        copyComputedStyles(imageContainer, clone);
        document.body.appendChild(clone);

        // Hide clone off-screen
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.margin = '0';
        clone.style.padding = '0';
        clone.style.boxSizing = 'border-box';
        clone.style.background = 'white';
        clone.style.transform = 'none';
        clone.style.zoom = '1';

        const width = imageContainer.offsetWidth;
        const height = imageContainer.offsetHeight;
        clone.style.width = `${width}px`;
        clone.style.height = `${height}px`;

        await document.fonts.ready;
        await new Promise(res => requestAnimationFrame(res)); // layout settle

        const blob = await domtoimage.toBlob(clone, {
          width,
          height,
          style: {
            margin: '0',
            padding: '0',
            boxSizing: 'border-box',
            transform: 'none',
            zoom: '1',
            background: 'white',
          },
        });

        document.body.removeChild(clone);

        if (!blob) {
          alert("Error: Failed to generate image!");
          return reject("Failed to generate image");
        }

        const formData = new FormData();
        const now = new Date();
        const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0];
        const fileName = `customized-image-${formattedDate}.png`;

        const imageData = window.getImageDetails?.() || {};
        formData.append('image', blob, fileName);
        formData.append('details', JSON.stringify(imageData));

        const subject = `Acrylic Premium Photo (${imageData.size || "default"})`;
        formData.append('subject', JSON.stringify(subject));

        resolve(formData);
      } catch (error) {
        console.error("Image generation failed:", error);
        reject(error);
      }
    });
  }

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
      scriptMain.src = "/js/AcrylicPhoto.js";
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

      // const token = localStorage.getItem("token");
      // if (!token) {
      //   console.error("User is not authenticated");
      //   toast.error("User is not authenticated.");
      //   return;
      // }

      const headers = {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        formData,
        { headers }
      );

      if (response.data?.success) {
        const newCartItem = response.data.data;
        console.log(response.data.data.image);

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


  // const handleShare = async () => {
  //   // setLoading(true);

  //   // const promise = new Promise(async (resolve, reject) => {
  //   //   try {
  //   //     const formData = await window.shareImage();
  //   //     console.log("FormData:", [...formData.entries()]);

  //   //     const token = localStorage.getItem("token");
  //   //     if (!token) {
  //   //       console.error("User is not authenticated");
  //   //       reject("User is not authenticated.");
  //   //       return;
  //   //     }

  //   //     const headers = {
  //   //       "Content-Type": "multipart/form-data",
  //   //       Authorization: `Bearer ${token}`,
  //   //     };

  //   //     const response = await axios.post(
  //   //       `${import.meta.env.VITE_BACKEND_URL}/send-email`,
  //   //       formData,
  //   //       { headers }
  //   //     );

  //   //     if (response.data?.success) {
  //   //       resolve("Product share successfully!");
  //   //       setLoading(false);
  //   //     } else {
  //   //       reject("Failed to share product.");
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error sharing product:", error);
  //   //     reject("Failed to share product. Please try again.");
  //   //   }
  //   // });

  //   // toast.promise(promise, {
  //   //   loading: "Sharing product...",
  //   //   success: (message) => message,
  //   //   error: (errMsg) => errMsg,
  //   // });
  // };

  const handleShare = async () => {
    setLoading(true);
    const formData = await shareImage();
    let image;
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   console.error("User is not authenticated");
    //   toast.error("User is not authenticated.");
    //   setLoading(false);
    //   return;
    // }

    const headers = {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/cart/uploadImage`,
      formData,
      { headers }
    );

    if (response.data?.success) {
      image = response.data.data;
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Failed to create product!");
    }
    const subject = JSON.parse(formData.get("subject"));
    const details = JSON.parse(formData.get("details"));

    const {
      name,
      type,
      size,
      shape,
      border,
      price,
      addedText
    } = details;

    const formattedText = addedText.length
      ? addedText.map(({ text, color, style }, i) =>
        `▪️ *${i + 1}.* "${text}"\n  🎨 Color: ${color}\n  🖋 Font: ${style}`
      ).join('\n\n')
      : null;

    let message = `✨ *Check New Order for ${subject}* ✨\n\n`;

    if (name) message += `📌 *Product Name:* ${name}\n`;
    if (type) message += `📦 *Type:* ${type}\n`;
    if (shape) message += `🔵 *Shape:* ${shape}\n`;
    if (size) message += `📏 *Size:* ${size}\n`;
    if (border) message += `🖌️ *Border:* ${border.split("solid")[1]?.trim()}\n`;
    if (image) message += `\n📸 *Image:* ${image}\n`;
    // if (price) message += `💰 *Price:* ₹${price}\n`;

    if (formattedText) {
      message += `\n📋 *Added Text:*\n${formattedText}`;
    }
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="ap-container">
        <div className="ap-border-colors">
          {[
            "none",
            "#000000",
            "#E21E23",
            "#FF5722",
            "#FFEB3B",
            "#AE4A84",
            "#058E3F",
            "#D72483",
            "#EC7D10",
            "#896A67",
          ].map((style, index) => (
            <button
              key={index}
              className={`ap-color-btn ${index === 1 ? "" : ""}`}
              style={{ border: `5px groove ${style}` }}
            >
              <FaImage />
            </button>
          ))}
        </div>

        <div className="ap-preview-container">
          <div className="ap-size-indicator ap-width-indicator" id="width">
          </div>
          <div className="ap-size-indicator ap-height-indicator" id="height">
          </div>

          <div className="ap-image-container" id="imageContainer">
            <TransformableImageBox src="/assets/10 FRAM Copy.jpg" alt = "10 FRAM Copy" imageClass = "ap-preview-image" imageId = "previewImage"/>
            {/* <div className="img-pre">
              <div className="transform-wrapper" id="transformWrapper">
                <img className="ap-preview-image" id="previewImage" src="/assets/10 FRAM Copy.jpg" alt="" />
              </div>
            </div>

            <div className="handles">
              <svg className="handle-lines" style={{ overflow: 'visible' }}>
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
            </div> */}
            {/* <div className="ap-bounding-box">
              <div className="ap-handle tl" data-handle="tl"></div>
              <div className="ap-handle tr" data-handle="tr"></div>
              <div className="ap-handle bl" data-handle="bl"></div>
              <div className="ap-handle br" data-handle="br"></div>
              <div className="ap-handle rotate" data-handle="rotate"></div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <img
                className="ap-preview-image"
                id="previewImage"
                src="/assets/10 FRAM Copy.jpg"
                alt="Preview"
              />
            </div> */}
          </div>

          <div className="ap-shape-options">
            {[
              // "default",
              // "square",
              "potrait",
              "rect",
              "circle",
              "oval",
              "custom",
              "custom2",
              "custom3",
              "custom4",
            ].map((shape, index) => (
              <button
                key={index}
                className={`ap-shape-btn ap-${shape} ${index === 0 ? "ap-active" : ""}`}
                data-shape={shape}
              ></button>
            ))}
          </div>
        </div>

        <div className="ap-controls">

          <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp, image/jpg" hidden />

          <button
            className="btn ap-upload"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaUpload />
          </button>

          {/* <input
            type="range"
            id="zoomRange"
            min="0.5"
            max="5"
            step="0.1"
            defaultValue="1"
            className="zoom-range"
          /> */}

          <button className="btn2 ap-share" id="shareBtn" onClick={handleShare} disabled={loading}>
            {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
          </button>

          <button
            className="btn ap-add-to-cart"
            id="cartBtn"
            onClick={handleAddToCart}
            disabled={cartLoading}
          >
            {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}
          </button>

          <div className="apSizeBtnContainer">
            <p className="size-label">Size:</p>

            {[
              "8x12",
              "12x15",
              "12x18",
              "16x24",
              "18x24",
              "20x30",
              "16x12",
              "20x36"
            ].map((ratio, index) => (
              <button
                key={index}
                className={`ap-size-btn ${index === 0 ? "ap-active" : ""}`}
                data-ratio={ratio}
              >
                {ratio}
              </button>
            ))}
          </div>

          <button className="btn" id="removeBgBtn">
            Change Background
          </button>

          <button className="btn2" id="addTextBtn">
            <HiPencilSquare />
          </button>

        </div>

        <div
          id="bgModal"
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
            <h3>Select a Background</h3>
            <div
              id="bgGallery"
              style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            ></div>
            <button
              onClick={() =>
                (document.getElementById("bgModal").style.display = "none")
              }
            >
              Close
            </button>
          </div>
        </div>

        {/* Text Modal */}
        <div
          id="textModal"
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
              className="border border-black p-1"
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

            <label htmlFor="fontStyleSelect">Font Style:</label>
            <select
              className="border border-black"
              id="fontStyleSelect"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              {[
                "Arial",
                "Times New Roman",
                "Courier New",
                "Verdana",
                "cursive",
                "fantasy",
                "monospace",
                "Lucida Console",
                "Lucida Sans Unicode",
                "Impact",
                "Georgia",
              ].map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>

            <button
              id="addTextModalBtn"
              style={{
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
              }}
            >
              Add Text
            </button>

            <button
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => (document.getElementById("textModal").style.display = "none")}
            >
              Cancel
            </button>

          </div>
        </div>

      </div>
    </>
  );
};

export default AcrylicPhoto;
