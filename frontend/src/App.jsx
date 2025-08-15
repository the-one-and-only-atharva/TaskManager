import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/layout/Home";
import Canvas from "./components/orbital/Canvas";
import Navbar, { withRouteTransition } from "./components/layout/Navbar.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  const HomePage = withRouteTransition(Home);
  const CanvasPage = withRouteTransition(Canvas);
  const AuthPage = withRouteTransition(Auth);
  const ProfilePage = withRouteTransition(Profile);

  const ScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);
    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <CanvasPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
