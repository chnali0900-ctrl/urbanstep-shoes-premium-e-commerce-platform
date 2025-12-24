import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Zip code is required"),
});
type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore(s => s.items);
  const totalPrice = useCartStore(s => s.totalPrice);
  const clearCart = useCartStore(s => s.clearCart);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });
  const total = totalPrice();
  const onSubmit = async (data: CheckoutFormValues) => {
    if (step < 2) {
      setStep(2);
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          image: i.images[0]
        })),
        totalAmount: total,
      };
      const result = await api<{ id: string }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      setOrderSuccess(result.id);
      clearCart();
      toast.success("Order confirmed!");
    } catch (error) {
      toast.error("Order processing failed.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tighter">SUCCESSFUL!</h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
            Your order <span className="font-mono font-bold text-foreground">#{orderSuccess.slice(0, 8)}</span> has been confirmed. We're preparing your urban gear for shipment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-xl h-14 px-8 font-bold" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <ShoppingBag className="h-16 w-16 text-muted mx-auto" />
        <h2 className="text-3xl font-bold tracking-tight">Your bag is empty</h2>
        <Button size="lg" className="rounded-xl h-14" onClick={() => navigate('/shop')}>Return to Shop</Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">CHECKOUT</h1>
        <div className="h-px flex-1 bg-border hidden sm:block" />
        <div className="flex gap-2">
          <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Truck className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold">Delivery Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider">Full Name</Label>
                        <Input {...register("customerName")} className="h-12 bg-secondary" placeholder="Enter your name" />
                        {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider">Email Address</Label>
                        <Input {...register("email")} type="email" className="h-12 bg-secondary" placeholder="email@address.com" />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold tracking-wider">Street Address</Label>
                      <Input {...register("address")} className="h-12 bg-secondary" placeholder="123 Urban Way" />
                      {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider">City</Label>
                        <Input {...register("city")} className="h-12 bg-secondary" placeholder="City" />
                        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider">Zip Code</Label>
                        <Input {...register("zipCode")} className="h-12 bg-secondary" placeholder="Zip" />
                        {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode.message}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-bold">Payment Simulation</h2>
                    </div>
                    <div className="p-8 border-2 border-dashed rounded-3xl bg-muted/20 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider">Card Details (Simulation Only)</Label>
                        <Input className="h-12 bg-background font-mono" disabled value="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input className="h-12 bg-background font-mono" disabled value="12/28" />
                        <Input className="h-12 bg-background font-mono" disabled value="123" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between items-center pt-8 border-t">
              {step === 2 && (
                <Button type="button" variant="ghost" className="font-bold" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> REVISE SHIPPING
                </Button>
              )}
              <Button type="submit" className="ml-auto h-14 px-10 text-lg font-bold rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? "PROCESSING..." : step === 1 ? "CONTINUE TO PAYMENT" : "FINALIZE PURCHASE"}
                {step === 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-muted/40 rounded-3xl p-8 sticky top-24 border">
            <h2 className="text-xl font-bold mb-8 uppercase tracking-tighter">Order Summary</h2>
            <div className="space-y-6 mb-8">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="h-20 w-16 rounded-xl overflow-hidden border bg-background flex-shrink-0">
                    <img src={item.images[0]} className="h-full w-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Size {item.selectedSize} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold flex items-center">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="mb-6" />
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px]">Express Free</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold tracking-tighter">TOTAL</span>
                <span className="text-3xl font-bold tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}