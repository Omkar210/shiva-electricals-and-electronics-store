import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Cart() {
  const cart = useQuery(api.cart.getCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (cartId: any, newQuantity: number) => {
    try {
      await updateQuantity({ cartId, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (cartId: any) => {
    try {
      await removeFromCart({ cartId });
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cart?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  ) || 0;

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {cart.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Add some products to get started
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/products")}
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card key={item._id} className="border-blue-100">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {item.product?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.product?.category}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleUpdateQuantity(item._id, item.quantity - 1)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    handleUpdateQuantity(item._id, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-lg font-bold text-blue-600">
                                  ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleRemove(item._id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="border-blue-100 sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>₹{shipping}</span>
                        </div>
                        <div className="border-t border-blue-100 pt-3 flex justify-between text-lg font-bold text-gray-900">
                          <span>Total</span>
                          <span className="text-blue-600">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => toast.success("Checkout feature coming soon!")}
                      >
                        Proceed to Checkout
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => navigate("/products")}
                      >
                        Continue Shopping
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
