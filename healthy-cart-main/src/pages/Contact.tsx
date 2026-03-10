import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactContent } from "@/hooks/useContactContent";
import { apiFetch } from "@/lib/api";

const iconByKey = {
  email: Mail,
  phone: Phone,
  address: MapPin,
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { content, loading: contentLoading, error: contentError } = useContactContent();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });

      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent. We'll get back to you soon.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="noise-texture min-h-screen"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 22% 28%) 100%)" }}
    >
      <section className="container mx-auto px-6 pb-20 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 font-sans-pro text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "hsl(43 25% 90% / 0.42)" }}
          >
            Millet Pro - Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[1.02]"
            style={{ color: "hsl(43 25% 92%)", letterSpacing: "-0.04em" }}
          >
            Talk to the team
            <br />
            behind the grain.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-6 max-w-xl font-sans-pro text-[15px] leading-[1.8]"
            style={{ color: "hsl(43 18% 84% / 0.62)" }}
          >
            Reach out for product support, retail partnerships, or any question about Millet Pro. We usually reply
            within one business day.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            onSubmit={handleSubmit}
            className="rounded-[28px] border p-6 shadow-[0_16px_44px_hsl(233_30%_8%/0.28)] md:p-8"
            style={{
              background: "linear-gradient(180deg, hsl(233 23% 23% / 0.96) 0%, hsl(233 21% 20% / 0.98) 100%)",
              borderColor: "hsl(233 18% 34%)",
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "hsl(233 14% 30%)" }}>
              <div>
                <h2 className="font-display text-[1.7rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                  Send a message
                </h2>
                <p className="mt-1 font-sans-pro text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                  Tell us what you need and we will route it quickly.
                </p>
              </div>
              <div
                className="hidden h-12 w-12 items-center justify-center rounded-full md:flex"
                style={{ background: "hsl(35 90% 55%)", color: "hsl(233 25% 12%)" }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-2 block font-sans-pro text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 20% 84% / 0.62)" }}>
                  Your Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base placeholder:text-white/35"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-2 block font-sans-pro text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 20% 84% / 0.62)" }}>
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base placeholder:text-white/35"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block font-sans-pro text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(43 20% 84% / 0.62)" }}>
                  Message
                </label>
                <Textarea
                  placeholder="Tell us how we can help."
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[220px] rounded-[24px] border-white/10 bg-white/5 text-base placeholder:text-white/35"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "hsl(233 14% 30%)" }}>
              <div className="flex items-center gap-2 font-sans-pro text-sm" style={{ color: "hsl(43 18% 84% / 0.54)" }}>
                <Clock3 className="h-4 w-4" />
                Replies typically within one business day
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-full px-7 text-[14px] font-semibold"
                style={{
                  background: "linear-gradient(135deg, hsl(35 92% 58%) 0%, hsl(45 95% 65%) 100%)",
                  color: "hsl(233 25% 12%)",
                  boxShadow: "0 10px 28px hsl(35 85% 18% / 0.36)",
                }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            {contentLoading ? (
              <div
                className="rounded-[24px] border p-6"
                style={{ background: "hsl(233 20% 22% / 0.92)", borderColor: "hsl(233 16% 34%)" }}
              >
                <p className="font-sans-pro text-sm" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                  Loading contact details...
                </p>
              </div>
            ) : contentError ? (
              <div
                className="rounded-[24px] border p-6"
                style={{ background: "hsl(233 20% 22% / 0.92)", borderColor: "hsl(233 16% 34%)" }}
              >
                <p className="font-sans-pro text-sm text-red-200">{contentError}</p>
              </div>
            ) : (
              content?.contactCards.map((card, index) => {
                const Icon = iconByKey[card.key as keyof typeof iconByKey] ?? Mail;

                return (
                  <div
                    key={card.key}
                    className="rounded-[24px] border p-6"
                    style={{
                      background: index === 0 ? "hsl(43 24% 92%)" : "hsl(233 20% 22% / 0.92)",
                      borderColor: index === 0 ? "hsl(43 24% 84%)" : "hsl(233 16% 34%)",
                      boxShadow: index === 0 ? "0 14px 34px hsl(233 25% 8% / 0.18)" : "0 14px 34px hsl(233 25% 8% / 0.2)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          background: index === 0 ? "hsl(35 90% 55%)" : "hsl(233 25% 15%)",
                          color: index === 0 ? "hsl(233 25% 12%)" : "hsl(35 90% 55%)",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className="font-sans-pro text-[11px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: index === 0 ? "hsl(233 18% 30% / 0.6)" : "hsl(43 18% 84% / 0.46)" }}
                        >
                          {card.title}
                        </p>
                        <h3
                          className="mt-2 font-sans-pro text-[1.35rem] font-semibold leading-[1.2]"
                          style={{ color: index === 0 ? "hsl(233 25% 14%)" : "hsl(43 25% 92%)" }}
                        >
                          {card.value}
                        </h3>
                        <p
                          className="mt-2 font-sans-pro text-sm leading-[1.7]"
                          style={{ color: index === 0 ? "hsl(233 15% 28% / 0.8)" : "hsl(43 18% 84% / 0.58)" }}
                        >
                          {card.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div
              className="rounded-[24px] border p-6"
              style={{
                background: "linear-gradient(145deg, hsl(233 22% 18%) 0%, hsl(233 18% 24%) 100%)",
                borderColor: "hsl(233 16% 32%)",
              }}
            >
              <p className="font-sans-pro text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "hsl(43 18% 84% / 0.46)" }}>
                {content?.supportWindow.title ?? "Support Window"}
              </p>
              <h3 className="mt-3 font-display text-[1.9rem] font-semibold" style={{ color: "hsl(43 25% 94%)" }}>
                {content?.supportWindow.heading ?? "Fast, human replies."}
              </h3>
              <p className="mt-3 max-w-sm font-sans-pro text-sm leading-[1.8]" style={{ color: "hsl(43 18% 84% / 0.58)" }}>
                {content?.supportWindow.description ??
                  "For urgent shipment or order issues, use the phone number above. For all other requests, email or the contact form works best."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
