
// const backgroundUrls = [
//     "https://static.remove.bg/backgrounds/product/art-artistic-background-1279813-size-156.jpg",
//     "https://static.remove.bg/backgrounds/person/Nature/background-clouds-colors-726330-size-156.jpg",
//     "https://static.remove.bg/backgrounds/product/antique-backdrop-background-164005-size-156.jpg",
//     "https://static.remove.bg/backgrounds/car/new/bg3-size-156.png",
//     "https://static.remove.bg/backgrounds/realestate/background-3104413_1920-size-156.jpg",
//     "https://static.remove.bg/backgrounds/person/Autumn/dawn-desktop-wallpaper-environment-2055389-size-156.jpg",
//     "https://static.remove.bg/backgrounds/person/Urban/architecture-building-business-2339009-size-156.jpg",
//     "https://static.remove.bg/backgrounds/person/new/pride_gradient-size-156.png",
//     "https://static.remove.bg/backgrounds/realestate/pexels-pixabay-531756-size-156.jpg",
//     "https://static.remove.bg/backgrounds/person/new/pexels-zaksheuskaya-1561020-size-156.jpg",
//     "https://i.pinimg.com/736x/d0/09/52/d00952ba351f7b7f0905a4a9465b6fc8.jpg",
//     "https://i.pinimg.com/736x/33/92/a6/3392a60bb7a4c4ec72f8bef181a9f556.jpg"
// ];

// const BASE_URL = window.BASE_URL;

// const imageContainer = document.querySelector('.ap-image-container');
// const previewImage = document.getElementById('previewImage');
// const fileInput = document.getElementById('fileInput');
// const widthInd = document.getElementById('width');
// const heightInd = document.getElementById('height');
// const shareBtn = document.getElementById('shareBtn');
// const cartBtn = document.getElementById('cartBtn');
// const zoomRange = document.getElementById('zoomRange');
// const removeBgBtn = document.getElementById('removeBgBtn');

// let scale = 1;
// let file;
// let isDragging = false;
// let currentX = 0;
// let currentY = 0;
// let initialX;
// let initialY;
// let xOffset = 0;
// let yOffset = 0;
// let isDraggingImage = false;
// const allTextData = [];


// function updateHandles() {
//     const wrapperRect = transformWrapper.getBoundingClientRect();
//     const editorRect = imageContainer.getBoundingClientRect();

//     const top = wrapperRect.top - editorRect.top;
//     const left = wrapperRect.left - editorRect.left;
//     const width = wrapperRect.width;
//     const height = wrapperRect.height;

//     const tlX = left;
//     const tlY = top;
//     const trX = left + width;
//     const trY = top;
//     const brX = left + width;
//     const brY = top + height;
//     const blX = left;
//     const blY = top + height;

//     // Position corner handles
//     document.querySelector('.ap-handle.tl').style.left = `${tlX}px`;
//     document.querySelector('.ap-handle.tl').style.top = `${tlY}px`;

//     document.querySelector('.ap-handle.tr').style.left = `${trX}px`;
//     document.querySelector('.ap-handle.tr').style.top = `${trY}px`;

//     document.querySelector('.ap-handle.br').style.left = `${brX}px`;
//     document.querySelector('.ap-handle.br').style.top = `${brY}px`;

//     document.querySelector('.ap-handle.bl').style.left = `${blX}px`;
//     document.querySelector('.ap-handle.bl').style.top = `${blY}px`;

//     // Update bounding box lines
//     document.getElementById('line-tl-tr').setAttribute('x1', tlX);
//     document.getElementById('line-tl-tr').setAttribute('y1', tlY);
//     document.getElementById('line-tl-tr').setAttribute('x2', trX);
//     document.getElementById('line-tl-tr').setAttribute('y2', trY);

//     document.getElementById('line-tr-br').setAttribute('x1', trX);
//     document.getElementById('line-tr-br').setAttribute('y1', trY);
//     document.getElementById('line-tr-br').setAttribute('x2', brX);
//     document.getElementById('line-tr-br').setAttribute('y2', brY);

