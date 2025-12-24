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
import { CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
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
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground mb-8">Your order #{orderSuccess.slice(0, 8)} has been placed.</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </motion.div>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
        <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input {...register("customerName")} placeholder="John Doe" />
                      {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input {...register("email")} type="email" placeholder="john@example.com" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input {...register("address")} placeholder="123 Street Ave" />
                    {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input {...register("city")} placeholder="New York" />
                      {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input {...register("zipCode")} placeholder="10001" />
                      {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>
                  <div className="p-6 border rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a simulation. No real payment will be processed.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="XXXX XXXX XXXX XXXX" disabled value="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" disabled value="12/28" />
                        <Input placeholder="CVC" disabled value="123" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between pt-6 border-t">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : step === 1 ? "Next Step" : "Place Order"}
                {step === 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-muted/50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden border">
                    <img src={item.images[0]} className="h-full w-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Size: {item.selectedSize} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}