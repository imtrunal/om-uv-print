import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        color: "#DBDBDB",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        mt: "1.5rem", // Push to bottom
      }}
    >
      <Container>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Sughosh Technolab. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
