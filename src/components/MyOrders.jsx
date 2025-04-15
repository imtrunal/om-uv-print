import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/billing`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          const sortedOrders = response.data.orders.sort((a, b) => {
            if (a.paymentStatus === "Pending" || a.paymentStatus === "Failed") return -1;
            if (b.paymentStatus === "Pending" || b.paymentStatus === "Failed") return 1;
            return 0;
          });

          setOrders(sortedOrders);
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error loading orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      window.location.reload();
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error("Something went wrong. Try again.");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Your Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray" }}>
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            sx={{
              mb: 3,
              border: order.paymentStatus === "Pending" || order.paymentStatus === "Failed" ? "2px solid red" : "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              backgroundColor: order.paymentStatus === "Pending" || order.paymentStatus === "Failed" ? "#ffe6e6" : "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Product Image */}
              <Grid item>
                <CardMedia
                  component="img"
                  image={order.products[0]?.productId?.image || "/placeholder.jpg"}
                  alt={order.products[0]?.productId?.name}
                  sx={{ width: 200, objectFit: "contain" }}
                />
              </Grid>

              {/* Order Details */}
              <Grid item xs={9}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Order ID: {order.orderNo}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Product:</strong> {order.products[0]?.productId?.name || "Unknown Product"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> ₹{order.total.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: order.status === "Pending" ? "orange" :
                        order.status === "Processing" ? "blue" :
                          order.status === "Completed" ? "green" : "black"
                    }}
                  >
                    <strong style={{ color: 'black' }}>Status:</strong> {order.status}
                  </Typography>
                  {(order.paymentStatus === "Pending" || order.paymentStatus === "Failed") && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: order.paymentStatus === "Pending" ? "red" : "darkred",
                        fontWeight: "bold",
                      }}
                    >
                      <strong style={{ color: "black" }}>Payment:</strong> {order.paymentStatus}
                    </Typography>
                  )}

                  <Typography variant="body1">
                    <strong>Items:</strong> {order.products.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {/* {order.paymentStatus === "Captured" && ( */}
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#000787", color: "white", mr: 1 }}
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Order
                      </Button>
                    {/* )} */}
                    {order.paymentStatus === "Pending" || order.paymentStatus === "Failed" ? (
                      <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "#8DE969", color: "white" }}
                          onClick={() => handleRetryPayment(order)}
                        >
                          Pay Now
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "red", color: "white" }}
                          onClick={() => handleCancelPayment(order._id)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : null}
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyOrders;
