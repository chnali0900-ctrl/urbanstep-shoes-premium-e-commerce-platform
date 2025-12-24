import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, ShoppingCart, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoeProduct, Order } from '@shared/types';
export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api<{ items: ShoeProduct[] }>('/api/products'),
  });
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api<{ items: Order[] }>('/api/orders'),
  });
  const deleteProduct = useMutation({
    mutationFn: (id: string) => api(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    }
  });
  return (
    <AppLayout className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-muted-foreground mt-1">Manage your store inventory and orders.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'products' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('products')}
            >
              <Package className="mr-2 h-4 w-4" /> Products
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Orders
            </Button>
          </div>
        </div>
        {activeTab === 'products' ? (
          <div className="space-y-6">
            <div className="flex justify-end">
              <AddProductModal />
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-10">Loading...</TableCell></TableRow>
                    ) : productsData?.items.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-10">Loading...</TableCell></TableRow>
                    ) : ordersData?.items.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
function AddProductModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const addMutation = useMutation({
    mutationFn: (data: Partial<ShoeProduct>) => api('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
      toast.success('Product added successfully');
    }
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as any,
      gender: formData.get('gender') as any,
      description: formData.get('description') as string,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ['Black']
    };
    addMutation.mutate(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input name="name" placeholder="Urban Velocity" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input name="price" type="number" step="0.01" placeholder="129.99" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select name="category" className="w-full border rounded-md h-10 px-3 bg-background">
                <option>Sneakers</option>
                <option>Running</option>
                <option>Classic</option>
                <option>Outdoor</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input name="description" placeholder="Short product description" />
          </div>
          <Button type="submit" className="w-full" disabled={addMutation.isPending}>
            {addMutation.isPending ? 'Saving...' : 'Save Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}