//     document.getElementById('line-br-bl').setAttribute('x1', brX);
//     document.getElementById('line-br-bl').setAttribute('y1', brY);
//     document.getElementById('line-br-bl').setAttribute('x2', blX);
//     document.getElementById('line-br-bl').setAttribute('y2', blY);

//     document.getElementById('line-bl-tl').setAttribute('x1', blX);
//     document.getElementById('line-bl-tl').setAttribute('y1', blY);
//     document.getElementById('line-bl-tl').setAttribute('x2', tlX);
//     document.getElementById('line-bl-tl').setAttribute('y2', tlY);

//     // Position rotate handle (above the center of the top edge)
//     document.querySelector('.ap-handle.rotate').style.left = `${(tlX + trX) / 2}px`;
//     document.querySelector('.ap-handle.rotate').style.top = `${tlY - 40}px`;
// }

// // Initialize event listeners
// function initEventListeners() {

//     updateHandles();


//     imageContainer.addEventListener('click', function (e) {
//         e.stopPropagation();
//         imageContainer.classList.add('active');
//     });

//     // Add click handler to document
//     document.addEventListener('click', function (e) {
//         if (!imageContainer.contains(e.target)) {
//             imageContainer.classList.remove('active');
//         }
//     });

//     // Existing resize handlers
//     document.querySelectorAll('.ap-handle').forEach(handle => {
//         handle.addEventListener('mousedown', startResize);
//     });


//     // Image drag events (only on double click/tap)
//     imageContainer.addEventListener('mousedown', enableImageDrag);
//     imageContainer.addEventListener('touchstart', handleTouchStart, { passive: false });

//     // Mouse/touch move and end events
//     document.addEventListener('mousemove', handleDrag);
//     document.addEventListener('mouseup', disableImageDrag);
//     document.addEventListener('touchmove', handleTouchMove, { passive: false });
//     document.addEventListener('touchend', disableImageDrag);

//     // Other controls
//     zoomRange.addEventListener('input', handleZoom);
//     fileInput.addEventListener('change', handleFileSelect);
//     removeBgBtn.addEventListener('click', openBgModal);

//     // Shape buttons
//     document.querySelectorAll('.ap-shape-btn').forEach(btn => {
//         btn.addEventListener('click', handleShapeSelection);
//     });

//     // Color buttons
//     document.querySelectorAll('.ap-color-btn').forEach(btn => {
//         btn.addEventListener('click', handleColorSelection);
//     });

//     // Size buttons
//     document.querySelectorAll('.ap-size-btn').forEach(btn => {
//         btn.addEventListener('click', handleSizeSelection);
//     });

//     // Text controls
//     document.getElementById('addTextBtn').addEventListener('click', function () {
//         document.getElementById('textModal').style.display = 'block';
//     });

//     document.getElementById('addTextModalBtn').addEventListener('click', addTextFromModal);

//     initResizeHandlers();
// }

// {/* Update JavaScript */ }
// let isResizing = false;
// let handleDirection;
// let startX, startY;
// let initialScale;
// let initialDistance;
// let initialTransform;

// function initResizeHandlers() {
//     document.querySelectorAll('.ap-handle').forEach(handle => {
//         handle.addEventListener('mousedown', startResize);
//     });
// }

// function startResize(e) {
//     e.preventDefault();
//     isResizing = true;
//     handleDirection = e.target.dataset.handle;

//     const containerRect = imageContainer.getBoundingClientRect();
//     const centerX = containerRect.left + containerRect.width / 2;
//     const centerY = containerRect.top + containerRect.height / 2;

//     startX = e.clientX;
//     startY = e.clientY;
//     initialScale = scale;
//     initialDistance = Math.sqrt(
//         Math.pow(startX - centerX, 2) +
//         Math.pow(startY - centerY, 2)
//     );

//     document.addEventListener('mousemove', handleResize);
//     document.addEventListener('mouseup', stopResize);
// }

// function handleResize(e) {
//     if (!isResizing) return;

