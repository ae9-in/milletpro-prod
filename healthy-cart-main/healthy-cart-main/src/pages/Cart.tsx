import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, gst, total } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some delicious millet products.</p>
        <Button asChild className="mt-6">
          <Link to="/products">Browse Products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity, weight, price }) => (
            <div key={`${product.id}-${weight}`} className="flex gap-4 rounded-lg border bg-card p-4">
              <img src={product.image} alt={product.name} className="h-24 w-24 rounded-md object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold">
                    {product.name} ({weight === "1kg" ? "1 Kg" : "500 g"})
                  </h3>
                  <p className="text-sm text-muted-foreground">Rs. {price} each</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-md border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, weight, quantity - 1)}
                      className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, weight, quantity + 1)}
                      className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">Rs. {price * quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, weight)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border bg-card p-6">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">Rs. {total}</span>
            </div>
          </div>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link to={user ? "/checkout" : "/auth"}>{user ? "Proceed to Checkout" : "Sign In to Checkout"}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Cart;
