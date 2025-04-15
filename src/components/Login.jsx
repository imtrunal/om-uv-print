import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserAuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
    const [firstName, setFirstName] = useState(""); // First Name
    const [lastName, setLastName] = useState(""); // Last Name
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "20px",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: "400px",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        border: "1px solid #ddd",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "16px",
        outline: "none",
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "15px",
    };

    const textButtonStyle = {
        background: "none",
        border: "none",
        color: "#007bff",
        cursor: "pointer",
        marginTop: "10px",
        textDecoration: "underline",
        fontSize: "14px",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isLogin
                ? `${import.meta.env.VITE_BACKEND_URL}/user/login`
                : `${import.meta.env.VITE_BACKEND_URL}/user/register`;

            const payload = isLogin
                ? { email, password }
                : { firstName, lastName, email, password };

            const response = await axios.post(url, payload);

            if (response.data.success) {
                setLoading(false);
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                toast(response.data.message || "Success!", { type: "success" });
                navigate("/home");
            } else {
                setLoading(false);
                toast(response.data.message || "Something went wrong!", { type: "error" });
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.errorMessage || "Something went wrong!";
            toast(errorMessage, { type: "error" });
        }
    };


    return (
        <div style={containerStyle} >
            <div style={cardStyle}>
                <div
                    style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#007bff",
                        margin: "0 auto 15px",
                    }}
                >
                    <FiLock style={{ fontSize: "28px", color: "white" }} />
                </div>

                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>
                    {isLogin ? "User Login" : "Register User"}
                </h2>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    {!isLogin && (
                        <>
                            <div>
                                <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Enter last name"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div style={{ marginTop: "15px", position: "relative" }}>
                        <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "0",
                                top: "75%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {showPassword ? (
                                <FiEyeOff style={{ fontSize: "18px", color: "#666" }} />
                            ) : (
                                <FiEye style={{ fontSize: "18px", color: "#666" }} />
                            )}
                        </button>
                    </div>

                    <button type="submit" style={buttonStyle}>
                        {loading ? "Please Wait..." : isLogin ? "Sign in" : "Register"}
                    </button>

                    <button
                        type="button"
                        style={textButtonStyle}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "New here? Register Now" : "Already have an account? Login"}
                    </button>

                    <ToastContainer />
                </form>
            </div>
        </div>
    );
};

export default UserAuthPage;
