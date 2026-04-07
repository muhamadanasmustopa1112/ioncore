import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ToolbarActionsProps {
  children?: ReactNode;
  className?: string;
}

export interface ToolbarProps {
  children?: ReactNode;
  className?: string;
}

export interface ToolbarTitleProps {
  children: ReactNode;
  className?: string;
}

export interface ToolbarHeadingProps {
  className?: string;
  children: ReactNode;
}

export const Toolbar = ({ children, className }: ToolbarProps) => {
  return (
    <div
      className={cn(
        "flex grow flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2.5",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ToolbarHeading = ({
  children,
  className,
}: ToolbarHeadingProps) => {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
};

export const ToolbarTitle = ({ className, children }: ToolbarTitleProps) => {
  return (
    <h1 className={cn("text-foreground text-lg font-semibold", className)}>
      {children}
    </h1>
  );
};

export const ToolbarActions = ({ children, className }: ToolbarActionsProps) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 lg:gap-3.5", className)}>
      {children}
    </div>
  );
};
