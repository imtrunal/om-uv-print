import React, { useState } from "react";
import "../assets/css/AcrylicClock.css";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../utils/ShareService";
import useCartStore from "../manage/CartStore";
import { toast } from "sonner";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import domtoimage from 'dom-to-image-more';

const ClockCustomizer = () => {
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const { addCart } = useCartStore();

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
                const imageContainer = document.querySelector('.image-container');
                if (!imageContainer) {
                    alert("Error: Image container not found!");
                    return reject("Image container not found");
                }

                await new Promise(r => setTimeout(r, 300)); // wait for any animation or layout to finish

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
                const formattedDate = now.toISOString().replace(/:/g, '-').split('.')[0];
                const fileName = `customized-image-${formattedDate}.png`;

                const imageData = getImageDetails();
                formData.append('image', blob, fileName);
                formData.append('details', JSON.stringify(imageData));
                const subject = `Acrylic Clock Order - ${formattedDate}`;
                formData.append('subject', JSON.stringify(subject));

                resolve(formData);
            } catch (error) {
                console.error("Image generation failed:", error);
                reject(error);
            }
        });
    }


    useEffect(() => {
        const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

        if (newPage) {
            sessionStorage.setItem("newPage", JSON.stringify(false));
            window.location.reload();
        }
        const scriptHtml2Canvas = document.createElement("script");
        scriptHtml2Canvas.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        scriptHtml2Canvas.defer = true;
        document.body.appendChild(scriptHtml2Canvas);

        scriptHtml2Canvas.onload = () => {
            const scriptMain = document.createElement("script");
            scriptMain.src = "/js/AcrylicClock.js";
            scriptMain.defer = true;
            scriptMain.type = "module";
            document.body.appendChild(scriptMain);

            return () => {
                document.body.removeChild(scriptMain);
                document.body.removeChild(scriptHtml2Canvas);
            };
        };
    }, []);

    const handleClockHands = async () => {
        document.querySelectorAll(".clock-hand, .clock-center").forEach(el => {
            el.classList.add("hidden");
        });
        setTimeout(() => {
            document.querySelectorAll(".clock-hand, .clock-center").forEach(el => {
                el.classList.remove("hidden");
            });
        }, 1000);
    }
    const handleAddToCart = async () => {
        setCartLoading(true);
        handleClockHands();
        const promise = new Promise(async (resolve, reject) => {
            try {
                const formData = await window.shareImage();
                console.log("FormData:", [...formData.entries()]);

                // const token = localStorage.getItem("token");
                // if (!token) {
                //     console.error("User is not authenticated");
                //     reject("User is not authenticated.");
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
        });
    };

    // const handleShare = async () => {
    //     setLoading(true);
    //     const promise = new Promise(async (resolve, reject) => {
    //         try {
    //             handleClockHands();
    //             const formData = await window.shareImage();
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
        handleClockHands();
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

        const {
            name,
            type,
            size,
            shape,
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
        if (image) message += `\n📸 *Image:* ${image}\n`;
        // if (price) message += `💰 *Price:* ₹${price}\n`;

        if (formattedText) {
            message += `\n📋 *Added Text:*\n${formattedText}`;
        }
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };
    return (
        <div className="ac-container">
            <div className="preview-container">
                <div className="size-indicator width-indicator" id="width">
                    Width 12 inch (30.48 cm)
                </div>
                <div className="size-indicator height-indicator" id="height">
                    Height 9 inch (22.86 cm)
                </div>
                <div className="image-container" id="imageContainer">
                    <img
                        className="preview-image"
                        id="previewImage"
                        src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Clock Background"
                    />
                    <div className="analog-clock">
                        <div className="clock-face">
                            <div className="clock-center"></div>
                            <div className="clock-hand hour-hand"></div>
                            <div className="clock-hand minute-hand"></div>
                            <div className="clock-hand second-hand"></div>
                            <div id="textContainer"></div>
                        </div>
                    </div>
                </div>

                <div className="shape-options">
                    {[
                        "square",
                        "circle",
                        "custom2",
                        "custom3",
                        "custom4",
                    ].map((shape, index) => {
                        return (
                            <button key={index} className={`shape-btn ${shape} ${index == 0 ? 'active' : ''}`} data-shape={shape}></button>
                        );
                    })}
                </div>
            </div>

            <div className="controls">
                <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp, image/jpg" style={{ display: "none" }} />
                <button className="btn upload" onClick={() => document.getElementById("fileInput").click()}>
                    <FaUpload />
                </button>
                <input type="range" id="zoomRange" min="0.5" max="3" step="0.1" defaultValue="1" style={{ width: "200px" }} />
                <button className="btn share" id="shareBtn" onClick={handleShare} disabled={loading}>
                    {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
                </button>
                <button
                    className="btn2 add-to-cart"
                    id="cartBtn"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                >
                    {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}

                </button>
                <p>Size:</p>
                {[
                    "11x11",
                    "16x16",
                ].map((size, index) => {
                    return (
                        <button key={index} className={`size-btn ${index == 0 ? 'active' : ''}`} data-ratio={size}>
                            {size}
                        </button>
                    )
                })}
                <button className="upload-btn" id="removeBgBtn">
                    Change Background
                </button>
                <button className="upload-btn" id="addTextBtn">
                    <HiPencilSquare />
                </button>
            </div>

            {/* Background Modal */}
            <div
                id="bgModal"
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
                    <h3>Select a Background</h3>
                    <div id="bgGallery" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}></div>
                    <button onClick={() => (document.getElementById("bgModal").style.display = "none")}>Close</button>
                </div>
            </div>

            {/* Text Modal */}
            <div
                className="z-50"
                id="textModal"
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
                        onChange={(e) => window.updatePreview(e)}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />

                    <label htmlFor="textColor">Text Color:</label>
                    <input type="color" id="textColor" defaultValue="#000000" style={{ width: "100%", marginBottom: "10px" }} />
                    <label htmlFor="fontStyleSelect">Select Font Style:</label>
                    <select className="border border-black" id="fontStyleSelect" style={{ width: "100%", marginBottom: "10px" }}>
                        {[
                            "Arial",
                            "Times New Roman",
                            "Courier New",
                            "Verdana",
                            "cursive",
                            "fantasy",
                            "monospace",
                            "Lucida Console",
                            "Lucida Sans Unicode",
                            "Impact",
                            "Georgia",
                        ].map((font) => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </option>
                        ))}
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
                    }} id="addTextModalBtn">Add Text</button>
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
                    }} onClick={() => (document.getElementById("textModal").style.display = "none")}>Cancel</button>
                </div>
            </div>

            <center>
                <h2>Select Clock Number Style:</h2>
            </center>
            <div className="clock-row">
                {["full", "full", "false", "roman", "roman", "limited"].map((type, index) => (
                    <div key={index} className={`style-clock small ${index == 0 ? 'active' : ''}`} onClick={(e) => window.activateClock(e.currentTarget, type)}>
                        <div className="preview-clock-face"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClockCustomizer;
