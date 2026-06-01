import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogData";
import { ArrowLeft, Clock, Calendar, User, Award } from "lucide-react";
import JsonLd from "@/components/JsonLd";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug);
  }, [slug]);

  const articleSchema = useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `https://www.milletpro.in/blog/${post.slug}#article`,
          "url": `https://www.milletpro.in/blog/${post.slug}`,
          "headline": post.title,
          "description": post.excerpt,
          "image": `https://www.milletpro.in${post.coverImage}`,
          "datePublished": "2026-06-01",
          "dateModified": "2026-06-01",
          "author": {
            "@type": "Person",
            "name": post.author,
            "jobTitle": "Nutritional Expert"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Millet Pro",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.milletpro.in/images/logo.png"
            }
          },
          "mainEntityOfPage": `https://www.milletpro.in/blog/${post.slug}`
        },
        {
          "@type": "FAQPage",
          "@id": `https://www.milletpro.in/blog/${post.slug}#faq`,
          "mainEntity": post.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ]
    };
  }, [post]);

  const canonicalUrl = useMemo(() => {
    return `https://www.milletpro.in/blog/${slug}`;
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main
      className="noise-texture min-h-screen pb-24"
      style={{ background: "linear-gradient(160deg, hsl(233 24% 19%) 0%, hsl(233 26% 23%) 100%)" }}
    >
      {articleSchema && <JsonLd data={articleSchema} />}
      
      {/* Dynamic Canonical tag handler */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Top utility bar */}
      <div className="container mx-auto px-6 pt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(40 22% 86% / 0.5)] hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>
      </div>

      {/* Article Header */}
      <header className="container mx-auto max-w-3xl px-6 pt-12 pb-8">
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: "hsl(35 90% 45% / 0.2)",
            color: "hsl(35 90% 55%)",
            border: "1px solid hsl(35 90% 55% / 0.3)"
          }}
        >
          {post.category}
        </span>

        <h1
          className="mb-6 font-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.2]"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em", color: "hsl(40 30% 94%)" }}
        >
          {post.title}
        </h1>

        {/* Author metadata panel */}
        <div
          className="flex flex-wrap items-center gap-6 rounded-2xl p-4 border"
          style={{
            background: "hsl(233 22% 16% / 0.5)",
            borderColor: "hsl(233 20% 28%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[hsl(40 35% 96%)] leading-none">{post.author}</p>
              {post.authorCredentials && (
                <p className="mt-1 text-[11px] text-[hsl(233 10% 70%)] flex items-center gap-1">
                  <Award className="h-3 w-3 text-accent" />
                  {post.authorCredentials}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] text-[hsl(233 10% 70%)] md:ml-auto">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="container mx-auto max-w-3xl px-6 mb-12">
        <div
          className="overflow-hidden rounded-2xl"
          style={{ aspectRatio: "16/9", background: "hsl(35 30% 95%)" }}
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-contain p-12"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto max-w-3xl px-6">
        <div
          className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-[14.5px] prose-p:text-[hsl(233_10%_85%)] prose-ul:list-disc prose-ul:pl-6 prose-li:text-[14px] prose-li:text-[hsl(233_10%_80%)] prose-li:mb-2"
          style={{ fontFamily: "sans-serif" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Dynamic FAQ Accordions */}
        {post.faqs && post.faqs.length > 0 && (
          <section
            className="mt-16 rounded-2xl border p-8"
            style={{
              background: "hsl(233 22% 16% / 0.4)",
              borderColor: "hsl(233 20% 28%)",
            }}
          >
            <h2
              className="mb-6 font-display text-[22px] font-bold text-[hsl(40 35% 96%)]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-5">
              {post.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 border"
                  style={{
                    background: "hsl(233 20% 22% / 0.6)",
                    borderColor: "hsl(233 15% 30%)",
                  }}
                >
                  <h3 className="text-[13.5px] font-bold text-accent">
                    Q: {faq.question}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[hsl(233 10% 80%)]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default BlogPost;
