// const uploadBox = document.getElementById('uploadBox');
// const fileInput = document.getElementById('fileInput');
// const previewImage = document.getElementById('afm-previewImage');
// const placeholderText = document.getElementById('afm-placeholderText');
// const uploadButton = document.querySelector('.afm-upload');
// const shareBtn = document.getElementById('shareBtn');
// const addTextBtn = document.getElementById('afm-addTextBtn');
// const allSizeBtn = document.querySelectorAll('.afm-size-btn');
// const allThicknessBtn = document.querySelectorAll('.afm-thickness-btn');
// const leftPanel = document.querySelector('.afm-image-customization-page .afm-left');
// const allTextData = [];
// const cartBtn = document.getElementById('cartBtn');
// const zoomRange = document.getElementById('afm-zoomRange');
// const BASE_URL = window.BASE_URL;

// let scale = 1;
// let isImageUploaded = false;
// let isDragging = false;
// let initialX = 0, initialY = 0;
// let currentX = 0, currentY = 0;
// let xOffset = 0, yOffset = 0;
// let rotation = 0; // in degrees


// uploadBox.addEventListener('click', () => {
//     if (!isImageUploaded) {
//         fileInput.click();
//     }
// });

// uploadButton.addEventListener('click', () => {
//     fileInput.disabled = false;
//     fileInput.click();
// });

// fileInput.addEventListener("change", function (event) {
//     const file = event.target.files[0];

//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             previewImage.src = e.target.result;
//             previewImage.style.display = "block";
//             placeholderText.style.display = "none";
//             isImageUploaded = true;
//             initializeImageFeatures(previewImage);
//             addTextBtn.style.display = 'block';
//             addTextBtn.style.display = 'block';
//             shareBtn.style.display = 'block';
//             cartBtn.style.display = 'block';
//         };
//         reader.readAsDataURL(file);
//     }
// });

// function initializeImageFeatures(imageElement) {
//     addRotateHandle(imageElement);
//     makeDraggable(imageElement, { rotate: 'afm-rotate' });
// }

// zoomRange.addEventListener('input', function () {
//     scale = parseFloat(zoomRange.value);
//     updateImagePosition();
// });
// function updateImagePosition() {
//     previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;
// }



// function addRotateHandle(imageElement) {
//     const rotateHandle = document.createElement('div');
//     rotateHandle.className = 'afm-rotate';
//     rotateHandle.style.position = 'absolute';
//     rotateHandle.style.top = '13%';
//     rotateHandle.style.left = '30%';
//     rotateHandle.style.transform = 'translateX(-50%)';
//     rotateHandle.style.cursor = 'pointer';
//     rotateHandle.innerHTML = '&#8635;';
//     rotateHandle.style.color = 'blue';
//     rotateHandle.style.fontWeight = 'bold';
//     rotateHandle.style.fontSize = '1.5rem';
//     rotateHandle.style.backgroundColor = 'transparent';

//     leftPanel.appendChild(rotateHandle);

//     rotateHandle.addEventListener('mousedown', function (e) {
//         e.stopPropagation();
//         const rect = imageElement.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;

//         function rotate(e) {
//             const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
//             rotation = (angle * (180 / Math.PI) + 90) % 360;
//             updateImagePosition();
//         }

//         function stopRotating() {
//             document.removeEventListener('mousemove', rotate);
//             document.removeEventListener('mouseup', stopRotating);
//         }

//         document.addEventListener('mousemove', rotate);
//         document.addEventListener('mouseup', stopRotating);
//     });
// }

// document.addEventListener('mousedown', (e) => {
//     if (!previewImage.contains(e.target)) {
//         previewImage.style.cursor = 'default';
//     }
// });

// // ===========================================
// // ============ADD TEXT BOX===================
// // ===========================================

// document.getElementById('afm-addTextBtn').addEventListener('click', function () {
//     document.getElementById('afm-textModal').style.display = 'block';
// });

// function closeTextModal() {
//     document.getElementById('afm-textModal').style.display = 'none';
// }

// document.getElementById('afm-addTextModalBtn').addEventListener('click', function () {
//     const text = document.getElementById('modalTextInput').value;
//     const textColor = document.getElementById('textColor').value;
//     const fontStyle = document.getElementById('fontStyleSelect').value;

