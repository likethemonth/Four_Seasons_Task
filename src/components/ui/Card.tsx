import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-sm border border-gray-300 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
      <h3 className="text-[14px] font-medium text-black">{title}</h3>
      {action && (
        <span className="cursor-pointer text-[12px] font-medium text-[#B8860B] hover:underline">
          {action}
        </span>
      )}
    </div>
  );
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}
