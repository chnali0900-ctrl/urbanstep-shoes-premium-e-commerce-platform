import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { ShoeProduct } from '@shared/types';
export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api<ShoeProduct>(`/api/products/${id}`),
    enabled: !!id
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-[4/5] rounded-3xl" />
          <div className="space-y-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <h2 className="text-3xl font-black tracking-tighter">PRODUCT NOT FOUND</h2>
        <Button className="rounded-xl h-14" onClick={() => navigate('/shop')}>BACK TO CATALOG</Button>
      </div>
    );
  }
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('SIZE REQUIRED', { description: 'Please pick a size before adding to bag.' });
      return;
    }
    addItem(product, selectedSize);
    toast.success('ADDED TO BAG', {
      description: `${product.name} (Size ${selectedSize})`,
      icon: <ShoppingBag className="h-4 w-4" />
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground mb-12 group transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> BACK TO PREVIOUS
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-2xl">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-2xl bg-muted border-2 border-transparent hover:border-primary cursor-pointer transition-all">
                <img src={img} alt={`${product.name} ${idx}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          className="flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[10px] font-black tracking-[0.2em]">
                {product.category}
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">{product.name}</h1>
              <div className="flex items-center gap-2 text-orange-500 pt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                <span className="text-[10px] text-muted-foreground font-bold tracking-widest ml-2">(124 VERIFIED REVIEWS)</span>
              </div>
            </div>
          </div>
          <p className="text-4xl font-black tracking-tighter mb-10">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            {product.description}
          </p>
          <Separator className="mb-12" />
          <div className="space-y-6 mb-12">
            <div className="flex justify-between items-baseline">
              <span className="font-black uppercase text-xs tracking-[0.2em]">Select Size</span>
              <button className="text-[10px] font-bold text-muted-foreground hover:underline tracking-widest uppercase">Size Guide</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {product.sizes.map(size => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size)}
                  className={`h-14 border-2 rounded-xl text-sm font-black transition-all ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                      : 'hover:border-primary/40 text-foreground bg-secondary/50'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mb-16">
            <Button 
              size="lg" 
              className="flex-1 h-16 text-lg font-black rounded-2xl shadow-xl shadow-primary/20" 
              onClick={handleAddToCart}
            >
              ADD TO BAG
            </Button>
            <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-2">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex gap-4 p-5 bg-muted/40 rounded-2xl border border-border/50">
              <Truck className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-wider">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground font-medium">Urban express delivery included.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-muted/40 rounded-2xl border border-border/50">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-wider">2yr Warranty</p>
                <p className="text-[10px] text-muted-foreground font-medium">Premium craftsmanship guarantee.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}