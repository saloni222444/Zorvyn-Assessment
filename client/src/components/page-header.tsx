import { Fragment, ReactNode } from "react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    rightAction?: ReactNode;
    renderPageHeader?: ReactNode
  }
  
const PageHeader = ({ title, subtitle, rightAction, renderPageHeader }: PageHeaderProps) => {
    return (
      <div className="w-full pt-24 pb-8 px-4 lg:px-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="w-full max-w-[var(--max-width)] mx-auto">
          {renderPageHeader 
          ? <Fragment>{renderPageHeader}</Fragment> 
          : (
            <div className="w-full flex flex-col gap-3 items-start justify-start lg:items-center lg:flex-row lg:justify-between">
              {(title || subtitle) && (
                <div className="space-y-1">
                  {title && (
                    <h2 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-muted-foreground text-sm">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              {rightAction && rightAction}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PageHeader;