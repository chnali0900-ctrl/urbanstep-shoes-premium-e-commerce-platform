import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
export function CartSheet({ children }: { children: React.NewNode }) {
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
          <SheetTitle className="flex items-center gap-2">
            Your Bag <Badge variant="secondary" className="rounded-full px-2">{items.length}</Badge>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 px-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              <ShoppingCart className="h-16 w-16 text-muted/50" />
            </motion.div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">Add some items to get started on your urban journey.</p>
            </div>
            <Button variant="outline" className="mt-4 rounded-xl" asChild>
              <SheetTrigger asChild>
                <a href="/shop">Start shopping</a>
              </SheetTrigger>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 overflow-hidden"
                    >
                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-muted">
                        <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between h-24 py-1">
                        <div>
                          <div className="flex justify-between text-sm font-semibold">
                            <h4 className="line-clamp-1">{item.name}</h4>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => removeItem(item.id, item.selectedSize)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="p-6 bg-muted/30 border-t space-y-4">
              <div className="flex justify-between text-base font-bold">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                Shipping and taxes calculated at checkout.
              </p>
              <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" asChild>
                <a href="/checkout">Checkout</a>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}