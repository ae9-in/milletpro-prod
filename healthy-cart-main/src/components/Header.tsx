import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import logoIcon from "../assets/image-removebg-preview.png";
import logoText from "../assets/milletprolettering.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-background/92 backdrop-blur-md shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex h-[68px] items-center justify-between px-6">

        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          aria-label="Millet Pro home"
        >
          <img
            src={logoIcon}
            alt="Millet Pro Icon"
            className="h-8 md:h-12 w-auto object-contain"
          />
          <img
            src={logoText}
            alt="Millet Pro Lettering"
            className="h-5 md:h-[30px] w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] font-medium tracking-wide transition-colors ${location.pathname === l.to
                ? "text-[hsl(40_35%_96%)]"
                : "text-[hsl(40_35%_96%/0.55)] hover:text-[hsl(40_35%_96%/0.9)]"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/profile"
                aria-label="Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)]"
              >
                <User className="h-[17px] w-[17px]" />
              </Link>
              <Link
                to="/orders"
                aria-label="Orders"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </Link>
              <button
                onClick={handleSignOut}
                aria-label="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)]"
              >
                <LogOut className="h-[17px] w-[17px]" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              aria-label="Sign In"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)]"
            >
              <User className="h-[17px] w-[17px]" />
            </Link>
          )}

          <Link to="/cart" className="relative" aria-label="Cart">
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)]">
              <ShoppingCart className="h-[17px] w-[17px]" />
            </span>
            {totalItems > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-accent p-0 text-[9px] font-bold text-accent-foreground">
                {totalItems}
              </Badge>
            )}
          </Link>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[hsl(40_35%_96%/0.7)] transition-colors hover:bg-white/10 hover:text-[hsl(40_35%_96%)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-[17px] w-[17px]" /> : <Menu className="h-[17px] w-[17px]" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="border-t border-white/10 bg-background/96 px-6 py-5 backdrop-blur-md md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 text-[14px] font-medium transition-colors ${location.pathname === l.to
                  ? "text-[hsl(40_35%_96%)]"
                  : "text-[hsl(40_35%_96%/0.55)] hover:text-[hsl(40_35%_96%)]"
                  }`}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground"
              >
                Sign In
              </Link>
            )}
            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-[14px] font-medium text-[hsl(40_35%_96%/0.55)] transition-colors hover:text-[hsl(40_35%_96%)]"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-[14px] font-medium text-[hsl(40_35%_96%/0.55)] transition-colors hover:text-[hsl(40_35%_96%)]"
                >
                  Orders
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleSignOut();
                  }}
                  className="mt-3 inline-flex w-fit items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
