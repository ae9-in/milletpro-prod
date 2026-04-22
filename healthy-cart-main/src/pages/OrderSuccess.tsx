import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const estimatedDelivery = format(addDays(new Date(), 5), "dd MMM yyyy");

  return (
    <main className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-primary" />
      <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
      <p className="mt-2 text-muted-foreground">Thank you for shopping with Millet Pro</p>

      <div className="mt-8 w-full max-w-sm rounded-lg border bg-card p-6 text-left text-sm space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-mono text-xs">{orderId?.slice(0, 8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="font-semibold text-primary">Confirmed</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Delivery</span>
          <span className="font-medium">{estimatedDelivery}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/orders">View Orders</Link>
        </Button>
      </div>
    </main>
  );
};

export default OrderSuccess;
