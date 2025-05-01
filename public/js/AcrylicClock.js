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

// const imageContainer = document.querySelector('.image-container');
// const previewImage = document.getElementById('previewImage');
// const fileInput = document.getElementById('fileInput');
// const widthInd = document.getElementById('width');
// const heightInd = document.getElementById('height');
// const zoomRange = document.getElementById('zoomRange');
// const removeBgBtn = document.getElementById('removeBgBtn');
// removeBgBtn.addEventListener('click', openBgModal);
// imageContainer.addEventListener('dblclick', dragStart);
// imageContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
// imageContainer.addEventListener('mousemove', drag);
// imageContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
// document.addEventListener('mouseup', dragEnd);
// document.addEventListener('touchend', dragEnd)
// const allShapeBtn = document.querySelectorAll('.shape-btn');
// const cartBtn = document.getElementById('cartBtn');
// const shareBtn = document.getElementById('shareBtn');
// const imgPre = document.querySelector(".img-pre");
// const handles = document.querySelector(".handles");
// const transformWrapper = document.getElementById('transformWrapper');
// const clockFace = document.querySelector('.clock-face');
// const allSizeBtn = document.querySelectorAll('.size-btn');
// const BASE_URL = window.BASE_URL;
// let activeClock = {};
// let clockNumbersStyle;

// let isDragging = false;
// let currentX = 0;
// let currentY = 0;
// let initialX;
// let initialY;
// let xOffset = 0;
// let yOffset = 0;
// let scale = 1;
// let rotation = 0;
// let isResizing = false;
// let isRotating = false;
// let offsetX = 0, offsetY = 0;
// let startX, startY;
// let initialAngle = 0;
// let initialDistance = 0;


// console.log(previewImage);


// function initEventListeners() {
//     console.log("INIT EVENT LISTENERS");
//     updateHandles();

//     previewImage.addEventListener('click', (e) => {
//         e.stopPropagation();
//         handles.style.display = "block";
//     });
//     clockFace.addEventListener('click', (e) => {
//         e.stopPropagation();
//         handles.style.display = "block";
//     });

//     document.addEventListener('click', (e) => {
//         if (!previewImage.contains(e.target)) {
//             handles.style.display = "none";
//         }
//     });
// }


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

//     // Position handles
//     document.querySelector('.handle.tl').style.left = `${tlX}px`;
//     document.querySelector('.handle.tl').style.top = `${tlY}px`;
//     document.querySelector('.handle.tr').style.left = `${trX}px`;
//     document.querySelector('.handle.tr').style.top = `${trY}px`;
//     document.querySelector('.handle.br').style.left = `${brX}px`;
//     document.querySelector('.handle.br').style.top = `${brY}px`;
//     document.querySelector('.handle.bl').style.left = `${blX}px`;
//     document.querySelector('.handle.bl').style.top = `${blY}px`;

//     // Update bounding lines
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

//     // Rotate handle
//     document.querySelector('.handle.rotate').style.left = `${(tlX + trX) / 2}px`;
//     document.querySelector('.handle.rotate').style.top = `${tlY - 20}px`;
// }

// fileInput.addEventListener('change', function (e) {
//     const file = e.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             previewImage.src = e.target.result;
//             previewImage.style.display = 'block';
//             previewImage.style.transform = 'translate(0px, 0px) scale(1)';
//         };
//         reader.readAsDataURL(file);
//         zoomRange.value = 1;
//         updateHandles();
//         shareBtn.style.display = 'block';
//         // cartBtn.style.display = 'block';
//     }

// });


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


const allShapeBtn = document.querySelectorAll('.shape-btn');
const cartBtn = document.getElementById('cartBtn');
const shareBtn = document.getElementById('shareBtn');
const imgPre = document.querySelector(".img-pre");
const handles = document.querySelector(".handles");
const transformWrapper = document.getElementById('transformWrapper');
const clockFace = document.querySelector('.clock-face');
const allSizeBtn = document.querySelectorAll('.size-btn');
const imageContainer = document.querySelector('.image-container');
const previewImage = document.getElementById('previewImage');
const fileInput = document.getElementById('fileInput');
const widthInd = document.getElementById('width');
const heightInd = document.getElementById('height');
// const zoomRange = document.getElementById('zoomRange');
const removeBgBtn = document.getElementById('removeBgBtn');
const BASE_URL = window.BASE_URL;

