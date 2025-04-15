import React from "react";
import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFileImageFill, BsFileImage } from "react-icons/bs";
import { RiFridgeFill, RiCollageFill } from "react-icons/ri";
import { IoMdClock } from "react-icons/io";

const menuItems = [
  { text: "Home", icon: <FaHome size={30} color="#000787" />, path: "/home" },
  { text: "Acrylic Photo", icon: <BsFileImageFill size={30} color="#000787" />, path: "/acrylic" },
  { text: "Clear Acrylic Photo", icon: <BsFileImage size={30} color="#000787" />, path: "/clear-acrylic" },
  { text: "Fridge Magnets", icon: <RiFridgeFill size={30} color="#000787" />, path: "/fridge-magnets" },
  { text: "Acrylic Wall Clock", icon: <IoMdClock size={30} color="#000787" />, path: "/acrylic-wall-clock" },
  { text: "Collage Acrylic Photo", icon: <RiCollageFill size={30} color="#000787" />, path: "/collage-acrylic-photo" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onClose} sx={{ color: "#048e1d" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItemButton
              key={text}
              onClick={() => {
                navigate(path);
                onClose();
              }}
              sx={{
                bgcolor: location.pathname === path ? "#ddd" : "transparent",
                "&:hover": { bgcolor: "#f0f0f0" },
                borderLeft: location.pathname === path ? "4px solid #048e1d" : "none",
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
