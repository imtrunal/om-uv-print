import Home from "./components/Pages/Home";
import Acrylic from "./components/AcrylicPhoto";
import ClearAcrylic from "./components/ClearAcrylicPhoto";
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import MainHome from "./components/Fridge Magnet/MainHome";
import CustomizePage from "./components/Fridge Magnet/CustomizePage";
import ClockCustomizer from "./components/AcrylicWallClock";
import AcrylicCollageHome from "./components/CollagePhoto/CollageHome";
import CollageAcrylicPhoto from "./components/CollagePhoto/CollageAcrylicPhoto";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar/Navbar";
import CartScreen from "./components/CartScreen";
import { Toaster, toast } from 'sonner'
import CheckoutScreen from "./components/CheckoutScreen";
import MyOrders from "./components/MyOrders";
import OrderDetails from "./components/OrderDetails";
import './index.css'
import Footer from "./components/Layouts/Footer";
import ComingSoon from "./components/ComingSoon";
function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  // const token = localStorage.getItem("token");

  // if (token && isLoginPage) {
  //   return <Navigate to="/home" />;
  // }
  return (
    <>
      <Toaster richColors position="top-center" duration={2000} />
      {!isLoginPage && <Navbar />}
      <div style={!isLoginPage ? { marginTop: "7%" } : {}}>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/acrylic" element={<ProtectedRoute><Acrylic /></ProtectedRoute>} />
          {/* <Route path="/clear-acrylic" element={<ProtectedRoute><ClearAcrylic /></ProtectedRoute>} /> */}
          <Route path="/clear-acrylic" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
          <Route path="/fridge-magnets" element={<ProtectedRoute><MainHome /></ProtectedRoute>} />
          <Route path="/fridge-magnets/:shape" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
          <Route path="/acrylic-wall-clock" element={<ProtectedRoute><ClockCustomizer /></ProtectedRoute>} />
          <Route path="/collage-acrylic-photo" element={<ProtectedRoute><AcrylicCollageHome /></ProtectedRoute>} />
          <Route path="/collage/:collageType" element={<ProtectedRoute><CollageAcrylicPhoto /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        </Routes>
        {!isLoginPage && <Footer />}
      </div>
    </>
  );
}

export default App;