let scale = 1;
let rotation = 0;
let isDragging = false;
let isResizing = false;
let isRotating = false;
let offsetX = 0, offsetY = 0;
let startX, startY;
let initialAngle = 0;
let initialDistance = 0;
let activeClock = {};
let clockNumbersStyle;
let initialScale = 1;
let file;
let allTextData = [];
let currentX = 0;
let currentY = 0;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let isDraggingImage = false;
let initialTouchDistance = 0;
let initialTouchScale = 1;


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

    // Get the original dimensions before transform
    const originalWidth = transformWrapper.offsetWidth;
    const originalHeight = transformWrapper.offsetHeight;

    // Calculate the center point (accounts for current translation)
    const centerX = wrapperRect.left + wrapperRect.width / 2 - editorRect.left;
    const centerY = wrapperRect.top + wrapperRect.height / 2 - editorRect.top;

    // Calculate half dimensions (scaled)
    const halfWidth = (originalWidth * scale) / 2;
    const halfHeight = (originalHeight * scale) / 2;

    // Apply rotation to corner points
    const angleRad = rotation * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Calculate exact edge positions (accounting for scale and rotation)
    const tlX = centerX + (-halfWidth * cos - (-halfHeight) * sin);
    const tlY = centerY + (-halfWidth * sin + (-halfHeight) * cos);

    const trX = centerX + (halfWidth * cos - (-halfHeight) * sin);
    const trY = centerY + (halfWidth * sin + (-halfHeight) * cos);

    const brX = centerX + (halfWidth * cos - halfHeight * sin);
    const brY = centerY + (halfWidth * sin + halfHeight * cos);

    const blX = centerX + (-halfWidth * cos - halfHeight * sin);
    const blY = centerY + (-halfWidth * sin + halfHeight * cos);

    // Position handles with pixel-perfect precision
    document.querySelectorAll('.handle').forEach(handle => {
        handle.style.transform = 'translate(-50%, -50%)'; // Center the handles
    });

    document.querySelector('.handle.tl').style.left = `${tlX}px`;
    document.querySelector('.handle.tl').style.top = `${tlY}px`;
    document.querySelector('.handle.tr').style.left = `${trX}px`;
    document.querySelector('.handle.tr').style.top = `${trY}px`;
    document.querySelector('.handle.br').style.left = `${brX}px`;
    document.querySelector('.handle.br').style.top = `${brY}px`;
    document.querySelector('.handle.bl').style.left = `${blX}px`;
    document.querySelector('.handle.bl').style.top = `${blY}px`;

    // Update bounding lines with sub-pixel precision
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

    // Position rotate handle with exact alignment
    const rotateHandleDistance = 20 * scale;
    const rotateX = centerX + (0 * cos - (-halfHeight - rotateHandleDistance) * sin);
    const rotateY = centerY + (0 * sin + (-halfHeight - rotateHandleDistance) * cos);

    document.querySelector('.handle.rotate').style.left = `${rotateX}px`;
    document.querySelector('.handle.rotate').style.top = `${rotateY}px`;
}