//     const containerRect = imageContainer.getBoundingClientRect();
//     const centerX = containerRect.left + containerRect.width / 2;
//     const centerY = containerRect.top + containerRect.height / 2;

//     const currentDistance = Math.sqrt(
//         Math.pow(e.clientX - centerX, 2) +
//         Math.pow(e.clientY - centerY, 2)
//     );

//     // Calculate scale based on distance from center
//     const scaleFactor = currentDistance / initialDistance;
//     scale = initialScale * scaleFactor;

//     // Constrain scale
//     scale = Math.max(0.1, Math.min(scale, 5));
//     zoomRange.value = scale;

//     updateImagePosition();
// }

// function stopResize() {
//     isResizing = false;
//     document.removeEventListener('mousemove', handleResize);
//     document.removeEventListener('mouseup', stopResize);
// }


// function enableImageDrag(e) {
//     if (e.target.closest('.ap-handle')) return;
//     if (e.button === 0) {

//         isDraggingImage = true;
//         initialX = e.clientX - xOffset;
//         initialY = e.clientY - yOffset;
//         imageContainer.style.cursor = 'grabbing';
//     }
// }

// function disableImageDrag() {
//     isDraggingImage = false;
//     imageContainer.style.cursor = 'default';
// }

// function handleDrag(e) {
//     if (!isDraggingImage) return;
//     e.preventDefault();
//     currentX = e.clientX - initialX;
//     currentY = e.clientY - initialY;
//     xOffset = currentX;
//     yOffset = currentY;
//     updateImagePosition();
// }

// // Handle touch start
// function handleTouchStart(e) {
//     // Check if this is a double tap (for image dragging)
//     if (e.touches.length === 1) {
//         const touch = e.touches[0];
//         const now = new Date().getTime();
//         const previousTouch = imageContainer.dataset.lastTouchTime || 0;

//         if (now - previousTouch < 300) { // Double tap detected
//             e.preventDefault();
//             isDraggingImage = true;
//             initialX = touch.clientX - xOffset;
//             initialY = touch.clientY - yOffset;
//             imageContainer.style.cursor = 'grabbing';
//         }
//         imageContainer.dataset.lastTouchTime = now;
//     }
// }

// // Handle touch move
// function handleTouchMove(e) {
//     if (isDraggingImage && e.touches.length === 1) {
//         e.preventDefault();
//         const touch = e.touches[0];
//         currentX = touch.clientX - initialX;
//         currentY = touch.clientY - initialY;
//         xOffset = currentX;
//         yOffset = currentY;
//         updateImagePosition();
//     }
// }

// // previewImage.style.transformOrigin = 'top left';

// // Update position and scale
// function updateImagePosition() {
//     previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
// }








const backgroundUrls = [
    "https://static.remove.bg/backgrounds/product/art-artistic-background-1279813-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Nature/background-clouds-colors-726330-size-156.jpg",
    "https://static.remove.bg/backgrounds/product/antique-backdrop-background-164005-size-156.jpg",
    "https://static.remove.bg/backgrounds/car/new/bg3-size-156.png",
    "https://static.remove.bg/backgrounds/realestate/background-3104413_1920-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Autumn/dawn-desktop-wallpaper-environment-2055389-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/Urban/architecture-building-business-2339009-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/new/pride_gradient-size-156.png",
    "https://static.remove.bg/backgrounds/realestate/pexels-pixabay-531756-size-156.jpg",
    "https://static.remove.bg/backgrounds/person/new/pexels-zaksheuskaya-1561020-size-156.jpg",
    "https://i.pinimg.com/736x/d0/09/52/d00952ba351f7b7f0905a4a9465b6fc8.jpg",
    "https://i.pinimg.com/736x/33/92/a6/3392a60bb7a4c4ec72f8bef181a9f556.jpg"
];

const BASE_URL = window.BASE_URL;

