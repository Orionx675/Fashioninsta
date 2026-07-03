"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/** Shared easing/duration tokens — one rhythm across the app (skill §7). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

/** One-shot entrance when the element scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: fadeUp.hidden,
        show: {
          ...fadeUp.show,
          transition: { duration: 0.5, ease: EASE_OUT, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its <StaggerItem> children into view. */
export function StaggerGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerParent}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
