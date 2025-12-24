import type { ShoeProduct, Category } from '@shared/types';
export const PRODUCTS: ShoeProduct[] = [
  {
    id: '1',
    name: 'Urban Velocity X1',
    price: 159.99,
    category: 'Running',
    gender: 'Men',
    description: 'Engineered for speed and comfort, the Velocity X1 features a breathable mesh upper and responsive cushioning.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
    sizes: [7, 8, 9, 10, 11, 12],
    featured: true,
    colors: ['Orange', 'Black']
  },
  {
    id: '2',
    name: 'Street Glide High',
    price: 129.99,
    category: 'Sneakers',
    gender: 'Unisex',
    description: 'Iconic high-top silhouette designed for the urban landscape. Durable leather with a classic grip sole.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'],
    sizes: [6, 7, 8, 9, 10, 11],
    featured: true,
    colors: ['Tan', 'White']
  },
  {
    id: '3',
    name: 'Cloud Walker 7',
    price: 189.99,
    category: 'Classic',
    gender: 'Women',
    description: 'The pinnacle of luxury walking. Featuring our proprietary Cloud-Tech foam for weightless movement.',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'],
    sizes: [5, 6, 7, 8, 9],
    featured: true,
    colors: ['White', 'Pastel Pink']
  },
  {
    id: '4',
    name: 'Trail Blazer Low',
    price: 145.00,
    category: 'Outdoor',
    gender: 'Men',
    description: 'Rugged, water-resistant, and ready for any terrain. All-weather traction outsole for maximum stability.',
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop'],
    sizes: [8, 9, 10, 11, 12, 13],
    colors: ['Forest Green', 'Black']
  },
  {
    id: '5',
    name: 'Aero Soft Runner',
    price: 95.00,
    category: 'Running',
    gender: 'Women',
    description: 'Lightweight everyday runner with a flexible sole and soft-touch fabric lining.',
    images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop'],
    sizes: [6, 7, 8, 9],
    colors: ['Grey', 'Mint']
  },
  {
    id: '6',
    name: 'Retro Pulse',
    price: 110.00,
    category: 'Sneakers',
    gender: 'Unisex',
    description: 'Bring back the 90s with this retro-inspired chunky sneaker. Bold colors and premium suede overlays.',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'],
    sizes: [7, 8, 9, 10, 11],
    colors: ['Multi', 'White']
  }
];
export const CATEGORIES: Category[] = ['Sneakers', 'Running', 'Classic', 'Outdoor'];