// Event handlers
function initEventListeners() {
    previewImage.addEventListener('click', (e) => {
        e.stopPropagation();
        handles.style.display = "block";
        updateHandles();
    });
    clockFace.addEventListener('click', (e) => {
        e.stopPropagation();
        handles.style.display = "block";
        updateHandles();
    });

    document.addEventListener('click', (e) => {
        if (!previewImage.contains(e.target)) {
            handles.style.display = "none";
        }
    });

    // Mouse events
    [clockFace, transformWrapper, previewImage,].map(el => {
        if (!el) return;
        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.classList.contains('handle')) return;
            isDragging = true;
            startX = e.clientX - offsetX;
            startY = e.clientY - offsetY;
            el.style.cursor = 'grabbing';
            e.preventDefault();
        });
    })

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

    // Touch events
    [transformWrapper, previewImage, clockFace].map(el => {
        if (!el) return;
        el.addEventListener('touchstart', (e) => {
            handles.style.display = "block";
            updateHandles();
            if (e.touches.length !== 1 || e.target.classList.contains('handle')) return;
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX - offsetX;
            startY = touch.clientY - offsetY;
            el.style.cursor = 'grabbing';
            e.preventDefault();
        }, { passive: false });
    });

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
            [transformWrapper, previewImage, clockFace].map(el => {
                if (!el) return;
                el.style.cursor = 'grab';
            })
        }
    });

    // Handle events
    document.querySelectorAll('.handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const editorRect = imageContainer.getBoundingClientRect();
            const wrapperRect = transformWrapper.getBoundingClientRect();

            // Get center point relative to container
            const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
            const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

            if (handle.classList.contains('rotate')) {
                isRotating = true;
                initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) - rotation;
            } else {
                isResizing = true;
                // Get initial distance from center to mouse position
                initialDistance = Math.sqrt(
                    Math.pow(e.clientX - centerX, 2) +
                    Math.pow(e.clientY - centerY, 2)
                );
                initialScale = scale;
            }

            startX = e.clientX;
            startY = e.clientY;
            document.addEventListener('mousemove', onHandleMove);
            document.addEventListener('mouseup', onHandleUp);
        });

        handle.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            e.preventDefault();
            const editorRect = imageContainer.getBoundingClientRect();
            const wrapperRect = transformWrapper.getBoundingClientRect();
            const touch = e.touches[0];

            // Get center point relative to container
            const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
            const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

            if (handle.classList.contains('rotate')) {
                isRotating = true;
                initialAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI) - rotation;
            } else {
                isResizing = true;
                // Get initial distance from center to touch position
                initialDistance = Math.sqrt(
                    Math.pow(touch.clientX - centerX, 2) +
                    Math.pow(touch.clientY - centerY, 2)
                );
                initialScale = scale;
            }

            startX = touch.clientX;
            startY = touch.clientY;
            document.addEventListener('touchmove', onTouchHandleMove, { passive: false });
            document.addEventListener('touchend', onHandleUp);
        });
    });
}

// Handle movement functions
function onHandleMove(e) {
    if (isResizing) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();

        // Get center point relative to container
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        // Calculate current distance from center to mouse
        const currentDistance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
        );

        // Calculate scale based on distance ratio
        scale = initialScale * (currentDistance / initialDistance);
        scale = Math.max(0.5, Math.min(scale, 3)); // Limit scale range
        // zoomRange.value = scale;
        updateTransform();
    }

    if (isRotating) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();

        // Get center point relative to container
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        // Calculate rotation angle
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
        updateTransform();
    }
}

function onTouchHandleMove(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (isResizing) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();

        // Get center point relative to container
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        // Calculate current distance from center to touch
        const currentDistance = Math.sqrt(
            Math.pow(touch.clientX - centerX, 2) +
            Math.pow(touch.clientY - centerY, 2)
        );

        // Calculate scale based on distance ratio
        scale = initialScale * (currentDistance / initialDistance);
        scale = Math.max(0.5, Math.min(scale, 3)); // Limit scale range
        // zoomRange.value = scale;
        updateTransform();
    }

    if (isRotating) {
        const editorRect = imageContainer.getBoundingClientRect();
        const wrapperRect = transformWrapper.getBoundingClientRect();

        // Get center point relative to container
        const centerX = editorRect.left + (wrapperRect.left - editorRect.left + wrapperRect.width / 2);
        const centerY = editorRect.top + (wrapperRect.top - editorRect.top + wrapperRect.height / 2);

        // Calculate rotation angle
        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
        rotation = angle - initialAngle;
        updateTransform();
    }
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


// File input handling
fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            scale = 1;
            rotation = 0;
            offsetX = 0;
            offsetY = 0;
            currentX = 0;
            currentY = 0;
            xOffset = 0;
            yOffset = 0;
            updateTransform();

        };
        reader.readAsDataURL(file);
        // zoomRange.value = 1;
    }
});

