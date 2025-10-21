import * as React from 'react'
import { cn } from '../../lib/utils'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  filled?: boolean
  className?: string
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = 'md', filled = false, className, ...props }, ref) => {
    const sizeStyles = {
      xs: 'text-base',
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
      '2xl': 'text-4xl',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'material-symbols-outlined select-none',
          sizeStyles[size],
          className,
        )}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
        {...props}
      >
        {name}
      </span>
    )
  },
)

Icon.displayName = 'Icon'

export { Icon }
