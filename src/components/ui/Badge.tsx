import type { ReactNode } from "react";
import type { BadgeVariant } from "@/components/ui/badge-variants";

const variantClass: Record<BadgeVariant, string> = {
  default: "badge--default",
  success: "badge--success",
  warning: "badge--warning",
  danger: "badge--danger",
  muted: "badge--muted",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return <span className={`badge ${variantClass[variant]}`}>{children}</span>;
}
