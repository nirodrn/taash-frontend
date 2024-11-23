import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading'; // Import the custom Loading component
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<any[]>([]); // Products fetched from backend
  const [categories, setCategories] = useState<any[]>([]); // Categories fetched from backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch products and categories from the backend
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get('https://taash-backend.onrender.com/api/products');
        const categoriesResponse = await axios.get('https://taash-backend.onrender.com/api/categories');

        // Set products state
        if (productsResponse.data && productsResponse.data.products) {
          setProducts(Object.values(productsResponse.data.products)); // Convert product object to array
        }

        // Set categories state
        if (categoriesResponse.data && categoriesResponse.data.categories) {
          setCategories(Object.values(categoriesResponse.data.categories)); // Convert category object to array
        }

        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        setError('Failed to load products and categories');
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Category filter logic
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => {
          return categories
            .find((category) => category.id === selectedCategory)
            ?.products.includes(product.id);
        });

  // Fade-in animation for page content
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  if (loading) return <Loading />; // Render custom Loading component
  if (error) return <p>{error}</p>; // Show error message

  return (
    <animated.div style={fadeIn} className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Collection Header with View Cart Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shop Collection</h1>
          <Link
            to="/cart"
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            View Cart
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {/* Add "All" category to the list of categories */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } transition-colors`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </animated.div>
  );
}

export default Shop;
