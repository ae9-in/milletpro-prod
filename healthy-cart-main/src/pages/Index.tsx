import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import milletHero from "@/assets/millet-hero-no-bg.png";
import { useCatalog } from "@/hooks/useCatalog";
import type { Product } from "@/types/product";

/* ────────────────────────────────────────────────────────────────
   Inline SVG: perspective crop-rows for non-hero sections
──────────────────────────────────────────────────────────────── */
const FieldRows = () => (
  <svg
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {Array.from({ length: 28 }, (_, i) => {
      const vx = 600;
      const vy = 240;
      const bx = 60 + (i / 27) * (1200 - 120);
      return (
        <line
          key={i}
          x1={vx} y1={vy} x2={bx} y2={900}
          stroke="hsl(233 22% 26%)"
          strokeWidth={i % 4 === 0 ? "1.2" : "0.6"}
          strokeOpacity={i % 4 === 0 ? 0.5 : 0.28}
        />
      );
    })}
    {[320, 400, 490, 590, 710].map((y, i) => (
      <line
        key={`h${i}`}
        x1="0" y1={y} x2="1200" y2={y}
        stroke="hsl(233 16% 36%)"
        strokeWidth="0.6"
        strokeOpacity={0.22 - i * 0.025}
      />
    ))}
  </svg>
);

