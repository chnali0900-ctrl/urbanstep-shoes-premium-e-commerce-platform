import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { PRODUCTS } from '@/lib/data';
import { motion } from 'framer-motion';
export function HomePage() {
  const featured = PRODUCTS.filter(p => p.featured);
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Runner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              ELEVATE YOUR <br />
              <span className="text-primary italic">URBAN JOURNEY</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium">
              Experience the perfect fusion of high-performance technology and street-ready style. Crafted for those who never stop moving.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90" asChild>
                <Link to="/shop">Shop Collection</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white text-white hover:bg-white/10" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On all orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure payment gateway</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Next Day Delivery</h3>
              <p className="text-sm text-muted-foreground">Available in select cities</p>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <p className="text-muted-foreground">The latest and greatest from our designers.</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link to="/shop" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* Category Grid */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group aspect-video md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Men"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10 text-white">
                <h3 className="text-4xl font-bold mb-4">FOR HIM</h3>
                <p className="mb-6 max-w-sm text-white/80">Dominate the streets with precision-engineered footwear designed for men who demand more.</p>
                <Button className="w-fit bg-white text-black hover:bg-white/90" asChild>
                  <Link to="/shop?gender=Men">Shop Men</Link>
                </Button>
              </div>
            </div>
            <div className="relative group aspect-video md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Women"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10 text-white">
                <h3 className="text-4xl font-bold mb-4">FOR HER</h3>
                <p className="mb-6 max-w-sm text-white/80">Elegant aesthetics meet high-performance comfort. Redefine your style with the Women's line.</p>
                <Button className="w-fit bg-white text-black hover:bg-white/90" asChild>
                  <Link to="/shop?gender=Women">Shop Women</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-muted rounded-3xl py-16 px-6 md:px-20 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">JOIN THE MOVEMENT</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Be the first to know about new drops, exclusive collaborations, and member-only rewards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 rounded-xl bg-background border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="h-full py-4 px-8 rounded-xl font-bold">SUBSCRIBE</Button>
          </div>
        </div>
      </section>
    </div>
  );
}