// Zoom control
// zoomRange.addEventListener('input', function () {
//     scale = parseFloat(this.value);
//     updateTransform();
// });


allShapeBtn.forEach(btn => {

    btn.addEventListener('click', function () {
        allShapeBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        const shape = this.dataset.shape;
        imageContainer.classList.remove(
            'circle-shape', 'square-shape', 'custom2-shape',
            'custom3-shape', 'custom4-shape'
        );
        imgPre.classList.remove('circle-shape', 'square-shape', 'custom2-shape', 'custom3-shape', 'custom4-shape');
        if (shape) {
            imageContainer.classList.add(`${shape}-shape`)
            imgPre.classList.add(`${shape}-shape`)
            console.log(imgPre);
            createClockNumbers();
        }
        if (activeClock.selectedClock && activeClock.type) {
            activateClock(activeClock.selectedClock, activeClock.type);
        }
    });
});

function dragStart(e) {
    if (!isDragging) {
        isDragging = true;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const now = new Date().getTime();
        const previousTouch = imageContainer.dataset.lastTouchTime || 0;

        if (now - previousTouch < 300) { // Double tap detected
            if (!isDragging) {
                isDragging = true;
                const touch = e.touches[0];
                initialX = touch.clientX - xOffset;
                initialY = touch.clientY - yOffset;
                e.preventDefault(); // Prevent scrolling
            }
        }
        imageContainer.dataset.lastTouchTime = now;
    }

}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        updatePosition();
    }
}

function handleTouchMove(e) {
    if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        currentX = touch.clientX - initialX;
        currentY = touch.clientY - initialY;
        updatePosition();
    }
}

function updatePosition() {
    xOffset = currentX;
    yOffset = currentY;
    updateImagePosition();
}

function dragEnd() {
    isDragging = false;
}

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

// zoomRange.addEventListener('input', function () {
//     scale = parseFloat(zoomRange.value);
//     updateImagePosition();
// });

document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('active'));
        this.classList.add('active');
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            return;
        }

        // const ratio = this.dataset.ratio.split('x');
        // const aspectWidth = ratio[0];
        // const aspectHeight = ratio[1];

        // let width = 500;
        // let height = (450 * aspectHeight) / aspectWidth;

        // const widthInd = document.getElementById('width');
        // const heightInd = document.getElementById('height');

        // if (aspectWidth == 11 && aspectHeight == 11) {
        //     imageContainer.style.width = '';
        //     imageContainer.style.height = '';
        //     widthInd.innerText = `Width 12 inch (30.48 cm)`;
        //     heightInd.innerText = `Height 9 inch (22.86 cm)`;
        // }
        // else {
        //     imageContainer.style.width = `${Math.round(width)}px`;
        //     imageContainer.style.height = `${Math.round(height)}px`;
        //     widthInd.innerText = `Width ${aspectWidth} inch (${aspectWidth * 2.54} cm)`;
        //     heightInd.innerText = `Height ${aspectHeight} inch (${aspectHeight * 2.54} cm)`;
        // }
        // createClockNumbers();
        // document.querySelectorAll('.circle-shape', '.square-shape', '.custom-shape', '.custom2-shape', '.custom3-shape', '.custom4-shape').forEach(shape => {
        //     if (shape.classList.contains('circle-shape')) {
        //         shape.style.width = `${Math.round(height)}px`;
        //         shape.style.height = `${Math.round(height)}px`;
        //     } else if (shape.classList.contains('square-shape')) {

        //         shape.style.width = `${Math.round(width)}px`;
        //         shape.style.height = `${Math.round(width)}px`;
        //     } else if (shape.classList.contains('rect-shape')) {
        //         shape.style.width = `${Math.round(width)}px`;
        //         shape.style.height = `${Math.round(width) - 100}px`;
        //     } else {
        //         shape.style.width = `${Math.round(width)}px`;
        //         shape.style.height = `${Math.round(height)}px`;
        //     }
        // });
        if (activeClock.selectedClock && activeClock.type) {
            activateClock(activeClock.selectedClock, activeClock.type);
        }
    });
});

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

