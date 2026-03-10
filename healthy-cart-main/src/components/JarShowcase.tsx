/**
 * JarShowcase — premium scroll-linked 3D product jar
 *
 * Animation map (scrollYProgress 0 → 1 within section):
 *  rotateY  : -8°  →  0°  → 12°  (label faces camera at 0°, then eases past)
 *  y        :  20px → 0px → -40px (slow vertical parallax upward)
 *  scale    :  0.92 → 1.02 → 0.96 (breathes in as it faces camera)
 *  shadow   :  0.70 → 1.0  → 0.75 (shadow widens at label-hero moment)
 *
 * Performance notes:
 *  - useSpring wraps scrollYProgress for inertia / smooth feel
 *  - Only GPU-composited transforms used (no layout/paint triggers)
 *  - `will-change: transform` kept on motion element only
 */

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "framer-motion";
import milletHealthMix from "@/assets/products/millet-healthmix.png";

const JarShowcase = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Scroll progress relative to this section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        // Start tracking when section bottom enters viewport; end when top leaves
        offset: ["start end", "end start"],
    });

    // Spring-smooth the raw scroll value — gives weight and inertia
    const smoothed = useSpring(scrollYProgress, {
        stiffness: 55,   // lower = slower to follow
        damping: 22,     // higher = less overshoot
        restDelta: 0.001,
    });

    // ── Transforms ────────────────────────────────────────────────
    // rotateY: jar starts angled, label faces camera at mid-scroll
    const rotateY = useTransform(
        smoothed,
        [0, 0.25, 0.55, 0.80, 1],
        [-8, 0, 0, 10, 14]
    );

    // Gentle vertical parallax — rises as you scroll
    const y = useTransform(smoothed, [0, 1], [28, -56]);

    // Scale — slight breathe-in as it faces camera
    const scale = useTransform(
        smoothed,
        [0, 0.3, 0.6, 1],
        [0.92, 1.04, 1.0, 0.95]
    );

    // Shadow: widens + softens when label faces camera
    const shadowScaleX = useTransform(
        smoothed,
        [0, 0.3, 0.6, 1],
        [0.65, 0.95, 0.82, 0.70]
    );
    const shadowOpacity = useTransform(
        smoothed,
        [0, 0.3, 0.6, 1],
        [0.18, 0.28, 0.22, 0.15]
    );

    return (
        <div ref={sectionRef} className="relative">
            {/* Perspective grandparent — essential for 3D depth */}
            <div style={{ perspective: "1100px", perspectiveOrigin: "50% 60%" }}>

                {/* 3D stage */}
                <motion.div
                    style={{
                        rotateY,
                        y,
                        scale,
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                    className="relative mx-auto flex w-full max-w-[320px] flex-col items-center"
                >
                    {/* ── Product image ────────────────────────────── */}
                    <img
                        src={milletHealthMix}
                        alt="Millet Health Mix jar"
                        className="h-auto w-full select-none"
                        draggable={false}
                        style={{
                            // Subtle drop shadow that respects 3D orientation
                            filter:
                                "drop-shadow(0 24px 40px hsl(233 22% 14% / 0.38)) drop-shadow(0 8px 16px hsl(233 22% 14% / 0.22))",
                        }}
                    />
                </motion.div>
            </div>

            {/* Ground shadow — ellipse beneath the jar */}
            <motion.div
                style={{ scaleX: shadowScaleX, opacity: shadowOpacity }}
                className="mx-auto mt-4 h-5 w-48 rounded-full bg-[hsl(233_22%_18%)] blur-xl"
            />
        </div>
    );
};

export default JarShowcase;
