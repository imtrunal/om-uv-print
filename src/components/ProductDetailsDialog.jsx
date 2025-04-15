import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdStraighten } from "react-icons/md";
import { FaShapes } from "react-icons/fa";
import { MdOutlineHeight } from "react-icons/md";
import { RxWidth } from "react-icons/rx";
import { RxBorderWidth } from "react-icons/rx";
import { TbBrandDatabricks } from "react-icons/tb";

const ProductDetailsDialog = ({ open, onClose, productDetails }) => {
    if (!productDetails) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    bgcolor: "#000787",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                }}
            >
                {productDetails.name}
                <IconButton onClick={onClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: "24px" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: "24px",
                        alignItems: "center",
                    }}
                >
                    {/* Product Image */}
                    <img
                        src={productDetails.image}
                        alt={productDetails.name}
                        style={{
                            width: "35%",
                            margin:"1rem",
                            background: "#fff",
                        }}
                    />


                    {/* Product Info */}
                    <Box sx={{ flex: "1", textAlign: "left" }}>
                        <Typography variant="h6" sx={{ color: "#D32F2F", fontWeight: "bold", mb: 2 }}>
                            Price: ₹{productDetails.price?.toLocaleString() || "N/A"} / unit
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Quantity: {productDetails.quantity || "N/A"}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {/* Dynamic Product Fields */}
                        {productDetails?.width && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <RxWidth style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Width:</strong> {productDetails.width}
                                </Typography>
                            </Box>
                        )}

                        {productDetails?.height && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <MdOutlineHeight style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Height:</strong> {productDetails.height}
                                </Typography>
                            </Box>
                        )}

                        {productDetails?.shape && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <FaShapes style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Shape:</strong> {productDetails.shape}
                                </Typography>
                            </Box>
                        )}

                        {productDetails?.size && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <MdStraighten style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Size:</strong> {productDetails.size}
                                </Typography>
                            </Box>
                        )}

                        {/* Display Border Color Box if Border Exists */}
                        {productDetails?.border && productDetails.border !== "none" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <RxBorderWidth style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Border:</strong>
                                </Typography>
                                <Box
                                    sx={{
                                        width: "20%",
                                        height: "10px",
                                        backgroundColor: productDetails?.border.split("solid ")[1],
                                    }}
                                />
                            </Box>
                        )}

                        {productDetails?.thickness && productDetails.thickness !== "none" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <TbBrandDatabricks style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Thickness:</strong> {productDetails.thickness}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsDialog;
