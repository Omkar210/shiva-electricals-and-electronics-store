import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

interface ProductCardProps {
  product: Doc<"products">;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useMutation(api.cart.addToCart);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-blue-100">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Save ₹{product.originalPrice - product.price}
            </Badge>
          )}
          {product.isSpotlight && (
            <Badge className="absolute top-2 left-2 bg-blue-600">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {product.category}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-xs text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
