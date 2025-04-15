import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { MdChevronLeft } from "react-icons/md";
import { Link } from "react-router-dom";

function Thankyou() {
    return (
        <Box
            sx={{
                marginTop:"10%",
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}
        >
            <Box sx={{ textAlign: "center", maxWidth: 500 }}>
                {/* Thank you heading */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: "#1C252E",
                        mb: 4,
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                >
                    Thank you for your purchase!
                </Typography>

                {/* Illustration */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 4,
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                >
                    <img
                        src="https://assets.minimals.cc/public/assets/illustrations/characters/character-10.webp"
                        alt="Thank You"
                        width="320"
                        height="240"
                        style={{ borderRadius: "8px" }}
                    />
                </Box>

                {/* Message */}
                <Divider
                    sx={{
                        borderColor: "#D1D5DB",
                        borderStyle: "dashed",
                        mb: 3,
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "medium",
                        color: "#1C252E",
                        mb: 2,
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                >
                    Thanks for placing the order
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#637381",
                        mb: 4,
                        animation: "fadeIn 0.5s ease-in-out",
                    }}
                >
                    We will send you a notification within 5 days when it ships. <br />
                    If you have any questions or queries, feel free to contact us. <br />
                    All the best,
                </Typography>

                {/* Go to Home Button */}
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Button
                            variant="outlined"
                            startIcon={<MdChevronLeft size={25} />}
                            sx={{
                                color: "#000",
                                borderColor: "#909eab52",
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
                                textTransform: "none",
                                height: 48,
                                fontWeight: "bold",
                            }}
                        >
                            Go to Home
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

export default Thankyou;
