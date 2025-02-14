import React from "react";
import { BrowserRouter as Router, Routes, Navigate, Route } from "react-router-dom";

import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import FarmerSignup from "./pages/FarmerSignup";
import ConsumerSignup from "./pages/ConsumerSignup";
import Login from "./pages/Login";

import FarmerHome from "./farmer/pages/FarmerHome";
import Products from "./farmer/pages/Products";
import Orders from "./farmer/pages/Orders";
import Settings from "./farmer/pages/Settings";
import ProductView from "./pages/ProductView";
import ProductSearch from "./pages/ProductSearch";
import Messages from "./pages/Messages";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConsumerSettings from "./pages/ConsumerSettings";
import Wishlist from "./pages/Wishlist";
import MessagesFarmer from "./farmer/pages/MessagesFarmer";

import AdminHome from "./admin/pages/AdminHome";
import UsersManagement from "./admin/pages/UsersManagement";
import AdminSettings from "./admin/pages/AdminSettings";
import ProductsManagement from "./admin/pages/ProductsManagement";

export const api_url = "http://localhost/sokolangu/api";

// Check if user is already logged in to route to the required page
const sessionsData = localStorage.getItem("sessions");

export const userFarmer =
  localStorage && sessionsData && sessionsData !== "null"
    ? JSON.parse(sessionsData).role === "farmer"
    : false;

export const userAdmin =
  localStorage && sessionsData && sessionsData !== "null"
    ? JSON.parse(sessionsData).role === "admin"
    : false; // Check if user is Admin

export const LoggedIn =
  localStorage && sessionsData && sessionsData !== "null"
    ? JSON.parse(sessionsData).user_id !== ""
    : false;

const MainRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes - Accessible to Everyone */}
          <Route path="/" element={!userFarmer && !userAdmin ? <Home /> : userAdmin ? <Navigate to="/adminHome" /> : <Navigate to="/farmerHome" />} />
          <Route path="/getstarted" element={<GetStarted />} />
          <Route path="/signupfarmer" element={<FarmerSignup />} />
          <Route path="/signupconsumer" element={<ConsumerSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Consumer Routes (Only for Non-Farmer Users) */}
          {LoggedIn && !userFarmer && !userAdmin ? (
            <>
              <Route path="/productView/:productID" element={<ProductView />} />
              <Route path="/productSearch/:search_term" element={<ProductSearch />} />
              <Route path="/messagesConsumer" element={<Messages />} />
              <Route path="/consumerSettings" element={<ConsumerSettings />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </>
          ) : (
            <>
              <Route path="/productView/:productID" element={<Navigate to="/login" />} />
              <Route path="/productSearch/:search_term" element={<Navigate to="/login" />} />
              <Route path="/messagesConsumer" element={<Navigate to="/login" />} />
              <Route path="/consumerSettings" element={<Navigate to="/login" />} />
              <Route path="/wishlist" element={<Navigate to="/login" />} />
            </>
          )}

          {/* Farmer Routes (Only for Farmer Users) */}
          {LoggedIn && userFarmer ? (
            <>
              <Route path="/farmerHome" element={<FarmerHome />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/messagesFarmer" element={<MessagesFarmer />} />
            </>
          ) : (
            <>
              <Route path="/farmerHome" element={<Navigate to="/" />} />
              <Route path="/products" element={<Navigate to="/" />} />
              <Route path="/orders" element={<Navigate to="/" />} />
              <Route path="/settings" element={<Navigate to="/" />} />
              <Route path="/messagesFarmer" element={<Navigate to="/" />} />
            </>
          )}

          {/* Admin Routes (Only for Admin Users) */}
          {LoggedIn && userAdmin ? (
            <>
              <Route path="/adminHome" element={<AdminHome />} />
              <Route path="/usersManagement" element={<UsersManagement />} />
              <Route path="/adminSettings" element={<AdminSettings />} />
              <Route path="/productsManagement" element={<ProductsManagement />} />
            </>
          ) : (
            <>
              <Route path="/adminHome" element={<Navigate to="/login" />} />
              <Route path="/usersManagement" element={<Navigate to="/login" />} />
              <Route path="/adminSettings" element={<Navigate to="/login" />} />
              <Route path="/productsManagement" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default MainRoutes;
