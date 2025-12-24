import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const addItem = useCartStore(s => s.addItem);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button className="mt-4" onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, selectedSize);
    toast.success(`${product.name} added to bag!`, {
      description: `Size: ${selectedSize}`,
    });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-lg bg-muted border cursor-pointer hover:opacity-80 transition">
                <img src={img} alt={`${product.name} ${idx}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {/* Info */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-primary font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-orange-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>
            </div>
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {product.description}
          </p>
          <Separator className="mb-8" />
          {/* Size Selector */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="font-semibold uppercase text-xs tracking-wider">Select Size</span>
              <button className="text-xs text-muted-foreground hover:underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 border rounded-md text-sm font-medium transition-all ${
                    selectedSize === size 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:border-primary/50 text-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-4 mb-10">
            <Button size="lg" className="flex-1 h-14 text-lg font-bold rounded-xl" onClick={handleAddToCart}>
              ADD TO BAG
            </Button>
            <Button size="lg" variant="outline" className="h-14 w-14 rounded-xl">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-6 mt-auto">
            <div className="flex gap-4 p-4 bg-muted/50 rounded-xl border border-border">
              <Truck className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Free standard delivery</p>
                <p className="text-xs text-muted-foreground">Order within 12 hours for delivery on Tuesday</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-muted/50 rounded-xl border border-border">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">2 Year Warranty</p>
                <p className="text-xs text-muted-foreground">Premium quality guaranteed. Easy returns within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}