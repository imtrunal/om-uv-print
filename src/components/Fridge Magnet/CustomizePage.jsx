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
import html2canvas from "html2canvas";


const CustomizePage = () => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const { addCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { shape } = useParams();

  // useEffect(() => {
  //   const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

  //   if (newPage) {
  //     sessionStorage.setItem("newPage", JSON.stringify(false));
  //     window.location.reload();
  //   }

  //   // Load html2canvas
  //   const scriptHtml2Canvas = document.createElement("script");
  //   scriptHtml2Canvas.src =
  //     "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  //   scriptHtml2Canvas.defer = true;

  //   // Load FridgeMagnet.js after html2canvas is loaded
  //   scriptHtml2Canvas.onload = () => {
  //     console.log("html2canvas loaded successfully!");

  //     const scriptMain = document.createElement("script");
  //     console.log(window.location.origin);

  //     scriptMain.src = `${window.location.origin}/js/FridgeMagnet.js`;
  //     scriptMain.defer = true;
  //     scriptMain.type = "module";

  //     scriptMain.onload = () => {
  //       console.log("FridgeMagnet.js loaded successfully!");
  //     };

  //     scriptMain.onerror = (error) => {
  //       console.error("Failed to load FridgeMagnet.js:", error);
  //     };

  //     document.body.appendChild(scriptMain);
  //   };

  //   scriptHtml2Canvas.onerror = (error) => {
  //     console.error("Failed to load html2canvas:", error);
  //   };

  //   document.body.appendChild(scriptHtml2Canvas);

  //   return () => {
  //     document.body.removeChild(scriptHtml2Canvas);
  //     const scriptMain = document.querySelector('script[src*="FridgeMagnet.js"]');
  //     console.log(scriptMain);

  //     if (scriptMain) {
  //       document.body.removeChild(scriptMain);
  //     }
  //   };
  // }, []);


  useEffect(() => {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('afm-previewImage');
    const placeholderText = document.getElementById('afm-placeholderText');
    const uploadButton = document.querySelector('.afm-upload');
    const shareBtn = document.getElementById('shareBtn');
    const addTextBtn = document.getElementById('afm-addTextBtn');
    const allSizeBtn = document.querySelectorAll('.afm-size-btn');
    const allThicknessBtn = document.querySelectorAll('.afm-thickness-btn');
    const leftPanel = document.querySelector('.afm-image-customization-page .afm-left');
    const cartBtn = document.getElementById('cartBtn');
    const zoomRange = document.getElementById('afm-zoomRange');
    const BASE_URL = window.BASE_URL;
    const allTextData = [];

    let scale = 1;
    let isImageUploaded = false;
    let currentX = 0, currentY = 0;
    let rotation = 0;

    // Event handlers
    const handleUploadBoxClick = () => {
      if (!isImageUploaded) {
        fileInput.click();
      }
    };

    const handleUploadButtonClick = () => {
      fileInput.disabled = false;
      fileInput.click();
    };

    const handleFileInputChange = function (event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
          placeholderText.style.display = "none";
          isImageUploaded = true;
          initializeImageFeatures(previewImage);
          addTextBtn.style.display = 'block';
          shareBtn.style.display = 'block';
          cartBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    };

    const handleZoomRangeInput = function () {
      scale = parseFloat(zoomRange.value);
      updateImagePosition();
    };

    const handleAddTextClick = function () {
      document.getElementById('afm-textModal').style.display = 'block';
    };

    const handleAddTextModalClick = function () {
      const text = document.getElementById('modalTextInput').value;
      const textColor = document.getElementById('textColor').value;
      const fontStyle = document.getElementById('fontStyleSelect').value;

      if (text.trim() !== '') {
        const textBox = document.createElement('div');
        textBox.className = 'afm-text-box';
        textBox.innerText = text;

        textBox.style.position = 'absolute';
        textBox.style.fontFamily = fontStyle;
        textBox.style.color = textColor;
        textBox.style.fontSize = '24px';
        textBox.style.top = '50%';
        textBox.style.left = '50%';
        textBox.style.transform = 'translate(-50%, -50%)';
        textBox.style.cursor = 'move';
        textBox.style.border = 'none';
        document.getElementById('uploadBox').appendChild(textBox);

        makeDraggable(textBox, { resize: 'afm-resize-handle', rotate: 'afm-rotate-handle' });
        makeResizable(textBox);
        makeRotatable(textBox);
        allTextData.push({
          text: text,
          color: textColor,
          style: fontStyle,
        });
      }

      closeTextModal();
    };

    // Helper functions
    function initializeImageFeatures(imageElement) {
      addRotateHandle(imageElement);
      makeDraggable(imageElement, { rotate: 'afm-rotate' });
    }

    function updateImagePosition() {
      previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;
    }

    function addRotateHandle(imageElement) {
      const rotateHandle = document.createElement('div');
      rotateHandle.className = 'afm-rotate';
      rotateHandle.style.position = 'absolute';
      rotateHandle.style.top = '13%';
      rotateHandle.style.left = '30%';
      rotateHandle.style.transform = 'translateX(-50%)';
      rotateHandle.style.cursor = 'pointer';
      rotateHandle.innerHTML = '&#8635;';
      rotateHandle.style.color = 'blue';
      rotateHandle.style.fontWeight = 'bold';
      rotateHandle.style.fontSize = '1.5rem';
      rotateHandle.style.backgroundColor = 'transparent';

      leftPanel.appendChild(rotateHandle);

      const handleMouseDown = function (e) {
        e.stopPropagation();
        const rect = imageElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          rotation = (angle * (180 / Math.PI) + 90) % 360;
          updateImagePosition();
        }

        function stopRotating() {
          document.removeEventListener('mousemove', rotate);
          document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
      };

      rotateHandle.addEventListener('mousedown', handleMouseDown);

      // Return cleanup function
      return () => {
        rotateHandle.removeEventListener('mousedown', handleMouseDown);
        leftPanel.removeChild(rotateHandle);
      };
    }

    function closeTextModal() {
      document.getElementById('afm-textModal').style.display = 'none';
    }

    function makeDraggable(element, handle) {
      let isDragging = false;
      let offsetX, offsetY;

      const handleMouseDown = function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
        element.style.border = '2px dashed #248EE6';

        if (handle.resize) {
          const resizeEl = element.querySelector(`.${handle.resize}`);
          if (resizeEl) resizeEl.style.display = 'block';
        }

        if (handle.rotate) {
          const rotateEl = element.querySelector(`.${handle.rotate}`);
          if (rotateEl) rotateEl.style.display = 'block';
        }
      };

      const handleMouseMove = function (e) {
        if (isDragging) {
          element.style.left = e.clientX - offsetX + 'px';
          element.style.top = e.clientY - offsetY + 'px';
        }
      };

      const handleMouseUp = function () {
        isDragging = false;
        element.style.cursor = 'move';
      };

      const handleDocumentMouseDown = function (e) {
        if (!element.contains(e.target)) {
          element.style.border = 'none';

          if (handle.resize) {
            const resizeEl = element.querySelector(`.${handle.resize}`);
            if (resizeEl) resizeEl.style.display = 'none';
          }

          if (handle.rotate) {
            const rotateEl = element.querySelector(`.${handle.rotate}`);
            if (rotateEl) rotateEl.style.display = 'none';
          }
        }
      };

      element.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousedown', handleDocumentMouseDown);

      // Return cleanup function
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousedown', handleDocumentMouseDown);
      };
    }

    function makeResizable(element) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'afm-resize-handle';
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.right = '-11.3px';
      resizeHandle.style.bottom = '-6.5px';
      resizeHandle.style.fontSize = '24px';
      resizeHandle.style.cursor = 'crosshair';
      resizeHandle.innerText = '+';
      resizeHandle.style.display = 'none';

      element.appendChild(resizeHandle);

      const handleMouseDown = function (e) {
        e.stopPropagation();
        const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
        const initialMouseX = e.clientX;

        function resize(e) {
          const scaleFactor = 0.2;
          const newSize = initialFontSize + (e.clientX - initialMouseX) * scaleFactor;

          if (newSize > 10) {
            element.style.fontSize = newSize + 'px';
          }
        }

        function stopResizing() {
          document.removeEventListener('mousemove', resize);
          document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
      };

      resizeHandle.addEventListener('mousedown', handleMouseDown);

      // Return cleanup function
      return () => {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
        element.removeChild(resizeHandle);
      };
    }

    function makeRotatable(element) {
      const rotateHandle = document.createElement('div');
      rotateHandle.className = 'afm-rotate-handle';
      rotateHandle.style.position = 'absolute';
      rotateHandle.style.bottom = '40px';
      rotateHandle.style.left = '50%';
      rotateHandle.style.transform = 'translateX(-50%)';
      rotateHandle.style.width = '20px';
      rotateHandle.style.height = '20px';
      rotateHandle.style.cursor = 'grab';
      rotateHandle.innerText = '⭯';
      rotateHandle.style.display = 'none';

      element.appendChild(rotateHandle);

      let isRotating = false;

      const handleMouseDown = function (e) {
        e.stopPropagation();
        isRotating = true;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e) {
          if (isRotating) {
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
          }
        }

        function stopRotating() {
          isRotating = false;
          document.removeEventListener('mousemove', rotate);
          document.removeEventListener('mouseup', stopRotating);
        }

        document.addEventListener('mousemove', rotate);
        document.addEventListener('mouseup', stopRotating);
      };

      rotateHandle.addEventListener('mousedown', handleMouseDown);

      // Return cleanup function
      return () => {
        rotateHandle.removeEventListener('mousedown', handleMouseDown);
        element.removeChild(rotateHandle);
      };
    }

    function updatePreview() {
      const text = document.getElementById('modalTextInput').value || 'Preview Text';

      document.querySelectorAll('option').forEach(option => {
        const font = option.value;
        option.style.fontFamily = font;
        option.textContent = `${text}`;
      });
    }

    function changeFontFamily() {
      const selectedFont = document.getElementById('fontStyleSelect').value;
      const textInput = document.getElementById('fontStyleSelect');
      textInput.style.fontFamily = selectedFont;
    }

    // Size button event handlers
    const sizeButtonClickHandlers = [];
    allSizeBtn.forEach(btn => {
      const handler = function () {
        allSizeBtn.forEach(button => button.classList.remove('afm-active'));
        this.classList.add('afm-active');
      };
      btn.addEventListener('click', handler);
      sizeButtonClickHandlers.push({ btn, handler });
    });

    // Thickness button event handlers
    const thicknessButtonClickHandlers = [];
    allThicknessBtn.forEach(btn => {
      const handler = function () {
        allThicknessBtn.forEach(button => button.classList.remove('afm-active'));
        this.classList.add('afm-active');
      };
      btn.addEventListener('click', handler);
      thicknessButtonClickHandlers.push({ btn, handler });
    });

    function getImageDetails() {
      const previewImage = document.getElementById('afm-previewImage');
      const selectedSize = document.querySelector('.afm-size-btn.afm-active');
      const selectedThickness = document.querySelector('.afm-thickness-btn.afm-active');
      const textElement = document.querySelectorAll('.text-box');
      const size = selectedSize && selectedSize.dataset.ratio !== "default"
        ? selectedSize.dataset.ratio
        : "default";
      if (!previewImage || !previewImage.src) {
        console.error("No image uploaded.");
        return null;
      }

      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];

      if (!file) {
        console.error("No file selected.");
        return null;
      }

      const imageDetails = {
        image: {
          name: file.name,
          lastModified: file.lastModified,
          lastModifiedDate: new Date(file.lastModifiedDate).toString(),
          size: file.size,
          type: file.type,
        },
        size: size,
        name: `Acrylic Fridge Magnet (${size})`,
        type: 'Acrylic Fridge Magnet',
        price: 899,
        thickness: selectedThickness ? selectedThickness.innerText : "default",
        addedText: textElement ? allTextData : [],
      };

      return imageDetails;
    }

    function shareImage() {
      return new Promise((resolve, reject) => {
        html2canvas(uploadBox, { backgroundColor: null }).then((canvas) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              alert("Error: Failed to generate image!");
              reject("Failed to generate image");
              return;
            }

            const formData = new FormData();
            const now = new Date();
            const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0];
            const fileName = `customized-image-${formattedDate}.png`;

            const imageData = getImageDetails();
            formData.append('image', blob, fileName);
            formData.append('details', JSON.stringify(imageData));
            const subject = `Acrylic Fridge Magnet (${imageData.size || "default"})`;
            formData.append('subject', JSON.stringify(subject));
            resolve(formData);
          });
        }).catch(error => reject(error));
      });
    }

    // Add event listeners
    uploadBox.addEventListener('click', handleUploadBoxClick);
    uploadButton.addEventListener('click', handleUploadButtonClick);
    fileInput.addEventListener("change", handleFileInputChange);
    zoomRange.addEventListener('input', handleZoomRangeInput);
    addTextBtn.addEventListener('click', handleAddTextClick);
    document.getElementById('afm-addTextModalBtn').addEventListener('click', handleAddTextModalClick);

    // Store cleanup functions
    const cleanupFunctions = [];

    // Expose functions to window
    window.getImageDetails = getImageDetails;
    window.shareImage = shareImage;

    // Return cleanup function
    return () => {
      // Remove event listeners with null checks
      if (uploadBox && uploadBox.removeEventListener) {
        uploadBox.removeEventListener('click', handleUploadBoxClick);
      }
      if (uploadButton && uploadButton.removeEventListener) {
        uploadButton.removeEventListener('click', handleUploadButtonClick);
      }
      if (fileInput && fileInput.removeEventListener) {
        fileInput.removeEventListener("change", handleFileInputChange);
      }
      if (zoomRange && zoomRange.removeEventListener) {
        zoomRange.removeEventListener('input', handleZoomRangeInput);
      }
      if (addTextBtn && addTextBtn.removeEventListener) {
        addTextBtn.removeEventListener('click', handleAddTextClick);
      }
      
      const addTextModalBtn = document.getElementById('afm-addTextModalBtn');
      if (addTextModalBtn && addTextModalBtn.removeEventListener) {
        addTextModalBtn.removeEventListener('click', handleAddTextModalClick);
      }
    
      // Remove size button handlers
      sizeButtonClickHandlers.forEach(({ btn, handler }) => {
        if (btn && btn.removeEventListener) {
          btn.removeEventListener('click', handler);
        }
      });
    
      // Remove thickness button handlers
      thicknessButtonClickHandlers.forEach(({ btn, handler }) => {
        if (btn && btn.removeEventListener) {
          btn.removeEventListener('click', handler);
        }
      });
    
      // Execute all cleanup functions
      if (cleanupFunctions && Array.isArray(cleanupFunctions)) {
        cleanupFunctions.forEach(cleanup => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        });
      }
    
      // Remove window functions safely
      if (window.getImageDetails) {
        try {
          delete window.getImageDetails;
        } catch (e) {
          console.warn("Could not delete window.getImageDetails", e);
        }
      }
      if (window.shareImage) {
        try {
          delete window.shareImage;
        } catch (e) {
          console.warn("Could not delete window.shareImage", e);
        }
      }
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

  // const handleShare = async () => {
  //   setLoading(true);
  //   const promise = new Promise(async (resolve, reject) => {
  //     try {
  //       const formData = await window.shareImage();
  //       console.log("FormData:", [...formData.entries()]);

  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         console.error("User is not authenticated");
  //         reject("User is not authenticated.");
  //         return;
  //       }

  //       const headers = {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       };

  //       const response = await axios.post(
  //         `${import.meta.env.VITE_BACKEND_URL}/send-email`,
  //         formData,
  //         { headers }
  //       );

  //       if (response.data?.success) {
  //         resolve("Product share successfully!");
  //         setLoading(false);
  //       } else {
  //         reject("Failed to share product.");
  //       }
  //     } catch (error) {
  //       console.error("Error sharing product:", error);
  //       reject("Failed to share product. Please try again.");
  //     }
  //   });

  //   toast.promise(promise, {
  //     loading: "Sharing product...",
  //     success: (message) => message,
  //     error: (errMsg) => errMsg,
  //   });

  // };

  const handleShare = async () => {
    const formData = await window.shareImage();
    console.log("FormData:", [...formData.entries()]);
    const subject = JSON.parse(formData.get("subject"));
    const details = JSON.parse(formData.get("details"));
    console.log(subject, details);

    const {
      name,
      type,
      size,
      thickness,
      price,
      addedText
    } = details;

    const formattedText = addedText.length
      ? addedText.map(({ text, color, style }, i) =>
        `▪️ *${i + 1}.* "${text}"\n  🎨 Color: ${color}\n  🖋 Font: ${style}`
      ).join('\n\n')
      : null;

    let message = `✨ *Check out this ${subject}* ✨\n\n`;

    if (name) message += `📌 *Product Name:* ${name}\n`;
    if (type) message += `📦 *Type:* ${type}\n`;
    if (shape) message += `🔵 *Shape:* ${shape}\n`;
    if (size) message += `📏 *Size:* ${size}\n`;
    if (thickness) message += `📐 *Thickness:* ${thickness}\n`;
    if (price) message += `💰 *Price:* ₹${price}\n`;

    if (formattedText) {
      message += `\n📋 *Added Text:*\n${formattedText}`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className={`afm-image-customization-page ${shape ? `afm-${shape}` : ''}`}>
      <div className="afm-page-container">
        <div className="afm-left">
          <div className="afm-upload-box" id="uploadBox">
            <img id="afm-previewImage" alt="Click to upload" style={{ display: "none" }} />
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg, image/png, image/webp, image/jpg"
              style={{ display: "none" }}
            />
            <p id="afm-placeholderText">
              <FaCameraRetro />
            </p>
          </div>
        </div>
        <div className="afm-right">
          <input
            type="range"
            id="afm-zoomRange"
            min="0.5"
            max="3"
            step="0.1"
            defaultValue="1"
            style={{
              width: "200px",
              accentColor: "#000787",
            }}
          />
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

          <label htmlFor="fontStyleSelect">Select Font Style:</label>
          <select
            className="border border-black"
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
