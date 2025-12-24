import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProductEntity, OrderEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { ShoeProduct, Order } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PRODUCTS
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const category = c.req.query('category');
    const gender = c.req.query('gender');
    let { items, next } = await ProductEntity.list(
      c.env, 
      cursor ?? null, 
      limit ? Math.max(1, Number(limit)) : 100
    );
    if (category && category !== 'All') {
      items = items.filter(p => p.category === category);
    }
    if (gender && gender !== 'All') {
      items = items.filter(p => p.gender === gender);
    }
    return ok(c, { items, next });
  });
  app.get('/api/products/:id', async (c) => {
    const product = new ProductEntity(c.env, c.req.param('id'));
    if (!await product.exists()) return notFound(c, 'Product not found');
    return ok(c, await product.getState());
  });
  app.post('/api/products', async (c) => {
    const body = await c.req.json() as ShoeProduct;
    if (!body.name || !body.price) return bad(c, 'Name and Price required');
    const product = await ProductEntity.create(c.env, { ...body, id: body.id || crypto.randomUUID() });
    return ok(c, product);
  });
  app.put('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as Partial<ShoeProduct>;
    const product = new ProductEntity(c.env, id);
    if (!await product.exists()) return notFound(c);
    await product.patch(body);
    return ok(c, await product.getState());
  });
  app.delete('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProductEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // ORDERS
  app.get('/api/orders', async (c) => {
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit');
    const page = await OrderEntity.list(c.env, cursor ?? null, limit ? Number(limit) : 50);
    return ok(c, page);
  });
  app.post('/api/orders', async (c) => {
    const body = await c.req.json() as Omit<Order, 'id' | 'createdAt' | 'status'>;
    if (!body.items || body.items.length === 0) return bad(c, 'No items in order');
    const newOrder: Order = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: 'Pending'
    };
    const order = await OrderEntity.create(c.env, newOrder);
    return ok(c, order);
  });
}