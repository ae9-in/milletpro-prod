import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState<"1kg" | "500g">("1kg");
  const { addToCart } = useCart();

  const currentPrice = product.prices[weight];

  const handleAdd = () => {
    addToCart(product, weight, currentPrice, qty);
    toast.success(`${product.name} (${weight === "1kg" ? "1Kg" : "500g"}) added to cart.`);
    setQty(1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="card-premium group relative flex flex-col overflow-hidden transition-all duration-400 hover:-translate-y-1"
    >
      {/* Best Seller ribbon */}
      {product.isBestSeller && (
        <span
          className="absolute left-4 top-4 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em]"
          style={{
            background: "hsl(35 90% 45%)",
            color: "hsl(233 10% 95%)",
          }}
        >
          Best Seller
        </span>
      )}

      {/* ── Image zone — restrained, not dominant ────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          background: "hsl(35 30% 95%)",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
      </div>

      {/* ── Copy zone ────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-6">

        {/* Product name — Playfair Display serif */}
        <h3
          className="font-display text-[17px] font-semibold leading-[1.3]"
          style={{ color: "hsl(233 15% 15%)" }}   /* deep navy */
        >
          {product.name}
        </h3>

        {/* Rating — subtle, understated */}
        <div className="flex items-center gap-1.5">
          <Star
            className="h-3 w-3 fill-current"
            style={{ color: "hsl(35 90% 55%)" }}   /* vibrant grain orange */
          />
          <span
            className="font-sans-pro text-[12px] font-semibold"
            style={{ color: "hsl(35 90% 45%)" }}
          >
            {product.rating}
          </span>
          <span
            className="font-sans-pro text-[12px]"
            style={{ color: "hsl(233 10% 65%)" }}
          >
            ({product.reviews})
          </span>
        </div>

        {/* Weight Selector */}
        <div className="flex flex-col gap-2 mt-1">
          <span className="font-sans-pro text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "hsl(233 10% 65%)" }}>
            Select Weight
          </span>
          <div className="flex gap-2">
            {(["1kg", "500g"] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${weight === w
                  ? "bg-[hsl(35_90%_50%)] text-[hsl(233_25%_12%)]"
                  : "bg-[hsl(233_15%_95%)] text-[hsl(233_20%_40%)] hover:bg-[hsl(233_12%_90%)]"
                  }`}
                style={{
                  border: weight === w ? "none" : "1px solid hsl(43 18% 84%)"
                }}
              >
                {w === "1kg" ? "1 Kg" : "500 g"}
              </button>
            ))}
          </div>
        </div>

        {/* Description — muted, smaller */}
        <p
          className="font-sans-pro flex-1 text-[12.5px] leading-[1.75]"
          style={{ color: "hsl(233 10% 55%)" }}
        >
          {product.description}
        </p>

        {/* Thin rule */}
        <div style={{ height: "1px", background: "hsl(43 18% 86%)" }} />

        {/* Price + quantity row */}
        <div className="flex items-center justify-between">
          {/* Price — bold, gold-warm */}
          <span
            className="font-display text-[22px] font-bold"
            style={{
              color: "hsl(41 96% 64%)",
              textShadow: "0 1px 0 hsl(233 22% 10% / 0.18)",
            }}
          >
            ₹{currentPrice}
          </span>

          {/* Qty stepper */}
          <div
            className="flex items-center overflow-hidden rounded-lg"
            style={{
              border: "1px solid hsl(43 18% 82%)",
              background: "hsl(43 22% 97%)",
            }}
          >
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center transition-colors"
              style={{ color: "hsl(233 10% 60%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(43 18% 90%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span
              className="font-sans-pro min-w-[1.8rem] text-center text-[13px] font-semibold"
              style={{ color: "hsl(233 15% 15%)" }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center transition-colors"
              style={{ color: "hsl(233 10% 60%)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(43 18% 90%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Add to Cart CTA — deep olive button */}
        <button
          onClick={handleAdd}
          className="font-sans-pro mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{
            background: "hsl(35 90% 55%)",
            color: "hsl(233 25% 12%)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(35 95% 60%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(35 90% 55%)")}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
