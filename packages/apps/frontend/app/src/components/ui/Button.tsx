import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden'

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-primary-500',
      secondary:
        'bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-700 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-secondary-500',
      outline:
        'border-2 border-primary-500 dark:border-primary-400 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-950 text-primary-600 dark:text-primary-400 hover:border-primary-600 dark:hover:border-primary-300 focus:ring-primary-500',
      ghost:
        'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-neutral-500',
      destructive:
        'bg-gradient-to-r from-error-600 to-error-500 hover:from-error-700 hover:to-error-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-error-500',
      success:
        'bg-gradient-to-r from-success-600 to-success-500 hover:from-success-700 hover:to-success-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-success-500',
    }

    const sizeStyles = {
      default: 'h-12 px-6 py-3 text-base',
      sm: 'h-9 px-4 py-2 text-sm',
      lg: 'h-14 px-8 py-4 text-lg',
      xl: 'h-16 px-10 py-5 text-xl',
      icon: 'h-12 w-12 p-0',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span className="truncate">{children}</span>}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button }
