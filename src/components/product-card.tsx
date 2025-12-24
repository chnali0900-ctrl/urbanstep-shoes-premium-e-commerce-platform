import React from 'react';
import { Link } from 'react-router-dom';
import type { ShoeProduct } from '@shared/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
interface ProductCardProps {
  product: ShoeProduct;
}
export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link to={`/product/${product.id}`} className="group">
        <Card className="overflow-hidden border-none shadow-none bg-transparent hover:shadow-soft transition-all duration-300">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-xl">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.featured && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground uppercase tracking-widest text-[10px] font-bold">
                Featured
              </Badge>
            )}
          </div>
          <div className="mt-4 px-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">
              {product.category} • {product.gender}
            </p>
            <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
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