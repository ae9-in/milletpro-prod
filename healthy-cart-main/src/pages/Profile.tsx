import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, Mail, MapPin, Phone, Save, ShoppingBag, User2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { AccountProfileResponse, AccountProfile } from "@/types/account";

const panelStyle = {
  background: "hsl(233 25% 18%)",
  borderRadius: "22px",
  border: "1px solid hsl(233 20% 28%)",
  boxShadow: "0 8px 32px hsl(233 45% 5% / 0.22)",
};

const emptyProfile: AccountProfile = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  },
  isAdmin: false,
  createdAt: undefined,
};



const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<AccountProfile>(emptyProfile);
  const [stats, setStats] = useState<AccountProfileResponse["stats"] | null>(null);
  const [orders, setOrders] = useState<AccountProfileResponse["orders"]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setPageLoading(false);
      return;
    }

    let cancelled = false;

    apiFetch<AccountProfileResponse>("/account/profile", { auth: true })
      .then((response) => {
        if (cancelled) {
          return;
        }

        setProfile(response.profile);
        setStats(response.stats);
        setOrders(response.orders);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Failed to load profile.");
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

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  async function handleSave() {
    try {
      setSaving(true);
      const response = await apiFetch<{ profile: AccountProfile; message: string }>("/account/profile", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      setProfile(response.profile);
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  const joinedDate = profile.createdAt ? format(new Date(profile.createdAt), "dd MMM yyyy") : "N/A";

  return (
    <main
      className="noise-texture min-h-screen"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 100%)" }}
    >
      <section className="container mx-auto px-6 pb-20 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <p
            className="mb-4 font-sans-pro text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "hsl(43 25% 90% / 0.42)" }}
          >
            Millet Pro - Account
          </p>
          <h1
            className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.04]"
            style={{ color: "hsl(43 25% 92%)", letterSpacing: "-0.04em" }}
          >
            Your account,
            <br />
            section by section.
          </h1>
        </div>

        {pageLoading ? (
          <p className="mt-12 text-sm" style={{ color: "hsl(43 18% 84% / 0.62)" }}>
            Loading account details...
          </p>
        ) : (
          <>
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                  <div className="p-6 md:p-8" style={panelStyle}>
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-[1.9rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                          Basic details
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                          Update your profile and delivery details saved in your account.
                        </p>
                      </div>
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ background: "hsl(35 90% 55%)", color: "hsl(233 25% 12%)" }}
                      >
                        <User2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Full Name
                        </label>
                        <Input value={profile.fullName} onChange={(e) => setProfile((current) => ({ ...current, fullName: e.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Phone
                        </label>
                        <Input value={profile.phone} onChange={(e) => setProfile((current) => ({ ...current, phone: e.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Email Address
                        </label>
                        <Input value={profile.email} disabled className="h-12 rounded-2xl border-white/10 bg-white/5 text-white/70" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Address Line 1
                        </label>
                        <Input value={profile.address.line1} onChange={(e) => setProfile((current) => ({ ...current, address: { ...current.address, line1: e.target.value } }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Address Line 2
                        </label>
                        <Input value={profile.address.line2} onChange={(e) => setProfile((current) => ({ ...current, address: { ...current.address, line2: e.target.value } }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          City
                        </label>
                        <Input value={profile.address.city} onChange={(e) => setProfile((current) => ({ ...current, address: { ...current.address, city: e.target.value } }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          State
                        </label>
                        <Input value={profile.address.state} onChange={(e) => setProfile((current) => ({ ...current, address: { ...current.address, state: e.target.value } }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.56)" }}>
                          Pincode
                        </label>
                        <Input value={profile.address.pincode} onChange={(e) => setProfile((current) => ({ ...current, address: { ...current.address, pincode: e.target.value } }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="mt-6 h-12 rounded-full px-7 text-[14px] font-semibold"
                      style={{ background: "linear-gradient(135deg, hsl(35 92% 58%) 0%, hsl(45 95% 65%) 100%)", color: "hsl(233 25% 12%)" }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 md:p-8" style={panelStyle}>
                    <h2 className="font-display text-[1.7rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                      Account snapshot
                    </h2>
                    <div className="mt-6 grid gap-4">
                      {[
                        { icon: Mail, label: "Email", value: profile.email },
                        { icon: Phone, label: "Phone", value: profile.phone || "Not added yet" },
                        { icon: CalendarDays, label: "Joined", value: joinedDate },
                        { icon: MapPin, label: "Saved city", value: profile.address.city || "Not added yet" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-4 rounded-[20px] border p-4" style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.65)" }}>
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "hsl(35 90% 55%)", color: "hsl(233 25% 12%)" }}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.46)" }}>
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm" style={{ color: "hsl(43 25% 92%)" }}>
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 md:p-8" style={panelStyle}>
                    <h2 className="font-display text-[1.7rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                      Stats
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "Total Orders", value: String(stats?.totalOrders ?? 0) },
                        { label: "Total Spent", value: `Rs. ${stats?.totalSpent ?? 0}` },
                        { label: "Last Order", value: stats?.lastOrderDate ? format(new Date(stats.lastOrderDate), "dd MMM yyyy") : "N/A" },
                        { label: "Account Type", value: profile.isAdmin ? "Admin" : "Customer" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[20px] border p-5" style={{ borderColor: "hsl(233 18% 30%)", background: "hsl(233 20% 16% / 0.65)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 18% 84% / 0.46)" }}>
                            {item.label}
                          </p>
                          <p className="mt-3 flex items-center gap-2 text-[1.45rem] font-semibold" style={{ color: "hsl(43 25% 92%)" }}>
                            <ShoppingBag className="h-4 w-4" style={{ color: "hsl(35 90% 55%)" }} />
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Profile;
