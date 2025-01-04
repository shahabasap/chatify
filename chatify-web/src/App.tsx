import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Navbar from "./layout/Navbar";
import Homepage from "./pages/Homepage";
import ProtectPublicRoutes from "./routes/ProtectPublicRoutes";
import ProtectPrivateRoutes from "./routes/ProtectPrivateRoutes";




export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<ProtectPublicRoutes />}>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Loginpage />} />
          </Route>
        </Route>

        {/* Private Routes */}
        <Route element={<ProtectPrivateRoutes />}>
          <Route path="/dashboard" element={<Homepage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}
