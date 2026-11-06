import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-brand-border p-5 md:p-6 shadow-subtle ${
        hoverable ? "hover:border-gray-300 hover:shadow-card transition-all duration-150" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
