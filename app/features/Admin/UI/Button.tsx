import { forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

export const styles = tv({
  base: "inline-flex items-center rounded-xl font-semibold disabled:cursor-not-allowed",
  variants: {
    tint: {
      black: "bg-black text-white disabled:bg-slate-700",
      white: `bg-white text-black disabled:bg-slate-200 border border-slate-200`,
      emerald: "bg-emerald-500 text-white disabled:bg-slate-700",
      red: "bg-red-500 text-white disabled:bg-slate-700",
    },
    size: {
      xs: "h-8 text-xs px-3",
      sm: "h-10 text-sm px-4",
      md: "h-12 text-base px-5",
      lg: "h-14 text-lg px-6",
    },
    fluid: {
      true: "w-full",
    },
  },
  defaultVariants: {
    size: "sm",
    fluid: false,
    tint: "black",
  },
});

export function ThreeDots() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
    </div>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styles> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading = false,
      size = "sm",
      fluid = false,
      tint = "black",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={styles({ class: className, size, fluid, tint })}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? <ThreeDots /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
