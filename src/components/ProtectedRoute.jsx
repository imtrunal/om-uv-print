import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const PayFirst = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#1a1a1a",
                color: "white",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
                }}
            >
                <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
                    Demo Time is Over. Please Contact Sughosh Technolab.
                </h1>
                <p style={{ fontSize: "16px" }}>Thank you for trying out the demo.</p>
            </div>
        </div>
    );
}

const ProtectedRoute = ({ children }) => {
    // const navigate = useNavigate();
    // const API_URL = import.meta.env.VITE_BACKEND_URL;
    // const toastShown = useRef(false);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         handleSessionExpiry();
    //         return;
    //     }

    //     const verifyToken = async () => {
    //         try {
    //             await axios.get(`${API_URL}/user/auth/verify`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    //         } catch (error) {
    //             handleSessionExpiry();
    //         }
    //     };

    //     verifyToken();
    // }, [navigate, API_URL]);

    // const handleSessionExpiry = () => {
    //     if (!toastShown.current) {
    //         toastShown.current = true;
    //         toast.error("Session expired. Please log in again.");
    //     }
    //     localStorage.removeItem("token");
    //     navigate("/");
    // };

    // const targetTime = new Date(2025, 2, 19, 18, 0, 0).getTime();
    // const currentTime = new Date().getTime();

    // if (currentTime >= targetTime) {
    //     return <PayFirst />
    // }
    console.log("Protected Route");
    

    return children;
};

export default ProtectedRoute;
