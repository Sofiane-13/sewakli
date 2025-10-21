import * as React from 'react'
import { cn } from '../../lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const sizeStyles = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    }

    const showFallback = !src || imageError

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold overflow-hidden',
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="uppercase">
            {fallback ||
              (alt ? alt.charAt(0) : '') ||
              (src ? src.charAt(0) : '?')}
          </span>
        )}
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'

export { Avatar }
