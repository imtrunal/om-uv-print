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
import domtoimage from 'dom-to-image-more';
import TransformableImageBox from "../TransformableImageBox";


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
        const imageContainer = document.getElementById('uploadBox');
        if (!imageContainer) {
          alert("Error: Image container not found!");
          return reject("Image container not found");
        }

        await new Promise(r => setTimeout(r, 300));

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
            background: 'transparent',
          },
        });

        document.body.removeChild(clone);

        if (!blob) {
          alert("Error: Failed to generate image!");
          return reject("Failed to generate image");
        }

        const formData = new FormData();
        const now = new Date();
        const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-MM-SS
        const fileName = `customized-image-${formattedDate}.png`;

        const imageData = getImageDetails();
        formData.append('image', blob, fileName);
        formData.append('details', JSON.stringify(imageData));
        const subject = `Acrylic Fridge Magnet (${imageData.size || "default"})`;
        formData.append('subject', JSON.stringify(subject));
        resolve(formData);
      } catch (error) {
        console.error("Image generation failed:", error);
        reject(error);
      }
    });
  }

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
    // const zoomRange = document.getElementById('afm-zoomRange');
    const BASE_URL = window.BASE_URL;
    const transformWrapper = document.getElementById("afm-transformWrapper");
    const preImage = document.querySelector(".afm-img-pre");

    const allTextData = [];
    let isDragging = false;


    let scale = 1;
    let isImageUploaded = false;
    let currentX = 0, currentY = 0;
    let isResizing = false;
    let isRotating = false;
    let offsetX = 0, offsetY = 0;
    let startX, startY;
    let initialAngle = 0;
    let initialDistance = 0;
    let initialTouchDistance = 0;
    let rotation = 0;
    let initialScale = 1;
    let file;
    let initialTouchScale = 1;


    // NEW: Variables for image dragging
    let isDraggingImage = false;
    let initialX, initialY;
    let xOffset = 0, yOffset = 0;
    let lastTouchTime = 0;

    const handles = document.querySelector(".afm-handles");





    // Touch events for dragging
    transformWrapper.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      handles.style.display = "block";
      if (e.touches.length !== 1 || e.target.classList.contains('ap-handle')) return;
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX - offsetX;
      startY = touch.clientY - offsetY;
      transformWrapper.style.cursor = 'grabbing';
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        offsetX = touch.clientX - startX;
        offsetY = touch.clientY - startY;
        updateTransform();
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        transformWrapper.style.cursor = 'grab';
      }
    });

    // Pinch to zoom
    transformWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialTouchScale = scale;
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && !isDragging && !isResizing && !isRotating) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (initialTouchDistance > 0) {
          scale = initialTouchScale * (currentDistance / initialTouchDistance);
          scale = Math.max(0.1, Math.min(scale, 5)); // Limit scale between 0.1 and 5
          updateTransform();
        }
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      initialTouchDistance = 0;
    });

    previewImage.addEventListener('click', (e) => {
      e.stopPropagation();
      handles.style.display = "block";
      updateHandles();
    });

    document.addEventListener('click', (e) => {
      if (!previewImage.contains(e.target)) {
        handles.style.display = "none";
      }
    });

    function updateHandles() {
      const wrapperRect = transformWrapper.getBoundingClientRect();
      const editorRect = uploadBox.getBoundingClientRect();

      const top = wrapperRect.top - editorRect.top;
      const left = wrapperRect.left - editorRect.left;
      const width = wrapperRect.width;
      const height = wrapperRect.height;

      const tlX = left;
      const tlY = top;
      const trX = left + width;
      const trY = top;
      const brX = left + width;
      const brY = top + height;
      const blX = left;
      const blY = top + height;

      // Position handles
      document.querySelector('.afm-handle.tl').style.left = `${tlX}px`;
      document.querySelector('.afm-handle.tl').style.top = `${tlY}px`;
      document.querySelector('.afm-handle.tr').style.left = `${trX}px`;
      document.querySelector('.afm-handle.tr').style.top = `${trY}px`;
      document.querySelector('.afm-handle.br').style.left = `${brX}px`;
      document.querySelector('.afm-handle.br').style.top = `${brY}px`;
      document.querySelector('.afm-handle.bl').style.left = `${blX}px`;
      document.querySelector('.afm-handle.bl').style.top = `${blY}px`;

      // Update bounding lines
      document.getElementById('afm-line-tl-tr').setAttribute('x1', tlX);
      document.getElementById('afm-line-tl-tr').setAttribute('y1', tlY);
      document.getElementById('afm-line-tl-tr').setAttribute('x2', trX);
      document.getElementById('afm-line-tl-tr').setAttribute('y2', trY);
      document.getElementById('afm-line-tr-br').setAttribute('x1', trX);
      document.getElementById('afm-line-tr-br').setAttribute('y1', trY);
      document.getElementById('afm-line-tr-br').setAttribute('x2', brX);
      document.getElementById('afm-line-tr-br').setAttribute('y2', brY);
      document.getElementById('afm-line-br-bl').setAttribute('x1', brX);
      document.getElementById('afm-line-br-bl').setAttribute('y1', brY);
      document.getElementById('afm-line-br-bl').setAttribute('x2', blX);
      document.getElementById('afm-line-br-bl').setAttribute('y2', blY);
      document.getElementById('afm-line-bl-tl').setAttribute('x1', blX);
      document.getElementById('afm-line-bl-tl').setAttribute('y1', blY);
      document.getElementById('afm-line-bl-tl').setAttribute('x2', tlX);
      document.getElementById('afm-line-bl-tl').setAttribute('y2', tlY);

      // Rotate handle
      document.querySelector('.afm-handle.rotate').style.left = `${(tlX + trX) / 2}px`;
      document.querySelector('.afm-handle.rotate').style.top = `${tlY - 40}px`;
    }

    function updateTransform() {
      transformWrapper.style.transform = `
        translate(${offsetX}px, ${offsetY}px)
        scale(${scale})
        rotate(${rotation}deg)
      `;
      updateHandles();
    }

    // Mouse event handlers
    const handleMouseDown = (e) => {

      if (e.button !== 0 || e.target.classList.contains('ap-handle')) return;
      isDragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
      transformWrapper.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        updateTransform();
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        transformWrapper.style.cursor = 'grab';
      }
    };

    function onHandleMove(e) {
      if (isResizing) {
        const editorRect = uploadBox.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const currentDistance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) +
          Math.pow(e.clientY - centerY, 2)
        );

        const scaleFactor = currentDistance / initialDistance;
        scale = Math.max(0.1, initialScale * scaleFactor);
      }

      if (isRotating) {
        const editorRect = uploadBox.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
      }

      updateTransform();
    }

    function onTouchHandleMove(e) {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];

      if (isResizing) {
        const editorRect = uploadBox.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const currentDistance = Math.sqrt(
          Math.pow(touch.clientX - centerX, 2) +
          Math.pow(touch.clientY - centerY, 2)
        );

        const scaleFactor = currentDistance / initialDistance;
        scale = Math.max(0.1, initialScale * scaleFactor);
      }

      if (isRotating) {
        const editorRect = uploadBox.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
      }

      updateTransform();
      e.preventDefault();
    }

    function onHandleUp() {
      isResizing = false;
      isRotating = false;
      document.removeEventListener('mousemove', onHandleMove);
      document.removeEventListener('touchmove', onTouchHandleMove);
      document.removeEventListener('mouseup', onHandleUp);
      document.removeEventListener('touchend', onHandleUp);
    }

    // Handle resize and rotate
    const initResizeRotateHandlers = () => {
      console.log("696");
      document.querySelectorAll('.afm-handle').forEach(handle => {
        handle.addEventListener('mousedown', e => {
          console.log("699");

          e.preventDefault();
          e.stopPropagation();

          const editorRect = uploadBox.getBoundingClientRect();
          const wrapperRect = transformWrapper.getBoundingClientRect();
          const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
          const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

          if (handle.classList.contains('rotate')) {
            isRotating = true;
            initialAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI) - rotation;
          } else {
            isResizing = true;
            initialScale = scale;
            const handleX = wrapperRect.left +
              (handle.classList.contains('tl') || handle.classList.contains('bl') ? 0 : wrapperRect.width);
            const handleY = wrapperRect.top +
              (handle.classList.contains('tl') || handle.classList.contains('tr') ? 0 : wrapperRect.height);
            initialDistance = Math.sqrt(
              Math.pow(handleX - centerX, 2) +
              Math.pow(handleY - centerY, 2)
            );
          }

          startX = e.clientX;
          startY = e.clientY;
          document.addEventListener('mousemove', onHandleMove);
          document.addEventListener('mouseup', onHandleUp);
        });

        handle.addEventListener('touchstart', e => {
          if (e.touches.length !== 1) return;
          e.preventDefault();
          e.stopPropagation();

          const editorRect = uploadBox.getBoundingClientRect();
          const wrapperRect = transformWrapper.getBoundingClientRect();
          const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
          const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

          const touch = e.touches[0];

          if (handle.classList.contains('rotate')) {
            isRotating = true;
            initialAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI) - rotation;
          } else {
            isResizing = true;
            initialScale = scale;
            const handleX = wrapperRect.left +
              (handle.classList.contains('tl') || handle.classList.contains('bl') ? 0 : wrapperRect.width);
            const handleY = wrapperRect.top +
              (handle.classList.contains('tl') || handle.classList.contains('tr') ? 0 : wrapperRect.height);
            initialDistance = Math.sqrt(
              Math.pow(handleX - centerX, 2) +
              Math.pow(handleY - centerY, 2)
            );
          }

          startX = touch.clientX;
          startY = touch.clientY;
          document.addEventListener('touchmove', onTouchHandleMove, { passive: false });
          document.addEventListener('touchend', onHandleUp);
        });
      });
    };

    const handleHandleMove = (e) => {
      if (isResizing) {
        const rect = transformWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentDistance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) +
          Math.pow(e.clientY - centerY, 2)
        );
        scale = initialDistance * (currentDistance / initialDistance);
        scale = Math.max(0.5, Math.min(scale, 3));
        // zoomRange.value = scale;
        updateTransform();
      }

      if (isRotating) {
        const rect = transformWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
        updateTransform();
      }
    };

    const handleHandleEnd = () => {
      isResizing = false;
      isRotating = false;
      document.removeEventListener('mousemove', handleHandleMove);
      document.removeEventListener('mouseup', handleHandleEnd);
    };

    // File input handler
    const handleFileInput = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
          placeholderText.style.display = "none";
          addTextBtn.style.display = 'block';
          shareBtn.style.display = 'block';
          offsetX = 0;
          offsetY = 0;
          rotation = 0;
          scale = 1;
          updateTransform();
        };
        reader.readAsDataURL(file);
      }
    };

    // Add event listeners
    previewImage.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // transformWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    // document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // zoomRange.addEventListener('input', handleZoom);
    fileInput.addEventListener('change', handleFileInput);
    initResizeRotateHandlers();

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
          addTextBtn.style.display = 'block';
          shareBtn.style.display = 'block';

          currentX = 0;
          currentY = 0;
          xOffset = 0;
          yOffset = 0;
          updateImagePosition();
        };
        reader.readAsDataURL(file);
      }
    };

    // NEW: Image drag functions
    const enableImageDrag = (e) => {
      // Only enable image drag if not clicking on a text element
      if (!e.target.closest('.afm-text-box')) {
        isDraggingImage = true;
        if (e.type === 'dblclick') {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
        }
        uploadBox.style.cursor = 'grabbing';
      }
    };

    const disableImageDrag = () => {
      isDraggingImage = false;
      uploadBox.style.cursor = 'default';
    };

    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const now = new Date().getTime();
        const previousTouch = uploadBox.dataset.lastTouchTime || 0;

        if (now - previousTouch < 300) {
          if (!isDragging) {
            e.preventDefault();
            isDraggingImage = true;
            const touch = e.touches[0];
            initialX = touch.clientX - xOffset;
            initialY = touch.clientY - yOffset;
            uploadBox.style.cursor = 'grabbing';
          }
        }
        uploadBox.dataset.lastTouchTime = now;
      }

    }

    const handleDrag = (e) => {
      if (isDraggingImage) {
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        currentX = clientX - initialX;
        currentY = clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        updateImagePosition();
      }
    };

    const handleTouchMove = (e) => {
      if (isDraggingImage && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        currentX = touch.clientX - initialX;
        currentY = touch.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        updateImagePosition();
      }
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
        textBox.style.zIndex = '1000'; // Ensure text is above image        
        preImage.appendChild(textBox);

        makeTextDraggable(textBox, { resize: 'afm-resize-handle', rotate: 'afm-rotate-handle' });
        makeTextResizable(textBox);
        makeTextRotatable(textBox);
        allTextData.push({
          text: text,
          color: textColor,
          style: fontStyle,
        });
      }

      closeTextModal();
    };

    function makeTextDraggable(element, handle) {
      let isDragging = false;
      let offsetX, offsetY;
      let startX, startY;

      // Mouse down event
      element.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Only start dragging if not clicking on a resize or rotate handle
        if (!e.target.classList.contains('afm-resize-handle') &&
          !e.target.classList.contains('afm-rotate-handle')) {
          isDragging = true;

          // Add highlight to selected text
          document.querySelectorAll('.afm-text-box').forEach(box => {
            box.style.border = 'none';
            const resizeHandle = box.querySelector('.afm-resize-handle');
            const rotateHandle = box.querySelector('.afm-rotate-handle');
            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
          });

          // Then style the current element
          element.style.border = '2px dashed #248EE6';
          element.style.zIndex = '1000'; // Bring to front

          // Show handles
          const resizeHandle = element.querySelector(`.${handle.resize}`);
          const rotateHandle = element.querySelector(`.${handle.rotate}`);

          if (resizeHandle) resizeHandle.style.display = 'block';
          if (rotateHandle) rotateHandle.style.display = 'block';

          // Get current position
          const rect = element.getBoundingClientRect();
          const containerRect = uploadBox.getBoundingClientRect();

          // Calculate position relative to container
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;

          // Store initial position relative to container
          startX = rect.left - containerRect.left;
          startY = rect.top - containerRect.top;
        }
      });

      // Touch start event
      element.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const target = document.elementFromPoint(touch.clientX, touch.clientY);

          // Only start dragging if not touching a resize or rotate handle
          if (!target.classList.contains('afm-resize-handle') &&
            !target.classList.contains('afm-rotate-handle')) {
            isDragging = true;

            // Get current position
            const rect = element.getBoundingClientRect();
            const containerRect = uploadBox.getBoundingClientRect();

            // Calculate position relative to container
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;

            // Store initial position relative to container
            startX = rect.left - containerRect.left;
            startY = rect.top - containerRect.top;

            element.style.border = '2px dashed #248EE6';

            // Show handles
            const resizeHandle = element.querySelector(`.${handle.resize}`);
            const rotateHandle = element.querySelector(`.${handle.rotate}`);
            if (resizeHandle) resizeHandle.style.display = 'block';
            if (rotateHandle) rotateHandle.style.display = 'block';
          }
        }
      }, { passive: false });

      // Mouse move event
      const handleMove = function (e) {
        if (isDragging) {
          e.preventDefault();

          // Calculate new position relative to container
          const containerRect = uploadBox.getBoundingClientRect();
          let clientX, clientY;

          if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
          } else if (e.type === 'touchmove' && e.touches.length === 1) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          }

          // Calculate new position ensuring it stays within container
          const maxX = containerRect.width - element.offsetWidth;
          const maxY = containerRect.height - element.offsetHeight;

          let newX = clientX - containerRect.left - offsetX;
          let newY = clientY - containerRect.top - offsetY;

          // Constrain to container bounds
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));

          element.style.left = `${newX}px`;
          element.style.top = `${newY}px`;

          // Remove any translate transform (keep rotation if any)
          const transform = element.style.transform;
          const rotationMatch = transform.match(/rotate\(([^)]+)\)/);
          const rotationValue = rotationMatch ? rotationMatch[0] : '';
          element.style.transform = rotationValue;
        }
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove, { passive: false });

      // End dragging
      const stopDrag = function () {
        if (isDragging) {
          isDragging = false;
          element.style.cursor = 'move';
        }
      };

      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);

      // Click outside to deselect
      document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
          element.style.border = 'none';
          const resizeHandle = element.querySelector(`.${handle.resize}`);
          const rotateHandle = element.querySelector(`.${handle.rotate}`);
          if (resizeHandle) resizeHandle.style.display = 'none';
          if (rotateHandle) rotateHandle.style.display = 'none';
        }
      });

      // Touch outside to deselect
      document.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          if (!element.contains(target)) {
            element.style.border = 'none';
            const resizeHandle = element.querySelector(`.${handle.resize}`);
            const rotateHandle = element.querySelector(`.${handle.rotate}`);
            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
          }
        }
      }, { passive: false });
    }

    function makeTextResizable(element) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'afm-resize-handle';
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.right = '-11.3px';
      resizeHandle.style.bottom = '-6.5px';
      resizeHandle.style.fontSize = '24px';
      resizeHandle.style.cursor = 'nwse-resize';
      resizeHandle.innerText = '+';
      resizeHandle.style.display = 'none';
      resizeHandle.style.zIndex = '1001'; // Above the text element

      element.appendChild(resizeHandle);

      let isResizing = false;
      let startSize, startX, startY;

      resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        isResizing = true;
        startSize = parseFloat(window.getComputedStyle(element).fontSize);
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      });

      resizeHandle.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (e.touches.length === 1) {
          e.preventDefault();
          isResizing = true;
          startSize = parseFloat(window.getComputedStyle(element).fontSize);
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;

          document.addEventListener('touchmove', handleTouchResize, { passive: false });
          document.addEventListener('touchend', stopResize);
        }
      }, { passive: false });

      function handleResize(e) {
        if (isResizing) {
          e.preventDefault();
          const scaleFactor = 0.5;
          const deltaX = e.clientX - startX;
          const newSize = Math.max(12, startSize + deltaX * scaleFactor);
          element.style.fontSize = `${newSize}px`;
        }
      }

      function handleTouchResize(e) {
        if (isResizing && e.touches.length === 1) {
          e.preventDefault();
          const touch = e.touches[0];
          const deltaX = touch.clientX - startX;
          const newSize = Math.max(12, startSize + deltaX * 0.5);
          element.style.fontSize = `${newSize}px`;
        }
      }

      function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('touchmove', handleTouchResize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchend', stopResize);
      }
    }

    function makeTextRotatable(element) {
      const rotateHandle = document.createElement('div');
      rotateHandle.className = 'afm-rotate-handle';
      rotateHandle.style.position = 'absolute';
      rotateHandle.style.top = '-30px';
      rotateHandle.style.left = '50%';
      rotateHandle.style.transform = 'translateX(-50%)';
      rotateHandle.style.cursor = 'pointer';
      rotateHandle.style.fontSize = '24px';
      rotateHandle.innerHTML = '&#8635;';
      rotateHandle.style.display = 'none';
      rotateHandle.style.zIndex = '1001'; // Above the text element

      element.appendChild(rotateHandle);

      let isRotating = false;
      let startAngle, centerX, centerY;

      rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        isRotating = true;
        const rect = element.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

        // Get current rotation
        const transform = element.style.transform;
        let currentRotation = 0;
        const match = transform.match(/rotate\((\d+)deg\)/);
        if (match) {
          currentRotation = parseInt(match[1]);
        }
        startAngle -= currentRotation;

        document.addEventListener('mousemove', handleRotate);
        document.addEventListener('mouseup', stopRotate);
      });

      rotateHandle.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (e.touches.length === 1) {
          e.preventDefault();
          isRotating = true;
          const rect = element.getBoundingClientRect();
          const touch = e.touches[0];
          centerX = rect.left + rect.width / 2;
          centerY = rect.top + rect.height / 2;
          startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);

          // Get current rotation
          const transform = element.style.transform;
          let currentRotation = 0;
          const match = transform.match(/rotate\((\d+)deg\)/);
          if (match) {
            currentRotation = parseInt(match[1]);
          }
          startAngle -= currentRotation;

          document.addEventListener('touchmove', handleTouchRotate, { passive: false });
          document.addEventListener('touchend', stopRotate);
        }
      }, { passive: false });

      function handleRotate(e) {
        if (isRotating) {
          e.preventDefault();
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
          const rotation = angle - startAngle;
          // Preserve any existing transform properties (like translate)
          const transform = element.style.transform.replace(/rotate\([^)]*\)/, '');
          element.style.transform = `${transform} rotate(${rotation}deg)`;
        }
      }

      function handleTouchRotate(e) {
        if (isRotating && e.touches.length === 1) {
          e.preventDefault();
          const touch = e.touches[0];
          const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
          const rotation = angle - startAngle;
          const transform = element.style.transform.replace(/rotate\([^)]*\)/, '');
          element.style.transform = `${transform} rotate(${rotation}deg)`;
        }
      }

      function stopRotate() {
        isRotating = false;
        document.removeEventListener('mousemove', handleRotate);
        document.removeEventListener('touchmove', handleTouchRotate);
        document.removeEventListener('mouseup', stopRotate);
        document.removeEventListener('touchend', stopRotate);
      }
    }

    function updateImagePosition() {
      previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;
    }

    function closeTextModal() {
      document.getElementById('afm-textModal').style.display = 'none';
    }

    // Size button event handlers
    const sizeButtonClickHandlers = [];
    allSizeBtn.forEach(btn => {
      const handler = function (e) {
        e.preventDefault();
        allSizeBtn.forEach(button => button.classList.remove('afm-active'));
        this.classList.add('afm-active');
      };
      btn.addEventListener('click', handler);
      btn.addEventListener('touchend', handler);
      sizeButtonClickHandlers.push({ btn, handler });
    });

    // Thickness button event handlers
    const thicknessButtonClickHandlers = [];
    allThicknessBtn.forEach(btn => {
      const handler = function (e) {
        e.preventDefault();
        allThicknessBtn.forEach(button => button.classList.remove('afm-active'));
        this.classList.add('afm-active');
      };
      btn.addEventListener('click', handler);
      btn.addEventListener('touchend', handler);
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

    // Add event listeners
    uploadBox.addEventListener('click', handleUploadBoxClick);
    uploadButton.addEventListener('click', handleUploadButtonClick);
    fileInput.addEventListener("change", handleFileInputChange);
    // zoomRange.addEventListener('input', handleZoomRangeInput);
    addTextBtn.addEventListener('click', handleAddTextClick);
    addTextBtn.addEventListener('touchend', handleAddTextClick);
    document.getElementById('afm-addTextModalBtn').addEventListener('click', handleAddTextModalClick);
    document.getElementById('afm-addTextModalBtn').addEventListener('touchend', handleAddTextModalClick);

    // NEW: Add drag event listeners
    // uploadBox.addEventListener('dblclick', enableImageDrag);
    // uploadBox.addEventListener('touchstart', handleTouchStart, { passive: false });
    // document.addEventListener('mousemove', handleDrag);
    // document.addEventListener('mouseup', disableImageDrag);
    // document.addEventListener('touchmove', handleTouchMove, { passive: false });
    // document.addEventListener('touchend', disableImageDrag);

    // Store cleanup functions
    const cleanupFunctions = [];

    // Expose functions to window
    window.getImageDetails = getImageDetails;

    // Return cleanup function
    return () => {


      previewImage.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // zoomRange.removeEventListener('input', handleZoom);
      fileInput.removeEventListener('change', handleFileInput);

      document.querySelectorAll('.ap-handle').forEach(handle => {
        handle.removeEventListener('mousedown', handleHandleMove);
      });
      document.removeEventListener('mousemove', handleHandleMove);
      document.removeEventListener('mouseup', handleHandleEnd);



      // Remove event listeners with null checks
      if (uploadBox && uploadBox.removeEventListener) {
        uploadBox.removeEventListener('click', handleUploadBoxClick);
        uploadBox.removeEventListener('dblclick', enableImageDrag);
        uploadBox.removeEventListener('touchstart', handleTouchStart);
      }
      if (uploadButton && uploadButton.removeEventListener) {
        uploadButton.removeEventListener('click', handleUploadButtonClick);
        uploadButton.removeEventListener('touchend', handleUploadButtonClick);
      }
      if (fileInput && fileInput.removeEventListener) {
        fileInput.removeEventListener("change", handleFileInputChange);
      }
      // if (zoomRange && zoomRange.removeEventListener) {
      //   zoomRange.removeEventListener('input', handleZoomRangeInput);
      // }
      if (addTextBtn && addTextBtn.removeEventListener) {
        addTextBtn.removeEventListener('click', handleAddTextClick);
        addTextBtn.removeEventListener('touchend', handleAddTextClick);
      }

      const addTextModalBtn = document.getElementById('afm-addTextModalBtn');
      if (addTextModalBtn && addTextModalBtn.removeEventListener) {
        addTextModalBtn.removeEventListener('click', handleAddTextModalClick);
        addTextModalBtn.removeEventListener('touchend', handleAddTextModalClick);
      }

      // Remove document event listeners
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', disableImageDrag);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', disableImageDrag);

      // Remove size button handlers
      sizeButtonClickHandlers.forEach(({ btn, handler }) => {
        if (btn && btn.removeEventListener) {
          btn.removeEventListener('click', handler);
          btn.removeEventListener('touchend', handler);
        }
      });

      // Remove thickness button handlers
      thicknessButtonClickHandlers.forEach(({ btn, handler }) => {
        if (btn && btn.removeEventListener) {
          btn.removeEventListener('click', handler);
          btn.removeEventListener('touchend', handler);
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

    let message = `✨ *Check New Order for ${subject}* ✨\n\n`;

    if (name) message += `📌 *Product Name:* ${name}\n`;
    if (type) message += `📦 *Type:* ${type}\n`;
    if (shape) message += `🔵 *Shape:* ${shape}\n`;
    if (size) message += `📏 *Size:* ${size}\n`;
    if (thickness) message += `📐 *Thickness:* ${thickness}\n`;
    // if (price) message += `💰 *Price:* ₹${price}\n`;
    if (image) message += `\n📸 *Image:* ${image}\n`;


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

            <TransformableImageBox alt="Click to upload" imageId="afm-previewImage" prefix="afm-" shape={shape ? `afm-${shape}` : ''} />

            {/* <div className={`afm-img-pre ${shape ? `afm-${shape}` : ''}`}>
              <div className="afm-htransform-wrapper" id='afm-transformWrapper'>
                <img id="afm-previewImage" alt="Click to upload" />
              </div>
            </div>

            <div className="afm-handles">
              <svg className="afm-handle-lines" style={{ overflow: "visible" }}>
                <line id="afm-line-tl-tr" stroke="#00caff" strokeWidth="1" />
                <line id="afm-line-tr-br" stroke="#00caff" strokeWidth="1" />
                <line id="afm-line-br-bl" stroke="#00caff" strokeWidth="1" />
                <line id="afm-line-bl-tl" stroke="#00caff" strokeWidth="1" />
              </svg>
              <div className="afm-handle tl"></div>
              <div className="afm-handle tr"></div>
              <div className="afm-handle bl"></div>
              <div className="afm-handle br"></div>
              <div className="afm-handle rotate"></div>
            </div> */}
            {/* <img src="/assets/10 FRAM Copy.jpg" id="afm-previewImage" alt="Click to upload" style={{ display: "none" }} /> */}
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
          {/* <input
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
          /> */}
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