const imageContainer = document.querySelector('.ap-image-container');
const previewImage = document.getElementById('previewImage');
const transformWrapper = document.querySelector('.transform-wrapper');
const fileInput = document.getElementById('fileInput');
const widthInd = document.getElementById('width');
const heightInd = document.getElementById('height');
const shareBtn = document.getElementById('shareBtn');
const cartBtn = document.getElementById('cartBtn');
// const zoomRange = document.getElementById('zoomRange');
const removeBgBtn = document.getElementById('removeBgBtn');
const imgPre = document.querySelector('.img-pre');
const handles = document.querySelector(".handles")

let scale = 1;
let rotation = 0;
let isResizing = false;
let isRotating = false;
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let initialAngle = 0;
let initialScale = 1;
let initialDistance = 0;
let file;
let allTextData = [];
let currentX = 0;
let currentY = 0;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let isDraggingImage = false;

// Transformation functions
function updateTransform() {
    transformWrapper.style.transform = `
        translate(${offsetX}px, ${offsetY}px)
        scale(${scale})
        rotate(${rotation}deg)
    `;
    updateHandles();
}

function updateHandles() {
    const wrapperRect = transformWrapper.getBoundingClientRect();
    const editorRect = imageContainer.getBoundingClientRect();

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
    document.querySelector('.ap-handle.tl').style.left = `${tlX}px`;
    document.querySelector('.ap-handle.tl').style.top = `${tlY}px`;
    document.querySelector('.ap-handle.tr').style.left = `${trX}px`;
    document.querySelector('.ap-handle.tr').style.top = `${trY}px`;
    document.querySelector('.ap-handle.br').style.left = `${brX}px`;
    document.querySelector('.ap-handle.br').style.top = `${brY}px`;
    document.querySelector('.ap-handle.bl').style.left = `${blX}px`;
    document.querySelector('.ap-handle.bl').style.top = `${blY}px`;

    // Update bounding lines
    document.getElementById('line-tl-tr').setAttribute('x1', tlX);
    document.getElementById('line-tl-tr').setAttribute('y1', tlY);
    document.getElementById('line-tl-tr').setAttribute('x2', trX);
    document.getElementById('line-tl-tr').setAttribute('y2', trY);
    document.getElementById('line-tr-br').setAttribute('x1', trX);
    document.getElementById('line-tr-br').setAttribute('y1', trY);
    document.getElementById('line-tr-br').setAttribute('x2', brX);
    document.getElementById('line-tr-br').setAttribute('y2', brY);
    document.getElementById('line-br-bl').setAttribute('x1', brX);
    document.getElementById('line-br-bl').setAttribute('y1', brY);
    document.getElementById('line-br-bl').setAttribute('x2', blX);
    document.getElementById('line-br-bl').setAttribute('y2', blY);
    document.getElementById('line-bl-tl').setAttribute('x1', blX);
    document.getElementById('line-bl-tl').setAttribute('y1', blY);
    document.getElementById('line-bl-tl').setAttribute('x2', tlX);
    document.getElementById('line-bl-tl').setAttribute('y2', tlY);

    // Rotate handle
    document.querySelector('.ap-handle.rotate').style.left = `${(tlX + trX) / 2}px`;
    document.querySelector('.ap-handle.rotate').style.top = `${tlY - 40}px`;
}

// Event handlers
function initEventListeners() {
    previewImage.addEventListener('click', (e) => {
        console.log("H");

        e.stopPropagation();
        handles.style.display = "block";
    });

    document.addEventListener('click', (e) => {
        if (!previewImage.contains(e.target)) {
            handles.style.display = "none"
        }
    });

    transformWrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || e.target.classList.contains('ap-handle')) return;
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        transformWrapper.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            updateTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            transformWrapper.style.cursor = 'grab';
        }
    });

    document.querySelectorAll('.ap-handle').forEach(handle => {
        handle.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();

            const editorRect = imageContainer.getBoundingClientRect();
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
    });

    // Existing controls
    // zoomRange.addEventListener('input', handleZoom);
    fileInput.addEventListener('change', handleFileSelect);
    removeBgBtn.addEventListener('click', openBgModal);
    document.querySelectorAll('.ap-shape-btn').forEach(btn => {
        btn.addEventListener('click', handleShapeSelection);
    });
    document.querySelectorAll('.ap-color-btn').forEach(btn => {
        btn.addEventListener('click', handleColorSelection);
    });
    document.querySelectorAll('.ap-size-btn').forEach(btn => {
        btn.addEventListener('click', handleSizeSelection);
    });
    document.getElementById('addTextBtn').addEventListener('click', () => {
        document.getElementById('textModal').style.display = 'block';
    });
    document.getElementById('addTextModalBtn').addEventListener('click', addTextFromModal);
}

