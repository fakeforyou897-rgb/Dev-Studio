import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`flex flex-col flex-1 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
