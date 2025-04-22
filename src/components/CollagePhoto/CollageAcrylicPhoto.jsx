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
        const textInput = document.getElementById('acol-textInput');
        const addTextBtn = document.getElementById('acol-addTextBtn');
        const deleteTextBtn = document.getElementById('acol-deleteTextBtn');
        const resetBtn = document.getElementById('acol-reset');
        const allSizeBtn = document.querySelectorAll('.acol-size-btn');
        const allThicknessBtn = document.querySelectorAll('.acol-thickness-btn');
        const cartBtn = document.getElementById('cartBtn');
        const collagePhoto = document.querySelector('.acol-collage-frame');
        const iminus = document.getElementById('acol-iminus');
        const iplus = document.getElementById('acol-iplus');
        const fontFamilyOptions = document.getElementById('acol-fontStyleSelect');
        const shareBtn = document.getElementById('acol-shareBtn');
        const textModal = document.querySelector('.acol-textModal');
        const zoomRange = document.getElementById('acol-zoomRange');
        const BASE_URL = window.BASE_URL;
        const allTextData = [];

        let uploadedImagesCount = 0;
        let totalImages = document.querySelectorAll(".acol-small-img, .acol-big-img").length;
        let activeTextBox = null;
        let activeImage = null;
        let scale = 1;
        let rotation = 0;
        let currentX = 0, currentY = 0;

        // Event handlers
        const handleSlotClick = (slot, input) => {
            if (!input.disabled) input.click();
        };

        const handleFileInputChange = function (input, previewImage, placeholder) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    previewImage.src = reader.result;
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
            newTextBox.style.wordBreak = 'break-word';
            newTextBox.style.whiteSpace = 'pre-wrap';
            newTextBox.style.overflow = 'hidden';
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
            updateImagePosition();
        };

        // Initialize image slots
        const slotCleanupFunctions = [];
        document.querySelectorAll(".acol-small-img, .acol-big-img").forEach((slot) => {
            const input = slot.querySelector("input");
            const placeholder = slot.querySelector("p");
            const previewImage = slot.querySelector("img");

            const slotClickHandler = () => handleSlotClick(slot, input);
            const fileInputHandler = () => handleFileInputChange(input, previewImage, placeholder);
            const previewClickHandler = () => handlePreviewImageClick(previewImage);

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

        // Helper functions (same as before)
        function incrementUploadedImages() {
            uploadedImagesCount++;
            if (totalImages === uploadedImagesCount) {
                shareBtn.style.display = "block";
                // cartBtn.style.display = 'block';
            }
        }

        function setActiveImage(imageElement) {
            removeExistingHandles();
            makeDraggable(imageElement, { resize: 'acol-resize', rotate: 'acol-rotate' });
            addRotateHandle(imageElement);
            activeImage = imageElement;

            if (!imageElement.dataset.scale) imageElement.dataset.scale = 1;
            if (!imageElement.dataset.rotation) imageElement.dataset.rotation = 0;
            if (!imageElement.dataset.x) imageElement.dataset.x = 0;
            if (!imageElement.dataset.y) imageElement.dataset.y = 0;

            scale = parseFloat(imageElement.dataset.scale);
            zoomRange.value = scale;            
            rotation = parseFloat(imageElement.dataset.rotation);
            currentX = parseFloat(imageElement.dataset.x);
            currentY = parseFloat(imageElement.dataset.y);

            updateImagePosition();
        }

        function removeExistingHandles() {
            document.querySelectorAll(".acol-resize, .acol-rotate").forEach((handle) => handle.remove());
        }

        function updateImagePosition() {
            if (activeImage) {
                activeImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;
                activeImage.dataset.scale = scale;
                activeImage.dataset.rotation = rotation;
                activeImage.dataset.x = currentX;
                activeImage.dataset.y = currentY;
            }
        }

        function addRotateHandle(imageElement) {
            const rotateHandle = document.createElement('div');
            rotateHandle.className = 'acol-rotate';
            rotateHandle.innerHTML = '&#8635;';

            collagePhoto.style.position = 'relative';
            collagePhoto.appendChild(rotateHandle);

            const rotateMouseDownHandler = function (e) {
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

            rotateHandle.addEventListener('mousedown', rotateMouseDownHandler);

            return () => {
                rotateHandle.removeEventListener('mousedown', rotateMouseDownHandler);
                collagePhoto.removeChild(rotateHandle);
            };
        }

        function makeDraggable(element, handle) {
            let isDragging = false;
            let offsetX = 0, offsetY = 0, startX, startY;
            let rotation = 0;

            const elementClickHandler = function () {
                const resizeHandle = document.querySelector(`.${handle.resize}`);
                const rotateHandle = document.querySelector(`.${handle.rotate}`);

                if (resizeHandle) resizeHandle.style.display = 'block';
                if (rotateHandle) rotateHandle.style.display = 'block';

                element.style.border = '2px dashed #248EE6';
            };

            const elementMouseDownHandler = function (e) {
                const resizeHandle = document.querySelector(`.${handle.resize}`);
                const rotateHandle = document.querySelector(`.${handle.rotate}`);

                if (resizeHandle) resizeHandle.style.display = 'block';
                if (rotateHandle) rotateHandle.style.display = 'block';

                isDragging = true;
                startX = e.clientX - offsetX;
                startY = e.clientY - offsetY;
                element.style.cursor = 'grabbing';

                const transform = window.getComputedStyle(element).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                }
            };

            const documentMouseMoveHandler = function (e) {
                if (!isDragging) return;

                offsetX = e.clientX - startX;
                offsetY = e.clientY - startY;

                element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
            };

            const documentMouseUpHandler = function () {
                if (isDragging) {
                    isDragging = false;
                    element.style.cursor = 'move';
                    currentX = offsetX;
                    currentY = offsetY;

                    if (activeImage) {
                        activeImage.dataset.x = currentX;
                        activeImage.dataset.y = currentY;
                    }
                }
            };

            const documentMouseDownHandler = function (e) {
                if (!element.contains(e.target)) {
                    element.style.border = 'none';

                    const resizeHandle = document.querySelector(`.${handle.resize}`);
                    const rotateHandle = document.querySelector(`.${handle.rotate}`);

                    if (resizeHandle) resizeHandle.style.display = 'none';
                    if (rotateHandle) rotateHandle.style.display = 'none';
                }
            };

            element.addEventListener('click', elementClickHandler);
            element.addEventListener('mousedown', elementMouseDownHandler);
            document.addEventListener('mousemove', documentMouseMoveHandler);
            document.addEventListener('mouseup', documentMouseUpHandler);
            document.addEventListener('mousedown', documentMouseDownHandler);

            return () => {
                element.removeEventListener('click', elementClickHandler);
                element.removeEventListener('mousedown', elementMouseDownHandler);
                document.removeEventListener('mousemove', documentMouseMoveHandler);
                document.removeEventListener('mouseup', documentMouseUpHandler);
                document.removeEventListener('mousedown', documentMouseDownHandler);
            };
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
                resizeHandle.style.cursor = 'crosshair';
                resizeHandle.innerText = '+';
                resizeHandle.style.display = 'none';

                element.appendChild(resizeHandle);

                const resizeMouseDownHandler = function (e) {
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

                resizeHandle.addEventListener('mousedown', resizeMouseDownHandler);

                return () => {
                    resizeHandle.removeEventListener('mousedown', resizeMouseDownHandler);
                    element.removeChild(resizeHandle);
                };
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

                element.appendChild(rotateHandle);

                const rotateMouseDownHandler = function (e) {
                    e.stopPropagation();
                    const rect = element.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    function rotate(e) {
                        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                        const degree = (angle * (180 / Math.PI) + 90) % 360;
                        element.style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
                    }

                    function stopRotating() {
                        document.removeEventListener('mousemove', rotate);
                        document.removeEventListener('mouseup', stopRotating);
                    }

                    document.addEventListener('mousemove', rotate);
                    document.addEventListener('mouseup', stopRotating);
                };

                rotateHandle.addEventListener('mousedown', rotateMouseDownHandler);

                return () => {
                    rotateHandle.removeEventListener('mousedown', rotateMouseDownHandler);
                    element.removeChild(rotateHandle);
                };
            }
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

        // function shareImage() {
        //     return new Promise((resolve, reject) => {
        //         html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
        //             canvas.toBlob((blob) => {
        //                 if (!blob) {
        //                     alert("Error: Failed to generate image!");
        //                     reject("Failed to generate image");
        //                     return;
        //                 }

        //                 const formData = new FormData();
        //                 const now = new Date();
        //                 const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0];
        //                 const fileName = `customized-image-${formattedDate}.png`;

        //                 const imageData = getImageDetails();
        //                 formData.append('image', blob, fileName);
        //                 formData.append('details', JSON.stringify(imageData));
        //                 const subject = `Collage Acrylic Photo (${imageData.size || "default"})`;
        //                 formData.append('subject', JSON.stringify(subject));
        //                 resolve(formData);
        //             });
        //         }).catch(error => reject(error));
        //     });
        // }

        window.updatePreview = updatePreview;
        window.changeFontFamily = changeFontFamily;
        window.getImageDetails = getImageDetails;
        // window.shareImage = shareImage;

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
            const windowProperties = ['updatePreview', 'changeFontFamily', 'getImageDetails', 'shareImage'];
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
    }, []);
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
                            <img className="acol-previewImage" id={`acol-previewImage${img.id}`} alt="Click to upload" style={{ display: "none" }} />
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

                    <div className="acol-textModal flex flex-col gap-3 py-3">
                        <div className="flex items-center">
                            <input
                                className="border border-black p-2 rounded-md text-base"
                                type="text"
                                id="acol-textInput"
                                placeholder="Enter text"
                                onInput={() => window.updatePreview()}
                            />
                            <a id="acol-deleteTextBtn">
                                <FaTrash />
                            </a>
                        </div>
                        <select
                            id="acol-fontStyleSelect"
                            className="border border-black p-2 rounded-md w-2/3"
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
