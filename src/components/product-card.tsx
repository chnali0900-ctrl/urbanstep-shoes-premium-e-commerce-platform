import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group">
        <Card className="overflow-hidden border-none shadow-none bg-transparent group-hover:shadow-soft transition-all duration-300">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-xl">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.featured && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground uppercase tracking-widest text-[10px]">
                New
              </Badge>
            )}
          </div>
          <div className="mt-4 px-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category} • {product.gender}
            </p>
            <h3 className="font-semibold text-base text-foreground line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm font-medium text-foreground/80 mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}