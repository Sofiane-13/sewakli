import * as React from 'react'
import { cn } from '../../lib/utils'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn(
            'w-px h-full bg-neutral-200 dark:bg-neutral-800',
            className,
          )}
          {...props}
        />
      )
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={cn('relative flex items-center', className)}
          {...props}
        >
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
          <span className="px-4 text-sm text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'h-px w-full bg-neutral-200 dark:bg-neutral-800',
          className,
        )}
        {...props}
      />
    )
  },
)

Divider.displayName = 'Divider'

export { Divider }
