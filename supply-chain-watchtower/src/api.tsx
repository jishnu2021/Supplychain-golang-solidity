// src/api.jsx
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Change if your backend runs on another port or domain

// Register API
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred during registration.";
  }
};

// Login API
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, credentials);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred during login.";
  }
};

// Update Account Details API
export const updateAccount = async (updateData) => {
  try {
    const res = await axios.put(`${BASE_URL}/users/update-details`, updateData);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while updating account details.";
  }
};

// Change Password API
export const changePassword = async (passwordData) => {
  try {
    const res = await axios.put(`${BASE_URL}/users/change-password`, passwordData);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while changing the password.";
  }
};

// Get All Products API
export const getProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/products`);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while fetching products.";
  }
};

// Get Product by ID API
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while fetching the product.";
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await axios.post(`${BASE_URL}/products`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while creating the product.";
  }
};
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("SupplyChainUser")}`, // Include token if required
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred while fetching products.";
  }
};


// Update Product Status API
export const updateProductStatus = async (id, statusData) => {
  try {
    const res = await axios.put(`${BASE_URL}/products/${id}/update-status`, statusData);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while updating the product status.";
  }
};

// Get Product History API
export const getProductHistory = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}/history`);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while fetching the product history.";
  }
};

// Delete Product API
export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || "An error occurred while deleting the product.";
  }
};
