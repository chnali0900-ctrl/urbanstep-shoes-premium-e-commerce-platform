import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
export function CartSheet({ children }: { children: React.ReactNode }) {
  const items = useCartStore(s => s.items);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);
  const totalPrice = useCartStore(s => s.totalPrice);
  const total = totalPrice();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md">
        <SheetHeader className="px-6">
          <SheetTitle>Your Bag ({items.length})</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Your bag is empty</p>
            <Button variant="link" asChild>
              <SheetTrigger asChild>
                <a href="/shop">Start shopping</a>
              </SheetTrigger>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between text-sm font-medium">
                        <h4 className="line-clamp-1">{item.name}</h4>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.id, item.selectedSize)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-6 space-y-4">
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Button className="w-full h-12 text-lg" asChild>
                <a href="/checkout">Checkout</a>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}