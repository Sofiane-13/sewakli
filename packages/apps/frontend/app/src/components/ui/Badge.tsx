import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant = 'default', size = 'md', icon, children, ...props },
    ref,
  ) => {
    const variantStyles = {
      default:
        'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700',
      primary:
        'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
      secondary:
        'bg-secondary-100 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800',
      success:
        'bg-success-100 dark:bg-success-950 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800',
      warning:
        'bg-warning-100 dark:bg-warning-950 text-warning-700 dark:text-warning-300 border border-warning-200 dark:border-warning-800',
      error:
        'bg-error-100 dark:bg-error-950 text-error-700 dark:text-error-300 border border-error-200 dark:border-error-800',
      neutral:
        'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    )
  },
)

Badge.displayName = 'Badge'

export { Badge }
