import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    CircularProgress,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Button,
} from "@mui/material";
import { IoImages } from "react-icons/io5";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import { toast } from "sonner";
import ProductDetailsDialog from "./ProductDetailsDialog";
import { FaEye } from "react-icons/fa";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const OrderDetails = () => {
    const navigate = useNavigate(); // Initialize navigation
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/billing/${orderId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.data.success) {
                    setOrder(response.data.data);
                } else {
                    toast.error("Failed to fetch order details.");
                    navigate("/my-orders"); // Redirect if the request fails
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                navigate("/my-orders"); // Redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]); // Include dependencies to avoid stale state

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    const { billingData: orderData, paymentDetails } = order;

    const statusSteps = ["Order Accepted", "Processing", "Order Completed"];
    const statusMapping = {
        "Pending": 0,
        "Processing": 1,
        "Completed": 2,
    };
    const activeStep = statusMapping[orderData.status] || 0;

    const CustomStepIcon = ({ active, completed }) => {
        return completed || activeStep == 2 ? (
            <CheckCircleIcon sx={{ color: "#048e1d" }} />
        ) : active ? (
            <IoImages color="#048e1d" size={'1.5rem'} />
        ) : (
            <RadioButtonUncheckedIcon sx={{ color: "#000787" }} />
        );
    };

    const downloadInvoice = async (order, paymentDetails) => {
        const promise = new Promise((resolve, reject) => {
            fetch("http://localhost:8080/download-invoice", {
                method: "POST",
                body: JSON.stringify({ order, paymentDetails }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `invoice-${order.orderNo}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });

        toast.promise(promise, {
            loading: "Generating invoice...",
            success: "Invoice generated successfully!",
            error: "Generate failed. Please try again."
        });
    };
    const handleRetryPayment = async (order) => {
        try {
            const orderResponse = await axios.post(`${API_URL}/order/create`,
                { amount: order.total, billingId: order._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            if (!orderResponse.data.success) {
                toast.error("Failed to create payment order.");
                return;
            }

            const orderId = orderResponse.data.data?.id;
            const amount = orderResponse.data.data?.amount;

            const options = {
                key: "rzp_test_uzGTmLb6xkyeHP",
                amount: amount,
                currency: "INR",
                name: "Acrylic Image",
                description: order.orderNo,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(`${API_URL}/verify-payment`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            billingId: order._id
                        });

                        if (verifyResponse.data.success) {
                            toast.success("Payment Successful!");
                            window.location.reload();
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: order.customerName,
                    email: order.customerEmail,
                    contact: order.customerPhone,
                },
                notes: { address: "Razorpay Corporate Office" },
                theme: { color: "#3399cc" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (response) {
                console.error("Payment Failed:", response.error);
                toast.error("Payment failed. Please try again.");
            });
            paymentObject.open();

        } catch (error) {
            console.error("Error retrying payment:", error);
            toast.error("Something went wrong. Try again.");
        }
    };

    const handleCancelPayment = async (id) => {
        try {
            const orderResponse = await axios.delete(`${API_URL}/billing/cancel-order/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            if (!orderResponse.data.success) {
                toast.error("Failed to cancel  order.");
                return;
            }
            toast.success("Order cancelled successfully");
            navigate('/my-orders');
        } catch (error) {
            console.error("Error retrying payment:", error);
            toast.error("Something went wrong. Try again.");
        }
    }
    return (
        <>
            <Box sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
                {/* Amazon-like Status Tracker */}
                <Box sx={{ my: 3 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            "& .MuiStepConnector-line": {
                                borderColor: "#000787", // Change this to your preferred color
                            },
                        }}
                    >
                        {statusSteps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    Order Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Order placed{" "}
                        {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}{" "}
                        | Order number <strong>{orderData.orderNo} | {orderData.orderId}</strong>
                    </Typography>
                    <Button variant="text" sx={{ fontSize: "1rem", fontWeight: "bold", textDecoration: "underline" }} onClick={() => downloadInvoice(orderData, paymentDetails)}>Invoice</Button>
                </Box>
                <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={10}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Billing Address
                            </Typography>
                            <Typography>{orderData.firstname} {orderData.lastname}</Typography>
                            <Typography>{orderData.street_address}</Typography>
                            <Typography>{orderData.city}</Typography>
                            <Typography>{orderData.zipcode}</Typography>
                            <Typography>Phone: {orderData.phone}</Typography>
                            <Typography>Email: {orderData.email}</Typography>
                        </Grid>

                        {/* Payment Method */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Payment Methods
                            </Typography>
                            {orderData.paymentStatus === "Captured" && (
                                <Typography component="span">
                                    {paymentDetails?.items[0]?.method?.toUpperCase()}
                                </Typography>
                            )}
                            {orderData.paymentStatus !== "Captured" && (
                                <Box sx={{ display: "flex", gap: "1rem" }}>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "#8DE969", color: "white" }}
                                        onClick={() => handleRetryPayment(orderData)}
                                    >
                                        Pay Now
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "red", color: "white" }}
                                        onClick={() => handleCancelPayment(orderData._id)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Grid>

                        {/* Order Summary */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Order Summary
                            </Typography>
                            <Typography>Item(s) Subtotal: ₹{orderData.total.toFixed(2)}</Typography>
                            <Typography>Shipping: ₹40.00</Typography>
                            <Typography>Total: ₹{(orderData.total + 40).toFixed(2)}</Typography>
                            <Typography sx={{ color: "green" }}>Promotion Applied: -₹40.00</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Grand Total: ₹{orderData.total.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>

                {/* Ordered Products */}
                {orderData.products.map((item) => (
                    <Card key={item.productId._id} sx={{ mb: 2, display: "flex", alignItems: "center", p: 2, width: "50%" }}>
                        <CardMedia
                            component="img"
                            image={item.productId.image || "/placeholder.jpg"}
                            sx={{ width: 120, objectFit: "cover", borderRadius: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: "#0073bb" }}>
                                {item.productId.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray" }}>
                                Sold by: Acylic Image Customizer
                            </Typography>
                            <Typography sx={{ fontWeight: "bold" }}>₹{item.productId.price} x {item.productId.quantity}</Typography>
                        </CardContent>
                        <Button
                            sx={{ color: "#000787", fontSize: "1.5rem" }}
                            onClick={() => { setSelectedItem(item.productId); setDialogOpen(true); }}
                        >
                            <FaEye />
                        </Button>
                    </Card>
                ))}
            </Box>
            <ProductDetailsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} productDetails={selectedItem} />
        </>
    );
};

export default OrderDetails;
