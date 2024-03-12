import { forwardRef } from "react";
import { tv, VariantProps } from "tailwind-variants";

const styles = tv({
  base: "rounded-xl bg-black text-white font-semibold disabled:bg-slate-700 disabled:cursor-not-allowed",
  variants: {
    size: {
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
  },
});

// Make a ThreeDots loader component
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
  ({ className, loading = false, size, fluid, children, ...props }, ref) => {
    return (
      <button
        className={styles({ class: className, size, fluid })}
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
