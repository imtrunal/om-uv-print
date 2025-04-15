
const imageContainer = document.querySelector('.acp-image-container');
const previewImage = document.getElementById('previewImage');
const fileInput = document.getElementById('fileInput');
const widthInd = document.getElementById('width');
const heightInd = document.getElementById('height');
const zoomRange = document.getElementById('zoomRange');
const allSizeBtn = document.querySelectorAll('.acp-size-btn');
const shareBtn = document.querySelector('.acp-share');
const allColorsBtn = document.querySelectorAll('.acp-color-btn');
const addTextBtn = document.getElementById('addTextBtn');
const textModal = document.getElementById('textModal');
const text = document.getElementById('modalTextInput');
const addTextModalBtn = document.getElementById('addTextModalBtn');
const selectedFont = document.getElementById('fontStyleSelect').value;
const textInput = document.getElementById('fontStyleSelect');


const zoomLevel = document.getElementById('zoomRange').value;
const textElements = document.querySelectorAll('.acp-text-box');
const fontStyleSelect = document.getElementById('fontStyleSelect');
const allTextData = [];
const cartBtn = document.getElementById('cartBtn');


const BASE_URL = window.BASE_URL;

let scale = 1;

let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

fileInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewImage.style.transform = 'translate(0px, 0px) scale(1)';
            await removeBackgroundAPI(file);
            shareBtn.style.display = 'block';
            cartBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

allColorsBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allColorsBtn.forEach(button => button.classList.remove('acp-active'));
        this.classList.add('acp-active');
        const borderColor = getComputedStyle(this).borderColor;
        console.log(borderColor);
        imageContainer.style.border = `15px solid ${borderColor}`;
        btn.classList.add('acp-active')
    });
});

imageContainer.addEventListener('dblclick', dragStart);
imageContainer.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

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

allSizeBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        allSizeBtn.forEach(button => button.classList.remove('acp-active'));
        this.classList.add('acp-active');

        const ratio = this.dataset.ratio.split('x');
        const aspectWidth = ratio[0];
        const aspectHeight = ratio[1];
        console.log(aspectWidth, aspectHeight);

        let width = 400;
        let height = (650 * aspectHeight) / aspectWidth;
        console.log(width, height);

        const widthInd = document.getElementById('width');
        const heightInd = document.getElementById('height');

        if (aspectWidth == "default") {
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
    });
});

async function removeBackgroundAPI(file) {
    const formData = new FormData();
    formData.append("image", file); // this is the file object, not base64

    try {
        const response = await fetch(`${BASE_URL}/change-bg`, {
            method: 'POST',
            body: formData, // ✅ don't manually set headers
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server error ${response.status}: ${text}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        previewImage.src = imageUrl;

    } catch (error) {
        console.error('Error removing background:', error);
        alert('Failed to remove background');
    }
}


addTextBtn.addEventListener('click', function () {
    textModal.style.display = 'block';
});

function closeTextModal() {
    textModal.style.display = 'none';
}

addTextModalBtn.addEventListener('click', function () {
    const text = document.getElementById('modalTextInput').value || 'Preview Text';
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
        imageContainer.appendChild(textBox);

        makeDraggable(textBox);
        makeResizable(textBox);
        makeRotatable(textBox);
        allTextData.push({
            text: text,
            color: textColor,
            style: fontStyle,
        });
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

function updatePreview() {
    const text = document.getElementById('modalTextInput').value || 'Preview Text';
    document.querySelectorAll('option').forEach(option => {
        option.textContent = `${text}`;
    });
}

function changeFontFamily() {
    textInput.style.fontFamily = selectedFont;
}


function getImageDetails() {
    const selectedSize = document.querySelector('.acp-size-btn.acp-active');
    const textElement = document.querySelector('.text-box');

    if (!previewImage || !previewImage.src) {
        console.error("No image uploaded.");
        return null;
    }

    const file = fileInput.files[0];
    if (!file) {
        console.error("No file selected.");
        return null;
    }

    const size = selectedSize && selectedSize.dataset.ratio !== "default"
        ? selectedSize.dataset.ratio
        : "default";
    const imageDetails = {
        image: {
            name: file.name,
            lastModified: file.lastModified,
            lastModifiedDate: new Date(file.lastModifiedDate).toString(),
            size: file.size,
            type: file.type,
        },
        name: `Trasparent Acrylic Photo (${size})`,
        type: 'Trasparent Acrylic Photo',
        price: 699,
        size: size,
        border: imageContainer ? imageContainer.style.border : '15px solid rgb(0, 0, 0)',
        addedText: textElement ? allTextData : [],
    };

    return imageDetails;
}

// shareBtn.addEventListener('click', () => {

//     if (!imageContainer) {
//         alert("Error: Image container not found!");
//         return;
//     }

//     shareBtn.disabled = true;
//     alert("Processing... Please wait!");

//     document.querySelectorAll('.acp-resize-handle, .acp-rotate-handle').forEach(handle => {
//         handle.style.display = 'none';
//     });

//     html2canvas(imageContainer, {
//         backgroundColor: null,
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: true
//     }).then((canvas) => {
//         canvas.toBlob((blob) => {
//             if (!blob) {
//                 alert("Error: Failed to generate image!");
//                 shareBtn.disabled = false;
//                 return;
//             }

//             const formData = new FormData();
//             const now = new Date();
//             const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0];
//             const fileName = `customized-image-${formattedDate}.png`;
//             const imageData = getImageDetails();
//             formData.append('image', blob, fileName);
//             formData.append('details', JSON.stringify(imageData));
//             formData.append('subject', `Clear Acrylic Photo Order - ${formattedDate}`);

//             fetch(`${BASE_URL}/send-email`, {
//                 method: 'POST',
//                 body: formData
//             })
//                 .then(response => response.json())
//                 .then(data => alert(data.message))
//                 .catch(error => alert("Error: " + error.message))
//                 .finally(() => {
//                     shareBtn.disabled = false;
//                 });
//         }, 'image/png');
//     });
// });

function shareImage() {
    return new Promise((resolve, reject) => {
        html2canvas(imageContainer, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true
        }).then((canvas) => {
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
                const subject = `Clear Acrylic Photo (${imageData.size || "default"})`;
                formData.append('subject', JSON.stringify(subject));
                
                resolve(formData);
            });
        }).catch(error => reject(error));
    });
}
window.updatePreview = updatePreview;
window.getImageDetails = getImageDetails;
window.shareImage = shareImage;

