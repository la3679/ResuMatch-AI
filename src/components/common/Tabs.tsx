import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

/** Accessible tab bar (ARIA tablist). Render panels yourself based on `active`. */
export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={cn('flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center justify-center gap-2 flex-1 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              selected
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
