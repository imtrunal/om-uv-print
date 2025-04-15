import { toast } from "sonner";
import axios from "axios";

export const handleShare = async () => {

    try {
        await toast.promise(
            (async () => {
                const formData = await window.shareImage();
                console.log(formData);

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/send-email`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );                
                return response.data;
            })(),
            {
                loading: "Sharing image... Please wait...",
                success: "Image shared successfully!",
                error: "Failed to share image. Please try again.",
                duration: 2000
            }
        );
    } catch (error) {
        console.error("Error sharing image:", error);
    }
};
