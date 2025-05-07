import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/CollagePhoto.css";
import { FaDownload, FaImage, FaTrash } from 'react-icons/fa6'
import { VscDebugRestart, VscTextSize } from 'react-icons/vsc'
import { HiPencilSquare } from "react-icons/hi2";
import { FaShareAlt } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../../utils/ShareService";
import { toast } from "sonner";
import axios from "axios";
import useCartStore from "../../manage/CartStore";
import { ImSpinner2 } from "react-icons/im";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image-more';
import TransformableImageBox from "../TransformableImageBox";

const collageLayouts = {

    "2-pics": {
        style: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-small-img" },
            { id: 2, type: "acol-small-img" },
        ],
    },
    "5-pics": {
        style: { gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-big-img" },
            { id: 2, type: "acol-small-img" },
            { id: 3, type: "acol-small-img" },
            { id: 4, type: "acol-small-img" },
            { id: 5, type: "acol-small-img" },
        ],
    },
    "8-pics": {
        style: { gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-small-img" },
            { id: 2, type: "acol-small-img" },
            { id: 3, type: "acol-small-img" },
            { id: 4, type: "acol-small-img" },
            { id: 5, type: "acol-small-img" },
            { id: 6, type: "acol-small-img" },
            { id: 7, type: "acol-small-img" },
            { id: 8, type: "acol-small-img" },
        ],
    },
};

