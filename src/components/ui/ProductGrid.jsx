import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

export const productItemVariants = {
  hidden: {
    opacity: 0,
    y: 28
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE
    }
  }
};

/**
 * ProductGrid
 * Container for product cards with viewport-based stagger entrance.
 * Ensures cards smoothly reveal one after another when scrolled into view.
 */
export default function ProductGrid({
  children,
  className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.18
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
