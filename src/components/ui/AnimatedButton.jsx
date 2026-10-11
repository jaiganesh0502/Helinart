import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

/**
 * AnimatedButton
 * Reusable luxury button with subtle hover lift, tap compression,
 * single-sweep translucent shine highlight, and arrow glide animation.
 */
export default function AnimatedButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  withArrow = false,
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  title,
  'aria-label': ariaLabel
}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Size styling classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-medium',
    md: 'px-7 py-3.5 text-sm font-semibold tracking-wide',
    lg: 'px-8 py-4 text-base font-semibold tracking-wide'
  }[size] || 'px-7 py-3.5 text-sm font-semibold';

  // Variant base and hover styling
  const variantStyles = {
    primary: {
      base: 'text-[#FFFDFC] shadow-xs border border-[#9C5550]/20',
      gradient: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)',
      hoverShadow: '0 10px 24px rgba(183, 127, 123, 0.22)'
    },
    secondary: {
      base: 'bg-[#FFFDFC] text-[#313851] border border-[#313851] shadow-2xs hover:bg-[#313851] hover:text-[#FFFDFC]',
      hoverShadow: '0 8px 20px rgba(49, 56, 81, 0.12)'
    },
    dark: {
      base: 'bg-[#262D42] text-[#FFFDFC] border border-[#313851] hover:bg-[#1E2333]',
      hoverShadow: '0 10px 24px rgba(38, 45, 66, 0.25)'
    },
    outline: {
      base: 'bg-transparent text-[#793D39] border border-[#D8C6C3] hover:bg-[#F4ECE6] hover:border-[#9C5550]',
      hoverShadow: '0 6px 16px rgba(156, 85, 80, 0.10)'
    },
    ghost: {
      base: 'bg-transparent text-[#313851] hover:bg-[#F4ECE6] hover:text-[#9C5550]',
      hoverShadow: 'none'
    }
  }[variant] || {};

  const commonMotionProps = shouldReduceMotion ? {} : {
    whileHover: disabled || loading ? {} : {
      y: -2,
      scale: 1.01,
      boxShadow: variantStyles.hoverShadow
    },
    whileTap: disabled || loading ? {} : {
      scale: 0.97
    },
    transition: {
      duration: 0.2,
      ease: LUXURY_EASE
    }
  };

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {withArrow && (
            <motion.span
              animate={shouldReduceMotion ? {} : { x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.18, ease: LUXURY_EASE }}
              className="inline-flex items-center shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          )}
        </>
      )}

      {/* Subtle single shine sweep on hover (Primary buttons only) */}
      {variant === 'primary' && !disabled && !shouldReduceMotion && (
        <motion.span
          className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={isHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}
    </span>
  );

  const baseClasses = `relative overflow-hidden inline-flex items-center justify-center rounded-full transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550] disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses} ${variantStyles.base || ''} ${className}`;

  if (to) {
    const Component = motion.create(Link);
    return (
      <Component
        to={to}
        className={baseClasses}
        style={variant === 'primary' ? { background: variantStyles.gradient } : {}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={title}
        aria-label={ariaLabel}
        {...commonMotionProps}
      >
        {content}
      </Component>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        style={variant === 'primary' ? { background: variantStyles.gradient } : {}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={title}
        aria-label={ariaLabel}
        {...commonMotionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={variant === 'primary' ? { background: variantStyles.gradient } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      aria-label={ariaLabel}
      {...commonMotionProps}
    >
      {content}
    </motion.button>
  );
}
