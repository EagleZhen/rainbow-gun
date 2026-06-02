import type { ReactNode } from 'react';

interface KeycapProps {
  children: ReactNode;
}

export default function Keycap({ children }: KeycapProps) {
  return (
    <kbd className="inline-flex min-w-4 items-center justify-center rounded border border-gray-300 bg-gray-50 px-1 py-0.5 font-mono text-[10px] font-semibold leading-none text-gray-700">
      {children}
    </kbd>
  );
}
