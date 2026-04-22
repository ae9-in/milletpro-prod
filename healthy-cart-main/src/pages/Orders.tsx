import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { AccountProfileResponse } from "@/types/account";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const panelStyle = {
  background: "hsl(233 25% 18%)",
  borderRadius: "22px",
  border: "1px solid hsl(233 20% 28%)",
  boxShadow: "0 8px 32px hsl(233 45% 5% / 0.22)",
};

const Orders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<AccountProfileResponse["orders"]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    let cancelled = false;

    apiFetch<AccountProfileResponse>("/account/profile", { auth: true })
      .then((response) => {
        if (cancelled) return;
        setOrders(response.orders);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Failed to load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPageLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <main
      className="noise-texture min-h-screen"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 100%)" }}
    >
      <section className="container mx-auto px-6 pb-20 pt-20 md:pt-28">
        <div className="max-w-4xl mx-auto">
          <p
            className="mb-4 font-sans-pro text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "hsl(43 25% 90% / 0.42)" }}
          >
            Millet Pro - Orders
          </p>
          <h1
            className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.04]"
            style={{ color: "hsl(43 25% 92%)", letterSpacing: "-0.04em" }}
          >
            Your Orders
          </h1>

          {pageLoading ? (
            <p className="mt-12 text-sm" style={{ color: "hsl(43 18% 84% / 0.62)" }}>
              Loading order details...
            </p>
          ) : (
            <div className="mt-10">
              <div className="p-6 md:p-8" style={panelStyle}>
                <h2 className="font-display text-[1.9rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                  Order history & status
                </h2>
                <p className="mt-1 text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                  Review your previous purchases and track their current status.
                </p>

                <div className="mt-8 space-y-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-10">
                      <Package className="mx-auto h-12 w-12 opacity-20 mb-4" />
                      <p className="text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                        No orders yet.
                      </p>
                      <Link to="/products" className="mt-4 inline-block text-[hsl(35_90%_55%)] hover:underline">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => {
                      // Determine status icon and color
                      let StatusIcon = Clock;
                      let statusColor = "hsl(43 18% 84% / 0.58)";
                      const statusLower = order.status.toLowerCase();
                      
                      if (statusLower === "delivered" || statusLower === "completed") {
                        StatusIcon = CheckCircle;
                        statusColor = "hsl(140 70% 50%)"; // Green
                      } else if (statusLower === "shipped" || statusLower === "processing") {
                        StatusIcon = Truck;
                        statusColor = "hsl(35 90% 55%)"; // Orange/Yellow
                      } else if (statusLower === "pending") {
                        StatusIcon = Clock;
                        statusColor = "hsl(210 70% 60%)"; // Blue
                      }

                      return (
                        <div
                          key={order.id}
                          className="rounded-[20px] border p-6"
                          style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.65)" }}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[hsl(233_18%_30%)] pb-4 mb-4">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "hsl(43 18% 84% / 0.46)" }}>
                                Order #{order.id}
                              </p>
                              <p className="mt-2 text-sm" style={{ color: "hsl(43 25% 92%)" }}>
                                Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-[hsl(233_25%_18%)] px-4 py-2 rounded-full border border-[hsl(233_18%_30%)]">
                              <StatusIcon className="h-4 w-4" style={{ color: statusColor }} />
                              <span className="text-sm font-semibold capitalize" style={{ color: statusColor }}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={`${order.id}-${item.id}-${item.weight}`} className="flex items-center justify-between gap-4 text-sm bg-[hsl(233_20%_18%)] p-3 rounded-xl border border-[hsl(233_18%_30%)]">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover" />
                                  )}
                                  <div>
                                    <p className="font-medium" style={{ color: "hsl(43 25% 92%)" }}>{item.name}</p>
                                    <p className="text-xs" style={{ color: "hsl(43 18% 84% / 0.58)" }}>{item.weight} x {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-semibold" style={{ color: "hsl(43 18% 84% / 0.8)" }}>Rs. {item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-[hsl(233_18%_30%)] flex justify-between items-center">
                            <span className="text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>Total Amount:</span>
                            <span className="text-lg font-bold" style={{ color: "hsl(35 90% 55%)" }}>Rs. {order.total}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Orders;
