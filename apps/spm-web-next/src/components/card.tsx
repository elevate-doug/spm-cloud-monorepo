import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  extra?: string;
  children?: React.ReactNode;
}

export default function Card(props: CardProps) {
  const { variant, extra, children, ...rest } = props;
  return (
    <div
      className={`!z-5 relative flex flex-col rounded-xl bg-white bg-clip-border border border-gray-200 shadow-sm dark:bg-navy-800 dark:border-navy-700 dark:text-white ${extra}`}
      {...rest}
    >
      {children}
    </div>
  );
}
