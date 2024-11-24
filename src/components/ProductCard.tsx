import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { getDatabase, ref, set } from 'firebase/database';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const spring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 300, friction: 20 },
  });

  const handleAddToCart = async () => {
    if (window.confirm('Add this item to your cart?')) {
      // Fetch the user's IP address
      const ip = await getUserIP();
      
      // Add the item to Zustand cart store
      addToCart(product);

      // Save cart item to Firebase with IP as the primary key
      saveCartToFirebase(ip, product);

      toast.success(`${product.name} added to cart!`, {
        icon: '🛍️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  // Function to fetch the user's IP address
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'unknown'; // Fallback in case of an error
    }
  };

  // Function to save cart to Firebase with IP as primary key
  const saveCartToFirebase = (ip: string, product: Product) => {
    const db = getDatabase();
    const cartRef = ref(db, `cart/${ip}/${product.id}`);

    set(cartRef, {
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      quantity: 1, // Default quantity when adding to cart
      date: new Date().toISOString(), // Adding date to track the time of adding
    }).catch((error) => {
      console.error('Error saving cart to Firebase:', error);
    });
  };

  return (
    <animated.div
      style={spring}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">LKR {product.price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </animated.div>
  );
}

export default ProductCard;
