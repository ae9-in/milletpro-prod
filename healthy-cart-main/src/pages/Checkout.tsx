import { useRef, useState } from "react";
import type { CSSProperties, ElementType, FormEvent, HTMLAttributes, ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Building2, Home, Lock, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import PaymentGatewayModal from "@/components/checkout/PaymentGatewayModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createPaymentSession } from "@/lib/paymentService";
import { openRazorpayCheckout } from "@/lib/paymentService";
import type { PaymentSession, PaymentVerificationResult } from "@/lib/paymentService";
import { apiFetch } from "@/lib/api";

type FloatingInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  icon?: ElementType;
  required?: boolean;
  optional?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
};

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  icon: Icon,
  required,
  optional,
  inputMode,
}: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 select-none font-sans-pro transition-all duration-200"
          style={{
            top: lifted ? "8px" : "50%",
            transform: lifted ? "none" : "translateY(-50%)",
            fontSize: lifted ? "10px" : "13.5px",
            fontWeight: lifted ? 600 : 400,
            letterSpacing: lifted ? "0.07em" : "normal",
            textTransform: lifted ? "uppercase" : "none",
            color: focused ? "hsl(233 45% 65%)" : lifted ? "hsl(233 15% 90%)" : "hsl(233 10% 80%)",
          }}
        >
          {label}
          {optional && (
            <span
              style={{
                marginLeft: 5,
                fontSize: 10,
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: "normal",
                color: "hsl(233 10% 70%)",
              }}
            >
              optional
            </span>
          )}
        </label>

        {Icon && (
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: focused ? "hsl(233 45% 65%)" : "hsl(233 10% 70%)", transition: "color 0.2s" }}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          required={required}
          inputMode={inputMode}
          placeholder={lifted ? placeholder : ""}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl pb-3 text-[14px] font-sans-pro outline-none transition-all duration-200"
          style={{
            paddingTop: lifted ? "24px" : "14px",
            paddingLeft: "16px",
            paddingRight: Icon ? "44px" : "16px",
            background: focused ? "hsl(43 26% 96%)" : "hsl(43 22% 97%)",
            border: `1.5px solid ${focused ? "hsl(233 45% 65%)" : "hsl(233 15% 45%)"}`,
            boxShadow: focused
              ? "0 0 0 3px hsl(233 45% 65% / 0.15), inset 0 1px 3px hsl(233 10% 10% / 0.1)"
              : "inset 0 1px 3px hsl(233 10% 10% / 0.08)",
            color: "hsl(233 25% 12%)",
          }}
        />
      </div>

      {hint && (
        <p className="pl-1 text-[11.5px] font-sans-pro" style={{ color: "hsl(233 15% 85%)" }}>
          {hint}
        </p>
      )}
    </div>
  );
};

const FieldGroupLabel = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-3 pb-1">
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.22em] font-sans-pro"
      style={{ color: "hsl(233 15% 80%)" }}
    >
      {children}
    </span>
    <span className="flex-1 border-t" style={{ borderColor: "hsl(43 14% 86%)" }} />
  </div>
);

const panelStyle: CSSProperties = {
  background: "hsl(233 25% 18%)",
  borderRadius: "18px",
  border: "1px solid hsl(233 20% 28%)",
  boxShadow: "0 2px 12px hsl(233 45% 5% / 0.25), 0 8px 32px hsl(233 45% 5% / 0.2)",
  padding: "36px",
};