function selectBackground(selectedBgUrl) {
    const previewImage = document.getElementById('previewImage');

    changeBackgroundAPI(selectedBgUrl, previewImage.src);
    closeBgModal();
}

async function changeBackgroundAPI(backgroundUrl, originalImageUrl) {
    const imageBlob = await fetch(originalImageUrl)
        .then(res => res.blob())
        .catch(error => {
            console.error('Error fetching image blob:', error);
            return null;
        });

    if (!imageBlob) {
        alert('Failed to fetch image blob');
        return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        try {
            const response = await fetch('/change-bg', {
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
}

document.getElementById('addTextBtn').addEventListener('click', function () {
    document.getElementById('textModal').style.display = 'block';
});

function closeTextModal() {
    document.getElementById('textModal').style.display = 'none';
}

document.getElementById('addTextModalBtn').addEventListener('click', function () {
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
        textBox.style.zIndex = '1';
        document.querySelector('.analog-clock').appendChild(textBox);

        makeDraggable(textBox);
        makeResizable(textBox);
        makeRotatable(textBox);
    }

    closeTextModal();
});

function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    // Mouse event handlers
    const handleMouseDown = (e) => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
        element.style.border = '2px dashed #248EE6';
        element.querySelector('.resize-handle').style.display = 'block';
        element.querySelector('.rotate-handle').style.display = 'block';
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - element.offsetLeft;
        offsetY = touch.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
        element.style.border = '2px dashed #248EE6';
        element.querySelector('.resize-handle').style.display = 'block';
        element.querySelector('.rotate-handle').style.display = 'block';
    };

    const handleMove = (clientX, clientY) => {
        if (isDragging) {
            element.style.left = clientX - offsetX + 'px';
            element.style.top = clientY - offsetY + 'px';
        }
    };

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

    const handleEnd = () => {
        isDragging = false;
        element.style.cursor = 'move';
    };

    const handleOutsideClick = (e) => {
        if (!element.contains(e.target)) {
            element.style.border = 'none';
            element.querySelector('.resize-handle').style.display = 'none';
            element.querySelector('.rotate-handle').style.display = 'none';
        }
    };

    // Add event listeners for both mouse and touch
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('touchstart', handleTouchStart, { passive: false });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
}

function makeResizable(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '-11.3px';
    resizeHandle.style.bottom = '-6.5px';
    resizeHandle.style.fontSize = '24px';
    resizeHandle.style.cursor = 'crosshair';
    resizeHandle.innerText = '+';
    resizeHandle.style.display = 'none';

    element.appendChild(resizeHandle);

    const handleResizeStart = (clientX) => {
        const initialFontSize = parseFloat(window.getComputedStyle(element).fontSize);
        const initialMouseX = clientX;

        const handleResize = (e) => {
            const currentX = e.clientX || e.touches[0].clientX;
            const scaleFactor = 0.2;
            const newSize = initialFontSize + (currentX - initialMouseX) * scaleFactor;

            if (newSize > 10) {
                element.style.fontSize = newSize + 'px';
            }
        };

        const stopResizing = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('touchmove', handleResize);
            document.removeEventListener('mouseup', stopResizing);
            document.removeEventListener('touchend', stopResizing);
        };

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('touchmove', handleResize, { passive: false });
        document.addEventListener('mouseup', stopResizing);
        document.addEventListener('touchend', stopResizing);
    };

    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        handleResizeStart(e.clientX);
    });

    resizeHandle.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        e.preventDefault();
        handleResizeStart(e.touches[0].clientX);
    }, { passive: false });
}

function makeRotatable(element) {
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

    const handleRotateStart = (clientX, clientY) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const handleRotate = (e) => {
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;
            const angle = Math.atan2(currentY - centerY, currentX - centerX);
            const degree = (angle * (180 / Math.PI) + 90 % 360);
            element.style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
        };

        const stopRotating = () => {
            document.removeEventListener('mousemove', handleRotate);
            document.removeEventListener('touchmove', handleRotate);
            document.removeEventListener('mouseup', stopRotating);
            document.removeEventListener('touchend', stopRotating);
        };

        document.addEventListener('mousemove', handleRotate);
        document.addEventListener('touchmove', handleRotate, { passive: false });
        document.addEventListener('mouseup', stopRotating);
        document.addEventListener('touchend', stopRotating);
    };

    rotateHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        handleRotateStart(e.clientX, e.clientY);
    });

    rotateHandle.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        e.preventDefault();
        handleRotateStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
}

function updateClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours % 12) * 30 + (minutes / 2);
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
}

function createClockNumbers(type) {
    const clockNumbers = document.querySelectorAll('.clock-number');
    const clockFace = document.querySelector('.clock-face');

    clockNumbers.forEach(number => number.remove());

    const containerWidth = imageContainer.offsetWidth;
    const containerHeight = imageContainer.offsetHeight;

    let radius = Math.min(containerWidth, containerHeight) / 2 - 20;
    let centerX = containerWidth / 2.5;
    let centerY = containerHeight / 2.6;

    const limitedNumbers = [12, 3, 6, 9];
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const useLimitedNumbers = type;

    clockNumbers.forEach(number => number.remove());
    if (imageContainer.classList.contains('custom2-shape')) {
        radius -= 20;
        centerX += 10;
        centerY += 15;
    }
    if (containerWidth == 500 && containerHeight == 450) {
        centerX = containerWidth / 2.5;
        centerY = containerHeight / 2.6;
        radius += 5
        if (imageContainer.classList.contains('custom2-shape')) {
            radius += 8;
            centerX += 24;
            centerY += 15;
        }
    }

    if (containerWidth == 260 && containerHeight == 260) {
        centerX = containerWidth / 2.15;
        centerY = containerHeight / 2.3;
        radius += 9;

        if (imageContainer.classList.contains('custom2-shape')) {
            console.log("Custom 2 shape activated");
            radius += 9;
            centerX += 12;
            centerY += 8.5;
        }
    }
    for (let i = 1; i <= 12; i++) {
        const clockNumber = document.createElement('div');
        clockNumber.classList.add('clock-number');

        if (useLimitedNumbers === "limited" && !limitedNumbers.includes(i)) {
            continue;
        }
        if (useLimitedNumbers === "roman" && !romanNumerals.includes(i - 1)) {
            clockNumber.textContent = romanNumerals[i - 1];
        }
        else {
            clockNumber.textContent = i;
        }

        const angle = (i - 3) * 30;
        const x = centerX + radius * Math.cos(angle * Math.PI / 180);
        const y = centerY + radius * Math.sin(angle * Math.PI / 180);

        clockNumber.style.position = 'absolute';
        clockNumber.style.left = `${x - 10}px`;
        clockNumber.style.top = `${y - 10}px`;

        clockFace.appendChild(clockNumber);
    }
}


function createPreviewClockNumbers() {
    const previewClockFaces = document.querySelectorAll('.preview-clock-face');

    previewClockFaces.forEach((previewClockFace, index) => {
        previewClockFace.innerHTML = '';

        const containerWidth = 130;
        const containerHeight = 130;

        let radius = Math.min(containerWidth, containerHeight) / 2 - 8;
        let centerX = containerWidth / 1.8;
        let centerY = containerHeight / 2.2;

        const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        const limitedNumbers = [12, 3, 6, 9];

        for (let i = 1; i <= 12; i++) {
            const clockNumber = document.createElement('div');
            clockNumber.classList.add('preview-clock-number');

            if (index === 3 || index === 4) {
                clockNumber.textContent = romanNumerals[i - 1];
            }

            else if (index === 5) {
                if (!limitedNumbers.includes(i)) continue;
                clockNumber.textContent = i;
            }

            else {
                clockNumber.textContent = i;
            }

            const angle = (i - 3) * 30;
            const x = centerX + radius * Math.cos(angle * Math.PI / 180);
            const y = centerY + radius * Math.sin(angle * Math.PI / 180);

            clockNumber.style.position = 'absolute';
            clockNumber.style.left = `${x - 10}px`;
            clockNumber.style.top = `${y - 10}px`;

            previewClockFace.appendChild(clockNumber);
        }
    });
}

setInterval(updateClock, 1000);

updateClock();

createClockNumbers();

createPreviewClockNumbers();