function onHandleMove(e) {
    if (isResizing) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const currentDistance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
        );

        const scaleFactor = currentDistance / initialDistance;
        scale = Math.max(0.1, initialScale * scaleFactor);
        // zoomRange.value = scale;
    }

    if (isRotating) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
    }

    updateTransform();
}

function onHandleUp() {
    isResizing = false;
    isRotating = false;
    document.removeEventListener('mousemove', onHandleMove);
    document.removeEventListener('mouseup', onHandleUp);
}


// Handle zoom
// function handleZoom() {
//     scale = parseFloat(zoomRange.value);
//     updateImagePosition();
// }

// Handle file selection
function handleFileSelect(e) {
    file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewImage.style.transform = 'translate(0px, 0px) scale(1)';
            offsetX = 0;
            offsetY = 0;
            currentX = 0;
            currentY = 0;
            scale = 1;
            // zoomRange.value = 1;
            updateImagePosition();
        };
        reader.readAsDataURL(file);
        shareBtn.style.display = "block";
    }
}

// Update position and scale
function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

// Handle shape selection
function handleShapeSelection() {
    document.querySelectorAll('.ap-shape-btn').forEach(button => button.classList.remove('ap-active'));
    this.classList.add('ap-active');
    const shape = this.dataset.shape;

    // Remove previous shape classes
    imageContainer.classList.remove(
        'ap-circle-shape', 'ap-square-shape', 'ap-oval-shape', 'ap-rect-shape',
        'ap-potrait-shape', 'ap-custom-shape', 'ap-custom2-shape', 'ap-custom3-shape', 'ap-custom4-shape'
    );
    imgPre.classList.remove(
        'ap-circle-shape', 'ap-square-shape', 'ap-oval-shape', 'ap-rect-shape',
        'ap-potrait-shape', 'ap-custom-shape', 'ap-custom2-shape', 'ap-custom3-shape', 'ap-custom4-shape'
    );

    // Add the selected shape class
    if (shape) {
        imageContainer.classList.add(`ap-${shape}-shape`);
        imgPre.classList.add(`ap-${shape}-shape`);
        updateHandles();
    }
}

// Handle color selection
function handleColorSelection() {
    const borderColor = this.style.border.split("groove ")[1] || "none";
    imageContainer.style.border = borderColor === "none" ? "none" : `10px solid ${borderColor}`;
    handles.style.top = borderColor === "none" ? "0px" : "-10px";
    handles.style.left = borderColor === "none" ? "0px" : "-10px";
    updateHandles();
}

function handleSizeSelection() {
    document.querySelectorAll('.ap-size-btn').forEach(button => button.classList.remove('ap-active'));
    this.classList.add('ap-active');
    const isMobile = window.innerWidth <= 768;

    // if (isMobile) return;

    const ratio = this.dataset.ratio.split('x');
    const aspectWidth = parseInt(ratio[0]);
    const aspectHeight = parseInt(ratio[1]);

    const pixelsPerInch = isMobile ? aspectWidth >= 20 ? 10 : 15 : aspectWidth >= 20 ? 15 : 20;

    // Calculate dimensions based on real-world size
    let width = aspectWidth * pixelsPerInch;
    let height = aspectHeight * pixelsPerInch;

    // Apply dimensions
    imageContainer.style.width = `${Math.round(width)}px`;
    imageContainer.style.height = `${Math.round(height)}px`;
    imageContainer.style.aspectRatio = `${aspectWidth}/${aspectHeight}`;

    // Update indicators
    widthInd.innerText = `Width ${aspectWidth} inch (${(aspectWidth * 2.54).toFixed(2)} cm)`;
    heightInd.innerText = `Height ${aspectHeight} inch (${(aspectHeight * 2.54).toFixed(2)} cm)`;
    updateHandles();
}

