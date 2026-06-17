import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Narrower column for focused content (history, account). */
  narrow?: boolean;
}

/** Consistent page width and vertical rhythm for routed content. */
export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 py-10',
        narrow ? 'max-w-3xl' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
