import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered'
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, ...props }, ref) => {
    const variantStyles = {
      default:
        'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm',
      elevated:
        'bg-white dark:bg-neutral-900 shadow-lg border border-neutral-100 dark:border-neutral-800',
      glass:
        'glass glass-border shadow-lg backdrop-blur-xl bg-white/90 dark:bg-neutral-900/90',
      bordered:
        'bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700',
    }

    const hoverStyles = hoverable
      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
      : ''

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-4 sm:p-6 transition-all duration-200',
          variantStyles[variant],
          hoverStyles,
          className,
        )}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-3 mb-4', className)}
        {...props}
      >
        {icon && (
          <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-1.5">{children}</div>
      </div>
    )
  },
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight',
          className,
        )}
        {...props}
      />
    )
  },
)

CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm text-neutral-600 dark:text-neutral-400',
        className,
      )}
      {...props}
    />
  )
})

CardDescription.displayName = 'CardDescription'

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-neutral-700 dark:text-neutral-300', className)}
        {...props}
      />
    )
  },
)

CardContent.displayName = 'CardContent'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800',
          className,
        )}
        {...props}
      />
    )
  },
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
