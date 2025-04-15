import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import useCartStore from "../manage/CartStore";
import { useNavigate } from "react-router-dom"
const API_URL = import.meta.env.VITE_BACKEND_URL;

const CheckoutPage = () => {
    const { clearCart } = useCartStore();
    const navigate = useNavigate();
    const [carts, setCart] = useState([]);
    const [cartLength, setcartLength] = useState(0);
    const [loadingCart, setLoadingCart] = useState(true);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        country: "Sri Lanka",
        street_address: "",
        city: "",
        province: "Western Province",
        zipcode: "",
        phone: "",
        email: "",
        additional: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate Form Data
    const validateForm = () => {
        const requiredFields = ["firstname", "lastname", "street_address", "city", "zipcode", "phone", "email"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`Please fill ${field.replace("_", " ")}`);
                return false;
            }
        }
        return true;
    };

    // Handle Place Order
    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Step 1: Store Billing Data in DB
            const billingResponse = await axios.post(`${API_URL}/billing/place-order`,
                { ...formData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!billingResponse.data.success) {
                toast.error(billingResponse.data.message);
                setLoading(false);
                return;
            }

            toast.success("Billing information stored successfully!");
            const totalAmount = billingResponse.data.order.total;
            const billingId = billingResponse.data.order._id;
            console.log("Billing ID:", billingId);

            // Step 2: Create an Order for Payment
            const orderResponse = await axios.post(`${API_URL}/order/create`,
                { amount: totalAmount, billingId: billingId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            if (!orderResponse.data.success) {
                toast.error("Failed to create order.");
                setLoading(false);
                return;
            }

            console.log("Amount:", orderResponse.data.data?.amount);

            const orderId = orderResponse.data.data?.id;
            const amount = orderResponse.data.data?.amount;

            const options = {
                key: "rzp_test_YDJxDGhc4itsCD",
                amount: amount,
                currency: "INR",
                name: "Acrylic Image",
                description: billingResponse.data.order.orderNo,
                order_id: orderId,
                handler: async function (response) {
                    console.log(`Payment ID: ${response.razorpay_payment_id}`);
                    console.log(`Order ID: ${response.razorpay_order_id}`);
                    console.log(`Signature: ${response.razorpay_signature}`);

                    try {
                        // Step 3: Call Verify Payment API
                        const verifyResponse = await axios.post(`${API_URL}/verify-payment`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            billingId: billingId
                        });

                        if (verifyResponse.data.success) {
                            toast.success("Order Placed Successfully!");
                            navigate('/my-orders');
                            clearCart();
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        toast.error("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: `${formData.firstname} ${formData.lastname}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: { "address": "Razorpay Corporate Office" },
                theme: { color: "#3399cc" },
            };

            const paymentObject = new window.Razorpay(options);

            // Handle Payment Failure
            paymentObject.on("payment.failed", async function (response) {
                console.error("Payment Failed:", response.error);
                toast.error("Payment failed. Please try again.");

                try {
                    // Inform backend that payment failed
                    await axios.post(`${API_URL}/update-payment-status`, {
                        billingId: billingId,
                        status: "Failed",
                        error: response.error.description || "Payment failed",
                    });

                    navigate('/my-orders'); // Redirect user to My Orders page
                } catch (error) {
                    console.error("Failed to update payment status:", error);
                }
            });

            paymentObject.open();

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
            clearCart();
        }
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (response.data.success) {
                setCart(response.data.data);
                setcartLength(response.data.data.length)
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart([]);
        } finally {
            setLoadingCart(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (!loadingCart && carts.length === 0) {
            navigate('/my-orders');
        }
    }, [carts, loadingCart]);

    const subtotal = carts.reduce((total, item) => total + item.subTotal, 0);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 4 }}>
            {/* Left: Billing Details */}
            <Box sx={{ width: "55%" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Billing details
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="First Name" name="firstname" fullWidth onChange={handleChange} />
                    <TextField label="Last Name" name="lastname" fullWidth onChange={handleChange} />
                </Box>

                <TextField label="Street Address" name="street_address" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Town / City" name="city" fullWidth sx={{ mb: 2 }} onChange={handleChange} />

                <TextField label="ZIP Code" name="zipcode" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="Phone" name="phone" fullWidth  onChange={handleChange} />
                    <TextField label="Email Address" name="email" fullWidth  onChange={handleChange} />
                </Box>
                <TextField label="Additional Information" name="additional" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            </Box>

            {/* Right: Order Summary */}
            {/* Right: Order Summary */}
            <Box sx={{ width: "40%", p: 3, border: "1px solid #ddd", borderRadius: "8px", bgcolor: "#f9f9f9" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Product <span style={{ float: "right" }}>Subtotal</span>
                </Typography>

                {carts.length > 0 ? (
                    carts.map((item) => (
                        <Box key={item._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={item.image} alt={item.name} width={50} />
                                <Typography>{item.name} × {item.quantity}</Typography>
                            </Box>

                            {/* Price */}
                            <Typography>Rs. {item.subTotal.toFixed(2)}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: "center", color: "gray", mb: 2 }}>Your cart is empty</Typography>
                )}
                <Typography sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    Subtotal <span>Rs. {subtotal.toFixed(2)}</span>
                </Typography>

                <Typography sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#000787", fontSize: "1.2rem", mt: 1 }}>
                    Total <span>Rs. {subtotal.toFixed(2)}</span>
                </Typography>

                <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
                    Your personal data will be used to support your experience on this website, manage access to your account, and for other purposes described in our <span style={{ textDecoration: "underline", cursor: "pointer" }}>privacy policy</span>.
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, fontWeight: "bold", borderRadius: "4px", bgcolor: "#000787", color: "white" }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </Button>
            </Box>

        </Box >
    );
};

export default CheckoutPage;
