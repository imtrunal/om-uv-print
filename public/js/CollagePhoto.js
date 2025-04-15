const textInput = document.getElementById('acol-textInput');
const addTextBtn = document.getElementById('acol-addTextBtn');
const deleteTextBtn = document.getElementById('acol-deleteTextBtn');
const resteBtn = document.getElementById('acol-reset');
const allSizeBtn = document.querySelectorAll('.acol-size-btn');
const allThicknessBtn = document.querySelectorAll('.acol-thickness-btn');
// const downloadBtn = document.getElementById('acol-downloadBtn');
const cartBtn = document.getElementById('cartBtn');
const collagePhoto = document.querySelector('.acol-collage-frame');
const iminus = document.getElementById('acol-iminus');
const iplus = document.getElementById('acol-iplus');
const fontFamilyOptions = document.getElementById('acol-fontStyleSelect');
let uploadedImagesCount = 0;
let totalImages = 0;
let activeTextBox = null;
const shareBtn = document.getElementById('acol-shareBtn');
const handles = document.querySelectorAll(".acol-resize, .acol-rotate");
const textModal = document.querySelector('.acol-textModal');
const BASE_URL = window.BASE_URL;
let activeImage = null;
let scale = 1;
let rotation = 0;
let currentX = 0, currentY = 0;
const allTextData = [];


document.querySelectorAll(".acol-small-img, .acol-big-img").forEach((slot) => {
    totalImages = document.querySelectorAll(".acol-small-img, .acol-big-img").length;

    const input = slot.querySelector("input");
    const placeholder = slot.querySelector("p");
    const previewImage = slot.querySelector("img");

    slot.addEventListener("click", () => {
        input.click();
    });

    input.addEventListener("change", () => {
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
    });

    previewImage.addEventListener("click", () => {
        setActiveImage(previewImage);
    });

});

function incrementUploadedImages() {
    uploadedImagesCount++;
    if (totalImages === uploadedImagesCount) {
        // downloadBtn.style.display = "block";
        shareBtn.style.display = "block";
        cartBtn.style.display = 'block';
    }
}

function setActiveImage(imageElement) {
    removeExistingHandles();
    makeDraggable(imageElement, { resize: 'acol-resize', rotate: 'acol-rotate' });
    // addResizeHandle(imageElement);
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

const zoomRange = document.getElementById('acol-zoomRange');

zoomRange.addEventListener('input', function () {
    scale = parseFloat(zoomRange.value);
    updateImagePosition();
});

function updateImagePosition() {
    if (activeImage) {
        // Update transform
        activeImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;

        // Store transform in dataset
        activeImage.dataset.scale = scale;
        activeImage.dataset.rotation = rotation;
        activeImage.dataset.x = currentX;
        activeImage.dataset.y = currentY;
    }
}



// function addResizeHandle(imageElement) {
//     const resizeHandle = document.createElement('div');
//     resizeHandle.className = 'acol-resize';
//     resizeHandle.innerText = '+';

//     // Ensure parent has relative positioning
//     const container = imageElement.parentElement;
//     container.style.position = 'relative';
//     container.appendChild(resizeHandle);

//     // TAILWIND FIX: Override Tailwind styles that block resizing
//     Object.assign(imageElement.style, {
//         maxWidth: 'none',
//         width: imageElement.offsetWidth + 'px',
//         boxSizing: 'content-box',
//         transition: 'none',
//     });

//     // Style the handle (no Tailwind conflict)
//     Object.assign(resizeHandle.style, {
//         position: 'absolute',
//         right: '10px',
//         bottom: '10px',
//         cursor: 'nwse-resize',
//         fontWeight: 'bold',
//         fontSize: '1.5rem',
//         color: 'blue',
//         backgroundColor: 'transparent',
//         zIndex: 10,
//         userSelect: 'none',
//     });

//     resizeHandle.addEventListener('mousedown', function (e) {
//         e.stopPropagation();
//         const initialWidth = imageElement.offsetWidth;
//         const initialMouseX = e.clientX;

//         function resize(e) {
//             const newWidth = initialWidth + (e.clientX - initialMouseX);
//             imageElement.style.width = newWidth + 'px';
//         }

//         function stopResizing() {
//             document.removeEventListener('mousemove', resize);
//             document.removeEventListener('mouseup', stopResizing);
//         }

//         document.addEventListener('mousemove', resize);
//         document.addEventListener('mouseup', stopResizing);
//     });
// }


function addRotateHandle(imageElement) {
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'acol-rotate';
    rotateHandle.innerHTML = '&#8635;';

    collagePhoto.style.position = 'relative';
    collagePhoto.appendChild(rotateHandle);

    rotateHandle.addEventListener('mousedown', function (e) {
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
    });
}


//=======================================================
// Add text functionality
//=======================================================

function updatePreview() {
    if (activeTextBox) {
        const text = document.getElementById('acol-textInput').value || 'New Custom Text';
        const textColor = document.getElementById('acol-textColor').value;

        activeTextBox.innerText = text;
        activeTextBox.style.color = textColor;
        attachHandles(activeTextBox);
        // document.querySelectorAll('option').forEach(option => {
        //     option.textContent = `${text}`;
        // });
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

        resizeHandle.addEventListener('mousedown', function (e) {
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
        });
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

        rotateHandle.addEventListener('mousedown', function (e) {
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
        });
    }
}

function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0, startX, startY;
    let rotation = 0;

    element.addEventListener('click', function () {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle) resizeHandle.style.display = 'block';
        if (rotateHandle) rotateHandle.style.display = 'block';

        element.style.border = '2px dashed #248EE6';
    });

    element.addEventListener('mousedown', function (e) {
        const resizeHandle = document.querySelector(`.${handle.resize}`);
        const rotateHandle = document.querySelector(`.${handle.rotate}`);

        if (resizeHandle) resizeHandle.style.display = 'block';
        if (rotateHandle) rotateHandle.style.display = 'block';

        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        element.style.cursor = 'grabbing';

        // Get current rotation from transform
        const transform = window.getComputedStyle(element).transform;
        if (transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI); // Convert radians to degrees
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;

        // Preserve rotation while dragging
        element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'move';

            // Save new position
            currentX = offsetX;
            currentY = offsetY;

            if (activeImage) {
                activeImage.dataset.x = currentX;
                activeImage.dataset.y = currentY;
            }
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';

            const resizeHandle = document.querySelector(`.${handle.resize}`);
            const rotateHandle = document.querySelector(`.${handle.rotate}`);

            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
        }
    });
}

