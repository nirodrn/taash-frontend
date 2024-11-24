import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

function Checkout() {
  const { cart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateOrderId = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${formattedDate}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const db = getDatabase();
      const generatedOrderId = generateOrderId();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error('You need to be logged in to place an order');
        return;
      }

      // Calculate delivery date (5 days from order placed date)
      const orderDate = new Date();
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 5);

      // Prepare order data for the orders table
      const orderData = {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        total,
        status: 'pending',
        createdAt: orderDate.toISOString(),
        orderId: generatedOrderId,
        userId: user.uid,
      };

      // Save order to the orders table
      const orderRef = ref(db, `orders/${generatedOrderId}`);
      await set(orderRef, orderData);

      // Prepare user-specific order data (only orderId, date, deliveryDate, price, status, items)
      const userOrderData = {
        orderId: generatedOrderId,
        date: orderDate.toISOString(),
        deliveryDate: deliveryDate.toISOString(),
        price: total,
        status: 'pending',
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      };

      // Save this order data to the user's node in the users table
      const userOrdersRef = ref(db, `users/${user.uid}/orders/${generatedOrderId}`);
      await set(userOrdersRef, userOrderData);

      setOrderId(generatedOrderId);
      setOrderSuccess(true);
      toast.success(`Order placed successfully! Order ID: ${generatedOrderId}`);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <animated.div style={fadeIn} className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orderSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-lg mb-6">Your order ID is <strong>{orderId}</strong>.</p>
            <button
              onClick={() => navigate(`/order/${orderId}`)} // Link to order tracking page or success page
              className="py-2 px-4 bg-black text-white rounded"
            >
              Track Order
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                </div>
                <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Subtotal</span>
                      <span>LKR {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Shipping</span>
                      <span>-</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-gray-900 text-sm">
                        <span>Total</span>
                        <span>LKR {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-lg shadow-md"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </animated.div>
  );
}

export default Checkout;
