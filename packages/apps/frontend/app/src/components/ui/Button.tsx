import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

    const variantStyles = {
      primary:
        'bg-primary hover:bg-blue-700 text-white shadow-lg active:scale-[0.98]',
      secondary:
        'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white shadow-sm',
      outline:
        'border-2 border-primary dark:border-blue-400 bg-transparent hover:bg-primary/10 dark:hover:bg-blue-400/10 text-primary dark:text-blue-400',
      ghost:
        'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
      destructive:
        'bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-[0.98]',
    }

    const sizeStyles = {
      default: 'h-12 px-6 py-3 text-base',
      sm: 'h-9 px-3 py-2 text-sm',
      lg: 'h-14 px-8 py-4 text-lg',
      icon: 'h-10 w-10 p-0',
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
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button }