// Handle size selection
// function handleSizeSelection() {
//     document.querySelectorAll('.ap-size-btn').forEach(button => button.classList.remove('ap-active'));
//     this.classList.add('ap-active');
//     const isMobile = window.innerWidth <= 768; // Common mobile breakpoint

//     // If mobile, don't change any dimensions or indicators
//     if (isMobile) {
//         return;
//     }
//     const ratio = this.dataset.ratio.split('x');
//     const aspectWidth = ratio[0];
//     const aspectHeight = ratio[1];

//     // Keep fixed width on all screens
//     let width = 300;
//     let height = (width * aspectHeight) / aspectWidth;

//     // if (aspectWidth === "8" && aspectHeight === "12") {
//     //     imageContainer.style.width = '';
//     //     imageContainer.style.height = '';
//     //     widthInd.innerText = `Width 12 inch (30.48 cm)`;
//     //     heightInd.innerText = `Height 8 inch (22.86 cm)`;
//     // } else {
//     imageContainer.style.width = `${Math.round(width)}px`;
//     imageContainer.style.height = `${Math.round(height)}px`;
//     widthInd.innerText = `Width ${aspectWidth} inch (${aspectWidth * 2.54} cm)`;
//     heightInd.innerText = `Height ${aspectHeight} inch (${aspectHeight * 2.54} cm)`;
//     // }

//     // Shape button visibility logic
//     // if ((aspectWidth == 11 && aspectHeight == 11) || (aspectWidth == 16 && aspectHeight == 16)) {
//     //     document.querySelectorAll('.ap-shape-btn').forEach(button => {
//     //         if (button.classList.contains('oval') || button.classList.contains('potrait')) {
//     //             button.style.display = 'none';
//     //         } else {
//     //             button.style.display = 'inline-block';
//     //         }
//     //     });
//     // } else if (aspectWidth === "default" && aspectHeight === "default") {
//     //     document.querySelectorAll('.ap-shape-btn').forEach(button => {
//     //         button.style.display = 'inline-block';
//     //     });
//     // } else {
//     //     document.querySelectorAll('.ap-shape-btn').forEach(button => {
//     //         if (
//     //             button.classList.contains('potrait') ||
//     //             button.classList.contains('rect') ||
//     //             button.classList.contains('circle') ||
//     //             button.classList.contains('custom3') ||
//     //             button.classList.contains('custom4') ||
//     //             button.classList.contains('custom5')
//     //         ) {
//     //             button.style.display = 'none';
//     //         } else {
//     //             button.style.display = 'inline-block';
//     //         }
//     //     });
//     // }
// }

window.addEventListener('load', function () {
    document.querySelector('.ap-size-btn.ap-active').click();
});

// Background modal functions
function openBgModal() {
    const bgGallery = document.getElementById('bgGallery');
    bgGallery.innerHTML = '';

    backgroundUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Background Image';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => selectBackground(url));
        bgGallery.appendChild(img);
    });

    document.getElementById('bgModal').style.display = 'block';
}

function closeBgModal() {
    document.getElementById('bgModal').style.display = 'none';
}

async function selectBackground(selectedBgUrl) {
    const previewImage = document.getElementById('previewImage');
    await changeBackgroundAPI(selectedBgUrl, previewImage.src);
    closeBgModal();
}

