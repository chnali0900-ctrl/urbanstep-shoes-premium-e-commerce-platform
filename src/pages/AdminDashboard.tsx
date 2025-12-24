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
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, Plus, Trash2, Edit, CheckCircle, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoeProduct, Order, OrderStatus } from '@shared/types';
export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<ShoeProduct | null>(null);
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
      toast.success('Inventory updated');
    }
  });
  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => 
      api(`/api/orders/${id}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status }) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    }
  });
  const cycleStatus = (order: Order) => {
    const sequence: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const nextIdx = (sequence.indexOf(order.status) + 1) % (sequence.length - 1); // Avoid cycling into Cancelled easily
    updateOrderStatus.mutate({ id: order.id, status: sequence[nextIdx] });
  };
  return (
    <AppLayout className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">ADMIN CONSOLE</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] mt-2">UrbanStep Global Fulfillment Network</p>
          </div>
          <div className="flex bg-secondary p-1 rounded-2xl">
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="rounded-xl px-6"
              onClick={() => setActiveTab('products')}
            >
              <Package className="mr-2 h-4 w-4" /> Products
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="rounded-xl px-6"
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Orders
            </Button>
          </div>
        </div>
        {activeTab === 'products' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-6 rounded-[2rem] border">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">In Stock</p>
                  <p className="text-3xl font-black">{productsData?.items.length ?? 0}</p>
                </div>
              </div>
              <AddProductModal 
                editingProduct={editingProduct} 
                onClose={() => setEditingProduct(null)} 
              />
            </div>
            <Card className="rounded-[2rem] overflow-hidden border-2 shadow-xl">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-black text-xs uppercase pl-8">Product Details</TableHead>
                    <TableHead className="font-black text-xs uppercase">Category</TableHead>
                    <TableHead className="font-black text-xs uppercase">Unit Price</TableHead>
                    <TableHead className="font-black text-xs uppercase text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold">COMMUNICATING WITH DO...</TableCell></TableRow>
                  ) : productsData?.items.map(product => (
                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold pl-8 py-6">{product.name}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full uppercase text-[10px]">{product.category}</Badge></TableCell>
                      <TableCell className="font-mono">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setEditingProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive rounded-full hover:bg-destructive/10"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
               <Card className="p-6 rounded-[2rem] border-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</p>
                 <p className="text-3xl font-black mt-2">
                   ${ordersData?.items.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
                 </p>
               </Card>
               <Card className="p-6 rounded-[2rem] border-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Orders</p>
                 <p className="text-3xl font-black mt-2">{ordersData?.items.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</p>
               </Card>
               <Card className="p-6 rounded-[2rem] border-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Success Rate</p>
                 <p className="text-3xl font-black mt-2">100%</p>
               </Card>
             </div>
            <Card className="rounded-[2rem] overflow-hidden border-2 shadow-xl">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-black text-xs uppercase pl-8">Order ID</TableHead>
                    <TableHead className="font-black text-xs uppercase">Customer</TableHead>
                    <TableHead className="font-black text-xs uppercase">Items</TableHead>
                    <TableHead className="font-black text-xs uppercase">Total</TableHead>
                    <TableHead className="font-black text-xs uppercase text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-20 font-bold">LOADING ORDERS...</TableCell></TableRow>
                  ) : ordersData?.items.map(order => (
                    <TableRow key={order.id} className="group">
                      <TableCell className="font-mono text-[10px] pl-8 py-6">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="text-sm font-bold">{order.customerName}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{order.email}</div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {order.items.length} units
                      </TableCell>
                      <TableCell className="font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => cycleStatus(order)}
                          className="rounded-full border-2 font-black text-[10px] tracking-widest uppercase px-4"
                        >
                          {order.status === 'Pending' && <Clock className="mr-2 h-3 w-3" />}
                          {order.status === 'Shipped' && <Truck className="mr-2 h-3 w-3" />}
                          {order.status === 'Delivered' && <CheckCircle className="mr-2 h-3 w-3" />}
                          {order.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
function AddProductModal({ editingProduct, onClose }: { editingProduct: ShoeProduct | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    if (editingProduct) setOpen(true);
  }, [editingProduct]);
  const mutation = useMutation({
    mutationFn: (data: Partial<ShoeProduct>) => {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      return api(url, { method, body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setOpen(false);
      onClose();
      toast.success(editingProduct ? 'Product updated' : 'Product added');
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
      images: [formData.get('image') as string || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
      sizes: [7, 8, 9, 10, 11, 12],
      colors: ['Default']
    };
    mutation.mutate(data);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { if(!v) onClose(); setOpen(v); }}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 font-black tracking-tighter shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" /> NEW PRODUCT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">
            {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Name</Label>
            <Input name="name" defaultValue={editingProduct?.name} className="h-12 bg-secondary" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Price ($)</Label>
              <Input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} className="h-12 bg-secondary" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Category</Label>
              <select name="category" defaultValue={editingProduct?.category} className="w-full border rounded-xl h-12 px-3 bg-secondary font-medium">
                <option>Sneakers</option>
                <option>Running</option>
                <option>Classic</option>
                <option>Outdoor</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Description</Label>
            <Input name="description" defaultValue={editingProduct?.description} className="h-12 bg-secondary" />
          </div>
           <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Image URL</Label>
            <Input name="image" defaultValue={editingProduct?.images[0]} className="h-12 bg-secondary" placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full h-14 rounded-2xl font-black tracking-tighter text-lg" disabled={mutation.isPending}>
            {mutation.isPending ? 'COMMITTING...' : editingProduct ? 'UPDATE INVENTORY' : 'CREATE ENTRY'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}