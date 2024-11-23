import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Added phone field for customer contact
  address: string;
  city: string;
  zipCode: string;
}

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Initial phone field
    address: '',
    city: '',
    zipCode: '',
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare the API request body
      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone, // Phone number key
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity })), // Assuming `id` exists in the cart item
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Send the request to the backend API
      const response = await fetch('https://taash-backend.onrender.com/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderId(result.orderId);
        setOrderSuccess(true); // Mark order as successful
        toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrackOrder = () => {
    // Redirect to WhatsApp with order ID
    const whatsappUrl = `https://wa.me/94703081617?text=I%20want%20to%20track%20my%20order%20ID%3A%20${orderId}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <animated.div style={fadeIn} className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        {orderSuccess ? (
          // Order success prompt
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-lg mb-6">Your order ID is <strong>{orderId}</strong>.</p>
            <button
              onClick={handleTrackOrder}
              className="py-2 px-4 bg-green-600 text-white rounded"
            >
              Track Order
            </button>
          </div>
        ) : (
          // Checkout form
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User details form */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="city" className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2 bg-blue-600 text-white rounded"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </animated.div>
  );
}

export default Checkout;
