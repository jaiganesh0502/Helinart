import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

/**
 * Reusable Reveal Component for viewport-based scroll entrances.
 * Supports configurable delays, directions, and prefers-reduced-motion accessibility.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  y = 24,
  amount = 0.18,
  once = true,
  className = '',
  as = 'div'
}) {
  const shouldReduceMotion = useReducedMotion();

  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        y: y
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once,
        amount
      }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
