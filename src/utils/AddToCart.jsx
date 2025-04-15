import { toast } from "sonner";
import { useCartUtils } from "./CartUtils";
import axios from "axios";

export const useHandleAddToCart = () => {
    const { addToCartWithImage } = useCartUtils();

    const handleAddToCart = async ({ container, title, price }) => {
        try {
            const customizationDetails = await window.getImageDetails();

            addToCartWithImage(
                container,
                `${title} (${customizationDetails.size ? customizationDetails.size : ''})`,
                price,
                customizationDetails
            );

            const formData = await window.shareImage();
            console.log("FormData:", [...formData.entries()]);
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("User is not authenticated");
                return;
            }

            const headers = {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            };

            // Send formData to backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cart/add`, formData, { headers });

            console.log("Product added:", response);

            if (response.data.success) {
                const newCartData = response.data.data;

                const existingCart = localStorage.getItem("cart");
                let cartData = existingCart ? JSON.parse(existingCart) : [];

                const userCartIndex = cartData.findIndex(cart => cart.user === newCartData[0].user);

                if (userCartIndex !== -1) {
                    cartData[userCartIndex].items = [...cartData[userCartIndex].items, ...newCartData[0].items];
                } else {
                    cartData.push(newCartData[0]);
                }

                localStorage.setItem("cart", JSON.stringify(cartData));
            }

            toast.success("Product added to cart!", { duration: 2000 });
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Failed to add product. Please try again.", { duration: 3000 });
        }
    };

    return { handleAddToCart };
};