//     if (text.trim() !== '') {
//         const textBox = document.createElement('div');
//         textBox.className = 'afm-text-box';
//         textBox.innerText = text;

//         textBox.style.position = 'absolute';
//         textBox.style.fontFamily = fontStyle;
//         textBox.style.color = textColor;
//         textBox.style.fontSize = '24px';
//         textBox.style.top = '50%';
//         textBox.style.left = '50%';
//         textBox.style.transform = 'translate(-50%, -50%)';
//         textBox.style.cursor = 'move';
//         textBox.style.border = 'none';
//         document.getElementById('uploadBox').appendChild(textBox);
        
//         makeDraggable(textBox, { resize: 'afm-resize-handle', rotate: 'afm-rotate-handle' });
//         makeResizable(textBox);
//         makeRotatable(textBox);
//         allTextData.push({
//             text: text,
//             color: textColor,
//             style: fontStyle,
//         });
//     }

//     closeTextModal();
// });

// function makeDraggable(element, handle) {
//     let isDragging = false;
//     let offsetX, offsetY;

//     element.addEventListener('mousedown', function (e) {
//         isDragging = true;
//         offsetX = e.clientX - element.offsetLeft;
//         offsetY = e.clientY - element.offsetTop;
//         element.style.cursor = 'grabbing';
//         element.style.border = '2px dashed #248EE6';

//         if (handle.resize) {
//             const resizeEl = element.querySelector(`.${handle.resize}`);
//             if (resizeEl) resizeEl.style.display = 'block';
//         }

//         if (handle.rotate) {
//             const rotateEl = element.querySelector(`.${handle.rotate}`);
//             if (rotateEl) rotateEl.style.display = 'block';
//         }
//     });

//     document.addEventListener('mousemove', function (e) {
//         if (isDragging) {
//             element.style.left = e.clientX - offsetX + 'px';
//             element.style.top = e.clientY - offsetY + 'px';
//         }
//     });

//     document.addEventListener('mouseup', function () {
//         isDragging = false;
//         element.style.cursor = 'move';
//     });

//     document.addEventListener('mousedown', function (e) {
//         if (!element.contains(e.target)) {
//             element.style.border = 'none';

//             if (handle.resize) {
//                 const resizeEl = element.querySelector(`.${handle.resize}`);
//                 if (resizeEl) resizeEl.style.display = 'none';
//             }

//             if (handle.rotate) {
//                 const rotateEl = element.querySelector(`.${handle.rotate}`);
//                 if (rotateEl) rotateEl.style.display = 'none';
//             }
//         }
//     });
// }


// function makeResizable(element) {
//     const resizeHandle = document.createElement('div');
//     resizeHandle.className = 'afm-resize-handle';
//     resizeHandle.style.position = 'absolute';
//     resizeHandle.style.right = '-11.3px';
//     resizeHandle.style.bottom = '-6.5px';
//     resizeHandle.style.fontSize = '24px';
//     resizeHandle.style.cursor = 'crosshair';
//     resizeHandle.innerText = '+';
//     resizeHandle.style.display = 'none';

//     element.appendChild(resizeHandle);

//     resizeHandle.addEventListener('mousedown', function (e) {
//         e.stopPropagation();
//         const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
//         const initialMouseX = e.clientX;

//         function resize(e) {
//             const scaleFactor = 0.2;
//             const newSize = initialFontSize + (e.clientX - initialMouseX) * scaleFactor;

//             if (newSize > 10) {
//                 element.style.fontSize = newSize + 'px';
//             }
//         }

//         function stopResizing() {
//             document.removeEventListener('mousemove', resize);
//             document.removeEventListener('mouseup', stopResizing);
//         }

//         document.addEventListener('mousemove', resize);
//         document.addEventListener('mouseup', stopResizing);
//     });
// }

// function makeRotatable(element) {
//     const rotateHandle = document.createElement('div');
//     rotateHandle.className = 'afm-rotate-handle';
//     rotateHandle.style.position = 'absolute';
//     rotateHandle.style.bottom = '40px';
//     rotateHandle.style.left = '50%';
//     rotateHandle.style.transform = 'translateX(-50%)';
//     rotateHandle.style.width = '20px';
//     rotateHandle.style.height = '20px';
//     rotateHandle.style.cursor = 'grab';
//     rotateHandle.innerText = '⭯';
//     rotateHandle.style.display = 'none';

