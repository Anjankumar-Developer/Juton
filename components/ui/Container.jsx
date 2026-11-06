import { cn } from '@/lib/utils';

/**
 * Reusable Container component for consistent luxury editorial layout bounds
 */
export default function Container({
  children,
  className = '',
  size = 'default', // 'sm' | 'default' | 'narrow' | 'wide' | 'full'
  as: Component = 'div',
  ...props
}) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'w-full',
  };

  return (
    <Component
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
