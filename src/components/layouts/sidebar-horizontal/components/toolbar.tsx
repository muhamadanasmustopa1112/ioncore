import { ReactNode } from "react";

function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 pb-5">
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarHeading({ children }: { children: ReactNode }) {
  return <div className="flex flex-col justify-center gap-1">{children}</div>;
}

function ToolbarPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-foreground text-base leading-none font-medium">
      {children}
    </h1>
  );
}

function ToolbarDescription({ children }: { children: ReactNode }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm font-normal">
      {children}
    </div>
  );
}

export {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
  ToolbarDescription,
};
