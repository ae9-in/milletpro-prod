import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogData";
import { ArrowRight, BookOpen, Clock, User } from "lucide-react";
import JsonLd from "@/components/JsonLd";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const list = new Set(blogPosts.map((post) => post.category));
    return ["all", ...Array.from(list)];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return blogPosts;
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.milletpro.in/blog#blog",
    "name": "Millet Pro Journal",
    "description": "Scientific research, recipes, and guides on millet nutrition, gluten-free living, and healthy habits.",
    "publisher": {
      "@type": "Organization",
      "name": "Millet Pro",
      "logo": "https://www.milletpro.in/images/logo.png"
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": "2026-06-01",
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": `https://www.milletpro.in/blog/${post.slug}`
    }))
  };

  return (
    <main
      className="noise-texture min-h-screen"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 100%)" }}
    >
      <JsonLd data={blogListSchema} />

      {/* Header Banner */}
      <div className="container mx-auto px-6 py-16 md:py-24 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.26em]"
          style={{ color: "hsl(43 25% 90% / 0.42)" }}
        >
          Millet Pro Journal
        </p>
        <h1
          className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] text-accent-foreground"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em", color: "hsl(40 30% 94%)" }}
        >
          The Science of Good Food.
        </h1>
        <p className="mx-auto max-w-xl text-[14.5px] font-light leading-relaxed text-[hsl(233 10% 80%)]">
          Explore recipes, deep-dive nutrient comparisons, and expert guides on incorporating healthy millets into your daily routine.
        </p>

        {/* Filter categories */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              style={{
                background: selectedCategory === cat ? "hsl(35 90% 55%)" : "hsl(233 20% 25%)",
                color: selectedCategory === cat ? "hsl(233 25% 12%)" : "hsl(40 25% 92%)",
                border: `1.5px solid ${selectedCategory === cat ? "hsl(35 90% 55%)" : "hsl(233 15% 35%)"}`,
              }}
            >
              {cat === "all" ? "Show All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "hsl(233 25% 18%)",
                borderColor: "hsl(233 20% 28%)",
              }}
            >
              {/* Card Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16 / 9", background: "hsl(35 30% 95%)" }}
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    background: "hsl(35 90% 45%)",
                    color: "hsl(233 10% 95%)",
                  }}
                >
                  {post.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-3 flex items-center gap-4 text-[11px] text-[hsl(233 10% 70%)] font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.publishedDate}</span>
                </div>

                <h2
                  className="mb-4 font-display text-[22px] font-semibold leading-[1.3] text-[hsl(40 35% 96%)] group-hover:text-accent transition-colors"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {post.title}
                </h2>

                <p className="mb-6 flex-1 text-[13.5px] leading-relaxed text-[hsl(233 10% 75%)]">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t pt-5" style={{ borderColor: "hsl(233 15% 28%)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <User className="h-3.5 w-3.5 text-accent/80" />
                    </div>
                    <span className="text-[12px] font-medium text-[hsl(233 10% 80%)]">
                      {post.author}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent group-hover:gap-2.5 transition-all duration-300"
                  >
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
