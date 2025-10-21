import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', centered = false, ...props }, ref) => {
    const sizeStyles = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1440px]',
      full: 'max-w-full',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-4 sm:px-6 lg:px-8',
          sizeStyles[size],
          centered && 'mx-auto',
          className,
        )}
        {...props}
      />
    )
  },
)

Container.displayName = 'Container'

export { Container }