const CollageAcrylicPhoto = () => {
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const { addCart } = useCartStore();

    const { collageType } = useParams();
    console.log(collageType);
    const layout = collageLayouts[collageType];

    // useEffect(() => {
    //     const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

    //     if (newPage) {
    //         sessionStorage.setItem("newPage", JSON.stringify(false));
    //         window.location.reload();
    //     }
    //     const scriptHtml2Canvas = document.createElement("script");
    //     scriptHtml2Canvas.src =
    //         "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    //     scriptHtml2Canvas.defer = true;
    //     document.body.appendChild(scriptHtml2Canvas);

    //     // Load main.js after html2canvas is loaded
    //     scriptHtml2Canvas.onload = () => {
    //         const scriptMain = document.createElement("script");
    //         scriptMain.src = "/js/CollagePhoto.js";
    //         scriptMain.defer = true;
    //         scriptMain.type = "module";
    //         document.body.appendChild(scriptMain);

    //         return () => {
    //             document.body.removeChild(scriptMain);
    //             document.body.removeChild(scriptHtml2Canvas);
    //         };
    //     };
    // }, [collageType]);


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
                const imageContainer = document.querySelector('.acol-collage-frame');
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
                const subject = `Collage Acrylic Photo (${imageData.size || "default"})`;
                formData.append('subject', JSON.stringify(subject));
                resolve(formData);
            } catch (error) {
                console.error("Image generation failed:", error);
                reject(error);
            }
        });
    }


    useEffect(() => {
        // Variables to track state for each image
        let activeImage = null;
        let scale = 1;
        let rotation = 0;
        let offsetX = 0, offsetY = 0;
        let isDragging = false;
        let isResizing = false;
        let isRotating = false;
        let startX, startY;
        let initialAngle = 0;
        let initialScale = 1;
        let initialDistance = 0;

        // Get all image elements and handles
        const imageElements = document.querySelectorAll('.acol-previewImage');
        const transformWrappers = document.querySelectorAll('.acol-transform-wrapper');
        const handles = document.querySelectorAll('.acol-handles');
        const imageContainer = document.querySelector('.acol-collage-frame');
        const textInput = document.getElementById('acol-textInput');
        const addTextBtn = document.getElementById('acol-addTextBtn');
        const deleteTextBtn = document.getElementById('acol-deleteTextBtn');
        const resetBtn = document.getElementById('acol-reset');
        const allSizeBtn = document.querySelectorAll('.acol-size-btn');
        const allThicknessBtn = document.querySelectorAll('.acol-thickness-btn');
        const cartBtn = document.getElementById('cartBtn');
        const iminus = document.getElementById('acol-iminus');
        const iplus = document.getElementById('acol-iplus');
        const fontFamilyOptions = document.getElementById('acol-fontStyleSelect');
        const shareBtn = document.getElementById('acol-shareBtn');
        const textModal = document.querySelector('.acol-textModal');
        const zoomRange = document.getElementById('acol-zoomRange');
        const allTextData = [];
        let uploadedImagesCount = 0;
        let totalImages = document.querySelectorAll(".acol-small-img, .acol-big-img").length;
        let activeTextBox = null;

        // Function to update transform for active image
        function updateTransform() {
            if (activeImage) {
                const transformWrapper = activeImage.closest('.acol-transform-wrapper');
                transformWrapper.style.transform = `
                    translate(${offsetX}px, ${offsetY}px)
                    scale(${scale})
                    rotate(${rotation}deg)
                `;
                updateHandles(activeImage);
            }
        }

        // Function to update handles position for active image
        // function updateHandles(imageElement) {
        //     if (!imageElement || !activeImage) return;

        //     const wrapperRect = imageElement.closest('.acol-transform-wrapper').getBoundingClientRect();
        //     const editorRect = imageContainer.getBoundingClientRect();
        //     const originalWidth = imageElement.offsetWidth;
        //     const originalHeight = imageElement.offsetHeight;

        //     // Calculate center point
        //     const centerX = wrapperRect.left + wrapperRect.width / 2 - editorRect.left;
        //     const centerY = wrapperRect.top + wrapperRect.height / 2 - editorRect.top;

        //     // Calculate half dimensions (scaled)
        //     const halfWidth = (originalWidth * scale) / 2;
        //     const halfHeight = (originalHeight * scale) / 2;

        //     // Apply rotation to corner points
        //     const angleRad = rotation * Math.PI / 180;
        //     const cos = Math.cos(angleRad);
        //     const sin = Math.sin(angleRad);

        //     // Calculate exact edge positions
        //     const tlX = centerX + (-halfWidth * cos - (-halfHeight) * sin);
        //     const tlY = centerY + (-halfWidth * sin + (-halfHeight) * cos);

        //     const trX = centerX + (halfWidth * cos - (-halfHeight) * sin);
        //     const trY = centerY + (halfWidth * sin + (-halfHeight) * cos);

        //     const brX = centerX + (halfWidth * cos - halfHeight * sin);
        //     const brY = centerY + (halfWidth * sin + halfHeight * cos);

        //     const blX = centerX + (-halfWidth * cos - halfHeight * sin);
        //     const blY = centerY + (-halfWidth * sin + halfHeight * cos);

        //     // Get handles container for this image
        //     const imageHandles = imageElement.closest('.acol-img-pre').nextElementSibling;
        //     if (!imageHandles) return;

        //     // Position handles
        //     imageHandles.querySelector(`.acol-handle.tl`).style.left = `${tlX}px`;
        //     imageHandles.querySelector(`.acol-handle.tl`).style.top = `${tlY}px`;
        //     imageHandles.querySelector(`.acol-handle.tr`).style.left = `${trX}px`;
        //     imageHandles.querySelector(`.acol-handle.tr`).style.top = `${trY}px`;
        //     imageHandles.querySelector(`.acol-handle.br`).style.left = `${brX}px`;
        //     imageHandles.querySelector(`.acol-handle.br`).style.top = `${brY}px`;
        //     imageHandles.querySelector(`.acol-handle.bl`).style.left = `${blX}px`;
        //     imageHandles.querySelector(`.acol-handle.bl`).style.top = `${blY}px`;

        //     // Update bounding lines
        //     imageHandles.querySelector(`#acol-line-tl-tr`).setAttribute('x1', tlX);
        //     imageHandles.querySelector(`#acol-line-tl-tr`).setAttribute('y1', tlY);
        //     imageHandles.querySelector(`#acol-line-tl-tr`).setAttribute('x2', trX);
        //     imageHandles.querySelector(`#acol-line-tl-tr`).setAttribute('y2', trY);

        //     imageHandles.querySelector(`#acol-line-tr-br`).setAttribute('x1', trX);
        //     imageHandles.querySelector(`#acol-line-tr-br`).setAttribute('y1', trY);
        //     imageHandles.querySelector(`#acol-line-tr-br`).setAttribute('x2', brX);
        //     imageHandles.querySelector(`#acol-line-tr-br`).setAttribute('y2', brY);

        //     imageHandles.querySelector(`#acol-line-br-bl`).setAttribute('x1', brX);
        //     imageHandles.querySelector(`#acol-line-br-bl`).setAttribute('y1', brY);
        //     imageHandles.querySelector(`#acol-line-br-bl`).setAttribute('x2', blX);
        //     imageHandles.querySelector(`#acol-line-br-bl`).setAttribute('y2', blY);

        //     imageHandles.querySelector(`#acol-line-bl-tl`).setAttribute('x1', blX);
        //     imageHandles.querySelector(`#acol-line-bl-tl`).setAttribute('y1', blY);
        //     imageHandles.querySelector(`#acol-line-bl-tl`).setAttribute('x2', tlX);
        //     imageHandles.querySelector(`#acol-line-bl-tl`).setAttribute('y2', tlY);

        //     // Position rotate handle
        //     const rotateHandleDistance = 20 * scale;
        //     const rotateX = centerX + (0 * cos - (-halfHeight - rotateHandleDistance) * sin);
        //     const rotateY = centerY + (0 * sin + (-halfHeight - rotateHandleDistance) * cos);

        //     imageHandles.querySelector(`.acol-handle.rotate`).style.left = `${rotateX}px`;
        //     imageHandles.querySelector(`.acol-handle.rotate`).style.top = `${rotateY}px`;
        // }

        function updateHandles(imageElement) {
            if (!imageElement || !activeImage) return;

            const transformWrapper = imageElement.closest('.acol-transform-wrapper');
            const container = transformWrapper.parentElement;
            const containerRect = container.getBoundingClientRect();
            const wrapperRect = transformWrapper.getBoundingClientRect();

            // Calculate position relative to container
            const relativeLeft = wrapperRect.left - containerRect.left;
            const relativeTop = wrapperRect.top - containerRect.top;

            // Get the handles container for this image
            const imageHandles = container.nextElementSibling;
            if (!imageHandles) return;

            // Set handles container to match the image container size
            imageHandles.style.width = `${containerRect.width}px`;
            imageHandles.style.height = `${containerRect.height}px`;
            imageHandles.style.position = 'absolute';

            // Calculate center point
            const centerX = relativeLeft + wrapperRect.width / 2;
            const centerY = relativeTop + wrapperRect.height / 2;

            // Calculate half dimensions
            const halfWidth = wrapperRect.width / 2;
            const halfHeight = wrapperRect.height / 2;

            // Apply rotation to corner points
            const angleRad = rotation * Math.PI / 180;
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            // Calculate exact edge positions
            const tlX = centerX + (-halfWidth * cos - (-halfHeight) * sin);
            const tlY = centerY + (-halfWidth * sin + (-halfHeight) * cos);

            const trX = centerX + (halfWidth * cos - (-halfHeight) * sin);
            const trY = centerY + (halfWidth * sin + (-halfHeight) * cos);

            const brX = centerX + (halfWidth * cos - halfHeight * sin);
            const brY = centerY + (halfWidth * sin + halfHeight * cos);

            const blX = centerX + (-halfWidth * cos - halfHeight * sin);
            const blY = centerY + (-halfWidth * sin + halfHeight * cos);

            // Position handles
            imageHandles.querySelector(`.acol-handle.tl`).style.left = `${tlX}px`;
            imageHandles.querySelector(`.acol-handle.tl`).style.top = `${tlY}px`;
            imageHandles.querySelector(`.acol-handle.tr`).style.left = `${trX}px`;
            imageHandles.querySelector(`.acol-handle.tr`).style.top = `${trY}px`;
            imageHandles.querySelector(`.acol-handle.br`).style.left = `${brX}px`;
            imageHandles.querySelector(`.acol-handle.br`).style.top = `${brY}px`;
            imageHandles.querySelector(`.acol-handle.bl`).style.left = `${blX}px`;
            imageHandles.querySelector(`.acol-handle.bl`).style.top = `${blY}px`;

            // Update bounding lines - with visibility fixes
            const svg = imageHandles.querySelector('svg');
            if (svg) {
                // Ensure SVG is properly positioned and visible
                svg.style.position = 'absolute';
                svg.style.top = '0';
                svg.style.left = '0';
                svg.style.color = '#000000'; // Ensure stroke color
                svg.style.width = `${containerRect.width}px`;
                svg.style.height = `${containerRect.height}px`;
                svg.style.overflow = 'visible';
                svg.style.pointerEvents = 'none';

                // Set line attributes with stroke and visibility
                const setLineAttributes = (line, x1, y1, x2, y2) => {
                    if (line) {
                        line.setAttribute('x1', x1);
                        line.setAttribute('y1', y1);
                        line.setAttribute('x2', x2);
                        line.setAttribute('y2', y2);
                        line.setAttribute('stroke', '#000000'); // Ensure stroke color
                        line.setAttribute('stroke-width', '1'); // Ensure stroke width
                        line.setAttribute('stroke-linecap', 'round');
                        line.style.display = 'block';
                    }
                };

                setLineAttributes(svg.querySelector('#acol-line-tl-tr'), tlX, tlY, trX, trY);
                setLineAttributes(svg.querySelector('#acol-line-tr-br'), trX, trY, brX, brY);
                setLineAttributes(svg.querySelector('#acol-line-br-bl'), brX, brY, blX, blY);
                setLineAttributes(svg.querySelector('#acol-line-bl-tl'), blX, blY, tlX, tlY);
            }

            // Position rotate handle
            const rotateHandleDistance = 20 * scale;
            const rotateX = centerX + (0 * cos - (-halfHeight - rotateHandleDistance) * sin);
            const rotateY = centerY + (0 * sin + (-halfHeight - rotateHandleDistance) * cos);

            imageHandles.querySelector(`.acol-handle.rotate`).style.left = `${rotateX}px`;
            imageHandles.querySelector(`.acol-handle.rotate`).style.top = `${rotateY}px`;
        }

        // Function to set active image

        function setActiveImage(imageElement) {
            // Hide all handles first
            handles.forEach(handle => {
                handle.style.display = 'none';
            });

            // Set new active image
            activeImage = imageElement;

            // Get the handles for this image
            const imageHandles = imageElement.closest('.acol-img-pre').nextElementSibling;
            if (imageHandles) {
                imageHandles.style.display = 'block';
            }

            // Initialize transform values
            const transformWrapper = imageElement.closest('.acol-transform-wrapper');
            const transform = window.getComputedStyle(transformWrapper).transform;

            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                // Extract translation
                offsetX = matrix.m41;
                offsetY = matrix.m42;
                // Extract scale (assuming uniform scaling)
                scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
                // Extract rotation
                rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            } else {
                offsetX = 0;
                offsetY = 0;
                scale = 1;
                rotation = 0;
            }

            // Update zoom range to match current scale
            zoomRange.value = scale;
        }

        // Event handlers
        const handleSlotClick = (slot, input) => {
            if (!input.disabled) input.click();
        };
        const handleFileInputChange = function (input, previewImage, placeholder) {
            console.log(previewImage);

            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    previewImage.src = reader.result;
                    const parent = previewImage.closest('.acol-img-pre');
                    if (parent) parent.style.display = "flex";
                    previewImage.style.display = "block";
                    placeholder.style.display = "none";
                    input.disabled = true;
                    setActiveImage(previewImage);
                    incrementUploadedImages();
                };
                reader.readAsDataURL(file);
            }
        };

        const handlePreviewImageClick = (previewImage) => {
            updateHandles(previewImage);
            setActiveImage(previewImage);
        };

        const handleAddTextClick = function () {
            textModal.style.display = 'flex';
            fontFamilyOptions.style.display = 'block';

            const textColor = document.getElementById('acol-textColor').value;
            const newTextBox = document.createElement('div');
            newTextBox.className = 'acol-text-box';
            newTextBox.innerText = 'New Custom Text';
            newTextBox.style.color = textColor;
            newTextBox.style.maxWidth = '100%';

            collagePhoto.appendChild(newTextBox);
            attachHandles(newTextBox);
            makeDraggable(newTextBox, { resize: 'acol-resize-handle', rotate: 'acol-rotate-handle' });
            activeTextBox = newTextBox;
        };

        const handleDeleteTextClick = function () {
            if (activeTextBox) {
                activeTextBox.remove();
                activeTextBox = null;
                document.getElementById('acol-textInput').value = '';
            }
            textModal.style.display = 'none';
            fontFamilyOptions.style.display = 'none';
            document.getElementById('acol-textColor').value = "#000000";
        };

        const handleSizeBtnClick = function (btn) {
            return function () {
                allSizeBtn.forEach(button => button.classList.remove('acol-active'));
                btn.classList.add('acol-active');
            };
        };

        const handleThicknessBtnClick = function (btn) {
            return function () {
                allThicknessBtn.forEach(button => button.classList.remove('acol-active'));
                btn.classList.add('acol-active');
            };
        };

        const handleIminusClick = function () {
            if (activeTextBox) {
                const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
                activeTextBox.style.fontSize = (currentFontSize - 5) + 'px';
                attachHandles(activeTextBox);
            }
        };

        const handleIplusClick = function () {
            if (activeTextBox) {
                const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
                activeTextBox.style.fontSize = (currentFontSize + 5) + 'px';
                attachHandles(activeTextBox);
            }
        };

        const handleResetClick = () => {
            location.reload();
        };

        const handleZoomRangeInput = function () {
            scale = parseFloat(zoomRange.value);
            updateTransform();
        };

        // Mouse/Touch event handlers for images
        function handleImageClick(e) {
            e.stopPropagation();
            setActiveImage(e.currentTarget);
        }

        function handleDocumentClick(e) {
            console.log("clickdef");

            if (activeImage && !activeImage.contains(e.target)) {
                const imageHandles = activeImage.closest('.acol-img-pre').nextElementSibling;
                if (imageHandles) {
                    imageHandles.style.display = 'none';
                }
                activeImage = null;
            }
        }

        function handleMouseDown(e) {
            if (e.button !== 0 || !activeImage || e.target.classList.contains('acol-handle')) return;

            isDragging = true;
            startX = e.clientX - offsetX;
            startY = e.clientY - offsetY;

            const transformWrapper = activeImage.closest('.acol-transform-wrapper');
            transformWrapper.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function handleTouchStart(e) {
            if (!activeImage || e.target.classList.contains('acol-handle')) return;

            if (e.touches.length === 1) {
                isDragging = true;
                const touch = e.touches[0];
                startX = touch.clientX - offsetX;
                startY = touch.clientY - offsetY;

                const transformWrapper = activeImage.closest('.acol-transform-wrapper');
                transformWrapper.style.cursor = 'grabbing';
                e.preventDefault();
            }
        }

        function handleMouseMove(e) {
            if (isDragging && activeImage) {
                offsetX = e.clientX - startX;
                offsetY = e.clientY - startY;
                updateTransform();
            }
        }

        function handleTouchMove(e) {
            if (isDragging && activeImage && e.touches.length === 1) {
                const touch = e.touches[0];
                offsetX = touch.clientX - startX;
                offsetY = touch.clientY - startY;
                updateTransform();
                e.preventDefault();
            }
        }

        function handleMouseUp() {
            if (isDragging) {
                isDragging = false;
                if (activeImage) {
                    const transformWrapper = activeImage.closest('.acol-transform-wrapper');
                    transformWrapper.style.cursor = 'grab';
                }
            }
        }

        function handleTouchEnd() {
            if (isDragging) {
                isDragging = false;
                if (activeImage) {
                    const transformWrapper = activeImage.closest('.acol-transform-wrapper');
                    transformWrapper.style.cursor = 'grab';
                }
            }
        }

        // Handle events for resize and rotate
        function handleHandleMouseDown(e, type) {
            if (!activeImage) return;

            e.preventDefault();
            e.stopPropagation();

            const editorRect = imageContainer.getBoundingClientRect();
            const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
            const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
            const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

            if (type === 'rotate') {
                isRotating = true;
                initialAngle = Math.atan2(startY - centerY, startX - centerX) * (180 / Math.PI) - rotation;
            } else {
                isResizing = true;
                initialScale = scale;
                const handleX = wrapperRect.left +
                    (e.target.classList.contains('tl') || e.target.classList.contains('bl') ? 0 : wrapperRect.width);
                const handleY = wrapperRect.top +
                    (e.target.classList.contains('tl') || e.target.classList.contains('tr') ? 0 : wrapperRect.height);
                initialDistance = Math.sqrt(
                    Math.pow(handleX - centerX, 2) +
                    Math.pow(handleY - centerY, 2)
                );
            }

            startX = e.clientX;
            startY = e.clientY;
        }

        function handleHandleTouchStart(e, type) {
            if (!activeImage || e.touches.length !== 1) return;

            e.preventDefault();
            e.stopPropagation();

            const editorRect = imageContainer.getBoundingClientRect();
            const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
            const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
            const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);
            const touch = e.touches[0];

            if (type === 'rotate') {
                isRotating = true;
                initialAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI) - rotation;
            } else {
                isResizing = true;
                initialScale = scale;
                const handleX = wrapperRect.left +
                    (e.target.classList.contains('tl') || e.target.classList.contains('bl') ? 0 : wrapperRect.width);
                const handleY = wrapperRect.top +
                    (e.target.classList.contains('tl') || e.target.classList.contains('tr') ? 0 : wrapperRect.height);
                initialDistance = Math.sqrt(
                    Math.pow(handleX - centerX, 2) +
                    Math.pow(handleY - centerY, 2)
                );
            }

            startX = touch.clientX;
            startY = touch.clientY;
        }

        function handleHandleMove(e) {
            if (!activeImage) return;

            if (isResizing) {
                const editorRect = imageContainer.getBoundingClientRect();
                const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
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
                const editorRect = imageContainer.getBoundingClientRect();
                const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
                const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
                const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                rotation = angle - initialAngle;
            }

            updateTransform();
        }

        function handleHandleTouchMove(e) {
            if (!activeImage || e.touches.length !== 1) return;

            const touch = e.touches[0];

            if (isResizing) {
                const editorRect = imageContainer.getBoundingClientRect();
                const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
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
                const editorRect = imageContainer.getBoundingClientRect();
                const wrapperRect = activeImage.closest('.acol-transform-wrapper').getBoundingClientRect();
                const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
                const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

                const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
                rotation = angle - initialAngle;
            }

            updateTransform();
            e.preventDefault();
        }

        function handleHandleUp() {
            isResizing = false;
            isRotating = false;
        }

        // Helper functions
        function incrementUploadedImages() {
            uploadedImagesCount++;
            if (totalImages === uploadedImagesCount) {
                shareBtn.style.display = "block";
            }
        }

        function updatePreview() {
            if (activeTextBox) {
                const text = document.getElementById('acol-textInput').value || 'New Custom Text';
                const textColor = document.getElementById('acol-textColor').value;

                activeTextBox.innerText = text;
                activeTextBox.style.color = textColor;
                attachHandles(activeTextBox);
            }
        }

        function attachHandles(element) {
            if (!element.querySelector('.acol-resize-handle')) {
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'acol-resize-handle';
                resizeHandle.style.position = 'absolute';
                resizeHandle.style.right = '-11.3px';
                resizeHandle.style.bottom = '-6.5px';
                resizeHandle.style.fontSize = '24px';
                resizeHandle.style.cursor = 'nwse-resize';
                resizeHandle.innerText = '+';
                resizeHandle.style.display = 'none';
                resizeHandle.style.touchAction = 'none';

                element.appendChild(resizeHandle);

                const resizeMouseDownHandler = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
                    const initialMouseX = e.clientX || (e.touches && e.touches[0].clientX);

                    function resize(e) {
                        e.preventDefault();
                        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                        const scaleFactor = 0.2;
                        const newSize = initialFontSize + (clientX - initialMouseX) * scaleFactor;

                        if (newSize > 10) {
                            element.style.fontSize = newSize + 'px';
                        }
                    }

                    function stopResizing() {
                        document.removeEventListener('mousemove', resize);
                        document.removeEventListener('touchmove', resize);
                        document.removeEventListener('mouseup', stopResizing);
                        document.removeEventListener('touchend', stopResizing);
                    }

                    document.addEventListener('mousemove', resize);
                    document.addEventListener('touchmove', resize, { passive: false });
                    document.addEventListener('mouseup', stopResizing);
                    document.addEventListener('touchend', stopResizing);
                };

                resizeHandle.addEventListener('mousedown', resizeMouseDownHandler);
                resizeHandle.addEventListener('touchstart', resizeMouseDownHandler, { passive: false });
            }

            if (!element.querySelector('.acol-rotate-handle')) {
                const rotateHandle = document.createElement('div');
                rotateHandle.className = 'acol-rotate-handle';
                rotateHandle.style.position = 'absolute';
                rotateHandle.style.top = '-30px';
                rotateHandle.style.left = '50%';
                rotateHandle.style.transform = 'translateX(-50%)';
                rotateHandle.style.cursor = 'pointer';
                rotateHandle.style.fontSize = '24px';
                rotateHandle.innerHTML = '&#8635;';
                rotateHandle.style.display = 'none';
                rotateHandle.style.touchAction = 'none';

                element.appendChild(rotateHandle);

                const rotateMouseDownHandler = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    const rect = element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

                    const startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
                    const transform = window.getComputedStyle(element).transform;
                    let currentRotation = 0;

                    if (transform !== 'none') {
                        const matrix = new DOMMatrix(transform);
                        currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                    }

                    const adjustedStartAngle = startAngle - currentRotation;

                    function rotate(e) {
                        e.preventDefault();
                        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                        const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
                        const rotation = angle - adjustedStartAngle;

                        // Preserve existing transform properties
                        const currentTransform = element.style.transform.replace(/rotate\([^)]*\)/, '');
                        element.style.transform = `${currentTransform} rotate(${rotation}deg)`;
                    }

                    function stopRotating() {
                        document.removeEventListener('mousemove', rotate);
                        document.removeEventListener('touchmove', rotate);
                        document.removeEventListener('mouseup', stopRotating);
                        document.removeEventListener('touchend', stopRotating);
                    }

                    document.addEventListener('mousemove', rotate);
                    document.addEventListener('touchmove', rotate, { passive: false });
                    document.addEventListener('mouseup', stopRotating);
                    document.addEventListener('touchend', stopRotating);
                };

                rotateHandle.addEventListener('mousedown', rotateMouseDownHandler);
                rotateHandle.addEventListener('touchstart', rotateMouseDownHandler, { passive: false });
            }
        }

        function makeDraggable(element, handle) {
            let isDragging = false;
            let offsetX = 0, offsetY = 0, startX, startY;
            let rotation = 0;

            const elementClickHandler = function () {
                const resizeHandle = element.querySelector(`.${handle.resize}`);
                const rotateHandle = element.querySelector(`.${handle.rotate}`);

                if (resizeHandle) resizeHandle.style.display = 'block';
                if (rotateHandle) rotateHandle.style.display = 'block';

                element.style.border = '2px dashed #248EE6';
            };

            const elementMouseDownHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();

                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);

                const resizeHandle = element.querySelector(`.${handle.resize}`);
                const rotateHandle = element.querySelector(`.${handle.rotate}`);

                if (resizeHandle) resizeHandle.style.display = 'block';
                if (rotateHandle) rotateHandle.style.display = 'block';

                isDragging = true;
                startX = clientX - offsetX;
                startY = clientY - offsetY;
                element.style.cursor = 'grabbing';

                const transform = window.getComputedStyle(element).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                }
            };

            const documentMouseMoveHandler = function (e) {
                if (!isDragging) return;
                e.preventDefault();

                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);

                offsetX = clientX - startX;
                offsetY = clientY - startY;

                element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
            };

            const documentMouseUpHandler = function () {
                if (isDragging) {
                    isDragging = false;
                    element.style.cursor = '';
                }
            };

            const documentMouseDownHandler = function (e) {
                const target = e.target || (e.touches && e.touches[0].target);
                if (!element.contains(target)) {
                    element.style.border = 'none';

                    const resizeHandle = element.querySelector(`.${handle.resize}`);
                    const rotateHandle = element.querySelector(`.${handle.rotate}`);

                    if (resizeHandle) resizeHandle.style.display = 'none';
                    if (rotateHandle) rotateHandle.style.display = 'none';
                }
            };

            element.addEventListener('click', elementClickHandler);
            element.addEventListener('mousedown', elementMouseDownHandler);
            element.addEventListener('touchstart', elementMouseDownHandler, { passive: false });
            document.addEventListener('mousemove', documentMouseMoveHandler);
            document.addEventListener('touchmove', documentMouseMoveHandler, { passive: false });
            document.addEventListener('mouseup', documentMouseUpHandler);
            document.addEventListener('touchend', documentMouseUpHandler);
            document.addEventListener('mousedown', documentMouseDownHandler);
            document.addEventListener('touchstart', documentMouseDownHandler, { passive: false });

            return () => {
                element.removeEventListener('click', elementClickHandler);
                element.removeEventListener('mousedown', elementMouseDownHandler);
                element.removeEventListener('touchstart', elementMouseDownHandler);
                document.removeEventListener('mousemove', documentMouseMoveHandler);
                document.removeEventListener('touchmove', documentMouseMoveHandler);
                document.removeEventListener('mouseup', documentMouseUpHandler);
                document.removeEventListener('touchend', documentMouseUpHandler);
                document.removeEventListener('mousedown', documentMouseDownHandler);
                document.removeEventListener('touchstart', documentMouseDownHandler);
            };
        }

        function changeFontFamily() {
            const selectedFont = document.getElementById('acol-fontStyleSelect').value;
            if (activeTextBox) {
                activeTextBox.style.fontFamily = selectedFont;
            }
        }

        function getImageDetails() {
            const imageContainers = document.querySelectorAll('.acol-small-img');
            const selectedSize = document.querySelector('.acol-size-btn.acol-active');
            const selectedThickness = document.querySelector('.acol-thickness-btn.acol-active')
            const size = selectedSize && selectedSize.dataset.ratio !== "default"
                ? selectedSize.dataset.ratio
                : "default";
            let imagesData = [];

            imageContainers.forEach(container => {
                const imageElement = container.querySelector('.acol-previewImage');
                const fileInput = container.querySelector('input[type="file"]');
                const imageDetails = {
                    name: imageElement.src ? imageElement.src.split('/').pop() : 'No image selected',
                    size: fileInput.files.length ? fileInput.files[0].size : 'No file selected',
                    type: fileInput.files.length ? fileInput.files[0].type : 'No file selected',
                    width: imageElement ? imageElement.offsetWidth + 'px' : 'No image',
                    height: imageElement ? imageElement.offsetHeight + 'px' : 'No image',
                };
                imagesData.push(imageDetails);
            });

            const textElements = document.querySelector('.acol-text-box');
            const text = document.getElementById('acol-textInput').value || 'New Custom Text';
            const textColor = document.getElementById('acol-textColor').value;
            const selectedFont = document.getElementById('acol-fontStyleSelect').value;

            const imageDetails = {
                name: `Acrylic Collage (${size})`,
                images: imagesData,
                size: size,
                thickness: selectedThickness ? selectedThickness.dataset.thickness : 'none',
                type: 'Acrylic Collage',
                price: 999,
                addedText: textElements ? [{
                    text: text,
                    color: textColor,
                    style: selectedFont
                }] : []
            };

            return imageDetails;
        }

        // Initialize image slots
        const slotCleanupFunctions = [];
        document.querySelectorAll(".acol-small-img, .acol-big-img").forEach((slot) => {
            const input = slot.querySelector("input");
            const placeholder = slot.querySelector("p");
            const previewImage = slot.querySelector("img");

            const slotClickHandler = () => handleSlotClick(slot, input);
            const fileInputHandler = () => handleFileInputChange(input, previewImage, placeholder);
            const previewClickHandler = (e) => handlePreviewImageClick(e.currentTarget);

            slot.addEventListener("click", slotClickHandler);
            input.addEventListener("change", fileInputHandler);
            previewImage.addEventListener("click", previewClickHandler);

            slotCleanupFunctions.push(() => {
                slot.removeEventListener("click", slotClickHandler);
                input.removeEventListener("change", fileInputHandler);
                previewImage.removeEventListener("click", previewClickHandler);
            });
        });

        // Add other event listeners
        addTextBtn.addEventListener('click', handleAddTextClick);
        deleteTextBtn.addEventListener('click', handleDeleteTextClick);
        iminus.addEventListener('click', handleIminusClick);
        iplus.addEventListener('click', handleIplusClick);
        resetBtn.addEventListener('click', handleResetClick);
        zoomRange.addEventListener('input', handleZoomRangeInput);

        // Add image transformation event listeners
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);

        // Add handle event listeners (delegated)
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('acol-handle')) {
                const type = e.target.classList.contains('rotate') ? 'rotate' : 'resize';
                handleHandleMouseDown(e, type);
            }
        });

        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('acol-handle')) {
                const type = e.target.classList.contains('rotate') ? 'rotate' : 'resize';
                handleHandleTouchStart(e, type);
            }
        }, { passive: false });

        document.addEventListener('mousemove', (e) => {
            if (isResizing || isRotating) {
                handleHandleMove(e);
            }
        });

        document.addEventListener('touchmove', (e) => {
            if ((isResizing || isRotating) && e.touches.length === 1) {
                handleHandleTouchMove(e);
            }
        }, { passive: false });

        document.addEventListener('mouseup', handleHandleUp);
        document.addEventListener('touchend', handleHandleUp);

        // Add size and thickness button handlers
        const sizeBtnCleanupFunctions = [];
        allSizeBtn.forEach(btn => {
            const handler = handleSizeBtnClick(btn);
            btn.addEventListener('click', handler);
            sizeBtnCleanupFunctions.push(() => btn.removeEventListener('click', handler));
        });

        const thicknessBtnCleanupFunctions = [];
        allThicknessBtn.forEach(btn => {
            const handler = handleThicknessBtnClick(btn);
            btn.addEventListener('click', handler);
            thicknessBtnCleanupFunctions.push(() => btn.removeEventListener('click', handler));
        });

        window.updatePreview = updatePreview;
        window.changeFontFamily = changeFontFamily;
        window.getImageDetails = getImageDetails;

        // Cleanup function
        return () => {
            // Remove event listeners with null checks
            if (addTextBtn && addTextBtn.removeEventListener) {
                addTextBtn.removeEventListener('click', handleAddTextClick);
            }
            if (deleteTextBtn && deleteTextBtn.removeEventListener) {
                deleteTextBtn.removeEventListener('click', handleDeleteTextClick);
            }
            if (iminus && iminus.removeEventListener) {
                iminus.removeEventListener('click', handleIminusClick);
            }
            if (iplus && iplus.removeEventListener) {
                iplus.removeEventListener('click', handleIplusClick);
            }
            if (resetBtn && resetBtn.removeEventListener) {
                resetBtn.removeEventListener('click', handleResetClick);
            }
            if (zoomRange && zoomRange.removeEventListener) {
                zoomRange.removeEventListener('input', handleZoomRangeInput);
            }

            // Remove image transformation event listeners
            document.removeEventListener('click', handleDocumentClick);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);

            // Remove handle event listeners
            document.removeEventListener('mousedown', (e) => {
                if (e.target.classList.contains('acol-handle')) {
                    const type = e.target.classList.contains('rotate') ? 'rotate' : 'resize';
                    console.log("handleHandleMouseDown", e, type);
                    
                    handleHandleMouseDown(e, type);
                }
            });
            document.removeEventListener('touchstart', (e) => {
                if (e.target.classList.contains('acol-handle')) {
                    const type = e.target.classList.contains('rotate') ? 'rotate' : 'resize';
                    handleHandleTouchStart(e, type);
                }
            });
            document.removeEventListener('mousemove', (e) => {
                if (isResizing || isRotating) {
                    handleHandleMove(e);
                }
            });
            document.removeEventListener('touchmove', (e) => {
                if ((isResizing || isRotating) && e.touches.length === 1) {
                    handleHandleTouchMove(e);
                }
            });
            document.removeEventListener('mouseup', handleHandleUp);
            document.removeEventListener('touchend', handleHandleUp);

            // Execute all cleanup functions with validation
            if (slotCleanupFunctions && Array.isArray(slotCleanupFunctions)) {
                slotCleanupFunctions.forEach(cleanup => {
                    if (typeof cleanup === 'function') {
                        cleanup();
                    }
                });
            }
            if (sizeBtnCleanupFunctions && Array.isArray(sizeBtnCleanupFunctions)) {
                sizeBtnCleanupFunctions.forEach(cleanup => {
                    if (typeof cleanup === 'function') {
                        cleanup();
                    }
                });
            }
            if (thicknessBtnCleanupFunctions && Array.isArray(thicknessBtnCleanupFunctions)) {
                thicknessBtnCleanupFunctions.forEach(cleanup => {
                    if (typeof cleanup === 'function') {
                        cleanup();
                    }
                });
            }

            // Remove window functions safely
            const windowProperties = ['updatePreview', 'changeFontFamily', 'getImageDetails'];
            windowProperties.forEach(prop => {
                if (window[prop] !== undefined) {
                    try {
                        delete window[prop];
                    } catch (e) {
                        console.warn(`Could not delete window.${prop}`, e);
                    }
                }
            });
        };
    }, [collageType]);


    if (!layout) return <h2>Invalid collage type</h2>;

    const handleAddToCart = async () => {
        setCartLoading(true);
        try {
            const formData = await shareImage();
            console.log("FormData:", [...formData.entries()]);

            // const token = localStorage.getItem("token");
            // if (!token) {
            //     console.error("User is not authenticated");
            //     toast.error("User is not authenticated.");
            //     return;
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
    //     setLoading(true);
    //     const promise = new Promise(async (resolve, reject) => {
    //         try {
    //             const formData = await shareImage();
    //             console.log("FormData:", [...formData.entries()]);

    //             const token = localStorage.getItem("token");
    //             if (!token) {
    //                 console.error("User is not authenticated");
    //                 reject("User is not authenticated.");
    //                 return;
    //             }

    //             const headers = {
    //                 "Content-Type": "multipart/form-data",
    //                 Authorization: `Bearer ${token}`,
    //             };

    //             const response = await axios.post(
    //                 `${import.meta.env.VITE_BACKEND_URL}/send-email`,
    //                 formData,
    //                 { headers }
    //             );

    //             if (response.data?.success) {
    //                 resolve("Product share successfully!");
    //                 setLoading(false);
    //             } else {
    //                 reject("Failed to share product.");
    //             }
    //         } catch (error) {
    //             console.error("Error sharing product:", error);
    //             reject("Failed to share product. Please try again.");
    //         }
    //     });

    //     toast.promise(promise, {
    //         loading: "Sharing product...",
    //         success: (message) => message,
    //         error: (errMsg) => errMsg,
    //     });

    // };

    const handleShare = async () => {
        setLoading(true);
        const formData = await shareImage();
        let image;
        // const token = localStorage.getItem("token");
        // if (!token) {
        //     console.error("User is not authenticated");
        //     toast.error("User is not authenticated.");
        //     setLoading(false);
        //     return;
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
        if (collageType) message += `🖼️ *collageType:* ${collageType}\n`;
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
        <div className="acol-content">
            <h2>{collageType ? collageType.replace("-", " ") : "2-pic"} Collage</h2>
            <div className="acol-main-content">
                <div className="acol-collage-frame" style={layout.style}>
                    {layout.images.map((img) => (
                        <div className={img.type} data-slot={img.id} key={img.id} style={{ border: "1px solid #000" }}>
                            {/* <img className="acol-previewImage" id={`acol-previewImage${img.id}`} alt="Click to upload" style={{ display: "none" }} /> */}
                            <TransformableImageBox imageClass="acol-previewImage" imageId={`acol-previewImage${img.id}`} alt="Click to upload" prefix="acol-" />
                            <input type="file" id={`acol-fileInput${img.id}`} accept="image/jpeg, image/png, image/webp, image/jpg" style={{ display: "none" }} />
                            <p className="acol-placeholderText">
                                <FaImage />
                                Upload
                            </p>
                        </div>
                    ))}
                </div>

                <div>
                    <input
                        type="range"
                        id="acol-zoomRange"
                        min="0.5"
                        max="3"
                        step="0.1"
                        defaultValue="1"
                        style={{
                            width: "200px",
                            accentColor: "#000787",
                            display:"none"
                        }}
                    />
                    <div className="acol-row">
                        <input type="color" id="acol-textColor" defaultValue="#000000" onInput={() => window.updatePreview()} />
                        <div className="acol-row">
                            <button id="acol-iminus">-</button> <VscTextSize style={{ fontSize: '2rem' }} />
                            <button id="acol-iplus">+</button>
                            <p id="acol-reset" title="Reset the collage"><VscDebugRestart /></p>
                            <button className="btn2" id="acol-addTextBtn">
                                <HiPencilSquare />
                            </button>

                        </div>
                    </div>

                    <div className="acol-textModal flex flex-col gap-3 py-3 w-full">
                        <div className="inputBox flex items-center gap-2">
                            <input
                                className="border border-black p-2 rounded-md text-base w-full sm:flex-1 "
                                type="text"
                                id="acol-textInput"
                                placeholder="Enter text"
                                onInput={() => window.updatePreview()}
                            />
                            <button
                                id="acol-deleteTextBtn"
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                aria-label="Delete text"
                            >
                                <FaTrash className="text-red-600" />
                            </button>
                        </div>

                        <select
                            id="acol-fontStyleSelect"
                            className="border border-black p-2 rounded-md w-full sm:w-64 md:w-72 lg:w-80 text-sm sm:text-base"
                            onChange={() => window.changeFontFamily()}
                        >
                            <option value="Arial" style={{ fontFamily: "Arial" }}>Arial</option>
                            <option value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>Times New Roman</option>
                            <option value="Courier New" style={{ fontFamily: "Courier New" }}>Courier New</option>
                            <option value="Verdana" style={{ fontFamily: "Verdana" }}>Verdana</option>
                            <option value="cursive" style={{ fontFamily: "cursive" }}>Cursive</option>
                            <option value="fantasy" style={{ fontFamily: "fantasy" }}>Fantasy</option>
                            <option value="monospace" style={{ fontFamily: "monospace" }}>Monospace</option>
                            <option value="Lucida Console" style={{ fontFamily: "Lucida Console" }}>Lucida Console</option>
                            <option value="Lucida Sans Unicode" style={{ fontFamily: "Lucida Sans Unicode" }}>Lucida Sans Unicode</option>
                            <option value="Impact" style={{ fontFamily: "Impact" }}>Impact</option>
                            <option value="Georgia" style={{ fontFamily: "Georgia" }}>Georgia</option>
                        </select>
                    </div>


                    <div className="acol-row">
                        <h3>Size (Inch):</h3>
                        {[
                            "12x9",
                            "21x15",
                            "35x23",
                            "48x36"
                        ].map((s, index) => (
                            <button key={index} className={`acol-size-btn ${index === 0 ? 'acol-active' : ''}`} data-ratio={s}>{s}</button>
                        ))}
                    </div>

                    <div className="acol-row">
                        <h3>Thickness (mm)</h3>
                        <button className="acol-thickness-btn acol-active" data-thickness="5 MM">5 MM</button>
                        <button className="acol-thickness-btn" data-thickness="8 MM">8 MM (Premium)</button>
                    </div>
                    <div style={{ display: 'flex', gap: "1rem" }}>
                        <button className="btn2 acol-share" id="acol-shareBtn" onClick={handleShare} disabled={loading}>
                            {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
                        </button>
                        <button
                            className="btn2 acol-add-to-cart"
                            id="cartBtn"
                            onClick={() => handleAddToCart({
                                container: "acol-collage-frame",
                                title: "Customized Collage Acrylic",
                                price: 799
                            })}
                            disabled={cartLoading}
                        >
                            {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CollageAcrylicPhoto;
