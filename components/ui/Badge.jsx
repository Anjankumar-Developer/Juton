import { cn } from '@/lib/utils';

/**
 * Reusable Badge component for MOQ, sustainability credentials, and product classifications
 */
export default function Badge({
  children,
  variant = 'default', // 'default' | 'moq' | 'sustainability' | 'jute' | 'outline' | 'subtle'
  size = 'md', // 'sm' | 'md'
  className = '',
  icon: Icon = null,
  ...props
}) {
  const variantStyles = {
    default: 'bg-[#E8DDCA]/70 text-[#252720] border border-[#A88B66]/30',
    moq: 'bg-[#3D4935]/10 text-[#3D4935] border border-[#3D4935]/30 font-medium',
    sustainability: 'bg-[#68745A] text-[#F7F5EF] border border-[#3D4935]',
    jute: 'bg-[#A88B66] text-white border border-[#A88B66]',
    outline: 'bg-transparent text-[#252720] border border-[#252720]/40',
    subtle: 'bg-[#F7F5EF] text-[#68745A] border border-[#E8DDCA]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-medium transition-colors select-none',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