function activateClock(selectedClock, type) {
    activeClock = {
        selectedClock: selectedClock,
        type: type
    };
    createClockNumbers(type);

    const allClocks = document.querySelectorAll('.style-clock');

    allClocks.forEach(clock => clock.classList.remove('active'));

    selectedClock.classList.add('active');

    const index = Array.from(allClocks).indexOf(selectedClock);

    const fontStyles = [
        { color: "white", fontFamily: "Audiowide", fontWeight: "bold" },
        { color: "white", fontFamily: "Vast Shadow", fontWeight: "bold" },
        { color: "black", fontFamily: "Vast Shadow", fontWeight: "bold" },
        { color: "black", fontFamily: "Arial", fontWeight: "bold" },
        { color: "white", fontFamily: "Arial", fontWeight: "bold" },
        { color: "white", fontFamily: "Wendy One", fontWeight: "bold" }
    ];
    const mainClockNumbers = document.querySelectorAll('.clock-number');

    clockNumbersStyle = {
        color: fontStyles[index].color,
        fontFamily: fontStyles[index].fontFamily,
        fontWeight: fontStyles[index].fontWeight
    }
    if (fontStyles[index]) {
        mainClockNumbers.forEach(number => {
            number.style.color = fontStyles[index].color;
            number.style.fontFamily = fontStyles[index].fontFamily;
            number.style.fontWeight = fontStyles[index].fontWeight;
        });
    }
}

function updatePreview(event) {
    console.log("UPDATE");

    const text = event.target.value || 'Preview Text';
    document.querySelectorAll('option').forEach(option => {
        option.textContent = text;
    });
}


function changeFontFamily() {
    const selectedFont = document.getElementById('fontStyleSelect').value;
    const textInput = document.getElementById('fontStyleSelect');
    textInput.style.fontFamily = selectedFont;
}

function getImageDetails() {
    const previewImage = document.getElementById('previewImage');
    const fileInput = document.getElementById('fileInput');
    const selectedSize = document.querySelector('.size-btn.active');
    const textElements = document.querySelectorAll('.text-box');
    const selectedShape = document.querySelector('.shape-btn.active');
    console.log(clockNumbersStyle);

    if (!previewImage || !previewImage.src) {
        console.error("No image uploaded.");
        return null;
    }

    if (!fileInput || !fileInput.files.length) {
        console.error("No file selected.");
        return null;
    }
    const size = selectedSize && selectedSize.dataset.ratio !== "default"
        ? selectedSize.dataset.ratio
        : "default";

    const file = fileInput.files[0];

    // Get text details
    const allTextData = [];
    textElements.forEach(textElement => {
        allTextData.push({
            text: textElement.innerText.trim(),
            color: textElement.style.color || "default",
            font: textElement.style.fontFamily || "default",
            fontSize: textElement.style.fontSize || "default",
            position: {
                top: textElement.style.top || "default",
                left: textElement.style.left || "default"
            },
            rotation: textElement.style.transform || "default",
        });
    });

    const imageDetails = {
        image: {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: new Date(file.lastModifiedDate).toISOString(),
            size: file.size + ' bytes',
            type: file.type,
            width: previewImage.naturalWidth + 'px',
            height: previewImage.naturalHeight + 'px',
        },
        type: 'Acrylic Clock',
        name: `Acrylic Clock (${size})`,
        price: 799,
        size: size,
        shape: selectedShape ? selectedShape.dataset.shape : 'squre',
        addedText: allTextData.length ? allTextData : ""
    };

    return imageDetails;
}

function shareImage() {
    return new Promise((resolve, reject) => {
        html2canvas(imageContainer, { backgroundColor: null }).then((canvas) => {
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
                const subject = `Acrylic Clock Order - ${formattedDate}`;
                formData.append('subject', JSON.stringify(subject));

                resolve(formData);
            });
        }).catch(error => reject(error));
    });
}


window.activateClock = activateClock;
window.updatePreview = updatePreview;
window.getImageDetails = getImageDetails;
window.shareImage = shareImage;
window.addEventListener('resize', () => createClockNumbers("default"));

initEventListeners();