import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type { ShoeProduct } from '@shared/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
const CATEGORIES = ['Sneakers', 'Running', 'Classic', 'Outdoor'];
export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'Newest' | 'Price Low' | 'Price High'>('Newest');
  const categoryFilter = searchParams.get('category') || 'All';
  const genderFilter = searchParams.get('gender') || 'All';
  const { data, isLoading } = useQuery({
    queryKey: ['products', categoryFilter, genderFilter, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (genderFilter !== 'All') params.set('gender', genderFilter);
      const res = await api<{ items: ShoeProduct[] }>(`/api/products?${params.toString()}`);
      // Client-side sort for initial phase since backend is simplified
      const items = [...res.items];
      if (sortBy === 'Price Low') items.sort((a, b) => a.price - b.price);
      if (sortBy === 'Price High') items.sort((a, b) => b.price - a.price);
      return { items };
    },
  });
  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };
  const products = data?.items ?? [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter">THE CATALOG</h1>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                {isLoading ? "Fetching Inventory..." : `${products.length} Items Available`}
              </span>
              {(categoryFilter !== 'All' || genderFilter !== 'All') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] font-bold rounded-full bg-primary/10"
                  onClick={() => setSearchParams({})}
                >
                  CLEAR FILTERS <X className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 rounded-xl font-bold border-2">
                  SORT: {sortBy.toUpperCase()} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-2">
                <DropdownMenuItem className="font-bold" onClick={() => setSortBy('Newest')}>NEWEST</DropdownMenuItem>
                <DropdownMenuItem className="font-bold" onClick={() => setSortBy('Price Low')}>PRICE: LOW TO HIGH</DropdownMenuItem>
                <DropdownMenuItem className="font-bold" onClick={() => setSortBy('Price High')}>PRICE: HIGH TO LOW</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-64 space-y-10 flex-shrink-0">
            <div className="space-y-6">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] border-l-4 border-primary pl-3">Category</h3>
              <div className="flex flex-wrap lg:flex-col gap-1">
                {['All', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter('category', cat)}
                    className={`text-left py-2.5 px-4 rounded-xl transition-all text-sm font-bold uppercase tracking-wider ${
                      categoryFilter === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Separator className="bg-border/50" />
            <div className="space-y-6">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] border-l-4 border-primary pl-3">Gender</h3>
              <div className="flex flex-wrap lg:flex-col gap-1">
                {['All', 'Men', 'Women', 'Unisex'].map(gen => (
                  <button
                    key={gen}
                    onClick={() => setFilter('gender', gen)}
                    className={`text-left py-2.5 px-4 rounded-xl transition-all text-sm font-bold uppercase tracking-wider ${
                      genderFilter === gen
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed">
                <p className="text-xl font-bold tracking-tight text-muted-foreground uppercase">Nothing in the vault.</p>
                <Button variant="link" className="font-bold" onClick={() => setSearchParams({})}>RESET ALL FILTERS</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}