import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, ref, get } from "../lib/firebase";
import { User as UserIcon, Package, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const user = auth.currentUser; // Get current authenticated user
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from Firebase Realtime Database
    const fetchUserData = async () => {
      if (user) {
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserDetails(snapshot.val());
        } else {
          toast.error("User data not found");
        }
      }
    };

    // Fetch user orders from Firebase Realtime Database (assuming orders are in "orders" node)
    const fetchOrders = async () => {
      if (user) {
        const ordersRef = ref(db, "orders/" + user.uid);
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
          setOrders(snapshot.val());
        } else {
          setOrders([]);
        }
      }
    };

    fetchUserData();
    fetchOrders();
  }, [user]);

  // Update user details in Firebase Realtime Database
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (user) {
      const userRef = ref(db, "users/" + user.uid);
      await set(userRef, userDetails);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-md focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-md focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={userDetails.phone}
            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-3 py-2 border rounded-md focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={userDetails.address}
            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100"
          />
        </div>
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="border-t pt-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md ${
                  activeTab === "profile" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md ${
                  activeTab === "orders" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Orders</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {activeTab === "orders" ? renderOrders() : renderProfile()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
