import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'Newest' | 'Price Low' | 'Price High'>('Newest');
  const categoryFilter = searchParams.get('category') || 'All';
  const genderFilter = searchParams.get('gender') || 'All';
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const catMatch = categoryFilter === 'All' || p.category === categoryFilter;
      const genMatch = genderFilter === 'All' || p.gender === genderFilter;
      return catMatch && genMatch;
    }).sort((a, b) => {
      if (sortBy === 'Price Low') return a.price - b.price;
      if (sortBy === 'Price High') return b.price - a.price;
      return 0; // Newest by default (index)
    });
  }, [categoryFilter, genderFilter, sortBy]);
  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">SHOP ALL</h1>
            <p className="text-muted-foreground mt-2">Found {filteredProducts.length} results</p>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10">
                  Sort By: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('Newest')}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Price Low')}>Price Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('Price High')}>Price High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter('category', cat)}
                    className={`text-left py-2 px-3 rounded-md transition-all text-sm ${
                      categoryFilter === cat 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Gender</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {['All', 'Men', 'Women', 'Unisex'].map(gen => (
                  <button
                    key={gen}
                    onClick={() => setFilter('gender', gen)}
                    className={`text-left py-2 px-3 rounded-md transition-all text-sm ${
                      genderFilter === gen 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {gen === 'All' ? 'All Genders' : gen}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          {/* Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl font-medium text-muted-foreground">No products found for these filters.</p>
                <Button variant="link" onClick={() => setSearchParams({})}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}