async function changeBackgroundAPI(backgroundUrl, originalImageUrl) {
    try {
        const imageBlob = await fetch(originalImageUrl).then(res => res.blob());
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
            try {
                const response = await fetch(`${BASE_URL}/change-bg`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imageBlob: base64String,
                        backgroundUrl: backgroundUrl
                    })
                });

                const data = await response.json();

                if (data.success) {
                    const bufferData = new Uint8Array(data.rbgResultData.data);
                    const imageUrl = URL.createObjectURL(new Blob([bufferData], { type: 'image/png' }));
                    previewImage.src = imageUrl;
                } else {
                    console.error('Failed to remove background:', data.error);
                    alert('Failed to remove background');
                }
            } catch (error) {
                console.error('Error removing background:', error);
                alert('Failed to remove background');
            }
        };
        reader.readAsDataURL(imageBlob);
    } catch (error) {
        console.error('Error fetching image blob:', error);
        alert('Failed to fetch image blob');
    }
}

// Text functions
function addTextFromModal() {
    const text = document.getElementById('modalTextInput').value;
    const textColor = document.getElementById('textColor').value;
    const fontStyle = document.getElementById('fontStyleSelect').value;

    if (text.trim() !== '') {
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
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
        textBox.style.zIndex = '1000';

        imageContainer.appendChild(textBox);

        allTextData.push({
            text: text,
            color: textColor,
            style: fontStyle,
        });

        makeTextDraggable(textBox);
        makeTextResizable(textBox);
        makeTextRotatable(textBox);

        // Clear the input
        document.getElementById('modalTextInput').value = '';
    }
    closeTextModal();
}

function closeTextModal() {
    document.getElementById('textModal').style.display = 'none';
}

function makeTextDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;

    // Mouse down event
    element.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        isDragging = true;

        // Get current position
        const rect = element.getBoundingClientRect();
        const containerRect = imageContainer.getBoundingClientRect();

        // Calculate position relative to container
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Store initial position relative to container
        startX = rect.left - containerRect.left;
        startY = rect.top - containerRect.top;

        element.style.cursor = 'grabbing';
        element.style.border = '2px dashed #248EE6';

        // Show handles
        const resizeHandle = element.querySelector('.resize-handle');
        const rotateHandle = element.querySelector('.rotate-handle');
        if (resizeHandle) resizeHandle.style.display = 'block';
        if (rotateHandle) rotateHandle.style.display = 'block';
    });

    // Touch start event
    element.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        if (e.touches.length === 1) {
            isDragging = true;
            const touch = e.touches[0];

            // Get current position
            const rect = element.getBoundingClientRect();
            const containerRect = imageContainer.getBoundingClientRect();

            // Calculate position relative to container
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;

            // Store initial position relative to container
            startX = rect.left - containerRect.left;
            startY = rect.top - containerRect.top;

            element.style.cursor = 'grabbing';
            element.style.border = '2px dashed #248EE6';

            // Show handles
            const resizeHandle = element.querySelector('.resize-handle');
            const rotateHandle = element.querySelector('.rotate-handle');
            if (resizeHandle) resizeHandle.style.display = 'block';
            if (rotateHandle) rotateHandle.style.display = 'block';
        }
    }, { passive: false });

    // Mouse move event
    const handleMove = function (e) {
        if (isDragging) {
            e.preventDefault();

            // Calculate new position relative to container
            const containerRect = imageContainer.getBoundingClientRect();
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

            // Remove any translate transform
            element.style.transform = element.style.transform.replace(/translate\(.*?\)/, '');
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
            const resizeHandle = element.querySelector('.resize-handle');
            const rotateHandle = element.querySelector('.rotate-handle');
            if (resizeHandle) resizeHandle.style.display = 'none';
            if (rotateHandle) rotateHandle.style.display = 'none';
        }
    });
}

