import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading'; // Custom Loading component
import { getDatabase, ref, get, child } from 'firebase/database'; // Firebase Realtime Database functions
import { Link } from 'react-router-dom';

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<any[]>([]); // Products fetched from Firebase
  const [categories, setCategories] = useState<any[]>([]); // Categories fetched from Firebase
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      try {
        const db = getDatabase();
        const dbRef = ref(db);

        // Fetch products and categories concurrently
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          get(child(dbRef, 'products')),
          get(child(dbRef, 'categories')),
        ]);

        if (productsSnapshot.exists()) {
          setProducts(Object.entries(productsSnapshot.val()).map(([id, data]) => ({ id, ...data })));
        } else {
          setProducts([]); // No products available
        }

        if (categoriesSnapshot.exists()) {
          setCategories(Object.entries(categoriesSnapshot.val()).map(([id, data]) => ({ id, ...data })));
        } else {
          setCategories([]); // No categories available
        }

        setError(null); // Reset error state if data is fetched successfully
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products and categories');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Filter logic for products based on selected category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

  // Fade-in animation for the page
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  if (loading) return <Loading />; // Show loading component while data is being fetched
  if (error) return <p>{error}</p>; // Show error message if there's an issue fetching data

  return (
    <animated.div style={fadeIn} className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with "View Cart" */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shop Collection</h1>
          <Link
            to="/cart"
            className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base lg:text-lg"
          >
            View Cart
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {/* "All" category filter */}
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

          {/* Category buttons */}
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600">No products available in this category.</p>
          )}
        </div>
      </div>
    </animated.div>
  );
}

export default Shop;
