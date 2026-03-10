import { apiFetch } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

type PaymentProvider = "razorpay" | "mock";

type MockInstructions = {
  otp: string;
  cards: {
    success: string[];
    failure: string[];
  };
  upi: {
    success: string;
    failure: string;
  };
};

export type PaymentSession = {
  provider: PaymentProvider;
  orderId: string;
  amount: number;
  currency: string;
  merchantName: string;
  testMode: boolean;
  key?: string;
  mockInstructions?: MockInstructions;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (payment: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
};

export type PaymentVerificationResult = {
  verified: boolean;
  provider: PaymentProvider;
  orderId: string;
  paymentId: string;
  signature?: string;
  paymentStatus: "paid" | "failed";
  paymentReference?: string;
  paymentMethod?: string;
  message?: string;
};

export type MockVerificationPayload = {
  provider: "mock";
  orderId: string;
  paymentMethod: "card" | "upi" | "wallet" | "netbanking";
  testValue?: string;
  otp?: string;
  mockOutcome?: "success" | "failure";
};

type RazorpayVerificationPayload = {
  provider: "razorpay";
  orderId: string;
  paymentId: string;
  signature: string;
};

type VerificationPayload = MockVerificationPayload | RazorpayVerificationPayload;

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export async function createPaymentSession(amountInRupees: number) {
  return apiFetch<PaymentSession>("/payments/create-order", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ amount: Math.round(amountInRupees * 100) }),
  });
}

export async function verifyPayment(payload: VerificationPayload) {
  return apiFetch<PaymentVerificationResult>("/payments/verify", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function openRazorpayCheckout(options: {
  session: PaymentSession;
  customer: { name: string; email: string; phone: string };
  onSuccess: (result: PaymentVerificationResult) => Promise<void> | void;
  onFailure?: (reason: string) => void;
}) {
  const { session, customer, onSuccess, onFailure } = options;

  if (session.provider !== "razorpay" || !session.key) {
    throw new Error("Razorpay is not available for this payment session.");
  }

  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay Checkout.js is unavailable.");
  }

  return new Promise<void>((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: session.key,
      amount: session.amount,
      currency: session.currency,
      order_id: session.orderId,
      name: session.merchantName,
      description: "Secure order payment",
      theme: {
        color: "hsl(35, 90%, 55%)",
      },
      modal: {
        ondismiss: () => {
          onFailure?.("Payment cancelled by user.");
          resolve();
        },
      },
      handler: async (payment) => {
        try {
          const result = await verifyPayment({
            provider: "razorpay",
            orderId: payment.razorpay_order_id,
            paymentId: payment.razorpay_payment_id,
            signature: payment.razorpay_signature,
          });

          await onSuccess(result);
          resolve();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Payment verification failed.";
          onFailure?.(message);
          reject(error);
        }
      },
    });

    razorpay.open();
  });
}
