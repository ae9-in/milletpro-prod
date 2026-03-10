export type AccountProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  isAdmin: boolean;
  createdAt?: string;
};

export type AccountStats = {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
};

export type AccountOrder = {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight: string;
  }>;
  subtotal: number;
  gst: number;
  total: number;
  paymentMethod: string;
  paymentGateway: string;
  paymentStatus: string;
  status: string;
  deliveryAddress: string;
  phone: string;
  createdAt: string;
};

export type AccountProfileResponse = {
  profile: AccountProfile;
  stats: AccountStats;
  orders: AccountOrder[];
};
