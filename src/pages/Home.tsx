import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  });

  const parallaxProps = useSpring({
    from: { transform: 'translate3d(0,30px,0)' },
    to: { transform: 'translate3d(0,0,0)' },
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <animated.div
        style={parallaxProps}
        className="relative h-screen flex items-center justify-center text-white"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <animated.div
          style={fadeIn}
          className="z-10 text-center px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">TAASH CLOTHING</h1>
          <p className="text-xl md:text-2xl mb-8">
            Elevate Your Style, Define Your Story
          </p>
          <Link
            to="/shop"
            className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </animated.div>
      </animated.div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <animated.div
              style={fadeIn}
              className="text-center p-6"
            >
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-800" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Crafted with the finest materials for lasting comfort
              </p>
            </animated.div>
            <animated.div
              style={fadeIn}
              className="text-center p-6"
            >
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-800" />
              <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
              <p className="text-gray-600">
                Stay ahead with our curated collection
              </p>
            </animated.div>
            <animated.div
              style={fadeIn}
              className="text-center p-6"
            >
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-800" />
              <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">
                Your style, your way, always
              </p>
            </animated.div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                title: 'Summer Collection',
              },
              {
                image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                title: 'Winter Essentials',
              },
              {
                image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                title: 'Casual Wear',
              },
            ].map((item, index) => (
              <animated.div
                key={index}
                style={fadeIn}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white text-2xl font-semibold">{item.title}</h3>
                </div>
              </animated.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;