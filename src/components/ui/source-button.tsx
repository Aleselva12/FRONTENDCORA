import type { ButtonHTMLAttributes } from "react";

/** Native-sized control for the imported Serveria design system. */
export function Button({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`source-button ${className}`} {...props} />;
}