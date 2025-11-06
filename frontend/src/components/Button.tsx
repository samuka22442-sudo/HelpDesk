import React, { forwardRef } from "react";
import styles from "./Button.module.css";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "highlight" | "disabled" | "outline";

export type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode; // suporta SVG ou ícones de libs
  iconPosition?: "left" | "right";
  ariaLabel?: string; // obrigatório quando for ícone-only
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

// Componente principal do sistema de botões
// - Variantes: primary, secondary, highlight, disabled, outline
// - Tamanhos: sm, md, lg
// - Estados: hover, active, focus, disabled
// - Acessibilidade: aria-disabled, aria-label (para ícone-only)
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled = false,
      icon,
      iconPosition = "left",
      ariaLabel,
      className,
      style,
      type = "button",
      onClick,
    },
    ref,
  ) => {
    const isIconOnly = !!icon && !children;
    const ariaLabelResolved = isIconOnly ? ariaLabel : undefined;

    const variantClass =
      variant === "primary"
        ? styles.primary
        : variant === "secondary"
        ? styles.secondary
        : variant === "highlight"
        ? styles.highlight
        : variant === "outline"
        ? styles.outline
        : styles.disabled;

    const sizeClass =
      size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;

    const iconGapClass = !!icon && !!children ? styles.iconGap : undefined;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(
          styles.btn,
          variantClass,
          sizeClass,
          fullWidth && styles.fullWidth,
          iconGapClass,
          className,
        )}
        style={style}
        disabled={disabled || variant === "disabled"}
        aria-disabled={disabled || variant === "disabled"}
        aria-label={ariaLabelResolved}
      >
        {icon && iconPosition === "left" ? (
          <span className={styles.icon}>{icon}</span>
        ) : null}
        {children && <span className={styles.label}>{children}</span>}
        {icon && iconPosition === "right" ? (
          <span className={styles.icon}>{icon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
