import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useContactContent } from "@/hooks/useContactContent";

const iconByKey = {
  email: Mail,
  phone: Phone,
  address: MapPin,
};

const Footer = () => {
  const { content } = useContactContent();
  const contactCards = content?.contactCards ?? [];

  return (
    <footer className="bg-sage-deep noise-texture border-t border-white/8">
      <div className="container px-6 pb-10 pt-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex flex-col gap-[3.5px]">
                {[14, 10, 6].map((w, i) => (
                  <span
                    key={i}
                    className="block rounded-full bg-[hsl(40_35%_96%)]"
                    style={{ height: "2.5px", width: `${w}px` }}
                  />
                ))}
              </span>
              <span className="text-[16px] font-bold tracking-[-0.04em] text-[hsl(40_35%_96%)]">
                Millet<span className="text-accent"> Pro</span>
              </span>
            </div>
            <p className="max-w-[22ch] text-[12.5px] leading-[1.75] text-[hsl(40_30%_90%/0.45)]">
              Modern millet nutrition, rooted in science. No fillers. No compromise.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(40_30%_90%/0.4)]">
              Navigate
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { to: "/products", label: "Products" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((linkItem) => (
                <Link
                  key={linkItem.to}
                  to={linkItem.to}
                  className="w-fit text-[13px] font-medium text-[hsl(40_30%_90%/0.55)] transition-colors hover:text-[hsl(40_35%_96%)]"
                >
                  {linkItem.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(40_30%_90%/0.4)]">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3">
              {contactCards.map((card) => {
                const Icon = iconByKey[card.key as keyof typeof iconByKey] ?? Mail;

                return (
                  <div key={card.key} className="flex items-center gap-2.5">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-accent/60" />
                    <span className="text-[12.5px] text-[hsl(40_30%_90%/0.5)]">{card.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/8 pt-7 sm:flex-row">
          <p className="text-[11px] text-[hsl(40_30%_90%/0.32)]">© 2026 Millet Pro. All rights reserved.</p>
          <p className="text-[11px] text-[hsl(40_30%_90%/0.22)]">Crafted for the health-conscious generation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
