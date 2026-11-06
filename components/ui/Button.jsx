'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reusable Luxury Editorial Button Component
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'jute' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  as: Component = null,
  ...props
}) {
  const variantStyles = {
    primary:
      'bg-[#3D4935] text-[#F7F5EF] border border-[#252720] hover:bg-[#252720] shadow-sm',
    secondary:
      'bg-[#E8DDCA] text-[#252720] border border-[#A88B66]/40 hover:bg-[#E8DDCA]/80',
    jute:
      'bg-[#A88B66] text-[#FFFFFF] border border-[#8C7150] hover:bg-[#8C7150] shadow-sm',
    outline:
      'bg-transparent text-[#252720] border border-[#252720] hover:bg-[#252720] hover:text-[#F7F5EF]',
    ghost:
      'bg-transparent text-[#252720] hover:bg-[#E8DDCA]/40 border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs uppercase tracking-widest px-3.5 py-2 font-medium',
    md: 'text-sm tracking-wide px-5 py-2.5 font-medium',
    lg: 'text-base tracking-wide px-7 py-3.5 font-medium',
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none text-center',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D4935] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5EF]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    sizeStyles[size] || sizeStyles.md,
    variantStyles[variant] || variantStyles.primary,
    className
  );

  // If passed an external custom element or anchor
  if (Component) {
    return (
      <Component className={baseClasses} onClick={onClick} {...props}>
        {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
      </Component>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { y: 1 }}
      transition={{ duration: 0.15 }}
      className={baseClasses}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </motion.button>
  );
}
