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
const fileInput = document.getElementById('fileInput');
const widthInd = document.getElementById('width');
const heightInd = document.getElementById('height');
// const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const cartBtn = document.getElementById('cartBtn');
imageContainer.addEventListener('dblclick', dragStart);
imageContainer.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);
const zoomRange = document.getElementById('zoomRange');
let scale = 1;
const removeBgBtn = document.getElementById('removeBgBtn');
removeBgBtn.addEventListener('click', openBgModal);
const allTextData = [];

let file;
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

fileInput.addEventListener('change', function (e) {
    file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewImage.style.transform = 'translate(0px, 0px) scale(1)';
        };
        reader.readAsDataURL(file);
        // downloadBtn.style.display = "block";
        shareBtn.style.display = "block";
        // cartBtn.style.display = "block";
    }
});

document.querySelectorAll('.ap-shape-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.ap-shape-btn').forEach(button => button.classList.remove('ap-active'));
        this.classList.add('ap-active');
        const shape = this.dataset.shape;

        // Remove previous shape classes
        imageContainer.classList.remove(
            'ap-circle-shape', 'ap-square-shape', 'ap-oval-shape', 'ap-rect-shape',
            'ap-potrait-shape', 'ap-custom-shape', 'ap-custom2-shape', 'ap-custom3-shape', 'ap-custom4-shape'
        );

        // Add the selected shape class
        if (shape) {
            imageContainer.classList.add(`ap-${shape}-shape`);
        }
    });
});


document.querySelectorAll('.ap-color-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const borderColor = this.style.border.split("groove ")[1] || "none";
        imageContainer.style.border = borderColor === "none" ? "none" : `10px solid ${borderColor}`;
    });
});


function dragStart(e) {
    if (!isDragging) {
        isDragging = true;

        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        updateImagePosition();
    }
}

function dragEnd() {
    if (isDragging) {
        isDragging = false;
    }
}

function updateImagePosition() {
    previewImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

zoomRange.addEventListener('input', function () {
    scale = parseFloat(zoomRange.value);
    updateImagePosition();
});

// downloadBtn.addEventListener('click', () => {
//     document.querySelectorAll('.resize-handle, .rotate-handle').forEach(handle => {
//         handle.style.display = 'none';
//     });
//     html2canvas(imageContainer, { backgroundColor: null }).then((canvas) => {
//         const link = document.createElement('a');
//         link.download = 'customized-image.png';
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//     });
// });

document.querySelectorAll('.ap-size-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.ap-size-btn').forEach(button => button.classList.remove('ap-active'));
        this.classList.add('ap-active');

        const ratio = this.dataset.ratio.split('x');
        const aspectWidth = ratio[0];
        const aspectHeight = ratio[1];

        let width = 500;
        let height = (450 * aspectHeight) / aspectWidth;

        const widthInd = document.getElementById('width');
        const heightInd = document.getElementById('height');

        console.log(ratio);

        console.log(aspectWidth, aspectHeight);

        if (aspectWidth === "8" && aspectHeight === "12") {
            console.log("yes");

            imageContainer.style.width = '';
            imageContainer.style.height = '';
            widthInd.innerText = `Width 12 inch (30.48 cm)`;
            heightInd.innerText = `Height 9 inch (22.86 cm)`;
        }
        else {
            imageContainer.style.width = `${Math.round(width)}px`;
            imageContainer.style.height = `${Math.round(height)}px`;
            widthInd.innerText = `Width ${aspectWidth} inch (${aspectWidth * 2.54} cm)`;
            heightInd.innerText = `Height ${aspectHeight} inch (${aspectHeight * 2.54} cm)`;
        }
        document.querySelectorAll('.circle-shape', '.square-shape', '.oval-shape', '.rect-shape', '.potrait-shape', '.custom-shape', '.custom2-shape', '.custom3-shape', '.custom4-shape').forEach(shape => {
            if (shape.classList.contains('circle-shape')) {
                console.log("square-shape");

                shape.style.width = `${Math.round(height)}px`;
                shape.style.height = `${Math.round(height)}px`;
            } else if (shape.classList.contains('square-shape')) {
                console.log("square-shape");

                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(width)}px`;
            } else if (shape.classList.contains('rect-shape')) {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(width) - 100}px`;
            } else {
                shape.style.width = `${Math.round(width)}px`;
                shape.style.height = `${Math.round(height)}px`;
            }
        });

        if ((aspectWidth == 11 && aspectHeight == 11) || (aspectWidth == 16 && aspectHeight == 16)) {
            document.querySelectorAll('.ap-shape-btn').forEach(button => {
                if (button.classList.contains('oval') || button.classList.contains('potrait')) {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'inline-block';
                }
            });
        }
        else if (aspectWidth === "default" && aspectHeight === "default") {
            document.querySelectorAll('.ap-shape-btn').forEach(button => {
                button.style.display = 'inline-block';
            });
        }
        else {
            document.querySelectorAll('.ap-shape-btn').forEach(button => {
                if (button.classList.contains('potrait') || button.classList.contains('rect') || button.classList.contains('circle') || button.classList.contains('custom3') || button.classList.contains('custom4') || button.classList.contains('custom5')) {
                    button.style.display = 'none';
                }
                else {
                    button.style.display = 'inline-block';
                }
            });
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
        document.getElementById('imageContainer').appendChild(textBox);

        allTextData.push({
            text: text,
            color: textColor,
            style: fontStyle,
        });
        makeDraggable(textBox);
        makeResizable(textBox);
        makeRotatable(textBox);
    }

    closeTextModal();
});

function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';

        element.style.border = '2px dashed #248EE6';
        element.querySelector('.resize-handle').style.display = 'block';
        element.querySelector('.rotate-handle').style.display = 'block';
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });

    document.addEventListener('mousedown', function (e) {
        if (!element.contains(e.target)) {
            element.style.border = 'none';
            element.querySelector('.resize-handle').style.display = 'none';
            element.querySelector('.rotate-handle').style.display = 'none';
        }
    });
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

// ==========================================
function getImageDetails() {
    const imageContainer = document.getElementById('imageContainer');
    const selectedShape = document.querySelector('.ap-shape-btn.ap-active');
    const selectedSize = document.querySelector('.ap-size-btn.ap-active');
    const textElement = document.querySelector('.text-box');
    const size = selectedSize && selectedSize.dataset.ratio !== "default"
        ? selectedSize.dataset.ratio
        : "default";
    const imageDetails = {
        type: 'Acrylic Photo',
        image: {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate.toString(),
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
        },
        name: `Acrylic Photo (${size})`,
        price: 599,
        width: imageContainer.offsetWidth + 'px',
        height: imageContainer.offsetHeight + 'px',
        border: imageContainer ? imageContainer.style.border : 'none',
        shape: selectedShape ? selectedShape.dataset.shape : 'default',
        size: size,
        addedText: textElement ? allTextData : [],
    };
    return imageDetails;
};

// function shareImage() {
//     return new Promise((resolve, reject) => {
//         html2canvas(imageContainer, { backgroundColor: null }).then((canvas) => {
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
//                 const subject = `Acrylic Premium Photo (${imageData.size || "default"})`;
//                 formData.append('subject', JSON.stringify(subject));

//                 resolve(formData);
//             });
//         }).catch(error => reject(error));
//     });
// }

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
                }
                )
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

window.closeBgModal = closeBgModal;
window.closeTextModal = closeTextModal;
window.getImageDetails = getImageDetails;
window.shareImage = shareImage;

