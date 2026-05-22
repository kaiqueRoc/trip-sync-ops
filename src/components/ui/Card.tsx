import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {title ? <h3 className="card__title">{title}</h3> : null}
      {children}
    </section>
  );
}
