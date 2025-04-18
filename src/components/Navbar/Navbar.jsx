import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CartDrawer from "./CartDrawer";
import useCartStore from "../../manage/CartStore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

function Navbar() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, SetUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [scrolled, setScrolled] = useState(false);

  const { addCart } = useCartStore();
  const navigate = useNavigate();

  const carts = useCartStore((state) => state.carts);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = (path) => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate(path);
  }
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data.success) {
        console.log(response.data.data);
        const cart = response.data.data;

        // 🔥 Directly set the cart state in the store
        useCartStore.setState({ carts: cart });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      useCartStore.setState({ carts: [] }); // Reset cart on error
    }
  };


  useEffect(() => {
    // fetchCart();
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const menuItems = [
    { text: "Home", path: "/home" },
    { text: "Acrylic Photo", path: "/acrylic" },
    { text: "Clear Acrylic Photo", path: "/clear-acrylic" },
    { text: "Fridge Magnets", path: "/fridge-magnets" },
    { text: "Acrylic Wall Clock", path: "/acrylic-wall-clock" },
    { text: "Collage Acrylic Photo", path: "/collage-acrylic-photo" },
  ];


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
          transition: "box-shadow 0.3s ease-in-out",
          borderBottom: !scrolled ? "1px solid #EAEAEA" : "none",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            sx={{
              mr: 2,
              color: "#000787",
              display: { xs: "flex", md: "none" },
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>


          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/assets/images/OM UV PRINT.png"
              style={{ width: '90px', margin: '5px', cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              ml: 4,
              flexGrow: 1,
            }}
          >
            {menuItems.map((item, index) => (
              <Box
                key={index}
                onClick={() => { navigate(item.path), sessionStorage.setItem("newPage", JSON.stringify(true)); }}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -2,
                    height: "2px",
                    width: location.pathname === item.path ? "100%" : "0",
                    backgroundColor: "#048E1D",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 500, color: "#000787", fontSize: "15px" }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>


          {/* Cart Icon */}
          {/* <IconButton size="large" onClick={() => setCartOpen(true)}>
            <Badge
              badgeContent={carts.length}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "#048e1d",
                },
              }}
            >
              <RiShoppingBag3Fill color="#000787" />
            </Badge>
          </IconButton> */}

          {/* Profile Icon with Dropdown Menu */}
          {/* <IconButton size="large" sx={{ color: "#000787" }} onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton> */}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              onClick={() => handleNavigate("/profile")}
            >
              <Typography sx={{ fontWeight: "bold", color: "black" }}>
                {user?.firstName || "Guest"} {user?.lastName[0] || ""}
              </Typography>
              <Typography variant="body2" sx={{ color: "blue", cursor: "pointer" }}>
                View Account
              </Typography>
            </MenuItem>

            <Divider />

            <MenuItem onClick={() => handleNavigate("/my-orders")}>
              <ListItemIcon>
                <ShoppingBagIcon fontSize="small" />
              </ListItemIcon>
              Your Orders
            </MenuItem>

            <MenuItem onClick={() => handleNavigate("/cart")}>
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              Cart
            </MenuItem>

            <Divider />

            <MenuItem onClick={() => handleLogout("/")}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>


      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {cartOpen && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
    </Box >
  );
}


export default Navbar;