function makeTextResizable(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '-11.3px';
    resizeHandle.style.bottom = '-6.5px';
    resizeHandle.style.fontSize = '24px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.innerText = '+';
    resizeHandle.style.display = 'none';

    element.appendChild(resizeHandle);

    let isResizing = false;
    let startSize, startX, startY;

    resizeHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
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
    rotateHandle.className = 'rotate-handle';
    rotateHandle.style.position = 'absolute';
    rotateHandle.style.top = '-30px';
    rotateHandle.style.left = '50%';
    rotateHandle.style.transform = 'translateX(-50%)';
    rotateHandle.style.cursor = 'pointer';
    rotateHandle.style.fontSize = '24px';
    rotateHandle.innerHTML = '&#8635;';
    rotateHandle.style.display = 'none';

    element.appendChild(rotateHandle);

    let isRotating = false;
    let startAngle, centerX, centerY;

    rotateHandle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
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
            element.style.transform = element.style.transform.replace(/rotate\(.*?\)/, '') + ` rotate(${rotation}deg)`;
        }
    }

    function handleTouchRotate(e) {
        if (isRotating && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
            const rotation = angle - startAngle;
            element.style.transform = element.style.transform.replace(/rotate\(.*?\)/, '') + ` rotate(${rotation}deg)`;
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

// Get image details for sharing
function getImageDetails() {
    const selectedShape = document.querySelector('.ap-shape-btn.ap-active');
    const selectedSize = document.querySelector('.ap-size-btn.ap-active');
    const size = selectedSize && selectedSize.dataset.ratio !== "default"
        ? selectedSize.dataset.ratio
        : "default";

    return {
        type: 'Acrylic Photo',
        image: file ? {
            name: file.name,
            size: file.size,
            type: file.type
        } : null,
        name: `Acrylic Photo (${size})`,
        price: 599,
        width: imageContainer.offsetWidth + 'px',
        height: imageContainer.offsetHeight + 'px',
        border: imageContainer.style.border || 'none',
        shape: selectedShape ? selectedShape.dataset.shape : 'default',
        size: size,
        addedText: allTextData,
    };
}

// Share image function
function shareImage() {
    return new Promise((resolve, reject) => {
        // Create a clone of the container with all styles
        const clone = imageContainer.cloneNode(true);
        clone.style.visibility = 'hidden';
        clone.style.position = 'absolute';
        clone.style.top = '0';
        clone.style.left = '0';
        document.body.appendChild(clone);

        // Copy all computed styles from original to clone
        const originalElements = imageContainer.querySelectorAll('*');
        const clonedElements = clone.querySelectorAll('*');

        originalElements.forEach((original, index) => {
            if (clonedElements[index]) {
                const computedStyle = window.getComputedStyle(original);
                Array.from(computedStyle).forEach(prop => {
                    clonedElements[index].style.setProperty(
                        prop,
                        computedStyle.getPropertyValue(prop),
                        computedStyle.getPropertyPriority(prop)
                    );

                    // Special handling for text elements
                    if (original.classList.contains('text-box')) {
                        const rect = original.getBoundingClientRect();
                        const parentRect = imageContainer.getBoundingClientRect();

                        clonedElements[index].style.position = 'absolute';
                        clonedElements[index].style.left = `${rect.left - parentRect.left}px`;
                        clonedElements[index].style.top = `${rect.top - parentRect.top}px`;
                        clonedElements[index].style.transform = original.style.transform || '';
                        clonedElements[index].style.zIndex = '1000';
                    }

                    // Handle the main preview image
                    if (original.id === 'previewImage') {
                        clonedElements[index].style.transform = original.style.transform;
                    }
                });
            }
        });

        // Force layout recalculation
        clone.offsetHeight;

        html2canvas(clone, {
            backgroundColor: null,
            scale: 2,
            allowTaint: true,
            useCORS: true,
            logging: false,
            onclone: (document, element) => {
                // Make sure all elements are visible
                element.querySelectorAll('*').forEach(el => {
                    el.style.visibility = 'visible';
                    el.style.display = 'block';
                });
            }
        }).then(canvas => {
            document.body.removeChild(clone);

            canvas.toBlob(blob => {
                if (!blob) {
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
                const subject = `Acrylic Photo Order - ${formattedDate}`;
                formData.append('subject', JSON.stringify(subject));

                resolve(formData);
            });
        }).catch(error => {
            document.body.removeChild(clone);
            reject(error);
        });
    });
}

// Initialize the app
window.closeBgModal = closeBgModal;
window.closeTextModal = closeTextModal;
window.getImageDetails = getImageDetails;
window.shareImage = shareImage;

// Start the application
initEventListeners();