import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-balance leading-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-xl text-pretty">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