const Checkout = () => {
  const { user, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState({ name: "", email: "", phone: "" });
  const pendingOrderPayloadRef = useRef<Record<string, unknown> | null>(null);
  const gst = 0;
  const total = subtotal;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const composedAddress = [street, apartment, city, state, pincode].filter(Boolean).join(", ");

  const completeOrder = async (
    verification: PaymentVerificationResult,
    pendingOrderPayload: Record<string, unknown>,
  ) => {
    const response = await apiFetch<{ order: { id: string } }>("/orders", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        ...pendingOrderPayload,
        paymentMethod: verification.provider === "razorpay" ? "razorpay" : "mock",
        paymentGateway: verification.provider,
        paymentStatus: verification.paymentStatus,
        paymentReference: verification.paymentReference || verification.paymentId,
        paymentSignature: verification.signature || null,
        mockPaymentMethod: verification.provider === "mock" ? verification.paymentMethod || null : null,
        razorpayPaymentId: verification.provider === "razorpay" ? verification.paymentId : null,
        razorpayOrderId: verification.provider === "razorpay" ? verification.orderId : null,
      }),
    });

    toast.success("Payment successful. Order placed.");
    setPaymentSession(null);
    pendingOrderPayloadRef.current = null;
    clearCart();
    navigate(`/order-success/${response.order.id}`);
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Please fill in all required delivery fields.");
      return;
    }

    setProcessing(true);

    try {
      const orderItems = items.map(({ product, quantity, weight, price }) => ({
        id: product.id,
        name: `${product.name} (${weight === "1kg" ? "1 Kg" : "500 g"})`,
        price,
        quantity,
        image: product.image,
        weight,
      }));

      const session = await createPaymentSession(total);

      const orderPayload = {
        items: orderItems,
        subtotal,
        gst,
        total,
        deliveryAddress: composedAddress,
        phone,
      };
      pendingOrderPayloadRef.current = orderPayload;
      setPaymentCustomer({
        name: fullName,
        email: email || user.email || "",
        phone,
      });

      if (session.provider === "razorpay") {
        await openRazorpayCheckout({
          session,
          customer: {
            name: "",
            email: "",
            phone: "",
          },
          onSuccess: async (verification) => {
            await completeOrder(verification, orderPayload);
            setProcessing(false);
          },
          onFailure: (reason) => {
            if (reason !== "Payment cancelled by user.") {
              toast.error(reason || "Payment failed. Please try again.");
            }
            setProcessing(false);
          },
        });
        return;
      }

      setPaymentSession(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error. Please try again.";
      toast.error(message);
      setProcessing(false);
    }
  };

  return (
    <main
      className="noise-texture min-h-screen"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 100%)" }}
    >
      <div className="container mx-auto px-6 py-16 md:py-24">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.26em] font-sans-pro"
          style={{ color: "hsl(43 25% 90% / 0.42)" }}
        >
          Millet Pro - Checkout
        </p>
        <h1
          className="mb-12 text-[clamp(2rem,4.5vw,3rem)] font-display font-semibold leading-[1.1]"
          style={{ color: "hsl(43 25% 92%)", letterSpacing: "-0.03em" }}
        >
          Complete your order.
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <div style={panelStyle}>
              <h2 className="mb-2 text-[20px] font-display font-semibold" style={{ color: "hsl(233 10% 95%)" }}>
                Delivery Details
              </h2>
              <p className="mb-8 text-[12.5px] leading-relaxed font-sans-pro" style={{ color: "hsl(233 10% 80%)" }}>
                We'll use this to deliver your order safely and on time.
              </p>

              <div className="flex flex-col gap-6">
                <FieldGroupLabel>Contact Information</FieldGroupLabel>
                <div className="flex flex-col gap-4">
                  <FloatingInput
                    id="fullName"
                    label="Full Name"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="As on your ID"
                    icon={User}
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FloatingInput
                      id="phone"
                      label="Phone Number"
                      value={phone}
                      onChange={setPhone}
                      placeholder="+91 XXXXX XXXXX"
                      type="tel"
                      icon={Phone}
                      hint="Used only for delivery updates"
                      required
                    />
                    <FloatingInput
                      id="email"
                      label="Email Address"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@example.com"
                      type="email"
                      icon={Mail}
                      hint="For order confirmation"
                      optional
                    />
                  </div>
                </div>

                <FieldGroupLabel>Delivery Address</FieldGroupLabel>
                <div className="flex flex-col gap-4">
                  <FloatingInput
                    id="street"
                    label="Street Address / House No."
                    value={street}
                    onChange={setStreet}
                    placeholder="e.g. 42 MG Road"
                    icon={MapPin}
                    required
                  />
                  <FloatingInput
                    id="apartment"
                    label="Apartment, Floor, or Landmark"
                    value={apartment}
                    onChange={setApartment}
                    placeholder="e.g. Flat 3B, near SBI ATM"
                    icon={Building2}
                    optional
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FloatingInput
                      id="city"
                      label="City"
                      value={city}
                      onChange={setCity}
                      placeholder="e.g. Bangalore"
                      icon={Home}
                      required
                    />
                    <FloatingInput
                      id="state"
                      label="State"
                      value={state}
                      onChange={setState}
                      placeholder="e.g. Karnataka"
                      required
                    />
                    <FloatingInput
                      id="pincode"
                      label="Pincode / ZIP"
                      value={pincode}
                      onChange={setPincode}
                      placeholder="560001"
                      type="text"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "hsl(233 20% 22%)", border: "1px solid hsl(233 15% 28%)" }}
                >
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: "hsl(35 90% 55%)" }} />
                  <p className="text-[12px] leading-snug font-sans-pro" style={{ color: "hsl(233 10% 85%)" }}>
                    We deliver across India in 3-5 business days. Free shipping on orders above Rs. 500.
                  </p>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <h2 className="mb-5 text-[20px] font-display font-semibold" style={{ color: "hsl(233 10% 95%)" }}>
                Payment
              </h2>

              <div
                className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: "hsl(233 20% 22%)", border: "1px solid hsl(233 15% 28%)" }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "hsl(233 25% 15%)" }}
                >
                  <ShieldCheck className="h-5 w-5" style={{ color: "hsl(35 90% 55%)" }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold font-sans-pro" style={{ color: "hsl(233 10% 95%)" }}>
                    Test payment gateway
                  </p>
                  <p className="mt-0.5 text-[12px] font-sans-pro" style={{ color: "hsl(233 10% 80%)" }}>
                    Backend-driven payment session with mock mode by default and Razorpay test mode when configured.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" style={{ color: "hsl(233 10% 70%)" }} />
                    <span className="text-[11px] font-sans-pro" style={{ color: "hsl(233 10% 75%)" }}>
                      Verification happens on the backend before the order is created
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              ...panelStyle,
              boxShadow: "0 4px 20px hsl(233 45% 5% / 0.25), 0 16px 48px hsl(233 45% 5% / 0.2)",
            }}
            className="flex h-fit flex-col"
          >
            <h2 className="mb-7 text-[20px] font-display font-semibold" style={{ color: "hsl(233 10% 95%)" }}>
              Order Summary
            </h2>

            <div className="flex flex-col gap-2.5 text-sm">
              {items.map(({ product, quantity, weight, price }) => (
                <div key={`${product.id}-${weight}`} className="flex justify-between gap-4">
                  <span className="font-sans-pro" style={{ color: "hsl(233 10% 80%)" }}>
                    {product.name} ({weight === "1kg" ? "1 Kg" : "500 g"}) x {quantity}
                  </span>
                  <span className="font-medium font-sans-pro" style={{ color: "hsl(233 10% 90%)" }}>
                    Rs. {price * quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t pt-5 text-sm" style={{ borderColor: "hsl(43 16% 84%)" }}>
              <div className="flex justify-between">
                <span className="font-sans-pro" style={{ color: "hsl(233 10% 85%)" }}>
                  Subtotal
                </span>
                <span className="font-sans-pro" style={{ color: "hsl(233 10% 95%)" }}>
                  Rs. {subtotal}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t pt-5" style={{ borderColor: "hsl(43 16% 82%)" }}>
              <span className="text-[15px] font-semibold font-sans-pro" style={{ color: "hsl(233 10% 95%)" }}>
                Total
              </span>
              <span className="text-[26px] font-bold font-display" style={{ color: "hsl(35 90% 55%)", letterSpacing: "-0.04em" }}>
                Rs. {total}
              </span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold font-sans-pro transition-all duration-200 disabled:opacity-60"
              style={{
                background: processing ? "hsl(35 90% 35%)" : "hsl(35 90% 55%)",
                color: "hsl(233 25% 12%)",
              }}
              onMouseEnter={(e) => {
                if (!processing) {
                  e.currentTarget.style.background = "hsl(35 95% 60%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px hsl(35 90% 15% / 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = processing ? "hsl(35 90% 35%)" : "hsl(35 90% 55%)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {processing ? "Opening payment..." : `Pay Rs. ${total}`}
            </button>

            <p className="mt-4 text-center text-[11.5px] font-sans-pro" style={{ color: "hsl(233 10% 80%)" }}>
              Test mode supported. No real card data is stored here.
            </p>
          </div>
        </form>
      </div>
      <PaymentGatewayModal
        open={Boolean(paymentSession)}
        session={paymentSession}
        customer={paymentCustomer}
        onClose={() => {
          setPaymentSession(null);
          setProcessing(false);
        }}
        onFailure={(message) => {
          if (message !== "Payment cancelled by user.") {
            toast.error(message);
          }
          setProcessing(false);
        }}
        onVerified={async (verification) => {
          const pendingOrderPayload = pendingOrderPayloadRef.current;

          if (!pendingOrderPayload) {
            throw new Error("Missing pending order details.");
          }

          await completeOrder(verification, pendingOrderPayload);
          setProcessing(false);
        }}
      />
    </main>
  );
};

export default Checkout;