addTextBtn.addEventListener('click', function () {
    textModal.style.display = 'flex';
    fontFamilyOptions.style.display = 'block';

    const textColor = document.getElementById('acol-textColor').value;
    const newTextBox = document.createElement('div');
    newTextBox.className = 'acol-text-box';
    newTextBox.innerText = 'New Custom Text';
    newTextBox.style.color = textColor;
    
    // ONLY ADD THESE 4 LINES TO FIX OVERFLOW
    newTextBox.style.wordBreak = 'break-word';
    newTextBox.style.whiteSpace = 'pre-wrap';
    newTextBox.style.overflow = 'hidden';
    newTextBox.style.maxWidth = '100%';

    document.querySelector('.acol-collage-frame').appendChild(newTextBox);

    attachHandles(newTextBox);
    makeDraggable(newTextBox, { resize: 'acol-resize-handle', rotate: 'acol-rotate-handle' });

    // Update activeTextBox reference to the new one
    activeTextBox = newTextBox;
});


deleteTextBtn.addEventListener('click', function () {
    const previewText = document.querySelector('.acol-text-box.preview');
    if (previewText) previewText.remove();
    document.getElementById('acol-textInput').value = '';
    if (activeTextBox) {
        activeTextBox.remove();
        activeTextBox = null;
        document.getElementById('acol-textInput').value = '';
    }
    textModal.style.display = 'none';
    fontFamilyOptions.style.display = 'none';
    document.getElementById('acol-textColor').value = "#000000";
});

allSizeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('acol-active'));
        this.classList.add('acol-active');
    });
});

allThicknessBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allThicknessBtn.forEach(button => button.classList.remove('acol-active'));
        this.classList.add('acol-active');
    });
});

// downloadBtn.addEventListener('click', () => {
//     html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
//         const link = document.createElement('a');
//         link.download = 'customized-image.png';
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//     });
// });

iminus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize - 5) + 'px';
        attachHandles(activeTextBox);
    }
});

iplus.addEventListener('click', function () {
    if (activeTextBox) {
        const currentFontSize = parseInt(window.getComputedStyle(activeTextBox).fontSize);
        activeTextBox.style.fontSize = (currentFontSize + 5) + 'px';
        attachHandles(activeTextBox);
    }
});

function changeFontFamily() {
    const selectedFont = document.getElementById('acol-fontStyleSelect').value;
    if (activeTextBox) {
        activeTextBox.style.fontFamily = selectedFont;
    }
}

resteBtn.addEventListener('click', () => {
    location.reload();
});


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


// document.getElementById('acol-shareBtn').addEventListener('click', () => {
//     const shareBtn = document.getElementById('shareBtn');
//     if (!imageContainer) {
//         alert("Error: Image container not found!");
//         return;
//     }

//     shareBtn.disabled = true;
//     alert("Processing... Please wait!");
//     document.querySelectorAll('.acol-resize-handle, .acol-rotate-handle').forEach(handle => {
//         handle.style.display = 'none';
//     });

//     html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
//         canvas.toBlob((blob) => {
//             const formData = new FormData();
//             const now = new Date();
//             const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-MM-SS
//             const fileName = `customized-image-${formattedDate}.png`;

//             const imageData = getImageDetails();
//             formData.append('image', blob, fileName);
//             formData.append('details', JSON.stringify(imageData));
//             const subject = `Collage Acrylic Photo Order - ${formattedDate}`;
//             formData.append('subject', JSON.stringify(subject));

//             fetch(`${BASE_URL}/send-email`, {
//                 method: 'POST',
//                 body: formData
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     alert(data.message);
//                 })
//                 .catch(error => {
//                     alert('Error: ' + error.message);
//                 }).finally(() => {
//                     shareBtn.disabled = false;
//                 });
//         });
//     });
// });

function shareImage() {
    return new Promise((resolve, reject) => {
        html2canvas(collagePhoto, { backgroundColor: null }).then((canvas) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("Error: Failed to generate image!");
                    reject("Failed to generate image");
                    return;
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
            });
        }).catch(error => reject(error));
    });
}

window.updatePreview = updatePreview;
window.changeFontFamily = changeFontFamily;
window.getImageDetails = getImageDetails;
window.shareImage = shareImage;