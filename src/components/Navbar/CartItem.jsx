import React, { useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { IoCloseCircle } from "react-icons/io5";
import { CartContext } from "../CartContext";

const CartItem = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);
    console.log(";;;;;",cart);
    
    return (
        <Box sx={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd" }}>
            <Box
                sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={cart.image}
                    alt={cart.name}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            {/* Product Details */}
            <Box sx={{ flex: 1, marginLeft: "16px", cursor: "pointer" }} onClick={() => onViewDetails(cart)}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{cart.name}</Typography>
                <Typography variant="body2" sx={{ color: "#000787", fontWeight: "bold", mt: 1 }}>
                    Rs. {cart.price.toLocaleString()}.00
                </Typography>

                {/* Quantity Controls */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <IconButton size="small" onClick={() => decreaseQuantity(cart._id)} sx={{ color: "#000787", borderRadius: "4px", p: 0.5 }}>
                        <Remove />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{cart.quantity}</Typography>
                    <IconButton size="small" onClick={() => increaseQuantity(cart._id)} sx={{ color: "#000787", borderRadius: "4px", p: 0.5 }}>
                        <Add />
                    </IconButton>
                </Box>
            </Box>

            {/* Delete Button */}
            <IconButton size="small" onClick={() => removeItem(cart._id)}>
                <IoCloseCircle style={{ fontSize: "1.5rem" }} />
            </IconButton>
        </Box>
    );
};

export default CartItem;
