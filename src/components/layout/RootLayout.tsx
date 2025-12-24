import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/cart-sheet';
import { useCartStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
export function RootLayout() {
  const totalItems = useCartStore(s => s.totalItems);
  const count = totalItems();
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tighter text-foreground">URBAN<span className="text-primary">STEP</span></span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link to="/shop" className="transition-colors hover:text-primary">Shop</Link>
                <Link to="/about" className="transition-colors hover:text-primary">About</Link>
                <Link to="/contact" className="transition-colors hover:text-primary">Contact</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle className="relative" />
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
              <CartSheet>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                      {count}
                    </span>
                  )}
                </Button>
              </CartSheet>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-bold tracking-tighter">URBANSTEP</span>
              <p className="mt-4 text-sm text-muted-foreground">
                Premium footwear for the modern explorer. Quality, comfort, and style in every step.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/shop">New Arrivals</Link></li>
                <li><Link to="/shop">Men's Collection</Link></li>
                <li><Link to="/shop">Women's Collection</Link></li>
                <li><Link to="/shop">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/shipping">Shipping Policy</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} UrbanStep Shoes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}