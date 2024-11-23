// src/lib/api.ts

import axios from 'axios';
import { ref, push, set, remove, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from './firebase';
import type { Product, Category, User, Order } from '../types';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

// Auth Functions
export const registerUser = async (email: string, password: string, fullName: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: fullName });
  
  const userData: User = {
    id: userCredential.user.uid,
    email,
    fullName,
    whatsappNo: '',
    deliveryAddress: '',
    isAdmin: false
  };

  await set(ref(db, `users/${userCredential.user.uid}`), userData);
  return userData;
};

// api.js (or wherever you have your API functions)
export const loginUser = async (email, password) => {
  const response = await fetch('https://taash-backend.onrender.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Return the token from the response
  return data.token;  // Ensure this matches the backend response structure
};

// API URL for your backend
const API_URL = 'https://taash-backend.onrender.com/api';

// Fetch products from the backend
export const getProductsFromBackend = async () => {
  const response = await axios.get(`${API_URL}/products`);
  if (response.data && response.data.products) {
    return response.data.products;
  }
  throw new Error('No products found in response');
};

// Fetch categories from the backend
export const getCategoriesFromBackend = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  if (response.data && response.data.categories) {
    return response.data.categories;
  }
  throw new Error('No categories found in response');
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
};

// Image Upload to ImgBB
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  const response = await axios.post('https://api.imgbb.com/1/upload', formData);
  return response.data.data.url;
};

// Firebase Products
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const newProductRef = push(ref(db, 'products'));
  const productWithId = { ...product, id: newProductRef.key };
  await set(newProductRef, productWithId);
  return newProductRef.key!;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await remove(ref(db, `products/${id}`));
};

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await get(ref(db, 'products'));
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};

// Firebase Categories
export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const newCategoryRef = push(ref(db, 'categories'));
  const categoryWithId = { ...category, id: newCategoryRef.key };
  await set(newCategoryRef, categoryWithId);
  return newCategoryRef.key!;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await remove(ref(db, `categories/${id}`));
};

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await get(ref(db, 'categories'));
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};

// Firebase Users
export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  await update(ref(db, `users/${id}`), updates);
};

export const getUser = async (id: string): Promise<User | null> => {
  const snapshot = await get(ref(db, `users/${id}`));
  return snapshot.val();
};

// Orders
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  const newOrderRef = push(ref(db, 'orders'));
  const orderWithId = { ...orderData, id: newOrderRef.key };
  await set(newOrderRef, orderWithId);
  
  // Update product stock
  for (const item of orderData.items) {
    const productRef = ref(db, `products/${item.id}`);
    const productSnapshot = await get(productRef);
    const currentStock = productSnapshot.val().stock;
    await update(productRef, { stock: currentStock - item.quantity });
  }
  
  return newOrderRef.key!;
};

export const getOrders = async (): Promise<Order[]> => {
  const snapshot = await get(ref(db, 'orders'));
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersRef = ref(db, 'orders');
  const ordersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(ordersQuery);
  return snapshot.val() ? Object.values(snapshot.val()) : [];
};

// Auth State Observer
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
