import { useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, CreditCard, Landmark, Loader2, Smartphone, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openRazorpayCheckout, verifyPayment } from "@/lib/paymentService";
import type { PaymentSession, PaymentVerificationResult } from "@/lib/paymentService";

type PaymentGatewayModalProps = {
  open: boolean;
  session: PaymentSession | null;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
  onVerified: (result: PaymentVerificationResult) => Promise<void> | void;
  onFailure: (message: string) => void;
};

const methodCards = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
] as const;

type MethodId = (typeof methodCards)[number]["id"];

const overlayStyle = {
  background: "linear-gradient(180deg, hsl(233 35% 8% / 0.82) 0%, hsl(233 40% 6% / 0.9) 100%)",
  backdropFilter: "blur(12px)",
} as const;

export default function PaymentGatewayModal(props: PaymentGatewayModalProps) {
  const { open, session, customer, onClose, onVerified, onFailure } = props;
  const [method, setMethod] = useState<MethodId>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [mockOutcome, setMockOutcome] = useState<"success" | "failure">("failure");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountLabel = useMemo(() => {
    if (!session) {
      return "Rs. 0";
    }

    return `Rs. ${(session.amount / 100).toFixed(2)}`;
  }, [session]);

  if (!open || !session) {
    return null;
  }

  async function handleMockPay() {
    try {
      setBusy(true);
      setError(null);

      const payload =
        method === "card"
          ? { provider: "mock" as const, orderId: session.orderId, paymentMethod: "card" as const, testValue: cardNumber, otp }
          : method === "upi"
            ? { provider: "mock" as const, orderId: session.orderId, paymentMethod: "upi" as const, testValue: upiId }
            : method === "wallet"
              ? { provider: "mock" as const, orderId: session.orderId, paymentMethod: "wallet" as const, mockOutcome }
              : { provider: "mock" as const, orderId: session.orderId, paymentMethod: "netbanking" as const, mockOutcome };

      const result = await verifyPayment(payload);
      await onVerified(result);
    } catch (paymentError) {
      const message = paymentError instanceof Error ? paymentError.message : "Mock payment failed.";
      setError(message);
      onFailure(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRazorpayPay() {
    try {
      setBusy(true);
      setError(null);

      await openRazorpayCheckout({
        session,
        customer,
        onSuccess: async (result) => {
          await onVerified(result);
        },
        onFailure: (message) => {
          setError(message);
          onFailure(message);
        },
      });
    } catch (paymentError) {
      const message = paymentError instanceof Error ? paymentError.message : "Unable to open Razorpay checkout.";
      setError(message);
      onFailure(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" style={overlayStyle}>
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border"
        style={{
          background: "linear-gradient(145deg, hsl(233 26% 18%) 0%, hsl(233 24% 13%) 52%, hsl(233 28% 10%) 100%)",
          borderColor: "hsl(233 16% 32%)",
          boxShadow: "0 24px 80px hsl(233 45% 4% / 0.55)",
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at top left, hsl(35 92% 58% / 0.18), transparent 38%)" }} />

        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-white/80 transition hover:text-white disabled:opacity-50"
          style={{ borderColor: "hsl(233 18% 34%)", background: "hsl(233 20% 18% / 0.7)" }}
          aria-label="Close payment modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b px-6 py-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-9" style={{ borderColor: "hsl(233 16% 28%)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: "hsl(43 25% 90% / 0.48)" }}>
              {session.provider === "mock" ? "Mock Payment Gateway" : "Razorpay Test Mode"}
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.7rem)] font-semibold leading-[1.02]" style={{ color: "hsl(43 25% 94%)" }}>
              Complete your payment
            </h2>
            <p className="mt-3 max-w-md text-sm leading-[1.75]" style={{ color: "hsl(43 18% 84% / 0.62)" }}>
              {session.provider === "mock"
                ? "Use the test credentials below to simulate success and failure flows without real money."
                : "You are in Razorpay test mode. No real money will be charged during this transaction."}
            </p>

            <div
              className="mt-8 rounded-[24px] border p-5"
              style={{ background: "hsl(233 20% 16% / 0.88)", borderColor: "hsl(233 18% 30%)" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: "hsl(43 18% 84% / 0.48)" }}>
                Payment Summary
              </p>
              <div className="mt-4 flex items-end justify-between gap-5">
                <div>
                  <p className="font-display text-[2rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                    {amountLabel}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                    {session.merchantName} · {session.currency}
                  </p>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    background: session.provider === "mock" ? "hsl(35 90% 55%)" : "hsl(180 70% 45%)",
                    color: "hsl(233 25% 12%)",
                  }}
                >
                  {session.provider === "mock" ? "Sandbox" : "Test Mode"}
                </div>
              </div>
            </div>

            {session.provider === "mock" && (
              <div className="mt-6 rounded-[24px] border p-5" style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.7)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: "hsl(43 18% 84% / 0.48)" }}>
                  Sandbox Payment
                </p>
                <p className="mt-3 text-sm leading-[1.8]" style={{ color: "hsl(43 18% 84% / 0.62)" }}>
                  This checkout is running in internal test mode. Complete the payment using the method you were given.
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-7 lg:px-8 lg:py-9">
            {session.provider === "mock" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {methodCards.map((card) => {
                    const Icon = card.icon;
                    const selected = method === card.id;

                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setMethod(card.id)}
                        className="rounded-[20px] border p-4 text-left transition-all"
                        style={{
                          borderColor: selected ? "hsl(35 92% 58%)" : "hsl(233 18% 30%)",
                          background: selected ? "hsl(35 90% 55% / 0.12)" : "hsl(233 20% 16% / 0.7)",
                          boxShadow: selected ? "0 0 0 1px hsl(35 92% 58% / 0.25)" : "none",
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: selected ? "hsl(35 92% 58%)" : "hsl(43 18% 84% / 0.64)" }} />
                        <p className="mt-4 text-sm font-semibold" style={{ color: "hsl(43 25% 92%)" }}>
                          {card.label}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[24px] border p-5" style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.75)" }}>
                  {method === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Test Card Number
                        </label>
                        <Input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35" />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          OTP
                        </label>
                        <Input value={otp} onChange={(event) => setOtp(event.target.value)} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35" />
                      </div>
                    </div>
                  )}

                  {method === "upi" && (
                    <div>
                      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                        Test UPI ID
                      </label>
                      <Input value={upiId} onChange={(event) => setUpiId(event.target.value)} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35" />
                    </div>
                  )}

                  {(method === "wallet" || method === "netbanking") && (
                    <div>
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                        Mock Outcome
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {(["success", "failure"] as const).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setMockOutcome(value)}
                            className="rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                            style={{
                              borderColor: mockOutcome === value ? "hsl(35 92% 58%)" : "hsl(233 18% 30%)",
                              background: mockOutcome === value ? "hsl(35 90% 55% / 0.12)" : "transparent",
                              color: "hsl(43 25% 92%)",
                            }}
                          >
                            {value === "success" ? "Simulate Success" : "Simulate Failure"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "hsl(0 62% 46% / 0.45)", background: "hsl(0 62% 46% / 0.14)", color: "hsl(0 0% 96%)" }}>
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleMockPay}
                  disabled={busy}
                  className="mt-6 h-12 w-full rounded-full text-[14px] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, hsl(35 92% 58%) 0%, hsl(45 95% 65%) 100%)",
                    color: "hsl(233 25% 12%)",
                    boxShadow: "0 10px 28px hsl(35 85% 18% / 0.36)",
                  }}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                  {busy ? "Processing Payment..." : `Pay Securely ${amountLabel}`}
                </Button>
              </>
            ) : (
              <div className="rounded-[24px] border p-6" style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.75)" }}>
                <p className="text-sm leading-[1.8]" style={{ color: "hsl(43 18% 84% / 0.62)" }}>
                  Continue to Razorpay test checkout. Use their test cards, UPI IDs, or bank flows to complete the payment.
                </p>
                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "hsl(0 62% 46% / 0.45)", background: "hsl(0 62% 46% / 0.14)", color: "hsl(0 0% 96%)" }}>
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={handleRazorpayPay}
                  disabled={busy}
                  className="mt-6 h-12 w-full rounded-full text-[14px] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, hsl(35 92% 58%) 0%, hsl(45 95% 65%) 100%)",
                    color: "hsl(233 25% 12%)",
                    boxShadow: "0 10px 28px hsl(35 85% 18% / 0.36)",
                  }}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                  {busy ? "Opening Razorpay..." : "Continue to Razorpay"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
