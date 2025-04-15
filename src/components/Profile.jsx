import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Avatar, TextField, Divider, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully!");
        setTimeout(() => navigate("/"), 1500);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill all password fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/change-password`, {
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.success) {
                toast(response.data.message || "Password changed successfully!", { type: "success" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("")
            } else {
                toast(response.data.message || "Something went wrong!", { type: "error" });
            }
            ;
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Something went wrong!";
            toast(errorMessage, { type: "error" });
        }
    };

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ maxWidth: 600, margin: "40px auto", padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: "12px" }}>
                {/* Profile Section */}
                <Box display="flex" alignItems="center" gap={2} mb={2} justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 70, height: 70, bgcolor: "#007bff", fontSize: "24px" }}>
                            {user.firstName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {user.email}
                            </Typography>
                            <Typography variant="body2" color="gray">
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Logout Button */}
                    <IconButton color="error" onClick={handleLogout} sx={{ fontSize: "20px" }}>
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                {/* Change Password Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Change Password
                </Typography>

                <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    margin="dense"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                    margin="dense"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    margin="dense"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, fontWeight: "bold" }}
                    startIcon={<LockIcon />}
                    onClick={handleChangePassword}
                >
                    Change Password
                </Button>

                <Divider sx={{ marginY: 2 }} />
            </Paper>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={2000} />
        </Box>
    );
};

export default Profile;
