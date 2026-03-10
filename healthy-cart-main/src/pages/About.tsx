import { motion } from "framer-motion";
import { Leaf, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Grown with Intention",
    desc: "We source directly from smallholder farmers who cultivate millets using regenerative methods — sustaining land, livelihood, and legacy.",
  },
  {
    icon: Heart,
    title: "Formulated for You",
    desc: "Every recipe is developed with nutritionists. No preservatives, no artificial color, no compromise. Just millet, done right.",
  },
  {
    icon: Users,
    title: "Rooted in Community",
    desc: "By championing indigenous grains, we create lasting demand for traditional crops and economic dignity for the communities that grow them.",
  },
];

const About = () => (
  <main
    className="noise-texture min-h-screen"
    style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 22% 28%) 100%)" }}
  >
    {/* ── Hero statement ─────────────────────────────────────────── */}
    <section className="container mx-auto px-6 pb-16 pt-24 md:pt-32">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="font-sans-pro mb-5 text-[10px] font-semibold uppercase tracking-[0.28em]"
        style={{ color: "hsl(233 15% 85% / 0.45)" }}
      >
        Millet Pro · Our Story
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
        className="font-display max-w-2xl text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.08]"
        style={{ color: "hsl(43 25% 92%)", letterSpacing: "-0.03em" }}
      >
        Ancient grains.
        <br />
        <span
          className="italic"
          style={{
            background: "linear-gradient(95deg, hsl(45 95% 65%), hsl(30 95% 60%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Modern science.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
        className="font-sans-pro mt-8 max-w-xl text-[16px] font-light leading-[1.85]"
        style={{ color: "hsl(43 20% 88% / 0.62)" }}
      >
        We are on a mission to revive India's ancient super grains. Our range of
        millet-based products combines traditional recipes with modern nutrition
        science — making nourishment simple, honest, and deeply rooted
        in the land.
      </motion.p>
    </section>

    {/* ── Thin cultivation divider ───────────────────────────────── */}
    <div className="horizon-lines" style={{ height: "1px", opacity: 0.3, background: "hsl(43 20% 80%)" }} />

    {/* ── Manifesto pull quote ───────────────────────────────────── */}
    <section className="container mx-auto px-6 py-20">
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="font-display border-l-2 pl-8 text-[clamp(1.3rem,3vw,2rem)] font-medium italic leading-[1.5]"
        style={{
          borderColor: "hsl(35 90% 55% / 0.45)",
          color: "hsl(233 10% 90% / 0.72)",
        }}
      >
        "Nutrition should not be a privilege.
        <br />
        Millet Pro exists to make premium,
        <br />
        science-backed health food accessible to every Indian household."
      </motion.blockquote>
    </section>

    {/* ── Values — cream editorial cards ────────────────────────── */}
    <section className="container mx-auto px-6 pb-28">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-sans-pro mb-10 text-[10px] font-semibold uppercase tracking-[0.26em]"
        style={{ color: "hsl(233 10% 75% / 0.38)" }}
      >
        What we stand for
      </motion.p>

      <div className="grid gap-5 md:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.52, ease: "easeOut", delay: i * 0.1 }}
            className="card-premium flex flex-col gap-5 p-8"
          >
            {/* Outline icon in a soft sage circle */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: "hsl(233 25% 15%)",
                border: "1px solid hsl(233 20% 28%)",
              }}
            >
              <v.icon
                className="h-5 w-5"
                strokeWidth={1.5}
                style={{ color: "hsl(35 90% 55%)" }}  /* vibrant grain orange */
              />
            </div>

            {/* Card headline — serif */}
            <h3
              className="font-display text-[18px] font-semibold leading-[1.25]"
              style={{ color: "hsl(233 10% 95%)" }}
            >
              {v.title}
            </h3>

            {/* Body — readable, generous line height */}
            <p
              className="font-sans-pro text-[13.5px] leading-[1.85]"
              style={{ color: "hsl(233 10% 85%)" }}
            >
              {v.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  </main>
);

export default About;