//     element.appendChild(rotateHandle);

//     let isRotating = false;
//     let startAngle = 0;

//     rotateHandle.addEventListener('mousedown', function (e) {
//         e.stopPropagation();
//         isRotating = true;
//         const rect = element.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;

//         function rotate(e) {
//             if (isRotating) {
//                 const dx = e.clientX - centerX;
//                 const dy = e.clientY - centerY;
//                 const angle = Math.atan2(dy, dx) * (180 / Math.PI);
//                 element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
//             }
//         }

//         function stopRotating() {
//             isRotating = false;
//             document.removeEventListener('mousemove', rotate);
//             document.removeEventListener('mouseup', stopRotating);
//         }

//         document.addEventListener('mousemove', rotate);
//         document.addEventListener('mouseup', stopRotating);
//     });
// }

// function updatePreview() {
//     const text = document.getElementById('modalTextInput').value || 'Preview Text';

//     document.querySelectorAll('option').forEach(option => {
//         const font = option.value;
//         option.style.fontFamily = font;
//         option.textContent = `${text}`;
//     });
// }

// function changeFontFamily() {
//     const selectedFont = document.getElementById('fontStyleSelect').value;
//     const textInput = document.getElementById('fontStyleSelect');
//     textInput.style.fontFamily = selectedFont;
// }

// allSizeBtn.forEach(btn => {
//     btn.addEventListener('click', function () {
//         allSizeBtn.forEach(button => button.classList.remove('afm-active'));
//         this.classList.add('afm-active');
//     });
// });

// allThicknessBtn.forEach(btn => {
//     btn.addEventListener('click', function () {
//         allThicknessBtn.forEach(button => button.classList.remove('afm-active'));
//         this.classList.add('afm-active');
//     });
// });


// function getImageDetails() {
//     const previewImage = document.getElementById('afm-previewImage');
//     const selectedSize = document.querySelector('.afm-size-btn.afm-active');
//     const selectedThickness = document.querySelector('.afm-thickness-btn.afm-active');
//     const textElement = document.querySelectorAll('.text-box');
//     const size = selectedSize && selectedSize.dataset.ratio !== "default"
//         ? selectedSize.dataset.ratio
//         : "default";
//     if (!previewImage || !previewImage.src) {
//         console.error("No image uploaded.");
//         return null;
//     }

//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];

//     if (!file) {
//         console.error("No file selected.");
//         return null;
//     }

//     const imageDetails = {
//         image: {
//             name: file.name,
//             lastModified: file.lastModified,
//             lastModifiedDate: new Date(file.lastModifiedDate).toString(),
//             size: file.size,
//             type: file.type,
//         },
//         // width: previewImage.naturalWidth + 'px',
//         // height: previewImage.naturalHeight + 'px',
//         size: size,
//         name: `Acrylic Fridge Magnet (${size})`,
//         type: 'Acrylic Fridge Magnet',
//         price: 899,
//         thickness: selectedThickness ? selectedThickness.innerText : "default",
//         addedText: textElement ? allTextData : [],
//     };

//     return imageDetails;
// }

// function shareImage() {
//     return new Promise((resolve, reject) => {
//         html2canvas(uploadBox, { backgroundColor: null }).then((canvas) => {
//             canvas.toBlob((blob) => {
//                 if (!blob) {
//                     alert("Error: Failed to generate image!");
//                     reject("Failed to generate image");
//                     return;
//                 }

//                 const formData = new FormData();
//                 const now = new Date();
//                 const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-MM-SS
//                 const fileName = `customized-image-${formattedDate}.png`;

//                 const imageData = getImageDetails();
//                 formData.append('image', blob, fileName);
//                 formData.append('details', JSON.stringify(imageData));
//                 const subject = `Acrylic Fridge Magnet (${imageData.size || "default"})`;
//                 formData.append('subject', JSON.stringify(subject));
//                 resolve(formData);
//             });
//         }).catch(error => reject(error));
//     });
// }
// window.getImageDetails = getImageDetails;
// window.shareImage = shareImage;