/* Section rhythm marker */
const SectionNo = ({ n, label }: { n: string; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[11px] font-bold tabular-nums text-accent/70">{n}</span>
    <span className="block h-px w-8 bg-accent/30" />
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[hsl(40_35%_96%/0.45)]">
      {label}
    </span>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Hero: radiating perspective line art (geometric background)
──────────────────────────────────────────────────────────────── */
const HeroLineArt = () => {
  // Vanishing point sits top-center of the right half
  const vx = 760;
  const vy = 0;
  const numRays = 28;
  const rays = Array.from({ length: numRays }, (_, i) => {
    const spreadAngle = Math.PI * 0.85; // fan out 153°
    const startAngle = Math.PI * 0.075;
    const angle = startAngle + (i / (numRays - 1)) * spreadAngle;
    const dist = 1400;
    return { x2: vx + Math.cos(angle) * dist, y2: vy + Math.sin(angle) * dist };
  });
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Fade lines toward center */}
        <radialGradient id="rayFade" cx="53%" cy="0%" r="75%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="rayMask">
          <rect width="1440" height="900" fill="url(#rayFade)" />
        </mask>
      </defs>
      <g mask="url(#rayMask)">
        {rays.map((r, i) => (
          <line
            key={i}
            x1={vx} y1={vy} x2={r.x2} y2={r.y2}
            stroke="hsl(233 30% 68%)"
            strokeWidth={i % 5 === 0 ? "0.9" : "0.5"}
            strokeOpacity={i % 5 === 0 ? 0.14 : 0.065}
          />
        ))}
        {/* Subtle horizontal arc lines */}
        {[220, 380, 540, 700, 840].map((y, i) => (
          <line
            key={`h${i}`}
            x1="480" y1={y} x2="1440" y2={y}
            stroke="hsl(233 22% 62%)"
            strokeWidth="0.5"
            strokeOpacity={Math.max(0, 0.08 - i * 0.013)}
          />
        ))}
      </g>
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────
   Hero stats data
──────────────────────────────────────────────────────────────── */
const buildCatalogStats = (products: Product[]) => {
  const averageRating =
    products.length > 0 ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1) : "0.0";

  return [
    { value: `${products.length}+`, label: "Product Variants" },
    { value: `${averageRating}★`, label: "Average Rating" },
    { value: "100%", label: "Natural Ingredients" },
  ];
};

/* ────────────────────────────────────────────────────────────────
   Premium editorial hero — two-column
   Left:  headline + supporting copy + CTA
   Right: millet-hero.png (transparent PNG) floating on green BG
──────────────────────────────────────────────────────────────── */
const Hero = ({ heroStats }: { heroStats: { value: string; label: string }[] }) => (
  <section
    className="noise-texture relative flex min-h-screen overflow-hidden"
    style={{
      background: "linear-gradient(155deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 45%, hsl(233 22% 27%) 100%)",
    }}
  >
    {/* ── Geometric line art ── */}
    <HeroLineArt />

    {/* ── Bottom-left radial vignette for depth ── */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 55% 70% at 0% 105%, hsl(233 30% 13% / 0.7) 0%, transparent 60%)",
      }}
    />

    {/* ── Top-right soft glow for warmth ── */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 50% 55% at 100% 0%, hsl(233 20% 32% / 0.35) 0%, transparent 65%)",
      }}
    />

    {/* ══════════════════════════════════════════════════════════
        MAIN CONTENT GRID
    ══════════════════════════════════════════════════════════ */}
    <div className="container relative z-10 mx-auto grid min-h-screen grid-cols-1 px-6 md:grid-cols-[1fr_1fr] md:items-center">

      {/* ── LEFT: Editorial text panel ── */}
      <div className="flex flex-col justify-center pt-28 pb-12 md:py-24 md:pr-12 lg:pr-16">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="mb-8 flex items-center gap-3"
        >
          <span
            className="text-[10.5px] font-bold tabular-nums"
            style={{ color: "hsl(45 95% 65% / 0.72)" }}
          >
            01
          </span>
          <span
            className="block h-px w-7"
            style={{ background: "hsl(35 90% 55% / 0.32)" }}
          />
          <span
            className="text-[9.5px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "hsl(40 25% 90% / 0.38)" }}
          >
            Millet Pro · Premium Nutrition
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "hsl(40 30% 94%)",
          }}
        >
          Millet Pro
        </motion.h1>

        {/* Brand Statement H2 */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            background: "linear-gradient(92deg, hsl(45 95% 65%), hsl(30 95% 55%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontStyle: "italic",
            marginTop: "1.5rem",
          }}
        >
          Ultimate Nutrition.
          <br />
          Packed for you.
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.44 }}
          className="mt-8 text-[15px] font-light leading-[1.82]"
          style={{
            color: "hsl(40 22% 86% / 0.48)",
            maxWidth: "20rem",
          }}
        >
          Ancient grain. Precise formulation.
          <br />Modern body.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.44 }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <Link
            to="/products"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3.5 text-[13.5px] font-semibold transition-all duration-200 hover:gap-4"
            style={{
              background: "hsl(35 90% 55%)",
              color: "hsl(233 25% 12%)",
              border: "1px solid hsl(45 95% 65% / 0.5)",
              boxShadow: "0 4px 24px hsl(35 90% 15% / 0.4), inset 0 1px 0 hsl(45 95% 75% / 0.2)",
            }}
          >
            Explore Products
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <span
            className="text-[11px] font-light"
            style={{ color: "hsl(40 22% 86% / 0.28)" }}
          >
            Pan-India dispatch
          </span>
        </motion.div>
      </div>

      {/* ── RIGHT: Millet PNG floating composition ── */}
      <div className="relative flex min-h-[55vh] items-center justify-center md:min-h-screen">

        {/* Transparent PNG — floats naturally over the green background */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative w-full"
          style={{ maxWidth: 580 }}
        >
          {/* Soft ambient shadow underneath the floating composition */}
          <div
            className="absolute"
            style={{
              bottom: "-6%",
              left: "10%",
              right: "10%",
              height: "18%",
              background: "hsl(233 30% 10% / 0.38)",
              filter: "blur(28px)",
              borderRadius: "50%",
            }}
          />

          {/* The millet image — true transparent PNG, floats on green BG */}
          <img
            src={milletHero}
            alt="Varieties of millet in ceramic bowls with millet stalks and a hand holding a bowl"
            className="relative block w-full"
            style={{
              background: "transparent",
              filter: [
                "drop-shadow(0px 28px 52px hsl(233 30% 7% / 0.48))",
                "drop-shadow(0px 8px 18px hsl(233 28% 10% / 0.30))",
                "saturate(0.88)",
                "brightness(0.98)",
              ].join(" "),
            }}
          />

          {/* Floating stats cards — anchored bottom-right of the image wrapper */}
          <div
            className="absolute flex flex-col gap-2"
            style={{ bottom: "8%", right: "-4%" }}
          >
            {heroStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 + i * 0.11 }}
                className="rounded-xl backdrop-blur-md"
                style={{
                  background: "hsl(233 22% 16% / 0.84)",
                  border: "1px solid hsl(233 18% 40% / 0.3)",
                  boxShadow: "0 4px 20px hsl(233 30% 8% / 0.45)",
                  padding: "10px 16px",
                  minWidth: 134,
                }}
              >
                <p
                  className="text-[19px] font-black leading-none tracking-[-0.03em]"
                  style={{ color: "hsl(40 28% 93%)" }}
                >
                  {s.value}
                </p>
                <p
                  className="mt-[5px] text-[8.5px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: "hsl(40 18% 78% / 0.42)" }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}

            {/* Diamond / sparkle accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 1.06 }}
              className="ml-auto mr-1 mt-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 1L13.5 8.5L21 11L13.5 13.5L11 21L8.5 13.5L1 11L8.5 8.5L11 1Z"
                  fill="hsl(45 95% 65%)"
                  fillOpacity="0.72"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);


/* ────────────────────────────────────────────────────────────────
   Data
──────────────────────────────────────────────────────────────── */
const trust = [
  { icon: FlaskConical, title: "Science-Backed", desc: "Lab-verified nutrient profiles in every batch" },
  { icon: Truck, title: "Pan-India Shipping", desc: "Fresh dispatches delivered across India." },
  { icon: ShieldCheck, title: "Zero Additives", desc: "No preservatives, no artificial flavours — ever" },
];

const stats = [
  { value: "9+", label: "Product Variants" },
  { value: "4.6★", label: "Average Rating" },
  { value: "100%", label: "Natural Ingredients" },
];

/* ────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────── */
const Index = () => {
  const { products, loading, error } = useCatalog();
  const featured = products.filter((p) => p.isBestSeller);

  return (
    <main className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO — green canvas + field rows
          ═══════════════════════════════════════════════════════ */}
      <Hero heroStats={buildCatalogStats(products)} />

      {/* ═══════════════════════════════════════════════════════
          CULTIVATION STRIP — horizontal rhythm divider
          ═══════════════════════════════════════════════════════ */}
      <div className="horizon-lines bg-[hsl(233_18%_38%)] py-5 noise-texture">
        <div className="container px-6">
          <div className="flex flex-wrap items-center gap-6 md:gap-14">
            {["High Fiber", "Low GI", "Calcium Rich", "Natural", "Sustainable", "Daily Nutrition"].map((tag) => (
              <span key={tag} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(40_30%_90%/0.38)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TRUST BAR — sow-pattern, icon rows
          ═══════════════════════════════════════════════════════ */}
      <section className="sow-pattern noise-texture bg-sage-light relative overflow-hidden">
        <div className="container relative z-10 px-6 py-16">
          <div className="mb-10">
            <SectionNo n="01" label="Why it works" />
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {trust.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/12">
                  <t.icon className="h-[18px] w-[18px] text-[hsl(40_35%_96%/0.75)]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[hsl(40_35%_96%)]">{t.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[hsl(40_35%_96%/0.46)]">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EDITORIAL STATEMENT — cream panel on green
          ═══════════════════════════════════════════════════════ */}
      <section className="noise-texture relative overflow-hidden bg-green-gradient py-24 md:py-32">
        <div className="container px-6">
          <div className="mb-10">
            <SectionNo n="02" label="The proposition" />
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-stretch">
            {/* Left — dark glass panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="flex flex-col justify-between rounded-2xl bg-white/7 border border-white/10 p-10 backdrop-blur-sm"
            >
              <h2 className="tracking-headline text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.92] text-[hsl(40_35%_96%)]">
                The grain
                <br />that
                <br />outperforms.
              </h2>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold text-accent hover:gap-3.5 transition-all duration-200"
              >
                Our story <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Right — cream panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
              className="panel-cream flex flex-col justify-between rounded-2xl p-10 shadow-[0_4px_32px_hsl(233_18%_16%/0.24)]"
            >
              <p className="text-[14.5px] leading-[1.85] text-[hsl(233_5%_34%)]">
                Millets deliver more protein, more fiber, and a lower glycaemic index than most staples — without compromising on flavour. We engineer every product to maximise that advantage.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[hsl(233_8%_88%)] pt-8">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + i * 0.08 }}
                  >
                    <p className="text-[22px] font-black tracking-[-0.04em] text-[hsl(233_8%_12%)]">{s.value}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(233_5%_50%)]">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BEST SELLERS — product cards appear after the hero
          ═══════════════════════════════════════════════════════ */}
      <section className="field-pattern noise-texture bg-sage-light py-24 md:py-32 relative overflow-hidden">
        <div className="container relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <SectionNo n="03" label="Top Picks" />
              <h2 className="mt-5 tracking-headline text-[clamp(2rem,4.5vw,3.2rem)] font-black text-[hsl(40_35%_96%)]">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[hsl(40_35%_96%/0.55)] hover:text-[hsl(40_35%_96%)] hover:gap-3 transition-all duration-200"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {loading ? (
            <p className="text-[13px] text-[hsl(40_35%_96%/0.55)]">Loading best sellers...</p>
          ) : error ? (
            <p className="text-[13px] text-red-200">{error}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.52, ease: "easeOut", delay: i * 0.12 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BAND
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-sage-deep sow-pattern noise-texture relative overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center gap-7 px-6 py-24 text-center md:py-28">
          <SectionNo n="04" label="Get Started" />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="tracking-headline max-w-xl text-[clamp(2.2rem,5vw,3.6rem)] font-black text-[hsl(40_35%_96%)]"
          >
            Make millet your
            <br />daily ritual.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
            className="max-w-xs text-[13px] leading-relaxed text-[hsl(40_30%_90%/0.45)]"
          >
            Browse malts, flours, and energy snacks.
            All natural. Precision formulated.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.32 }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-[14px] font-semibold text-accent-foreground shadow-lg transition-all duration-200 hover:bg-[hsl(35_95%_60%)] hover:gap-4"
            >
              Shop All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
};

export default Index;

